import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from './NavBar';
import Footer from './Footer';
import Chatbot from "./Chatbot";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 mt-20"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Layout;