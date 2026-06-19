import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import cartReducer from './cartSlice';

const rootReducer = combineReducers({ auth: authReducer, cart: cartReducer });

const persistConfig = { key: 'root', storage, whitelist: ['auth','cart'] };

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({ reducer: persistedReducer, middleware: (getDefault) => getDefault() });

export const persistor = persistStore(store);
export default store;
