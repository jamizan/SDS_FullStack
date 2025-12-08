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

const addCustomItem = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.post(API_URL + 'custom', data, config);
  return result.data;
};

const removeCustomItem = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.delete(API_URL + 'custom/' + data.itemId + '?listId=' + data.listId, config);
  return result.data;
};

const removeAllItemsFromList = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.delete(API_URL + 'all', config);
  return result.data;
};

const toggleCustomItem = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.put(API_URL + 'custom/' + data.itemId + '/toggle?listId=' + data.listId, {}, config);
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
  const body = friendId ? { friendId } : {};
  const result = await axios.post(API_URL + 'unshare', body, config);
  return result.data;
};

const toggleIngredient = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await axios.put(API_URL + 'toggle-ingredient', data, config);
  return result.data;
};

const groceryService = {
  getGroceryList,
  addRecipeToList,
  removeRecipeFromList,
  addCustomItem,
  removeCustomItem,
  removeAllItemsFromList,
  toggleCustomItem,
  shareGroceryList,
  unshareGroceryList,
  toggleIngredient,
};

export default groceryService;
