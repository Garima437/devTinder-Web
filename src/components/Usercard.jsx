
import React from "react";

const UserCard = ({ user, handleRequest }) => {
  if (!user) return null;

  // 🛠️ FIXED: Destructure photoUrl instead of photo
  const { _id, firstName, lastName, age, photoUrl, about, skills, gender } = user;

  const getDefaultAvatar = () => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=random&color=fff&size=150`;
  };

  // 🛠️ FIXED: Use photoUrl for the final source check
  const finalSrc = photoUrl && photoUrl.trim() !== "" ? photoUrl : getDefaultAvatar();

  return (
    <div className="relative w-full max-w-[420px] aspect-[9/16] bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 animate-slideUp group">

      {/* 1. HERO IMAGE: Full Bleed */}
      <img
        key={finalSrc}
        src={finalSrc}
        alt={`${firstName}'s profile`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        // 🛠️ FIXED: Better error handling for broken links
        onError={(e) => {
          if (e.target.src !== getDefaultAvatar()) {
            e.target.src = getDefaultAvatar();
          }
        }}
      />

      {/* 2. GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      {/* 3. USER CONTENT */}
      <div className="absolute bottom-28 left-6 right-6 text-white pointer-events-none">
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-black tracking-tight">
            {firstName} {lastName}{age ? `, ${age}` : ""}
          </h2>
          {gender === 'female' ? <span className="text-pink-400 text-sm font-bold">♀</span> : <span className="text-blue-400 text-sm font-bold">♂</span>}
        </div>

        <p className="text-gray-300 text-sm mt-2 line-clamp-2 leading-relaxed font-medium">
          {about || "No bio provided yet..."}
        </p>

        {/* SKILLS */}
        {skills && (
          <div className="flex flex-wrap gap-2 mt-4">
            {(Array.isArray(skills) ? skills : skills.split(",")).slice(0, 3).map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase font-bold border border-white/10 text-blue-300">
                {typeof skill === 'string' ? skill.trim() : skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. ACTION BUTTONS */}
      {/* 🛠️ ADDED: Check if handleRequest exists (for the "Live Preview" mode in EditProfile) */}
      {handleRequest && (
        <div className="absolute bottom-8 left-0 w-full flex justify-center gap-6 px-10">
          <button
            onClick={() => handleRequest("ignored", _id)}
            className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-red-500/50 flex items-center justify-center text-red-500 text-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-lg pointer-events-auto"
          >
            ✕
          </button>

          <button
            onClick={() => handleRequest("interested", _id)}
            className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-green-500/50 flex items-center justify-center text-green-500 text-3xl hover:bg-green-500 hover:text-white transition-all active:scale-90 shadow-lg pointer-events-auto"
          >
            ❤
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;