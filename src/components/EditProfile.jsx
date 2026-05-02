import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Base_Url } from "../utils/constants";
import Usercard from "./Usercard";
import toast from "react-hot-toast";

const EditProfile = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    skills: "",
    about: "",
    photoUrl: "", // 🛠️ FIXED: Renamed from photo
    isAgeEditable: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(Base_Url + "/profile/me", { withCredentials: true });
        if (res.data?.data) {
          const user = res.data.data;
          setFormData({
            ...user,
            // 🛠️ Convert skills array to comma-separated string for the input field
            skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadToast = toast.loading("Uploading new photo...");
    const previewUrl = URL.createObjectURL(file);

    // Show local preview immediately
    setFormData((prev) => ({ ...prev, photoUrl: previewUrl }));

    const data = new FormData();
    data.append("photo", file); // Keep this as "photo" if your multer backend expects it

    try {
      const res = await axios.post(Base_Url + "/profile/upload-photo", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🛠️ Ensure your backend returns the new URL in a field named 'photoUrl' or 'photo'
      const finalPhoto = res.data.photoUrl || res.data.photo;

      if (finalPhoto) {
        setFormData((prev) => ({ ...prev, photoUrl: finalPhoto }));
        // Update Redux immediately
        dispatch(addUser({ ...formData, photoUrl: finalPhoto }));
        toast.success("Photo uploaded successfully!", { id: uploadToast });
      }
    } catch (err) {
      toast.error("Photo upload failed", { id: uploadToast });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const savingToast = toast.loading("Saving changes...");

    try {
      // 🛠️ Correctly format skills back into an array for the backend
      const skillsArray = typeof formData.skills === "string"
        ? formData.skills.split(",").map(skill => skill.trim()).filter(s => s !== "")
        : formData.skills;

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        age: formData.age,
        about: formData.about,
        skills: skillsArray,
        photoUrl: formData.photoUrl // 🛠️ FIXED: Changed from photo
      };

      const res = await axios.patch(
        Base_Url + "/profile/edit",
        updateData,
        { withCredentials: true }
      );

      // ✅ Update Redux store with the fresh data from the server
      const updatedUser = res.data.data;
      dispatch(addUser(updatedUser));

      toast.success("Profile saved successfully! ✅", { id: savingToast });

      // Keep local state in sync (converting skills array back to string for UI)
      setFormData({
        ...updatedUser,
        skills: Array.isArray(updatedUser.skills) ? updatedUser.skills.join(", ") : updatedUser.skills
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Update Failed", { id: savingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen bg-black p-6 gap-12 pt-24 text-white">
      <div className="w-full max-w-md">
        <h2 className="text-blue-500 font-bold text-xs uppercase tracking-[0.2em] mb-6 ml-2">
          Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="photoUpload" className="cursor-pointer relative group">
              <img
                src={formData.photoUrl || "https://i.ibb.co/dsB9Zw6C/profil-jpg.png"} // 🛠️ FIXED: photoUrl
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-blue-500/50 group-hover:border-blue-400 transition-all"
                onError={(e) => { e.target.src = "https://i.ibb.co/dsB9Zw6C/profil-jpg.png"; }}
              />
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[10px] font-bold uppercase text-white">Update Photo</span>
              </div>
            </label>
            <input id="photoUpload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>

          <div className="space-y-5">
            <div className="flex gap-4">
               <div className="w-1/2">
                 <label className="text-[10px] text-gray-500 uppercase ml-1">First Name</label>
                 <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[#121212] p-3 rounded-xl border border-white/10" />
               </div>
               <div className="w-1/2">
                 <label className="text-[10px] text-gray-500 uppercase ml-1">Last Name</label>
                 <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[#121212] p-3 rounded-xl border border-white/10" />
               </div>
            </div>

           <div>
  <label className="text-[10px] text-gray-500 uppercase ml-1">
    Age {!formData.isAgeEditable && "(Locked)"}
  </label>
  <input
    type="number"
    name="age"
    value={formData.age}
    onChange={handleChange}
    // ✅ Use the flag to disable the input if needed
    disabled={!formData.isAgeEditable}
    className={`w-full bg-[#121212] p-3 rounded-xl border border-white/10 transition-all ${
      !formData.isAgeEditable ? "opacity-50 cursor-not-allowed border-none" : "focus:border-blue-500"
    }`}
  />
</div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase ml-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#121212] p-3 rounded-xl border border-white/10 outline-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase ml-1">Skills (comma separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-[#121212] p-3 rounded-xl border border-white/10" placeholder="React, Node, Java" />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase ml-1">About</label>
              <textarea name="about" value={formData.about} onChange={handleChange} rows="3" className="w-full bg-[#121212] p-3 rounded-xl border border-white/10 resize-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-8 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-sm lg:sticky lg:top-24">
        <h2 className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mb-6 ml-2">Live Preview</h2>
        <Usercard user={formData} isPreview={true} />
      </div>
    </div>
  );
};

export default EditProfile;