import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../utils/constants";
import { addConnections, removeConnection } from "../utils/connectionSlice";

const Connections = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const connections = useSelector((store) => store.connections);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

 const fetchConnections = async () => {
    try {
        const res = await axios.get(Base_Url + "/user/connections", { withCredentials: true });

        // Ensure we are grabbing the array correctly
        const connectionData = res.data?.data || res.data;

        if (Array.isArray(connectionData)) {
            dispatch(addConnections(connectionData));
        }
    } catch (err) {
        console.error("Failed to fetch connections:", err);
        // If 401, you might want to redirect to login
        if (err.response?.status === 401) navigate("/login");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchConnections();
    }, []);

    // ✅ Unmatch handler
    const handleUnmatch = async (connectionId, e) => {
        e.stopPropagation();
        try {
            await axios.delete(Base_Url + `/unmatch/${connectionId}`, { withCredentials: true });
            dispatch(removeConnection(connectionId));
            setSelectedUser(null);
        } catch (err) {
            console.error("Failed to unmatch:", err);
        }
    };



    const user = useSelector((store) => store.user);

    const handleMessage = (targetUserId, e) => {
        e.stopPropagation();

        if (!user?._id || !targetUserId) return;

        // 🚀 THE FIX: Sort both IDs so the Room ID is identical for both users
        // Example: ["ID_A", "ID_B"].sort() always results in "ID_A_ID_B"
        const sharedRoomId = [user._id, targetUserId].sort().join("_");

        navigate(`/chat/${sharedRoomId}`);
    };

    const getDefaultAvatar = (gender) =>
        gender?.toLowerCase() === "female"
            ? "https://avatar.iran.liara.run/public/girl"
            : "https://avatar.iran.liara.run/public/boy";

    /* ================= TINDER EXPANDED PROFILE VIEW ================= */
    if (selectedUser) {
        const displayPhoto = selectedUser.photoUrl || getDefaultAvatar(selectedUser.gender);

        return (
            <div className="fixed inset-0 z-[70] bg-black overflow-y-auto animate-slideUp">
                <div className="relative w-full h-[65vh] md:h-[80vh]">
                    <img
                        src={displayPhoto}
                        className="w-full h-full object-cover"
                        alt="Profile"
                        onError={(e) => { e.target.src = getDefaultAvatar(selectedUser.gender); }}
                    />
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl hover:bg-black/60 transition-all z-20"
                    >
                        ✕
                    </button>
                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <h1 className="text-4xl font-extrabold flex items-center gap-3">
                            {selectedUser.firstName}, {selectedUser.age}
                        </h1>
                        <p className="text-gray-300 text-lg opacity-90 capitalize">{selectedUser.gender}</p>
                    </div>
                </div>

                <div className="px-6 py-10 max-w-2xl mx-auto space-y-10 pb-20">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">About Me</h3>
                        <p className="text-white text-lg leading-relaxed font-light italic">
                            "{selectedUser.about || "Just here to connect and build cool stuff!"}"
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Tech Stack</h3>
                        <div className="flex flex-wrap gap-3">
                            {selectedUser.skills?.map((skill, i) => (
                                <span key={i} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full text-sm font-bold shadow-lg">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    <div className="flex gap-4 pt-4">
                        {/* ✅ FIXED MESSAGE BUTTON */}
                        <button
                            onClick={(e) => handleMessage(selectedUser._id, e)}
                            className="flex-1 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform active:scale-95"
                        >
                            MESSAGE
                        </button>

                        <button
                            onClick={(e) => handleUnmatch(selectedUser._id, e)}
                            className="px-6 py-4 bg-[#222] text-white rounded-2xl border border-white/10 hover:bg-red-600 transition-colors"
                        >
                            UNMATCH
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ================= LIST VIEW (GRID) ================= */
    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-orange-500"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-black px-4 pt-32 pb-10 flex flex-col items-center">
            <h1 className="text-3xl font-black italic text-white mb-10 tracking-tighter uppercase border-b-2 border-orange-500 pb-2">
                Your Connections
            </h1>

            {connections?.length === 0 ? (
                <p className="text-gray-500 mt-10">No connections found. Keep swiping!</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                    {connections?.map((user) => {
                        const cardPhoto = user.photoUrl || getDefaultAvatar(user.gender);
                        return (
                            <div
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer group hover:ring-4 ring-orange-500 transition-all duration-300 shadow-xl shadow-orange-500/10"
                            >
                                <img
                                    src={cardPhoto}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={user.firstName}
                                    onError={(e) => { e.target.src = getDefaultAvatar(user.gender); }}
                                />
                                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-white font-black text-lg tracking-tight">
                                            {user.firstName}, {user.age}
                                        </p>
                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Active Now</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Connections;