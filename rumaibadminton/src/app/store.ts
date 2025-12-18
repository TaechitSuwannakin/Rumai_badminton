import { configureStore } from '@reduxjs/toolkit';
import racketReducer from '../features/racket/racketSlice';

export const store = configureStore({
  reducer: {
    racket: racketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;