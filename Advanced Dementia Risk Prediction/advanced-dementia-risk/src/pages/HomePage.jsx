import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBrain, FaHeartbeat, FaChartLine } from 'react-icons/fa';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Cognitive Health Assessment
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Advanced AI-powered tools for comprehensive cognitive health evaluation
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300"
          >
            <div className="text-blue-600 mb-4">
              <FaBrain className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cognitive Test</h2>
            <p className="text-gray-600 mb-6">
              Comprehensive assessment of memory, attention, and cognitive functions
            </p>
            <Link
              to="/cog-test"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Start Test
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300"
          >
            <div className="text-indigo-600 mb-4">
              <FaHeartbeat className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Depression Screening</h2>
            <p className="text-gray-600 mb-6">
              AI-powered analysis for early detection of depression symptoms
            </p>
            <Link
              to="/depression-test"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Take Screening
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300"
          >
            <div className="text-purple-600 mb-4">
              <FaChartLine className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Risk Assessment</h2>
            <p className="text-gray-600 mb-6">
              Personalized dementia risk prediction based on multiple factors
            </p>
            <Link
              to="/prediction-form"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300"
            >
              Start Assessment
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-gray-600">
            Our platform combines cutting-edge AI technology with established medical protocols
            to provide accurate and comprehensive cognitive health assessments. Get started
            today to take control of your cognitive health.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;