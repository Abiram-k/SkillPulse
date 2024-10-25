import { createSlice } from "@reduxjs/toolkit";
import { json } from "react-router-dom";

const initialState = {
  user: JSON.parse(localStorage.getItem("userData")) || null,
  details: JSON.parse(localStorage.getItem("productDetails")) || [],
  signUpSuccess: localStorage.getItem("signUpSuccess") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    signUpSuccess: (state, action) => {
      state.signUpSuccess = action.payload;
      localStorage.setItem("signUpSuccess", action.payload);
    },
    otpSuccess: (state, action) => {
      state.signUpSuccess = null;
      localStorage.removeItem("signUpSuccess");
    },
    setProductDetails: (state, action) => {
      state.details = [action.payload];
      localStorage.setItem("productDetails", JSON.stringify(state.details));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("productDetails");
    },
  },
});

export default userSlice.reducer;
export const {
  addUser,
  setProductDetails,
  logoutUser,
  signUpSuccess,
  otpSuccess,
} = userSlice.actions;
