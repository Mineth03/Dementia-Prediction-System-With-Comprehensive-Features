import { useState } from "react";
import { motion } from "framer-motion";
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

  const difficultQuestions = new Set([
    "clock", "forwardDigits", "backwardDigits", "serial7s", "sentence1", "sentence2",
    "abstract1", "abstract2", "recall", "date", "month", "year"
  ]);

  const bgGradient = "bg-gradient-to-br from-[#F5F5F5] to-[#F5F5F5]";
  const card = "bg-white shadow-xl rounded-2xl p-8";
  const primary = "text-[#229799]";
  const accent = "text-[#48CFCB]";
  const btnCorrect = "border-[#48CFCB] text-[#229799] hover:bg-[#48CFCB]/10";
  const btnWrong = "border-red-400 text-red-600 hover:bg-red-50";

  if (step === -1) {
    return (
      <motion.div className={`min-h-screen flex items-center justify-center p-8 ${bgGradient}`}>
        <div className={`max-w-2xl w-full ${card}`}>
          <div className="flex items-center justify-center mb-6">
            <FaBrain className="text-4xl text-[#48CFCB] mr-3" />
            <h2 className="text-3xl font-bold text-[#424242]">Cognitive Assessment</h2>
          </div>
          <ul className="space-y-4 mb-8 text-[#424242]">
            {guideSteps.map((step, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-3 text-[#48CFCB]">•</span> {step}
              </li>
            ))}
          </ul>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(0)}
            className="w-full py-3 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition flex items-center justify-center"
          >
            Start Test <FaArrowRight className="ml-2" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (step >= questions.length) {
    return (
      <motion.div className={`min-h-screen flex items-center justify-center p-8 ${bgGradient}`}>
        <div className={`max-w-xl w-full ${card} text-center`}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-[#424242] mb-4">Test Completed!</h2>
          <p className="text-2xl font-semibold text-[#229799] mb-4">Your MoCA score: {score} / 30</p>
          <div className="bg-gray-100 rounded-lg p-6">
            {score >= 26 ? (
              <p className="text-green-600 font-medium">This is considered normal cognitive function.</p>
            ) : (
              <p className="text-yellow-600 font-medium">Consider consulting a medical professional for further evaluation.</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className={`min-h-screen flex items-center justify-center p-8 ${bgGradient}`}>
      <div className={`max-w-xl w-full ${card}`}>
        <h2 className="text-2xl font-bold text-[#424242] mb-4">Question {step + 1}/{questions.length}</h2>
        <p className="text-xl text-[#424242] mb-6 flex items-center">
          <span className="text-3xl mr-3">{questions[step].icon}</span> {questions[step].question}
        </p>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-[#48CFCB] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="space-y-4">
          {["Done Correctly", "Unsatisfied"].map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setAnswers({ ...answers, [questions[step].key]: option });
                if (option === "Done Correctly") {
                  setScore(score + (difficultQuestions.has(questions[step].key) ? 2 : 1));
                }
                setStep(step + 1);
              }}
              className={`w-full py-3 rounded-lg border-2 flex items-center justify-between transition ${
                option === "Done Correctly" ? btnCorrect : btnWrong
              }`}
            >
              {option}
              {option === "Done Correctly" ? (
                <FaCheck className="text-[#229799]" />
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
