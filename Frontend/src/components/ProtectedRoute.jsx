// src/components/ProtectedRoute.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useAuth } from "../context/AuthContext";

Modal.setAppElement("#root"); // Required for accessibility

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Check if the user is logged in
  const [showModal, setShowModal] = useState(!user); // Show modal if no user
  const navigate = useNavigate();

  // Handle Login Button Click
  const handleLogin = () => {
    setShowModal(false);
    navigate("/login"); // Redirect to login
  };

  // Handle Cancel Button Click
  const handleCancel = () => {
    setShowModal(false);
    navigate("/"); // Redirect to homepage or any fallback
  };

  // If user is logged in, allow access to the protected route
  if (user) {
    return children;
  }

  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={handleCancel}
        contentLabel="Login Required"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to log in to access this page. Please log in to continue.
          </p>

          {/* Button Group */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProtectedRoute;
