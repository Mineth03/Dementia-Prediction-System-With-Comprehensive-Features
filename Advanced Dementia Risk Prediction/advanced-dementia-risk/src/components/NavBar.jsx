import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBrain, FaChartLine, FaUser, FaBars, FaTimes, FaFileMedicalAlt } from "react-icons/fa";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", icon: <FaHome />, text: "Home" },
    { path: "/prediction-form", icon: <FaChartLine />, text: "Predictions" },
    { path: "/cog-test", icon: <FaBrain />, text: "Cognitive Test" },
    { path: "/dementia-risk-form", icon: <FaFileMedicalAlt />, text: "Dementia Risk" },
    { path: "/profile", icon: <FaUser />, text: "Profile" },
    

  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

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
          <div className="hidden lg:flex space-x-8">
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
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="lg:hidden"
            >
              {menuItems.map((item) => (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  className="py-2"
                >
                  <Link
                    to={item.path}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;