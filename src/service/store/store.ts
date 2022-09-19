import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./auth.reducer";
import deviceReducer from "./device.reducer";
import imessReducer from "./imess.reducer";
import sendScriptReducer from "./sendScript";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    imess: imessReducer,
    device: deviceReducer,
    sendScript: sendScriptReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): any => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
