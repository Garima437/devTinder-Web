// import Footer from "./Footer";
// import NavBar from "./NavBar";
// import { useLocation, Outlet, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { addUser } from "../utils/userSlice";
// import { Base_Url } from "../utils/constants";

// function Body() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user = useSelector((store) => store.user);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     if (location.pathname === "/login") {
//       setLoading(false);
//       return;
//     }


//     if (user && user._id) {
//       setLoading(false);
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`${Base_Url}/profile/view`, {
//           withCredentials: true,
//         });


//         const userData = res.data.data || res.data.user || res.data;
//         dispatch(addUser(userData));
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         // If unauthorized, send to login
//         if (err.response?.status === 401) {
//           navigate("/login", { replace: true });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();

//   }, [dispatch, navigate, location.pathname]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black">
//         <span className="loading loading-spinner loading-lg text-blue-500"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-black">
//       <NavBar />
//       <main className="flex-grow">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default Body;



import Footer from "./Footer";
import NavBar from "./NavBar";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { Base_Url } from "../utils/constants";

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Skip fetch if we are on login or already have user in Redux
    if (location.pathname === "/login" || (user && user._id)) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        // ✅ FIXED: Changed /profile/view to /profile/me to match backend
        // const res = await axios.get(`${Base_Url}/profile/me`, {
        //   withCredentials: true,
        // });
        const res = await axios.get(Base_Url + "/profile/me", { withCredentials: true });

        const userData = res.data.data || res.data.user || res.data;
        dispatch(addUser(userData));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // If the cookie is expired or missing, backend returns 401
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, navigate, location.pathname]); // Removed 'user' from deps to avoid infinite loop

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Body;