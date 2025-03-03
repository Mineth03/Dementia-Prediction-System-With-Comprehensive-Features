import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaHeartbeat, FaChartLine, FaPuzzlePiece, FaGamepad } from 'react-icons/fa';
import image from '../assets/HomePageDC.jpg';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const navigate = useNavigate();

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.div variants={itemVariants}>
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Join With Us For Ensure Cognitive Wellbeing.
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            "The mind is like a muscle—the more you exercise it, the stronger it gets." – Anonymous
          </p>
        </motion.div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-700 py-10 px-10 mt-12 rounded-3xl shadow-2xl flex flex-col lg:flex-row items-center justify-between overflow-hidden"
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-700 to-blue-800 opacity-50 blur-lg"></div>

        {/* Left Content - Larger Quote & Text */}
        <motion.div
          variants={itemVariants}
          className="relative text-white text-center lg:text-left max-w-xl z-10"
        >
          <h1 className="text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Detect Early. <br /> Care Better.
          </h1>
          <p className="text-2xl opacity-90 font-medium leading-relaxed">
          Early detection of dementia is more than a diagnosis, it’s a chance for timely treatment, informed decisions, and better quality of life. It empowers individuals and families to plan, seek support, and slow progression, making every moment count.
          </p>
          <button
            onClick={() => navigate("/prediction-form")}
            className="mt-6 px-8 py-4 text-xl bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-100 transition-all"
          >
            Take Quick Test
          </button>
        </motion.div>

        {/* Right Content - Large Image Inside the Rectangle */}
        <motion.div
          variants={itemVariants}
          className="relative w-[550px] h-[550px] flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden">
            <img
              src={image}
              alt="Doctor consulting patient"
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Feature Section */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
        {[
          {
            icon: <FaBrain className="w-16 h-16 mx-auto text-blue-600" />, title: "Cognitive Test", description: "Comprehensive assessment of memory, attention, and cognitive functions", link: "/cog-test", bgColor: "bg-blue-600",
          },
          {
            icon: <FaHeartbeat className="w-16 h-16 mx-auto text-indigo-600" />, title: "Depression Screening", description: "AI-powered analysis for early detection of depression symptoms", link: "/depression-test", bgColor: "bg-indigo-600",
          },
          {
            icon: <FaChartLine className="w-16 h-16 mx-auto text-purple-600" />, title: "Risk Assessment", description: "Personalized dementia risk prediction based on multiple factors", link: "/prediction-form", bgColor: "bg-purple-600",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center space-y-6 transition-transform duration-300"
          >
            {item.icon}
            <h2 className="text-2xl font-semibold text-gray-900">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
            <Link
              to={item.link}
              className={`inline-block ${item.bgColor} text-white px-6 py-3 rounded-lg hover:opacity-90 transition duration-300`}
            >
              Learn More
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Video Section */}
      <motion.div variants={itemVariants} className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">A Brighter Future for Dementia Care</h2>
        <p className="text-gray-600 mb-6">
          Together, let's rewrite the narrative and make early detection the norm. Listen to dementia experts, advocates, and caregivers explain why this is the future of care.
        </p>
        <iframe
          className="w-full h-64 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          src="https://www.youtube.com/watch?v=-lwJyVNsytg"
          title="Dementia Awareness Video"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </motion.div>

      {/* Games Section */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-16">
        {[ 
          { icon: <FaPuzzlePiece className="w-16 h-16 mx-auto text-blue-600" />, title: "Sliding Puzzle", link: "/sliding-puzzle" },
          { icon: <FaGamepad className="w-16 h-16 mx-auto text-blue-600" />, title: "Flip Cards", link: "/flip-cards" },
          { icon: <FaChartLine className="w-16 h-16 mx-auto text-blue-600" />, title: "Cross Words", link: "/cross-words" },
          { icon: <FaPuzzlePiece className="w-16 h-16 mx-auto text-blue-600" />, title: "Jigsaw Puzzle", link: "/jigsaw" },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center space-y-6 transition-transform duration-300"
          >
            {item.icon}
            <h2 className="text-2xl font-semibold text-gray-900">{item.title}</h2>
            <Link
              to={item.link}
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition duration-300"
            >
              Play Now
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Section */}
      <motion.div variants={itemVariants} className="text-center bg-gray-100 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
        <p className="text-gray-600">"A healthy outside starts from the inside." – Robert Urich</p>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
