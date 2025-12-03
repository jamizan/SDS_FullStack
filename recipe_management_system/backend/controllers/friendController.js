const asyncHandler = require('express-async-handler');
const Friend = require('../models/friendModel');
const User = require('../models/userModel');

const sendFriendRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const recipient = await User.findOne({ email });
  if (!recipient) {
    res.status(404);
    throw new Error('User not found');
  }

  if (recipient._id.toString() === req.user.id) {
    res.status(400);
    throw new Error('Cannot send friend request to yourself');
  }

  const existingRequest = await Friend.findOne({
    $or: [
      { requester: req.user.id, recipient: recipient._id },
      { requester: recipient._id, recipient: req.user.id },
    ],
  });

  if (existingRequest) {
    res.status(400);
    throw new Error('Friend request already exists');
  }

  const friendRequest = await Friend.create({
    requester: req.user.id,
    recipient: recipient._id,
  });

  const populatedRequest = await Friend.findById(friendRequest._id)
    .populate('requester', 'name email')
    .populate('recipient', 'name email');

  res.status(201).json(populatedRequest);
});

const getFriendRequests = asyncHandler(async (req, res) => {
  const requests = await Friend.find({
    recipient: req.user.id,
    status: 'pending',
  }).populate('requester', 'name email');

  res.status(200).json(requests);
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const request = await Friend.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Friend request not found');
  }

  if (request.recipient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  request.status = 'accepted';
  await request.save();

  const populatedRequest = await Friend.findById(request._id)
    .populate('requester', 'name email')
    .populate('recipient', 'name email');

  res.status(200).json(populatedRequest);
});

const rejectFriendRequest = asyncHandler(async (req, res) => {
  const request = await Friend.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Friend request not found');
  }

  if (request.recipient.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await request.deleteOne();
  res.status(200).json({ id: req.params.id });
});

const getFriends = asyncHandler(async (req, res) => {
  const friends = await Friend.find({
    $or: [
      { requester: req.user.id, status: 'accepted' },
      { recipient: req.user.id, status: 'accepted' },
    ],
  })
    .populate('requester', 'name email')
    .populate('recipient', 'name email');

  const friendsList = friends.map((friend) => {
    if (friend.requester._id.toString() === req.user.id) {
      return {
        _id: friend.recipient._id,
        name: friend.recipient.name,
        email: friend.recipient.email,
        friendshipId: friend._id,
      };
    } else {
      return {
        _id: friend.requester._id,
        name: friend.requester.name,
        email: friend.requester.email,
        friendshipId: friend._id,
      };
    }
  });

  res.status(200).json(friendsList);
});

const removeFriend = asyncHandler(async (req, res) => {
  const friend = await Friend.findOneAndDelete({
    $or: [
      { requester: req.user.id, recipient: req.params.id },
      { requester: req.params.id, recipient: req.user.id },
    ],
    status: 'accepted',
  });

  if (!friend) {
    res.status(404);
    throw new Error('Friend not found');
  }

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
};
