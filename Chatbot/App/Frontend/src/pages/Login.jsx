import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '', // ✅ REPLACED EMAIL WITH USERNAME
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = "Username is required"; // ✅ UPDATED VALIDATION FOR USERNAME
    if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
          setSuccessMessage("Successfully logged in");
          console.log("Login Successful!", data);
          setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
        } else {
          setErrors({ general: data.error || "Login failed" });
        }
      } catch (error) {
        setErrors({ general: "Server error. Please try again later." });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
      {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Username</label>  {/* ✅ UPDATED LABEL */}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <motion.button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" whileHover={{ scale: 1.05 }}>
          Login
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LoginForm;
