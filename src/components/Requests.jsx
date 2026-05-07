import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Base_Url } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchRequests = async () => {
    try {
      // ✅ FIXED: Changed "/requests" to "/request" to match your app.js prefix
      const res = await axios.get(Base_Url + "/request/received", {
        withCredentials: true,
      });

      // ✅ FIXED: Defensive check for data structure
      const fetchedData = res.data?.data || res.data || [];
      dispatch(addRequests(fetchedData));
    } catch (err) {
      console.error("Fetch Requests Error:", err);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      // ✅ Matches your app.js: app.use("/request", requestRouter)
      await axios.post(
        Base_Url + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      setSelectedUser(null);
    } catch (err) {
      console.error("Review Request Error:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ================= TINDER-STYLE DETAIL VIEW ================= */
  if (selectedUser) {
    const user = selectedUser.fromUserId;
    const getDefaultAvatar = (user) =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=random&color=fff&size=150`;

    const userPhoto = user.photoUrl || user.photo || getDefaultAvatar(user);

    return (
      <div className="fixed inset-0 z-[70] bg-black overflow-y-auto animate-slideUp">
        <div className="relative w-full h-[65vh] bg-[#050505] flex items-center justify-center overflow-hidden">
          {/* Layer 1: Blurred Background */}
          <img
            src={userPhoto}
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40"
            alt=""
          />

          {/* Layer 2: Main Image */}
          <img
            src={userPhoto}
            className="relative z-10 max-w-full max-h-full object-contain shadow-2xl shadow-black"
            alt={user.firstName}
          />

          <button
            onClick={() => setSelectedUser(null)}
            className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
          >
            ✕
          </button>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
          <div className="absolute bottom-6 left-6 z-20 text-white">
            <h1 className="text-4xl font-black">
              {user.firstName}, {user.age || "20"}
            </h1>
            <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
              {user.gender || "Developer"}
            </p>
          </div>
        </div>

        <div className="p-8 max-w-xl mx-auto space-y-10 bg-black min-h-[40vh]">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">About</h3>
            <p className="text-gray-200 text-lg leading-relaxed italic">
              "{user.about || "Interested in a great conversation!"}"
            </p>
          </section>

          <div className="flex gap-4 pb-12">
            <button
              onClick={() => reviewRequest("accepted", selectedUser._id)}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              ACCEPT
            </button>
            <button
              onClick={() => reviewRequest("rejected", selectedUser._id)}
              className="flex-1 py-4 bg-[#111] text-red-500 font-bold rounded-2xl border border-red-900/30 active:scale-95 transition-transform"
            >
              IGNORE
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= LIST VIEW (GRID) ================= */
  return (
    <div className="min-h-screen bg-black p-6 pt-24">
      <h1 className="text-xl font-bold text-white mb-6 border-l-4 border-pink-500 pl-3">
        Interested in You
      </h1>

      {/* Empty State */}
      {(!requests || requests.length === 0) && (
        <div className="text-center py-20">
          <p className="text-gray-500 italic">No pending requests yet.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
{requests?.filter(req => req.fromUserId !== null).map((req) => {
          const getDefaultAvatar = (user) =>
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=random&color=fff&size=150`;

const cardPhoto = req.fromUserId?.photoUrl || req.fromUserId?.photo || 
  (req.fromUserId ? getDefaultAvatar(req.fromUserId) : "https://i.ibb.co/dsB9Zw6C/profil-jpg.png");
          return (
            <div
              key={req._id}
              onClick={() => setSelectedUser(req)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group"
            >
              <img
                src={cardPhoto}
                className="w-full h-full object-cover blur-[1px] group-hover:blur-0 group-hover:scale-105 transition-all duration-500"
                alt=""
              />
              <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black via-black/60 to-transparent text-white">
                <p className="font-bold text-sm">
                  {req.fromUserId?.firstName}, {req.fromUserId?.age || "20"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
