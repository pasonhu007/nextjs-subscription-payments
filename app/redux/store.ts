import { configureStore } from '@reduxjs/toolkit';
import botReducer from './bot/botSlice';

export const store = configureStore({
  reducer: {
    bot: botReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
