import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  details: [],
  user: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    setProductDetails: (state, action) => {
      state.details = [action.payload]
    },
  },
});

export default userSlice.reducer;
export const { addUser, setProductDetails } = userSlice.actions;
