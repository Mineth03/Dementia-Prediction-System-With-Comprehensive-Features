import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateStep = () => {
    let tempErrors = {};
    if (step === 1) {
      if (!formData.fullName) tempErrors.fullName = "Full Name is required";
      if (!formData.username) tempErrors.username = "Username is required";
      if (!formData.gender) tempErrors.gender = "Gender is required";
      if (!formData.age || isNaN(formData.age) || formData.age < 1 || formData.age > 120) tempErrors.age = "Age must be between 1 and 120";
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) tempErrors.email = "Invalid email format";
      if (!formData.phone.match(/^\d{10}$/)) tempErrors.phone = "Invalid phone number";
    } else if (step === 2) {
      if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
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
          body: JSON.stringify(formData)
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
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
      {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {step === 1 && (
          <>
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <button type="button" onClick={handleNext} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-gray-700">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-600">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-600">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mr-2" />
              <label className="text-gray-700">I agree to the Terms & Conditions</label>
            </div>

            <button type="button" onClick={handleBack} className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">Back</button>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Register</button>
          </>
        )}
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
