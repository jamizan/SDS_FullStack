import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '../features/friends/friendSlice';
import FriendRequestModal from '../components/FriendRequestModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import authService from '../features/auth/authService';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { friends, friendRequests } = useSelector((state) => state.friends);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    dispatch(getFriends());
    dispatch(getFriendRequests());
  }, [dispatch]);

  const handleAcceptRequest = (requestId) => {
    dispatch(acceptFriendRequest(requestId)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        alert('Friend request accepted successfully!');
        dispatch(getFriends());
      } else {
        alert('Failed to accept friend request');
      }
    });
  };

  const handleRejectRequest = (requestId) => {
    if (window.confirm('Are you sure you want to reject this friend request?')) {
      dispatch(rejectFriendRequest(requestId)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          alert('Friend request rejected');
        } else {
          alert('Failed to reject friend request');
        }
      });
    }
  };

  const handleRemoveFriend = (friendId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      dispatch(removeFriend(friendId)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          alert('Friend removed successfully');
          dispatch(getFriends());
        } else {
          alert('Failed to remove friend');
        }
      });
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData, user.token);
      alert('Password changed successfully!');
      setShowPasswordModal(false);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to change password';
      alert(message);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>

      {friendRequests.length > 0 && (
        <div className="friend-requests-section">
          <h2>Friend Requests ({friendRequests.length})</h2>
          <div className="friend-requests-list">
            {friendRequests.map((request) => (
              <div key={request._id} className="friend-request-card">
                <div className="request-info">
                  <h3>{request.requester.name}</h3>
                  <p>{request.requester.email}</p>
                </div>
                <div className="request-actions">
                  <button
                    className="btn btn-accept"
                    onClick={() => handleAcceptRequest(request._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => handleRejectRequest(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="profile-details">
        <table className="profile-table">
          <thead>
            <tr>
              <th colSpan="2">
                <h3>User Information</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Name:</th>
              <td>{user?.name || 'N/A'}</td>
            </tr>
            <tr>
              <th>Email:</th>
              <td>{user?.email || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <button className="btn btn-block" onClick={() => setShowPasswordModal(true)}>Change Password</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="social-details">
        <div className="social-buttons">
          <button className="btn btn-block" onClick={() => setShowAddModal(true)}>
            Add Friend
          </button>
        </div>
        <table className="profile-table">
          <thead>
            <tr>
              <th colSpan="3">
                <h3>Your Friends ({friends.length})</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            {friends.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                  No friends yet. Send a friend request to get started!
                </td>
              </tr>
            ) : (
              friends.map((friend, index) => (
                <tr key={friend._id}>
                  <th>{index + 1}</th>
                  <td>{friend.name} ({friend.email})</td>
                  <td>
                    <button
                      className="btn btn-remove-small"
                      onClick={() => handleRemoveFriend(friend._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && <FriendRequestModal onClose={() => setShowAddModal(false)} />}
      {showPasswordModal && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  );
}

export default Profile
