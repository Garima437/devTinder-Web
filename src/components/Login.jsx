import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../utils/constants";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState("garima.dev@test.com");
  const [password, setPassword] = useState("Garima@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        Base_Url + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      /**
       * 🛠️ DATA EXTRACTION LOGIC
       * We check for 'res.data.user' (what your auth.js sends)
       * or 'res.data.data' as a fallback.
       */
      const userData = res.data.user || res.data.data || res.data;

      // 🔍 DEBUGGING LOG: Check your browser console!
      console.log("Full User Object received at Login:", userData);

      if (userData) {
        // We dispatch the FULL object so Redux gets 'photoUrl'
        dispatch(addUser(userData));
        navigate("/feed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black px-4 pt-24 md:pt-32">
      <div className="w-full max-w-md bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-800 p-10">

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-500 tracking-tight">
            DevTinder 👩‍💻
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Connect with developers worldwide
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 text-xs p-3 rounded-xl mb-4 text-center font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 transition duration-200 text-white font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-95 flex justify-center items-center"
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-gray-400 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:underline cursor-pointer font-bold"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;