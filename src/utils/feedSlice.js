
import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  // 1. Change to null so Feed.jsx knows when to trigger the first API call
  initialState: null,

  reducers: {
    addFeed: (state, action) => {
      // 2. When data arrives, this replaces null with the array from your API
      return action.payload;
    },

    removeFeed: (state, action) => {
      // 3. Keep this as null or [] depending on if you want to force a re-fetch later
      return null;
    },

    // 4. ADD THIS: This is essential for the "Tinder" experience
    // It removes a specific user from the feed after you Swipe/Interested
    removeUserFromFeed: (state, action) => {
      if (!state) return null;
      const newFeed = state.filter((user) => user._id !== action.payload);
      return newFeed;
    },
  },
});

export const { addFeed, removeFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;