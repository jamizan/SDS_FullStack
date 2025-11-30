import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllRecipes, addRecipe } from '../features/recipes/recipeSlice';
import RecipeModal from '../components/RecipeModal';

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recipes } = useSelector((state) => state.recipe);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllRecipes());
  }, [dispatch]);

  const totalRecipes = recipes.length;
  const avgPrepTime = recipes.length > 0 
    ? Math.round(recipes.reduce((sum, r) => sum + r.prepTime, 0) / recipes.length)
    : 0;

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const recipesThisMonth = recipes.filter(r => new Date(r.createdAt) > monthAgo).length;

  const handleCreate = (recipeData) => {
    dispatch(addRecipe(recipeData));
    setShowAddModal(false);
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's your recipe management overview</p>
        <button className="add-recipe-btn" onClick={() => setShowAddModal(true)}>
          + Add New Recipe
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalRecipes}</h3>
          <p>Total Recipes</p>
        </div>

        <div className="stat-card">
          <h3>{recipesThisMonth}</h3>
          <p>Recipes Added This Month</p>
        </div>

        <div className="stat-card">
          <h3>{avgPrepTime} min</h3>
          <p>Avg Prep Time</p>
        </div>
      
      </div>

      {recipes.length > 0 && (
        <div className="recent-recipes-section">
          <h2>Recent Recipes</h2>
          <div className="recipe-grid">
            {recipes.slice(0, 3).map((recipe) => (
              <div key={recipe._id} className="recipe-preview-card">
                <h3>{recipe.title}</h3>
                <p>{recipe.description?.substring(0, 80)}...</p>
                <div className="recipe-meta">
                  <span> {recipe.prepTime} mins</span>
                  <span> {recipe.ingredients?.length} ingredients</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <RecipeModal
          recipe={{ title: '', description: '', ingredients: [], instructions: '', prepTime: 0 }}
          onClose={() => setShowAddModal(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
}

export default Dashboard;
