import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../utils/constants";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=default";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${Base_Url}/user/profile/${userId}`, {
          withCredentials: true,
        });
        setUser(res.data?.data || res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-blue-500"></span>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <p>User not found</p>
    </div>
  );

  const photo = user.photoUrl || DEFAULT_AVATAR;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Image */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <img src={photo} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40" alt="" />
        <img src={photo} className="relative z-10 w-full h-full object-contain" alt={user.firstName} />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
        >
          ←
        </button>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
        <div className="absolute bottom-6 left-6 z-20">
          <h1 className="text-4xl font-black">{user.firstName} {user.lastName}{user.age ? `, ${user.age}` : ""}</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest">{user.gender || "Developer"}</p>
        </div>
      </div>

      {/* Details */}
      <div className="p-8 max-w-xl mx-auto space-y-8">
        {user.about && (
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">About</h3>
            <p className="text-gray-200 text-lg leading-relaxed italic">"{user.about}"</p>
          </section>
        )}

        {user.skills?.length > 0 && (
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Profile;
