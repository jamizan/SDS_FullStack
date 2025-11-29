import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRecipes, updateRecipe, addRecipe, deleteRecipe, clearState } from "../features/recipes/recipeSlice";
import { addRecipeToGroceryList } from "../features/grocery/grocerySlice";
import RecipeTable from "../components/RecipeTable"

function Recipes() {
  const dispatch = useDispatch();
  const { recipes, isLoading, isError, message } = useSelector((state) => state.recipe);

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

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(fetchAllRecipes());

    return () => {
      dispatch(clearState());
    };
  }, [dispatch, isError, message]);
  return (
    <div className="recipes-container">
        <h2>Recipes Page</h2>
        <p>List of all recipes will be displayed here.</p>
        <RecipeTable recipes={recipes} onUpdate={handleUpdate} onCreate={handleCreate} onDelete={handleDelete} onAddToGroceryList={handleAddToGroceryList} />
    </div>
  )
}

export default Recipes
