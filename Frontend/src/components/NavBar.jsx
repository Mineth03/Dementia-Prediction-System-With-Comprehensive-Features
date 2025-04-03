import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaBrain,
  FaChartLine,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaInfoCircle,
  FaSignOutAlt,
  FaClipboardList,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useAuth();
  const [authUser, setAuthUser] = useState(user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthUser(user);
  }, [user]);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = () => {
    logout();
    setAuthUser(null);
    setShowLogoutModal(false);
    navigate('/');
  };

  const checkUserAndNavigate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/check-tracker/${user?.username}`
      );
      const data = await response.json();

      if (response.ok && data.exists) {
        navigate("/dashboard");
      } else {
        navigate("/trackingform");
      }
    } catch (error) {
      console.error("Error checking tracker:", error);
      alert("Error checking tracker. Please try again.");
    }
  };

  const menuItems = [
    { path: '/', icon: <FaHome />, text: 'Home' },
    { path: '#', icon: <FaChartLine />, text: 'Predictions', dropdown: 'predictions' },
    { isTracker: true, icon: <FaClipboardList />, text: 'Tracker' },
    { path: '/profile', icon: <FaUser />, text: 'Profile' },
    { path: '/about-us', icon: <FaInfoCircle />, text: 'About Us' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-lg shadow-lg z-50 h-20 border-b border-white/20">
      <div className="w-full px-6 flex items-center justify-between h-full">
        {/* Logo on far left */}
        <div className="flex items-center space-x-2">
          <FaBrain className="text-3xl text-[#229799] drop-shadow-md" />
          <span className="text-3xl font-bold text-[#229799] whitespace-nowrap drop-shadow-md">SafeMind</span>
        </div>

        {/* Centered Menu */}
        <div className="hidden md:flex space-x-6 justify-center items-center flex-1">
          {menuItems.map((item) => (
            <div key={item.text} className="relative">
              {item.isTracker ? (
                <div
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                  onClick={checkUserAndNavigate}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base font-medium break-words">{item.text}</span>
                </div>
              ) : item.dropdown ? (
                <div
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveDropdown(item.dropdown)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base font-medium break-words">{item.text}</span>
                  <FaChevronDown className="text-sm" />
                  <AnimatePresence>
                    {activeDropdown === item.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 bg-white text-black shadow-lg rounded-md mt-2 w-44 z-50"
                      >
                        <Link to="/prediction-form" className="block px-4 py-2 hover:bg-[#9ACBD0] text-sm">
                          Early Detection
                        </Link>
                        <Link to="/dementia-risk-form" className="block px-4 py-2 hover:bg-[#9ACBD0] text-sm">
                          Risk Prediction
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/20 transition-colors duration-200"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base font-medium break-words">{item.text}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Auth Buttons on far right */}
        <div className="hidden md:flex items-center space-x-4">
          {authUser ? (
            <>
              <span className="text-[#229799] font-medium whitespace-nowrap">
                {getTimeGreeting()}, {authUser.username}
              </span>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-[#48A6A7] rounded-md hover:bg-[#9ACBD0] transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#48A6A7] text-white rounded-md hover:bg-[#006A71] transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} className="text-white" /> : <FaBars size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/10 backdrop-blur-lg text-white flex flex-col items-center space-y-4 py-4 w-full"
          >
            {menuItems.map((item) =>
              item.isTracker ? (
                <button
                  key={item.text}
                  onClick={() => {
                    setIsOpen(false);
                    checkUserAndNavigate();
                  }}
                  className="flex items-center space-x-2 px-6 py-3 w-full justify-center hover:bg-white/20"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base font-medium break-words">{item.text}</span>
                </button>
              ) : (
                <Link
                  key={item.text}
                  to={item.path}
                  className="flex items-center space-x-2 px-6 py-3 w-full justify-center hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base font-medium break-words">{item.text}</span>
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Logout
              </h2>
              <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
