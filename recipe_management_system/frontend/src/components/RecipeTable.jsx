import React, { useState } from 'react';
import RecipeModal from './RecipeModal.jsx';

function RecipeTable({ recipes, showActions = true, columns = ['title', 'description', 'time'], onUpdate, onCreate, onDelete, onAddToGroceryList, onShare, onUnShare, onEdit, currentUserId, editingRecipe, onCloseModal, onSave }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleRow = (recipeId) => {
    setExpandedId(expandedId === recipeId ? null : recipeId);
  };

  const isSharedWithMe = (recipe) => {
    if (!currentUserId){
      return false;
    }  
    const ownerId = (recipe.owner?._id || recipe.owner || recipe.user?._id || recipe.user)?.toString();
    const userId = currentUserId.toString();
    const isOwner = ownerId === userId;
    const isInSharedWith = recipe.sharedWith?.some(user => {
      const sharedUserId = user._id || user;
      return sharedUserId.toString() === userId;
    });
    
    return isInSharedWith && !isOwner;
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
              className={`
                ${expandedId === recipe._id ? 'expanded' : ''}
                ${isSharedWithMe(recipe) ? 'shared-recipe' : ''}
              `}
            >
              {columns.includes('title') && (
                <td>
                  {recipe.title}
                  {isSharedWithMe(recipe) && <span className="shared-badge">Shared by {recipe.owner?.name || recipe.user?.name}</span>}
                </td>
              )}
              {columns.includes('description') && <td>{recipe.description}</td>}
              {columns.includes('time') && <td>{recipe.prepTime} mins</td>}
              {showActions && (
                <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(recipe)}>Edit</button>
                    <button onClick={() => onAddToGroceryList(recipe._id)}>Add to List</button>
                    {((recipe.owner?._id || recipe.owner) === currentUserId || (!recipe.owner && (recipe.user?._id || recipe.user) === currentUserId)) && (
                      <button className="share-button" onClick={() => onShare(recipe._id, recipe.title, recipe.sharedWith || [])}>Share</button>
                    )}
                    {isSharedWithMe(recipe) && (
                      <button className="unshare-button" onClick={() => onUnShare(recipe._id)}>Remove Shared Recipe</button>
                    )}
                    {((recipe.owner?._id || recipe.owner) === currentUserId || (!recipe.owner && (recipe.user?._id || recipe.user) === currentUserId)) && (
                      <button id="delete-button" onClick={() => onDelete(recipe._id)}>Delete</button>
                    )}
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

      {editingRecipe && onCloseModal && onSave && (
        <RecipeModal
          recipe={editingRecipe}
          onClose={onCloseModal}
          onSave={onSave}
        />
      )}
    </>
  );
}

export default RecipeTable;