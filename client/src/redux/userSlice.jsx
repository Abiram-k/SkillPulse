import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  details: [],
  user: JSON.parse(localStorage.getItem("userData") || null),
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
      state.details = [action.payload];
    },
    logoutUser: (state, action) => {
      state.user = null;
      state.user = localStorage.removeItem("userData");
    },
  },
});

export default userSlice.reducer;
export const { addUser, setProductDetails, logoutUser } = userSlice.actions;
