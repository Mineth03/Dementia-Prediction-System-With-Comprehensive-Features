import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    gender: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateStep = () => {
    let tempErrors = {};
    if (step === 1) {
      if (!formData.fullName) tempErrors.fullName = "Full Name is required";
      if (!formData.gender) tempErrors.gender = "Gender is required";
      if (!formData.age || isNaN(formData.age) || formData.age < 1 || formData.age > 120)
        tempErrors.age = "Age must be between 1 and 120";
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        tempErrors.email = "Invalid email format";
      if (!formData.phone.match(/^\d{10}$/)) tempErrors.phone = "Invalid phone number";
    } else if (step === 2) {
      if (!formData.username) tempErrors.username = "Username is required";
      if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword)
        tempErrors.confirmPassword = "Passwords do not match";
      if (!formData.termsAccepted) tempErrors.termsAccepted = "You must accept the terms";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Registration Successful!", data);
          navigate("/login");
        } else {
          setErrors({ general: data.error || "Registration failed" });
        }
      } catch (error) {
        setErrors({ general: "Server error. Please try again later." });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/doctor-talking-with-her-elder-patient_23-2148962312.jpg?t=st=1743662293~exp=1743665893~hmac=379346856bb6550c01a2aee463e0297d69e49b403f88ae099267e6bab301494d&w=1480')",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/30 w-full max-w-2xl"
      >
        <h2 className="text-5xl font-bold text-center text-[#229799] mb-8">Sign Up</h2>
        {errors.general && (
          <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#424242]">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242]">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242]">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242]">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242]">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-[#48CFCB] text-white py-3 rounded-lg hover:bg-[#229799] transition-transform transform hover:scale-105"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#424242]">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242]">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-[#48CFCB] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm text-[#424242]">I agree to the Terms & Conditions</label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>
              )}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-1/2 mr-2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 ml-2 bg-[#48CFCB] text-white py-3 rounded-lg hover:bg-[#229799] transition-transform transform hover:scale-105"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
