import axios from 'axios';

const API_URL = '/api/grocery/';

const getGroceryList = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.get(API_URL, config);
  return result.data;
};

const addRecipeToList = async (recipeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.post(API_URL + 'recipe', { recipeId }, config);
  return result.data;
};

const removeRecipeFromList = async (recipeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.delete(API_URL + 'recipe/' + recipeId, config);
  return result.data;
};

const addCustomItem = async (itemData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.post(API_URL + 'custom', itemData, config);
  return result.data;
};

const removeCustomItem = async (itemId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.delete(API_URL + 'custom/' + itemId, config);
  return result.data;
};

const toggleCustomItem = async (itemId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.put(API_URL + 'custom/' + itemId + '/toggle', {}, config);
  return result.data;
};

const shareGroceryList = async (friendId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.post(API_URL + 'share', { friendId }, config);
  return result.data;
};

const unshareGroceryList = async (friendId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.post(API_URL + 'unshare', { friendId }, config);
  return result.data;
};

const groceryService = {
  getGroceryList,
  addRecipeToList,
  removeRecipeFromList,
  addCustomItem,
  removeCustomItem,
  toggleCustomItem,
  shareGroceryList,
  unshareGroceryList,
};

export default groceryService;
