import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import recipeReducer from '../features/recipes/recipeSlice';
import groceryReducer from '../features/grocery/grocerySlice';
import friendReducer from '../features/friends/friendSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipe: recipeReducer,
    grocery: groceryReducer,
    friends: friendReducer,
  },
});
