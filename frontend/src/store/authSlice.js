import { createSlice } from '@reduxjs/toolkit';

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
const initialState = { user: savedUser ? JSON.parse(savedUser) : null, accessToken: savedToken || null, isAuthenticated: !!savedToken };

const authSlice = createSlice({ name: 'auth', initialState, reducers: {
  setCredentials(state, action) {
    state.user = action.payload.user;
    state.accessToken = action.payload.accessToken;
    state.isAuthenticated = true;
    try { localStorage.setItem('accessToken', action.payload.accessToken); localStorage.setItem('user', JSON.stringify(action.payload.user)); } catch (e) {}
  },
  setAccessToken(state, action) {
    state.accessToken = action.payload;
    state.isAuthenticated = !!action.payload;
    try { if (action.payload) localStorage.setItem('accessToken', action.payload); else localStorage.removeItem('accessToken'); } catch (e) {}
  },
  logout(state) {
    state.user = null;
    state.accessToken = null;
    state.isAuthenticated = false;
    try { localStorage.removeItem('accessToken'); localStorage.removeItem('user'); } catch (e) {}
  }
}});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
