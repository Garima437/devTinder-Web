import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { Base_Url } from "../utils/constants";

// The fallback image if the user hasn't uploaded a photo yet
const DEFAULT_AVATAR =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  // console.log("NavBar User Data:", user);
  const requests = useSelector((store) => store.requests);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = user && user.firstName;



const handleLogout = async () => {
  try {
    // 1. Tell the backend to clear the cookie
    await axios.post(`${Base_Url}/logout`, {}, { withCredentials: true });
  } catch (err) {
    console.error("Backend logout failed or was unreachable:", err);
    // Even if the server is down, we want to clear the local session
  } finally {
    // 2. ALWAYS clear Redux and redirect
    dispatch(removeUser());
    navigate("/login", { replace: true });
  }
};
  return (
    <div className="navbar bg-base-300 shadow-sm fixed top-0 z-50">
      <div className="flex-1">
        <button
          className="btn btn-ghost text-blue-500 text-xl font-bold italic"
          onClick={() => navigate("/feed")}
        >
          👩‍💻 DevTinder
        </button>
      </div>

      {isLoggedIn ? (
        <div className="flex items-center gap-4 px-4">
          <p className="text-white font-medium hidden sm:block">
            Welcome, {user.firstName}
          </p>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar border border-blue-500/30 relative"
            >
              {/* Notification dot for pending requests */}
              {requests?.length > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-base-300"></div>
              )}

              <div className="w-12 rounded-full overflow-hidden">
                <img
                  alt="profile"
                  /* ✅ FIXED: Changed user.photo to user.photoUrl */
                  src={user.photoUrl || DEFAULT_AVATAR}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-2xl border border-white/10"
            >
              <li>
                <Link to="/profile">Edit Profile</Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
<li>
  <Link to="/membership">⭐ Membership</Link>
</li>
              <li>
                <Link to="/requests" className="flex justify-between">
                  Requests
                  {requests?.length > 0 && (
                    <span className="badge badge-sm badge-secondary">{requests.length}</span>
                  )}
                </Link>
              </li>

              <div className="divider my-0 opacity-20"></div>

              <li>
                <button onClick={handleLogout} className="text-red-500 hover:bg-red-500/10">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="px-4">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
