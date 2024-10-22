import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
};
const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    addAdmin: (state, action) => {
      state.admin = action.payload;
    },
    logoutAdmin: (state, action) => {
      state.admin = null;
    },
  },
});

export default adminSlice.reducer;
export const { addAdmin, logoutAdmin } = adminSlice.actions;
