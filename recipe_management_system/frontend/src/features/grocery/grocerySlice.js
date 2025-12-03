import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import groceryService from './groceryService';

const initialState = {
  groceryList: null,
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
      return await groceryService.addCustomItem(itemData, token);
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
      return await groceryService.removeCustomItem(itemId, token);
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
      return await groceryService.toggleCustomItem(itemId, token);
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

export const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    clearState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroceryList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGroceryList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.groceryList = action.payload;
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
      });
  },
});

export const { clearState } = grocerySlice.actions;
export default grocerySlice.reducer;
