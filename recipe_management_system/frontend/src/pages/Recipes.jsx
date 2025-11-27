import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRecipes, updateRecipe, clearState } from "../features/recipes/recipeSlice";
import RecipeTable from "../components/RecipeTable"

function Recipes() {
  const dispatch = useDispatch();
  const { recipes, isLoading, isError, message } = useSelector((state) => state.recipe);

  const handleUpdate = (recipeId, updatedData) => {
    dispatch(updateRecipe({ recipeId, recipeData: updatedData }));
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
        <RecipeTable recipes={recipes} onUpdate={handleUpdate} />
    </div>
  )
}

export default Recipes
