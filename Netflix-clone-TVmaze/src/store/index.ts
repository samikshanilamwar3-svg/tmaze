import { configureStore } from "@reduxjs/toolkit";
import { tvmazeApi } from "./slices/apiSlice";
import discoverReducer from "./slices/discover";

const store = configureStore({
  reducer: {
    discover: discoverReducer,
    [tvmazeApi.reducerPath]: tvmazeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tvmazeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
