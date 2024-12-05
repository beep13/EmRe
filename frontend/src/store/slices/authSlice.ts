import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { User } from '../api/types';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ access_token: string; token_type: string }>
    ) => {
      const { access_token } = action.payload;
      state.token = access_token;
      state.isAuthenticated = true;
      localStorage.setItem('token', access_token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.user;

export default authSlice.reducer; 