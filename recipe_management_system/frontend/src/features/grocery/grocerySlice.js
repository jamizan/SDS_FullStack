import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import groceryService from './groceryService';

const initialState = {
  groceryList: null,
  groceryLists: [],
  activeListId: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const fetchGroceryList = createAsyncThunk(
  'grocery/fetch',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groceryService.getGroceryList(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addRecipeToGroceryList = createAsyncThunk(
  'grocery/addRecipe',
  async (recipeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groceryService.addRecipeToList(recipeId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeRecipeFromGroceryList = createAsyncThunk(
  'grocery/removeRecipe',
  async (recipeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groceryService.removeRecipeFromList(recipeId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addCustomItemToList = createAsyncThunk(
  'grocery/addCustom',
  async (itemData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const activeListId = thunkAPI.getState().grocery.activeListId;
      return await groceryService.addCustomItem({ ...itemData, listId: activeListId }, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeCustomItemFromList = createAsyncThunk(
  'grocery/removeCustom',
  async (itemId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const activeListId = thunkAPI.getState().grocery.activeListId;
      return await groceryService.removeCustomItem({ itemId, listId: activeListId }, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeAllItemsFromGroceryList = createAsyncThunk(
  'grocery/removeAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groceryService.removeAllItemsFromList(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleCustomItemChecked = createAsyncThunk(
  'grocery/toggleCustom',
  async (itemId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const activeListId = thunkAPI.getState().grocery.activeListId;
      return await groceryService.toggleCustomItem({ itemId, listId: activeListId }, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const shareGroceryList = createAsyncThunk(
  'grocery/share',
  async (friendId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groceryService.shareGroceryList(friendId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const unshareGroceryList = createAsyncThunk(
  'grocery/unshare',
  async (friendId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groceryService.unshareGroceryList(friendId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleIngredientChecked = createAsyncThunk(
  'grocery/toggleIngredient',
  async ({ ingredientName, listId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groceryService.toggleIngredient({ ingredientName, listId }, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    clearState: () => initialState,
    setActiveList: (state, action) => {
      const listId = action.payload;
      const list = state.groceryLists.find(l => l._id === listId);
      if (list) {
        state.activeListId = listId;
        state.groceryList = list;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroceryList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGroceryList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryLists = action.payload;
        const ownList = action.payload.find(list => list.user._id === state.activeListId || list.user._id);
        const activeList = ownList || action.payload[0];
        if (activeList) {
          state.activeListId = activeList._id;
          state.groceryList = activeList;
        }
      })
      .addCase(fetchGroceryList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addRecipeToGroceryList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRecipeToGroceryList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
      })
      .addCase(addRecipeToGroceryList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeRecipeFromGroceryList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeRecipeFromGroceryList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
      })
      .addCase(removeRecipeFromGroceryList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addCustomItemToList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCustomItemToList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
        const index = state.groceryLists.findIndex(list => list._id === action.payload._id);
        if (index !== -1) {
          state.groceryLists[index] = action.payload;
        }
      })
      .addCase(addCustomItemToList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeCustomItemFromList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeCustomItemFromList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
        const index = state.groceryLists.findIndex(list => list._id === action.payload._id);
        if (index !== -1) {
          state.groceryLists[index] = action.payload;
        }
      })
      .addCase(removeCustomItemFromList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(toggleCustomItemChecked.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleCustomItemChecked.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
        const index = state.groceryLists.findIndex(list => list._id === action.payload._id);
        if (index !== -1) {
          state.groceryLists[index] = action.payload;
        }
      })
      .addCase(toggleCustomItemChecked.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(shareGroceryList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(shareGroceryList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
      })
      .addCase(shareGroceryList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unshareGroceryList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unshareGroceryList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
      })
      .addCase(unshareGroceryList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(toggleIngredientChecked.pending, (state) => {
        // Don't set loading to avoid UI flickering
      })
      .addCase(toggleIngredientChecked.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
        const index = state.groceryLists.findIndex(list => list._id === action.payload._id);
        if (index !== -1) {
          state.groceryLists[index] = action.payload;
        }
      })
      .addCase(removeAllItemsFromGroceryList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleIngredientChecked.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeAllItemsFromGroceryList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
      })
      .addCase(removeAllItemsFromGroceryList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { clearState, setActiveList } = grocerySlice.actions;
export default grocerySlice.reducer;
