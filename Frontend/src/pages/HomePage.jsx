import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBrain,
  FaHeartbeat,
  FaChartLine,
  FaPuzzlePiece,
  FaGamepad,
} from "react-icons/fa";
import image from "../assets/HomePageDC.jpg";
import image1 from "../assets/imageTracker.png";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  // Variants for main content
  const mainContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const mainItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Function to check if the user exists and navigate accordingly
  const checkUserAndNavigate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/check-tracker/${user?.username}`
      );
      const data = await response.json();

      if (response.ok && data.exists) {
        // Navigate to Dashboard if user is registered
        navigate("/dashboard");
      } else {
        // Navigate to Registration Form if not registered
        navigate("/trackingform");
      }
    } catch (error) {
      console.error("Error checking tracker:", error);
      alert("Error checking tracker. Please try again.");
    }
  };

  // Fetch feedbacks from API
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getFeedbacks");
      if (response.status === 200 && response.data.length > 0) {
        setFeedbacks(response.data);
      } else {
        setFeedbacks([{ feedback: "No feedback available yet." }]);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setFeedbacks([{ feedback: "Error loading feedbacks. Try again later." }]);
    }
  };

  // Fetch feedbacks on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Rotate feedbacks every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex(
        (prevIndex) => (prevIndex + 1) % feedbacks.length
      );
    }, 20000);

    return () => clearInterval(interval);
  }, [feedbacks]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={mainContainerVariants}
      className="min-h-screen bg-[#F5F5F5] sm:px-0 lg:px-0"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative w-full h-screen"
      >

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://img.freepik.com/free-photo/arabic-woman-teaching-senior-man-use-led-lamp-with-smartphone_23-2149356609.jpg?t=st=1743662029~exp=1743665629~hmac=2b1fadffbfc01d82d51cf7bb3c8fcf1d4640902c4c861deb8e04119882e8c380&w=1380')`,
          }}
        ></div>

        {/* Content Wrapper with Transparent Background */}
        <div className="absolute inset-0 flex items-center justify-start px-8 sm:px-12 lg:px-20">
          <div className="max-w-2xl p-8 bg-white bg-opacity-0 rounded-lg shadow-lg">
            <h2 className="text-5xl font-bold text-[#ffffff] mb-8 leading-relaxed">
              "Dementia care is not about fixing memories but about filling each
              moment with love, patience, and understanding. Even when words
              fade, kindness speaks louder than ever."
            </h2>
            <Link
              to="/about-us"
              className="bg-[#48CFCB] text-white px-8 py-4 text-lg rounded-lg hover:bg-[#229799] transition duration-300"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Early Detection Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative bg-[#229799] py-10 px-6 lg:px-12 mt-12 rounded-3xl shadow-2xl flex flex-col lg:flex-row items-center justify-between overflow-hidden"
      >

        {/* Left Content */}
        <motion.div
          variants={mainItemVariants}
          className="relative text-[#F5F5F5] text-center lg:text-left max-w-xl z-10"
        >
          <h1 className="text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Detect Early. <br /> Care Better.
          </h1>
          <p className="text-2xl opacity-90 font-medium leading-relaxed">
            Early detection of dementia is more than a diagnosis, it’s a chance
            for timely treatment, informed decisions, and better quality of
            life. It empowers individuals and families to plan, seek support,
            and slow progression, making every moment count.
          </p>
          <button
            onClick={() => navigate("/prediction-form")}
            className="mt-6 px-8 py-4 text-xl bg-[#48CFCB] text-white font-bold rounded-xl shadow-lg hover:bg-[#424242] transition-all"
          >
            Take Quick Test
          </button>
        </motion.div>

        {/* Right Content - Large Image */}
        <motion.div
          variants={mainItemVariants}
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
      <motion.div
        variants={mainContainerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 px-6 lg:px-12"
      >
        {/* Risk Assessment Section with background image */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/lifestyle-scene-showing-care-support-from-people-community_23-2151261234.jpg?t=st=1743568585~exp=1743572185~hmac=3b67f6a7f0c14479a8c4bea122e26213458be444b2af72110cc61b2d5d295a75&w=900')] bg-cover bg-center opacity-100"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 " />

          <motion.div
            variants={mainItemVariants}
            whileHover={{ scale: 1.03 }}
            className="relative z-10 p-10 flex flex-col items-center text-center space-y-8 transition-transform duration-300 h-full"
          >
            <FaChartLine className="w-24 h-24 mx-auto text-[#4DA1A9]" />
            <h2 className="text-4xl font-bold text-[#229799]">Dementia Risk Assessment</h2>
            <p className="text-[#48CFCB] font-bold text-xl md:text-2xl leading-relaxed max-w-3xl">
              Leverage cutting-edge AI technology to assess your risk of developing dementia based on a combination
              of cognitive, lifestyle, and medical factors. This personalized tool offers early warnings and
              empowers you with insights to take preventive actions, seek clinical support, or adopt healthier habits.
              Begin your proactive journey toward cognitive well-being today.
            </p>
            <Link
              to="/dementia-risk-form"
              className="inline-block bg-[#4DA1A9] text-white font-semibold text-lg px-10 py-4 rounded-xl hover:opacity-90 transition duration-300 shadow-lg"
            >
              Start Risk Assessment
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Other Features */}
        <div className="flex flex-col gap-10">
          {[
            {
              icon: <FaBrain className="w-16 h-16 mx-auto text-[#4DA1A9]" />,
              title: "Cognitive Test",
              description:
                "Comprehensive assessment of memory, attention, and cognitive functions",
              link: "/cog-test",
            },
            {
              icon: <FaHeartbeat className="w-16 h-16 mx-auto text-[#4DA1A9]" />,
              title: "Alternative Screening",
              description:
                "AI-powered analysis for early detection of depression symptoms",
              link: "/depression-test",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={mainItemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center space-y-6 transition-transform duration-300"
            >
              {item.icon}
              <h2 className="text-2xl font-semibold text-[#424242]">{item.title}</h2>
              <p className="text-[#4DA1A9]">{item.description}</p>
              <Link
                to={item.link}
                className="inline-block bg-[#4DA1A9] text-white px-6 py-3 rounded-lg hover:opacity-90 transition duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>


      {/* Patient Tracking Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative py-10 px-10 mt-12 flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-[#F5F5F5]"
      >

        {/* Image Section */}
        <motion.div className="relative flex items-center justify-center w-full lg:w-1/2 mt-8 lg:mt-0">
          <img
            src={image1}
            alt="Patient tracking and monitoring"
            className="object-contain w-full h-auto"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div className="relative text-[#424242] text-center lg:text-left max-w-xl z-10 lg:ml-10">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Track Progress. <br /> Enhance Care.
          </h1>
          <p className="text-xl font-medium leading-relaxed">
            Our Patient Tracking Dashboard empowers healthcare providers with
            intuitive tools to effortlessly monitor patient cognitive health.
          </p>
          <button
            onClick={checkUserAndNavigate}
            className="mt-6 inline-block px-8 py-4 text-lg bg-[#48CFCB] text-white font-bold hover:bg-[#229799] transition-all"
          >
            Visit Patient Dashboard
          </button>
        </motion.div>
      </motion.div>

{/* Games Section */}
<section className="mt-24 px-6 lg:px-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >

    <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
      Boost Your Brain with Fun Memory Games
    </h2>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      Engaging in cognitive games regularly can help improve memory, attention, and mental agility.
      All of which play a vital role in reducing the risk of dementia and maintaining long-term brain health.
    </p>
  </motion.div>

  <motion.div
    variants={mainContainerVariants}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
  >
    {[
      {
        icon: <FaPuzzlePiece className="w-20 h-20 text-[#48CFCB]" />,
        title: "Sliding Puzzle",
        description: "Rearrange tiles to rebuild the number order. A fun twist on spatial reasoning!",
        link: "/sliding-puzzle",
      },
      {
        icon: <FaGamepad className="w-20 h-20 text-[#48CFCB]" />,
        title: "Flip Cards",
        description: "Test your memory with this classic card-flipping challenge.",
        link: "/flip-cards",
      },
      {
        icon: <FaChartLine className="w-20 h-20 text-[#48CFCB]" />,
        title: "Cross Words",
        description: "Stimulate your brain with word clues that sharpen vocabulary and logic.",
        link: "/cross-words",
      },
      {
        icon: <FaPuzzlePiece className="w-20 h-20 text-[#48CFCB]" />,
        title: "Jigsaw Puzzle",
        description: "Piece together images while boosting focus and pattern recognition.",
        link: "/jigsaw",
      },
    ].map((item, index) => (
      <motion.div
        key={index}
        variants={mainItemVariants}
        whileHover={{ scale: 1.06 }}
        className="relative bg-white rounded-3xl shadow-xl p-8 pt-20 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300"
      >
        <div className="absolute -top-10 bg-[#E0FBFC] p-5 rounded-full shadow-md">
          {item.icon}
        </div>
        <h2 className="mt-8 text-2xl font-bold text-[#424242]">{item.title}</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">{item.description}</p>
        <Link
          to={item.link}
          className="inline-block bg-[#48CFCB] text-white font-medium px-6 py-3 rounded-full hover:bg-[#3eb5b2] transition duration-300"
        >
          Play Now
        </Link>
      </motion.div>
    ))}
  </motion.div>
</section>



    {/* Feedback Section - Single Feedback Display */}
    <div
      className="relative w-full bg-cover bg-center bg-no-repeat py-10 lg:py-16 h-[400px] mt-16"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/realistic-scene-with-health-worker-taking-care-elderly-patient_23-2151231426.jpg?t=st=1743664536~exp=1743668136~hmac=dc461cece5fb7e9e3b38ce5f8e870d44357f523a505237bbc657d287e7b6b61a&w=1800')`,
      }}
    >
  {/* Feedback Wrapper */}
  <div className="relative max-w-5xl mx-auto h-full flex items-center justify-center px-4">
    {/* Feedback Card */}
    <motion.div
      key={currentFeedbackIndex}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 md:p-12 w-full max-w-3xl h-[250px] flex items-center justify-center"
    >
      <p className="text-[#424242] text-xl md:text-2xl italic leading-relaxed text-center">
        {feedbacks.length > 0
          ? feedbacks[currentFeedbackIndex]?.feedback
          : "Loading feedback..."}
      </p>
    </motion.div>
  </div>

  {/* Navigation Buttons */}
  <div className="absolute inset-y-0 left-4 flex items-center">
    <button
      onClick={() =>
        setCurrentFeedbackIndex(
          (prevIndex) =>
            (prevIndex - 1 + feedbacks.length) % feedbacks.length
        )
      }
      className="bg-white bg-opacity-70 rounded-full p-3 shadow-lg hover:bg-opacity-100 transition duration-300"
    >
      ◀️
    </button>
  </div>

  <div className="absolute inset-y-0 right-4 flex items-center">
    <button
      onClick={() =>
        setCurrentFeedbackIndex(
          (prevIndex) => (prevIndex + 1) % feedbacks.length
        )
      }
      className="bg-white bg-opacity-70 rounded-full p-3 shadow-lg hover:bg-opacity-100 transition duration-300"
    >
      ▶️
    </button>
  </div>
</div>


    </motion.div>
  );
};

export default HomePage;
