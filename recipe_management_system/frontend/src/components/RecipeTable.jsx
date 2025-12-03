import React, { useState } from 'react';
import RecipeModal from './RecipeModal.jsx';

function RecipeTable({ recipes, showActions = true, columns = ['title', 'description', 'time'], onUpdate, onCreate, onDelete, onAddToGroceryList, onShare, currentUserId }) {
  const [expandedId, setExpandedId] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const toggleRow = (recipeId) => {
    setExpandedId(expandedId === recipeId ? null : recipeId);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  const handleCloseModal = () => {
    setEditingRecipe(null);
  };

  const handleSave = (updatedData) => {
    if (editingRecipe._id) {
      onUpdate(editingRecipe._id, updatedData);
    } else {
      onCreate(updatedData);
    }
    setEditingRecipe(null);
  };

  const handleAddNew = () => {
    setEditingRecipe({
      title: '',
      description: '',
      ingredients: [],
      instructions: '',
      prepTime: 0,
    });
  };

  return (
    <>
    <div className='add-new-button-container'>
      <button 
        className='add-new-button' 
        onClick={handleAddNew}
        onClose={handleCloseModal}
      >
        Add New Recipe
      </button>
    </div>
    <table className="recipe-table">
      <thead>
        <tr>
          {columns.includes('title') && <th>Recipe Name</th>}
          {columns.includes('description') && <th>Description</th>}
          {columns.includes('time') && <th>Preparation Time</th>}
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <React.Fragment key={recipe._id}>
            <tr 
              id={recipe._id}
              onClick={() => toggleRow(recipe._id)}
              style={{ cursor: 'pointer' }}
              className={expandedId === recipe._id ? 'expanded' : ''}
            >
              {columns.includes('title') && <td>{recipe.title}</td>}
              {columns.includes('description') && <td>{recipe.description}</td>}
              {columns.includes('time') && <td>{recipe.prepTime} mins</td>}
              {showActions && (
                <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleEdit(recipe)}>Edit</button>
                    <button onClick={() => onAddToGroceryList(recipe._id)}>Add to List</button>
                    {(recipe.owner === currentUserId || (!recipe.owner && recipe.user === currentUserId)) && (
                      <button className="share-button" onClick={() => onShare(recipe._id, recipe.title)}>Share</button>
                    )}
                    <button id="delete-button" onClick={() => onDelete(recipe._id)}>Delete</button>
                </td>
              )}
            </tr>
            {expandedId === recipe._id && (
              <tr className="recipe-details">
                <td colSpan={columns.length + (showActions ? 1 : 0)}>
                  <div className="expanded-content">
                    <h3>Ingredients:</h3>
                    <ul>
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx}>
                          {typeof ingredient === 'string' ? ingredient : `${ingredient.amount} ${ingredient.name}`}
                        </li>
                      ))}
                    </ul>
                    <h3>Instructions:</h3>
                    <p>{recipe.instructions}</p>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
      </table>

      {editingRecipe && (
        <RecipeModal
          recipe={editingRecipe}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default RecipeTable;