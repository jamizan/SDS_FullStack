import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recipeService from './recipeService';

const initialState = {
  recipes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const fetchAllRecipes = createAsyncThunk(
  'recipes/fetchAll',
  async (filter, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recipeService.fetchRecipes(filter, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async ({ recipeId, recipeData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recipeService.updateRecipe(recipeId, recipeData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addRecipe = createAsyncThunk(
  'recipes/add',
  async (recipeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recipeService.addRecipe(recipeData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/delete',
  async (recipeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recipeService.deleteRecipe(recipeId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const shareRecipe = createAsyncThunk(
  'recipes/share',
  async ({ recipeId, friendId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recipeService.shareRecipe(recipeId, friendId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const unShareRecipe = createAsyncThunk(
  'recipes/unshare',
  async ({ recipeId, friendId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await recipeService.unShareRecipe(recipeId, token, friendId);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    clearState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recipes = action.payload;
      })
      .addCase(fetchAllRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.recipes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      .addCase(addRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recipes.push(action.payload);
      })
      .addCase(deleteRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recipes = state.recipes.filter(r => r._id !== action.payload.id);
      })
      .addCase(shareRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(shareRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(shareRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.recipes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      })
      .addCase(unShareRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unShareRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unShareRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recipes = state.recipes.filter(recipe => recipe._id !== action.payload._id);
      });

  },
});



export const { clearState } = recipeSlice.actions;
export default recipeSlice.reducer;