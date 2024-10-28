import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("userData")) || null,
  details: JSON.parse(localStorage.getItem("productDetails")) || [],
  checkoutItems: JSON.parse(localStorage.getItem("checkoutItems")) || null,
  signUpSuccess: localStorage.getItem("signUpSuccess") || null,
  // selectedAddress also need to remove from localstorage
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
    checkoutItems: (state, action) => {
      state.checkoutItems = action.payload;
      localStorage.setItem("checkoutItems", JSON.stringify(action.payload));
    },
    ordered: (state, action) => {
      state.checkoutItems = null;
      localStorage.removeItem("checkoutItems");
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
  checkoutItems,
  ordered
} = userSlice.actions;
