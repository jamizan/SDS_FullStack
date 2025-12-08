import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFriends } from '../features/friends/friendSlice';
import { shareRecipe, unShareRecipe } from '../features/recipes/recipeSlice';

function ShareRecipeModal({ isOpen, onClose, recipeId, recipeTitle, sharedWith }) {
  const dispatch = useDispatch();
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const { friends } = useSelector((state) => state.friends);
  const { recipes } = useSelector((state) => state.recipe);
  const currentRecipe = recipes.find(r => r._id === recipeId);
  const currentSharedWith = currentRecipe?.sharedWith || sharedWith || [];

  useEffect(() => {
    if (isOpen) {
      dispatch(getFriends());
    }
  }, [isOpen, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFriendId) {
      alert('Please select a friend');
      return;
    }

    try {
      await dispatch(shareRecipe({ recipeId, friendId: selectedFriendId })).unwrap();
      alert('Recipe shared successfully!');
      setSelectedFriendId('');
      onClose();
    } catch (error) {
      alert(error || 'Failed to share recipe');
    }
  };

  const handleUnshare = async (friendId) => {
    if (window.confirm('Remove sharing with this friend?')) {
      try {
        await dispatch(unShareRecipe({ recipeId, friendId })).unwrap();
        alert('Sharing removed successfully!');
      } catch (error) {
        alert(error || 'Failed to remove sharing');
      }
    }
  };

  const availableFriends = friends.filter(
    friend => !currentSharedWith.some(shared => shared._id === friend._id)
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Share Recipe: {recipeTitle}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="friend">Select Friend:</label>
            <select
              id="friend"
              value={selectedFriendId}
              onChange={(e) => setSelectedFriendId(e.target.value)}
              required
            >
              <option value="">-- Choose a friend --</option>
              {availableFriends.map((friend) => (
                <option key={friend._id} value={friend._id}>
                  {friend.name} ({friend.email})
                </option>
              ))}
            </select>
          </div>
          <div className="shared-list">
            <h4>Already Shared With:</h4>
            {currentSharedWith.length === 0 ? (
              <p>This recipe is not shared with anyone yet.</p>
            ) : (
              <ul>
                {currentSharedWith.map((user) => (
                  <li key={user._id || user} className="shared-user-item">
                    <span>{user.name || 'Unknown User'} ({user.email || 'No Email'})</span>
                    <button 
                      className="btn-unshare-recipe-small"
                      onClick={() => handleUnshare(user._id)}
                      type="button"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Share Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShareRecipeModal;
