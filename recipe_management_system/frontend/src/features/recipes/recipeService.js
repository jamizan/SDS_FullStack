import axios from 'axios';

const API_URL = '/api/recipes/';

const fetchRecipes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const result = await axios.get(API_URL, config);
  return result.data;
};

const updateRecipe = async (recipeId, recipeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const result = await axios.put(API_URL + recipeId, recipeData, config);
  return result.data;
};

const recipeService = {
  fetchRecipes,
  updateRecipe,
};

export default recipeService;