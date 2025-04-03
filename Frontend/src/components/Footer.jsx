import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState(null);

  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback.trim() === "") {
      setMessage("Please enter your feedback before submitting.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/submitFeedback", {
        feedback,
      });

      if (response.status === 200) {
        setMessage("Thank you for your feedback!");
        setFeedback(""); // Clear the input after submission
      } else {
        setMessage("Error submitting feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage("Error submitting feedback. Please try again.");
    }
  };

  return (
    <footer className="bg-[#006A71] text-white p-6 text-center text-sm mt-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Feedback Form */}
        <div className="bg-[#48A6A7] p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">We Value Your Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="3"
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#9ACBD0] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#9ACBD0] text-[#006A71] rounded-lg hover:bg-[#48A6A7] transition-colors duration-200"
            >
              Submit Feedback
            </button>
            {message && (
              <p className="mt-2 text-sm text-green-400">{message}</p>
            )}
          </form>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-300">
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <p>Email: safeminddsgp@gmail.com</p>
            <p>Phone: +94-123-456-7890</p>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9ACBD0] transition-colors duration-200"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9ACBD0] transition-colors duration-200"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9ACBD0] transition-colors duration-200"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Copyright Info */}
        <div className="text-gray-400">
          © 2025 SafeMind. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
