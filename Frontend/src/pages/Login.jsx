import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email_or_username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email_or_username)
      tempErrors.email_or_username = "Email or Username is required";
    if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
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
          body: JSON.stringify({
            email_or_username: formData.email_or_username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          login(formData.email_or_username, formData.password);
          setSuccessMessage("Successfully logged in");
          setTimeout(() => navigate("/"), 2000);
        } else {
          setErrors({ general: data.error || "Login failed" });
        }
      } catch (error) {
        console.error("Login error", error);
        setErrors({ general: "Server error. Please try again later." });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl"
      >
        {/* Left Section - Image */}
        <div className="hidden md:flex w-1/2 bg-[#48CFCB] items-center justify-center">
          <img
            src="https://www.pillarcare.co.uk/wp-content/uploads/2021/03/live-in-1-scaled.jpg"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-center text-[#424242] mb-6">
            Welcome Back
          </h2>

          {successMessage && (
            <p className="text-green-600 text-center text-sm mb-4">{successMessage}</p>
          )}
          {errors.general && (
            <p className="text-red-500 text-center text-sm mb-4">{errors.general}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Username */}
            <div>
              <label className="block text-[#424242] font-semibold mb-2">
                Email or Username
              </label>
              <input
                type="text"
                name="email_or_username"
                value={formData.email_or_username}
                onChange={handleChange}
                className="w-full p-4 border border-[#48CFCB] rounded-xl shadow-sm focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
              />
              {errors.email_or_username && (
                <p className="text-red-500 text-sm mt-1">{errors.email_or_username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#424242] font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-4 border border-[#48CFCB] rounded-xl shadow-sm focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#229799]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="w-full bg-[#48CFCB] text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-[#229799] transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Login
            </motion.button>

            {/* Forgot Password */}
            <p className="text-center text-sm text-[#424242] mt-4">
              Forgot your password?{" "}
              <a href="#" className="text-[#48CFCB] hover:text-[#229799] font-medium">
                Reset here
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
