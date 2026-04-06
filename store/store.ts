import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import hospitalReducer from "./features/hospital/hospitalSlice";
import contactReducer from "./features/contact/contactSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    hospital: hospitalReducer,
    contact: contactReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
