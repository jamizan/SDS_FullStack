import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGroceryList,
  removeRecipeFromGroceryList,
  addCustomItemToList,
  removeCustomItemFromList,
  toggleCustomItemChecked,
  clearState,
} from '../features/grocery/grocerySlice';

function Groceries() {
  const dispatch = useDispatch();
  const { groceryList, isLoading, isError, message } = useSelector((state) => state.grocery);
  const [customItemInput, setCustomItemInput] = useState({ name: '', amount: '' });
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(fetchGroceryList());

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
      <h2>Grocery List</h2>

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
    </div>
  );
}

export default Groceries;
