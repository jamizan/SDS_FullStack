import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

function RecipeModal({ recipe, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [],
    instructions: '',
    prepTime: '',
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || '',
        prepTime: recipe.prepTime || '',
      });
    }
  }, [recipe]);

  const [ingredientInput, setIngredientInput] = useState({ name: '', amount: '' });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const addIngredient = () => {
    if (ingredientInput.name.trim() && ingredientInput.amount.trim()) {
      setFormData((prevState) => ({
        ...prevState,
        ingredients: [...prevState.ingredients, { name: ingredientInput.name.trim(), amount: ingredientInput.amount.trim() }],
      }));
      setIngredientInput({ name: '', amount: '' });
    }
  };

  const removeIngredient = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      ingredients: prevState.ingredients.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Recipe</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Preparation Time (minutes)</label>
            <input
              type="number"
              name="prepTime"
              value={formData.prepTime}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            <div className="ingredient-input">
              <input
                type="text"
                value={ingredientInput.amount}
                onChange={(e) => setIngredientInput({ ...ingredientInput, amount: e.target.value })}
                placeholder="Amount"
                style={{ flex: '0 0 150px' }}
              />
              <input
                type="text"
                value={ingredientInput.name}
                onChange={(e) => setIngredientInput({ ...ingredientInput, name: e.target.value })}
                placeholder="Ingredient name"
              />
              <button type="button" onClick={addIngredient}>Add</button>
            </div>
            <ul className="ingredients-list">
              {formData.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span><strong>{typeof ingredient === 'string' ? '' : ingredient.amount}</strong> {typeof ingredient === 'string' ? ingredient : ingredient.name}</span>
                  <button type="button" onClick={() => removeIngredient(index)}>&times;</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={onChange}
              rows="5"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecipeModal;