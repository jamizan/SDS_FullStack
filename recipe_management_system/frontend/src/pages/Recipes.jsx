import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRecipes, updateRecipe, addRecipe, deleteRecipe, clearState, unShareRecipe } from "../features/recipes/recipeSlice";
import { addRecipeToGroceryList } from "../features/grocery/grocerySlice";
import RecipeTable from "../components/RecipeTable"
import ShareRecipeModal from "../components/ShareRecipeModal";

function Recipes() {
  const dispatch = useDispatch();
  const { recipes, isLoading, isError, message } = useSelector((state) => state.recipe);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');
  const [shareModal, setShareModal] = useState({ isOpen: false, recipeId: null, recipeTitle: '' });
  const [editingRecipe, setEditingRecipe] = useState(null);

  const handleUpdate = (recipeId, updatedData) => {
    dispatch(updateRecipe({ recipeId, recipeData: updatedData }));
  };

  const handleCreate = (newData) => {
    dispatch(addRecipe(newData));
  };

  const handleDelete = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      dispatch(deleteRecipe(recipeId));
    }
  };

  const handleAddToGroceryList = (recipeId) => {
    dispatch(addRecipeToGroceryList(recipeId));
  };

  const handleShare = (recipeId, recipeTitle) => {
    setShareModal({ isOpen: true, recipeId, recipeTitle });
  };

  const handleUnShare = (recipeId) => {
    dispatch(unShareRecipe({ recipeId }));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    dispatch(fetchAllRecipes(newFilter));
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

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  const handleCloseModal = () => {
    setEditingRecipe(null);
  };

  const handleSave = (updatedData) => {
    if (editingRecipe?._id) {
      handleUpdate(editingRecipe._id, updatedData);
    } else {
      handleCreate(updatedData);
    }
    setEditingRecipe(null);
  };

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(fetchAllRecipes(filter));

    return () => {
      dispatch(clearState());
    };
  }, [dispatch, isError, message]);
  
  return (
    <div className="recipes-container">
        <h2>Recipes Page</h2>
        <p>List of all recipes will be displayed here.</p>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Recipes
          </button>
          <button 
            className={`filter-btn ${filter === 'mine' ? 'active' : ''}`}
            onClick={() => handleFilterChange('mine')}
          >
            My Recipes
          </button>
          <button 
            className={`filter-btn ${filter === 'shared' ? 'active' : ''}`}
            onClick={() => handleFilterChange('shared')}
          >
            Shared with Me
          </button>
          <button 
            className='add-new-button' 
            onClick={handleAddNew}
          >
            Add New Recipe
          </button>
        </div>

        <RecipeTable 
          recipes={recipes} 
          onUpdate={handleUpdate} 
          onCreate={handleCreate} 
          onDelete={handleDelete} 
          onAddToGroceryList={handleAddToGroceryList}
          onShare={handleShare}
          onUnShare={handleUnShare}
          onEdit={handleEdit}
          currentUserId={user?.id}
          editingRecipe={editingRecipe}
          onCloseModal={handleCloseModal}
          onSave={handleSave}
        />

        <ShareRecipeModal 
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false, recipeId: null, recipeTitle: '' })}
          recipeId={shareModal.recipeId}
          recipeTitle={shareModal.recipeTitle}
        />
    </div>
  )
}

export default Recipes
