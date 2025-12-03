import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFriends } from '../features/friends/friendSlice';
import { shareRecipe } from '../features/recipes/recipeSlice';

function ShareRecipeModal({ isOpen, onClose, recipeId, recipeTitle }) {
  const dispatch = useDispatch();
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const { friends } = useSelector((state) => state.friends);

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
              {friends.map((friend) => (
                <option key={friend._id} value={friend._id}>
                  {friend.name} ({friend.email})
                </option>
              ))}
            </select>
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
