import axios from 'axios';

const API_URL = '/api/friends/';

const sendFriendRequest = async (email, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.post(API_URL + 'request', { email }, config);
  return result.data;
};

const getFriendRequests = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.get(API_URL + 'requests', config);
  return result.data;
};

const acceptFriendRequest = async (requestId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.put(API_URL + 'accept/' + requestId, {}, config);
  return result.data;
};

const rejectFriendRequest = async (requestId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.delete(API_URL + 'reject/' + requestId, config);
  return result.data;
};

const getFriends = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.get(API_URL, config);
  return result.data;
};

const removeFriend = async (friendId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.delete(API_URL + friendId, config);
  return result.data;
};

const friendService = {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
};

export default friendService;
