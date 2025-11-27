import React, { useState } from 'react';
import RecipeModal from './RecipeModal.jsx';

function RecipeTable({ recipes, showActions = true, columns = ['title', 'description', 'time'], onUpdate }) {
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
    onUpdate(editingRecipe._id, updatedData);
    setEditingRecipe(null);
  };

  return (
    <>
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
                    <button>Add to List</button>
                    <button id="delete-button">Delete</button>
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
                        <li key={idx}>{ingredient}</li>
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