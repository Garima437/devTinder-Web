import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addUser } from "../utils/userSlice"; // Adjust path to your slice
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("garima@gmail.com");
  const [password, setPassword] = useState("Garima@123");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true } // Crucial for saving JWT cookies
      );

      // 1. Update Redux Store
      dispatch(addUser(res.data));

      // 2. Redirect to Feed
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Invalid Credentials");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card w-96 bg-base-300 shadow-xl border border-white/10">
        <div className="card-body">
          <h2 className="card-title justify-center text-primary font-bold text-2xl">
            Login
          </h2>

          <div className="space-y-4 mt-4">
            {/* Email Input */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>

            {/* Password Input */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                value={password}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="card-actions justify-center mt-6">
            <button className="btn btn-primary w-full" onClick={handleLogin}>
              Login
            </button>
          </div>

          <p className="text-center mt-4 text-sm">
            New here?{" "}
            <Link to="/signup" className="link link-primary">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;