import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  details: JSON.parse(localStorage.getItem("productDetails")) || [], // Initialize as an empty array
  user: JSON.parse(localStorage.getItem("userData")) || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    setProductDetails: (state, action) => {
      // Store one product at a time as an array
      state.details = [action.payload];
      localStorage.setItem("productDetails", JSON.stringify(state.details)); // Persist updated array
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("productDetails");
    },
  },
});

export default userSlice.reducer;
export const { addUser, setProductDetails, logoutUser } = userSlice.actions;
