import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBrain, FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";

const CogTest = () => {
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});

  const guideSteps = [
    "Welcome to the Montreal Cognitive Assessment (MoCA) test.",
    "This test consists of multiple cognitive tasks to assess different mental abilities.",
    "You will be asked to perform various tasks, and the examiner will evaluate your responses.",
    "For each task, select 'Done Correctly' if the patient completes it successfully, otherwise select 'Unsatisfied'.",
    "Let's begin!"
  ];

  const questions = [
    { question: "Draw a clock showing '10 past 11'.", key: "clock", icon: "⏰" },
    { question: "What is this animal? (Lion)", key: "lion", icon: "🦁" },
    { question: "What is this animal? (Rhino)", key: "rhino", icon: "🦏" },
    { question: "What is this animal? (Camel)", key: "camel", icon: "🐪" },
    { question: "Repeat the numbers: 2-1-8-5-4", key: "forwardDigits", icon: "🔢" },
    { question: "Repeat them backward: 7-4-2", key: "backwardDigits", icon: "↩️" },
    { question: "Subtract 7 from 100 repeatedly.", key: "serial7s", icon: "➖" },
    { question: "Repeat: 'The cat always hid under the couch when dogs were in the room.'", key: "sentence1", icon: "🗣️" },
    { question: "Repeat: 'I only know that John is the one to help today.'", key: "sentence2", icon: "📢" },
    { question: "What is the similarity between a train and a bicycle?", key: "abstract1", icon: "🤔" },
    { question: "What is the similarity between a watch and a ruler?", key: "abstract2", icon: "📏" },
    { question: "Recall any of these words: Face, Velvet, Church, Daisy, Red", key: "recall", icon: "🧠" },
    { question: "What is the date today?", key: "date", icon: "📅" },
    { question: "What is the month?", key: "month", icon: "📅" },
    { question: "What is the year?", key: "year", icon: "📅" },
    { question: "What is the day of the week?", key: "day", icon: "📅" },
    { question: "What is the name of this place?", key: "place", icon: "📍" },
    { question: "What city are we in?", key: "city", icon: "🏙️" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (step === -1) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <FaBrain className="text-4xl text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Cognitive Assessment Guide</h2>
          </div>
          
          <motion.ul className="space-y-4 mb-8">
            {guideSteps.map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center text-gray-700"
              >
                <span className="mr-3 text-blue-600">•</span>
                {step}
              </motion.li>
            ))}
          </motion.ul>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(0)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Start Test
            <FaArrowRight className="ml-2" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (step >= questions.length) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheck className="text-green-500 text-3xl" />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">Test Completed!</h2>
          <p className="text-2xl font-semibold text-blue-600 mb-4">
            Your MoCA score: {score} / 30
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            {score >= 26 ? (
              <p className="text-green-600">This is considered normal cognitive function.</p>
            ) : (
              <p className="text-yellow-600">You may want to consult a medical professional for further evaluation.</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Question {step + 1}/{questions.length}</h2>
            <span className="text-3xl">{questions[step].icon}</span>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xl text-gray-700">{questions[step].question}</p>
        </div>

        <div className="space-y-4">
          {["Done Correctly", "Unsatisfied"].map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setAnswers({ ...answers, [questions[step].key]: option });
                if (option === "Done Correctly") setScore(score + 1);
                setStep(step + 1);
              }}
              className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center justify-between ${
                option === "Done Correctly"
                  ? "border-green-500 text-green-700 hover:bg-green-50"
                  : "border-red-500 text-red-700 hover:bg-red-50"
              }`}
            >
              {option}
              {option === "Done Correctly" ? (
                <FaCheck className="text-green-500" />
              ) : (
                <FaTimes className="text-red-500" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CogTest;