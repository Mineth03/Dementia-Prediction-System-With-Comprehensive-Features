import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBrain, FaChartLine, FaUser, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png"; // Ensure your logo path is correct

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", icon: <FaHome />, text: "Home" },
    { path: "/prediction-form", icon: <FaChartLine />, text: "Predictions" },
    { path: "/cog-test", icon: <FaBrain />, text: "Cognitive Test" },
    { path: "/profile", icon: <FaUser />, text: "Profile" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo (Left Side) */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
          {menuItems.map((item) => (
            <motion.div key={item.path} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={item.path}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200"
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop Login & Signup */}
        <div className="hidden lg:flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-200 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
          >
            Signup
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-blue-700 text-white"
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 px-6 py-3 hover:bg-blue-800 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}

            {/* Mobile Login & Signup */}
            <div className="flex flex-col px-6 py-3 space-y-2">
              <Link
                to="/login"
                className="block px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-200 transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
