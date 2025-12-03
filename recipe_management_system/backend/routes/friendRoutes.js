const express = require('express');
const router = express.Router();
const {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
} = require('../controllers/friendController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, sendFriendRequest);
router.get('/requests', protect, getFriendRequests);
router.put('/accept/:id', protect, acceptFriendRequest);
router.delete('/reject/:id', protect, rejectFriendRequest);
router.get('/', protect, getFriends);
router.delete('/:id', protect, removeFriend);

module.exports = router;
