import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../utils/constants";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [about, setAbout] = useState(""); // New State for About
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!gender) return setError("Please select a gender");
    if (!skills.trim()) return setError("At least one skill is required");

    setLoading(true);
    try {
      const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s !== "");

      const res = await axios.post(
        Base_Url + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
          age: Number(age),
          gender,
          skills: skillsArray,
          photoUrl,
          about // Sending the bio to the backend
        },
        { withCredentials: true }
      );

      const userData = res.data.data || res.data.user || res.data;
      dispatch(addUser(userData));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black px-4 pt-10 md:pt-14 pb-12">
      <div className="w-full max-w-lg bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-800 p-8 md:p-10">

        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-blue-500 tracking-tight">
            DevTinder 👩‍💻
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Build your developer identity</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] p-3 rounded-xl mb-2 text-center font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          {/* Name Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">First Name</label>
              <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Last Name</label>
              <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all" />
            </div>
          </div>

          {/* Age, Gender & Photo Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Age</label>
              <input type="number" required value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full px-4 py-3.5 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer">
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Photo URL</label>
              <input type="text" placeholder="https://..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all" />
            </div>
          </div>

          {/* About Section */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">About / Bio</label>
            <textarea
              rows="3"
              placeholder="Tell other developers about yourself..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>

          {/* Skills Box */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Skills (Comma separated)</label>
            <input type="text" placeholder="React, Node, MongoDB" required value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all placeholder:text-zinc-600" />
          </div>

          {/* Auth Row */}
          <div className="flex gap-4">
            <div className="flex-[1.5]">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Email ID</label>
              <input type="email" required value={emailId} onChange={(e) => setEmailId(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 mt-2 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 transition duration-200 text-white font-bold text-lg shadow-xl active:scale-95 flex justify-center items-center">
            {loading ? <span className="loading loading-spinner loading-md"></span> : "Join Community"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;