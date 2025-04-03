import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaTransgender,
} from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "John Doe",
    email: user?.email || "johndoe@example.com",
    phone: user?.phone || "+1 123 456 7890",
    gender: user?.gender || "Not specified",
  });

  const username = user?.username || "johndoe123";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert(result.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Server error.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6"
    >
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-[#48CFCB] text-white rounded-full flex items-center justify-center shadow-md"
          >
            <FaUser className="text-4xl" />
          </motion.div>
          <h1 className="mt-4 text-3xl font-bold text-[#424242]">{username}</h1>
          <p className="text-[#229799] font-medium">{formData.fullName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Full Name", icon: <FaUser />, name: "fullName" },
            { label: "Email", icon: <FaEnvelope />, name: "email" },
            { label: "Phone", icon: <FaPhoneAlt />, name: "phone" },
            { label: "Gender", icon: <FaTransgender />, name: "gender" },
          ].map(({ label, icon, name }) => (
            <motion.div
              key={name}
              whileHover={{ scale: 1.03 }}
              className="bg-[#f5f5f5] p-5 rounded-lg shadow border border-gray-200"
            >
              <div className="flex items-center mb-2 text-[#424242]">
                <span className="text-[#48CFCB] mr-3">{icon}</span>
                <h2 className="text-md font-semibold">{label}</h2>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#48CFCB] focus:border-[#48CFCB]"
                />
              ) : (
                <p className="text-gray-600">{formData[name]}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                className="px-6 py-3 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="px-6 py-3 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
