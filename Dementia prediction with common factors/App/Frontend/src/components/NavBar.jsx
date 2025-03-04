import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBrain, FaChartLine, FaUser, FaBars, FaTimes, FaChevronDown, FaInfoCircle } from "react-icons/fa";
import logo from "../assets/logo.png"; // Ensure your logo path is correct

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const menuItems = [
    { path: "/", icon: <FaHome />, text: "Home" },
    { path: "#", icon: <FaChartLine />, text: "Predictions", dropdown: "predictions" },
    { path: "#", icon: <FaBrain />, text: "Other Tests", dropdown: "otherTests" },
    { path: "/profile", icon: <FaUser />, text: "Profile" },
    { path: "/about-us", icon: <FaInfoCircle />, text: "About Us" }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo (Left Side) */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {menuItems.map((item) => (
            <div key={item.text} className="relative">
              {item.dropdown ? (
                <div
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveDropdown(item.dropdown)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.icon}
                  <span>{item.text}</span>
                  <FaChevronDown className="text-sm" />
                  <AnimatePresence>
                    {activeDropdown === item.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 bg-white text-black shadow-lg rounded-md mt-2 w-48"
                      >
                        {item.dropdown === "predictions" && (
                          <>
                            <Link to="/prediction-form" className="block px-4 py-2 hover:bg-gray-200">
                              Early Detection
                            </Link>
                            <Link to="/dementia-risk-form" className="block px-4 py-2 hover:bg-gray-200">
                              Risk Prediction
                            </Link>
                          </>
                        )}
                        {item.dropdown === "otherTests" && (
                          <>
                            <Link to="/cog-test" className="block px-4 py-2 hover:bg-gray-200">
                              Cognitive Test
                            </Link>
                            <Link to="/depression-test" className="block px-4 py-2 hover:bg-gray-200">
                              Depression Test
                            </Link>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Login & Signup */}
        <div className="hidden md:flex space-x-4">
          <Link to="/login" className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-200 transition">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition">
            Signup
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
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
            className="md:hidden bg-blue-700 text-white flex flex-col items-center space-y-4 py-4 w-full"
          >
            {menuItems.map((item) => (
              <Link
                key={item.text}
                to={item.path}
                className="flex items-center space-x-2 px-6 py-3 w-full justify-center hover:bg-blue-800"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
