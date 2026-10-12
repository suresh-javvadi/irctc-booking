import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import trainsReducer from "./trainsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    trains: trainsReducer,
  },
});

let savedUser = store.getState().auth.user;

store.subscribe(() => {
  const user = store.getState().auth.user;

  if (user === savedUser) return;

  savedUser = user;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
});

export default store;
