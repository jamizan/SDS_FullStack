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

const addRecipe = async (recipeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.post(API_URL, recipeData, config);
  return result.data;
};

const deleteRecipe = async (recipeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.delete(API_URL + recipeId, config);
  return result.data;
};

const recipeService = {
  fetchRecipes,
  updateRecipe,
  addRecipe,
  deleteRecipe,
};

export default recipeService;