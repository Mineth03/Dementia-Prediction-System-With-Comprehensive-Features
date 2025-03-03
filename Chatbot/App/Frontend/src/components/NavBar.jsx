import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBrain, FaChartLine, FaUser, FaBars, FaTimes, FaUserPlus, FaSignInAlt, FaCaretDown } from "react-icons/fa";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuItems = [
    { path: "/", icon: <FaHome />, text: "Home" },
    { path: "/prediction-form", icon: <FaChartLine />, text: "Predictions" },
    { path: "/cog-test", icon: <FaBrain />, text: "Cognitive Test" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold"
          >
            HealthAI
          </motion.h1>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center">
            {menuItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              </motion.div>
            ))}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200"
              >
                <FaUser />
                <span>Profile</span>
                <FaCaretDown />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded-lg shadow-lg"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setProfileOpen(false)}
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setProfileOpen(false)}
                    >
                      Registration
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setProfileOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
