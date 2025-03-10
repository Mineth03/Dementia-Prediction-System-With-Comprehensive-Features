import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FaExclamationTriangle className="text-red-500 text-4xl" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-900 mb-2"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-gray-700 mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;