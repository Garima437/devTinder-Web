

import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    addConnections: (state, action) => {
      return action.payload;
    },
    // ✅ Add this to fix the "removeConnection" error
    removeConnection: (state, action) => {
      if (!state) return null;
      return state.filter((c) => c._id !== action.payload);
    },
    // This clears everything (useful for Logout)
    removeConnections: (state) => {
      return null;
    },
  },
});

// ✅ Make sure "removeConnection" is in this export list
export const { addConnections, removeConnection, removeConnections } = connectionSlice.actions;
export default connectionSlice.reducer;