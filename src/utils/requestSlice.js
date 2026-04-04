
import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    // ✅ Add this to fix the "addRequests" error
    addRequests: (state, action) => {
      return action.payload;
    },
    // ✅ Add this to fix the "removeRequest" error
    removeRequest: (state, action) => {
      if (!state) return null;
      // This removes the request from the list after you click Accept/Reject
      return state.filter((r) => r._id !== action.payload);
    },
  },
});

export const { addRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;