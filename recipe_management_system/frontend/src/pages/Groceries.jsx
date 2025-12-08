import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGroceryList,
  removeRecipeFromGroceryList,
  addCustomItemToList,
  removeCustomItemFromList,
  toggleCustomItemChecked,
  shareGroceryList,
  unshareGroceryList,
  clearState,
} from '../features/grocery/grocerySlice';
import { getFriends } from '../features/friends/friendSlice';
import ShareRecipeModal from '../components/ShareRecipeModal';

function Groceries() {
  const dispatch = useDispatch();
  const { groceryList, isLoading, isError, message } = useSelector((state) => state.grocery);
  const { user } = useSelector((state) => state.auth);
  const { friends } = useSelector((state) => state.friends);
  const [customItemInput, setCustomItemInput] = useState({ name: '', amount: '' });
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(fetchGroceryList());
    dispatch(getFriends());

    return () => {
      dispatch(clearState());
    };
  }, [dispatch, isError, message]);

  const handleRemoveRecipe = (recipeId) => {
    if (window.confirm('Remove this recipe from grocery list?')) {
      dispatch(removeRecipeFromGroceryList(recipeId));
    }
  };

  const handleAddCustomItem = () => {
    if (customItemInput.name.trim()) {
      dispatch(addCustomItemToList(customItemInput));
      setCustomItemInput({ name: '', amount: '' });
    }
  };

  const handleRemoveCustomItem = (itemId) => {
    dispatch(removeCustomItemFromList(itemId));
  };

  const handleToggleCustomItem = (itemId) => {
    dispatch(toggleCustomItemChecked(itemId));
  };

  const handleToggleIngredient = (ingredientName) => {
    setCheckedIngredients((prev) => {
      if (prev.includes(ingredientName)) {
        return prev.filter((name) => name !== ingredientName);
      } else {
        return [...prev, ingredientName];
      }
    });
  };

  const handleShareGroceryList = async (friendId) => {
    try {
      await dispatch(shareGroceryList(friendId)).unwrap();
      alert('Grocery list shared successfully!');
      setShowShareModal(false);
    } catch (error) {
      alert(error || 'Failed to share grocery list');
    }
  };

  const handleUnshareWithFriend = async (friendId) => {
    const isUnsharing = friendId === user._id;
    const confirmMessage = isUnsharing 
      ? 'Are you sure you want to stop viewing this grocery list?' 
      : 'Stop sharing grocery list with this friend?';
    
    if (window.confirm(confirmMessage)) {
      try {
        await dispatch(unshareGroceryList(isUnsharing ? null : friendId)).unwrap();
        alert(isUnsharing ? 'You are no longer viewing this list' : 'Sharing ended successfully!');
        dispatch(fetchGroceryList());
      } catch (error) {
        alert(error || 'Failed to end sharing');
      }
    }
  };

  const aggregateIngredients = () => {
    if (!groceryList || !groceryList.recipes) return [];

    const ingredientMap = {};

    groceryList.recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const name = typeof ingredient === 'string' ? ingredient : ingredient.name;
        const amount = typeof ingredient === 'string' ? '' : ingredient.amount;

        if (ingredientMap[name]) {
          if (amount && ingredientMap[name].amount) {
            ingredientMap[name].amount += ', ' + amount;
          } else if (amount) {
            ingredientMap[name].amount = amount;
          }
        } else {
          ingredientMap[name] = { name, amount };
        }
      });
    });

    return Object.values(ingredientMap);
  };

  const aggregatedIngredients = aggregateIngredients();

  if (isLoading) {
    return <div className="groceries-container"><p>Loading...</p></div>;
  }

  return (
    <div className="groceries-container">
      <div className="groceries-header">
        <h2>Grocery List</h2>
        {groceryList && user && groceryList.user === user._id && (
          <div className="grocery-share-actions">
            <button className="btn-share-grocery" onClick={() => setShowShareModal(true)}>
              Share List
            </button>
            {groceryList?.sharedWith && groceryList.sharedWith.length > 0 && (
              <div className="shared-with-section">
                <span>Shared with: </span>
                {groceryList.sharedWith.map((userId) => {
                  const friend = friends.find((f) => f._id === userId);
                  return friend ? (
                    <span key={userId} className="shared-friend-tag">
                      {friend.name}
                      <button 
                        className="btn-unshare-small"
                        onClick={() => handleUnshareWithFriend(userId)}
                      >
                        &times;
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        )}
        {groceryList && user && groceryList.user !== user._id && groceryList.sharedWith?.includes(user._id) && (
          <div className="grocery-share-actions">
            <button className="btn-stop-viewing" onClick={() => handleUnshareWithFriend(user._id)}>
              Stop Viewing This List
            </button>
          </div>
        )}
      </div>

      {groceryList?.recipes && groceryList.recipes.length > 0 && (
        <div className="grocery-section">
          <h3>Recipes in List</h3>
          <div className="recipe-chips">
            {groceryList.recipes.map((recipe) => (
              <div key={recipe._id} className="recipe-chip">
                <span>{recipe.title}</span>
                <button onClick={() => handleRemoveRecipe(recipe._id)}>&times;</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grocery-section">
        <h3>Shopping List</h3>
        <div className="custom-item-input">
          <input
            type="text"
            value={customItemInput.amount}
            onChange={(e) => setCustomItemInput({ ...customItemInput, amount: e.target.value })}
            placeholder="Amount"
            style={{ flex: '0 0 150px' }}
          />
          <input
            type="text"
            value={customItemInput.name}
            onChange={(e) => setCustomItemInput({ ...customItemInput, name: e.target.value })}
            placeholder="Item name"
          />
          <button onClick={handleAddCustomItem}>Add</button>
        </div>

        <ul className="grocery-items">
          {aggregatedIngredients.map((ingredient, idx) => {
            const isChecked = checkedIngredients.includes(ingredient.name);
            return (
              <li key={idx} className={`grocery-item ${isChecked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleIngredient(ingredient.name)}
                />
                <span onClick={() => handleToggleIngredient(ingredient.name)}>
                  {ingredient.amount && <strong>{ingredient.amount}</strong>} {ingredient.name}
                </span>
              </li>
            );
          })}
          {groceryList?.customItems && groceryList.customItems.map((item) => (
            <li key={item._id} className={`grocery-item custom-item ${item.checked ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggleCustomItem(item._id)}
              />
              <span onClick={() => handleToggleCustomItem(item._id)}>
                {item.amount && <strong>{item.amount}</strong>} {item.name}
              </span>
              <button onClick={() => handleRemoveCustomItem(item._id)}>&times;</button>
            </li>
          ))}
        </ul>
      </div>

      {showShareModal && (
        <GroceryShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleShareGroceryList}
          friends={friends}
          alreadySharedWith={groceryList?.sharedWith || []}
        />
      )}
    </div>
  );
}

function GroceryShareModal({ isOpen, onClose, onShare, friends, alreadySharedWith }) {
  const [selectedFriendId, setSelectedFriendId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFriendId) {
      alert('Please select a friend');
      return;
    }
    onShare(selectedFriendId);
    setSelectedFriendId('');
  };

  const availableFriends = friends.filter(
    (friend) => !alreadySharedWith.includes(friend._id)
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Share Grocery List</h3>
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
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Share List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Groceries;
