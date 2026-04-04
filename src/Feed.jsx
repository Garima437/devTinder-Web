import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard"; // Make sure this component exists!

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    // If feed already has data, don't fetch again (optional optimization)
    if (feed && feed.length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      // res.data might be res.data.data depending on your backend
      dispatch(addFeed(res.data?.data || res.data));
    } catch (err) {
      console.error("Feed Fetch Error:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // 1. Handle Loading State
  if (!feed) return <div className="flex justify-center my-10"><span className="loading loading-spinner loading-lg"></span></div>;

  // 2. Handle Empty Feed (No new people to show)
  if (feed.length <= 0) {
    return (
      <div className="flex justify-center my-10">
        <h1 className="text-xl font-bold text-gray-500">No new users found! Check back later.</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-10">
      {/* 3. Render the first user in the feed array */}
      {feed && (
        <div className="flex justify-center">
          <UserCard user={feed[0]} />
        </div>
      )}
    </div>
  );
};

export default Feed;