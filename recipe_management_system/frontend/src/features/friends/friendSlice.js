import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import friendService from './friendService';

const initialState = {
  friends: [],
  friendRequests: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const sendFriendRequest = createAsyncThunk(
  'friends/sendRequest',
  async (email, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await friendService.sendFriendRequest(email, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFriendRequests = createAsyncThunk(
  'friends/getRequests',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await friendService.getFriendRequests(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friends/acceptRequest',
  async (requestId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await friendService.acceptFriendRequest(requestId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'friends/rejectRequest',
  async (requestId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await friendService.rejectFriendRequest(requestId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFriends = createAsyncThunk(
  'friends/getFriends',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await friendService.getFriends(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeFriend = createAsyncThunk(
  'friends/removeFriend',
  async (friendId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await friendService.removeFriend(friendId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFriendRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFriendRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friendRequests = action.payload;
      })
      .addCase(getFriendRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friendRequests = state.friendRequests.filter(
          (req) => req._id !== action.payload._id
        );
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(rejectFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friendRequests = state.friendRequests.filter(
          (req) => req._id !== action.payload.id
        );
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friends = action.payload;
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeFriend.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.friends = state.friends.filter(
          (friend) => friend._id !== action.payload.id
        );
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { clearState } = friendSlice.actions;
export default friendSlice.reducer;
