import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Base_Url } from "../utils/constants";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const getFeed = async () => {
  // Only fetch if feed is empty/null AND we aren't already fetching
  if (feed && feed.length > 0) return;

  try {
    const res = await axios.get(Base_Url + "/user/feed", {
      withCredentials: true
    });

    const feedData = res.data?.data || res.data;

    // If backend returns an empty array, ensure Redux gets an empty array []
    // rather than null to trigger the "Desert" view correctly.
    dispatch(addFeed(Array.isArray(feedData) ? feedData : []));
  } catch (err) {
    console.error("Feed Fetch Error:", err);
    // If the error is 401, they need to log in again
    if (err.response?.status === 401) {
       // navigate("/login"); (Import navigate if you want this)
    }
  }
};

const handleRequest = async (status, _id) => {
    try {
      await axios.post(
        Base_Url + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Request Error:", err);
    } finally {
      dispatch(removeUserFromFeed(_id));
    }
  };
  useEffect(() => {
    getFeed();
  }, []);

  // 1. Initial Loading State
  if (!feed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="loading loading-dots loading-lg text-blue-500"></span>
      </div>
    );
  }

  // 2. No more users left
  if (feed.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10">
        <div className="text-6xl mb-4">🏜️</div>
        <h1 className="text-white text-xl font-black italic tracking-widest uppercase">
          End of the Feed
        </h1>
        <p className="text-gray-500 text-sm mt-2 text-center max-w-xs">
          You've seen all the developers in your area. Check back later!
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all font-bold"
        >
          REFRESH
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20">
      <div className="relative w-full max-w-[420px]">
        {/* ✅ We render the FIRST user in the array */}
        <UserCard user={feed[0]} handleRequest={handleRequest} />

        {/* Pro-Tip: Showing a "shadow" card behind the main one makes it look better */}
        {feed.length > 1 && (
           <div className="absolute inset-0 -z-10 translate-y-2 scale-95 opacity-50 blur-sm">
              <UserCard user={feed[1]} />
           </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
