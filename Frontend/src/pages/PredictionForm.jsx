import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaHeartbeat } from 'react-icons/fa';

const PredictionForm = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("predictionFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          Name: '',
          Sex: '',
          Age: '',
          EducationYears: '',
          MaritalStatus: '',
          AlcoholFrequency: '',
          SmokingStatus: '',
          SmokingYears: '',
          BMI: '',
          DepressionStatus: '',
          SleepingProblems: [],
          Diabetes: '',
          Cholesterol: '',
          BloodPressure: '',
          HeartAttack: '',
          HeartFailure: '',
          FamilyHistory: '',
          CognitiveTestScore: '',
        };
  });

  useEffect(() => {
    localStorage.setItem("predictionFormData", JSON.stringify(formData));
  }, [formData]);

  const [prediction, setPrediction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const sections = [
    { title: "Personal Information", icon: "👤" },
    { title: "Lifestyle Factors", icon: "🌿" },
    { title: "Health Conditions", icon: "❤️" },
  ];

  const formSections = {
    0: [
      { name: "Name", type: "text", label: "Full Name" },
      { name: "Sex", type: "select", label: "Sex", options: ["", "Male", "Female"] },
      { name: "Age", type: "number", label: "Age" },
      { name: "EducationYears", type: "number", label: "Years of Education" },
      {
        name: "MaritalStatus",
        type: "select",
        label: "Marital Status",
        options: [
          "",
          "Married",
          "Widowed",
          "Divorced",
          "Separated",
          "Never married",
          "Living as married/domestic partner",
          "Other",
        ],
      },
    ],
    1: [
      {
        name: "AlcoholFrequency",
        type: "select",
        label: "Alcohol Consumption Frequency",
        options: [
          "",
          "Less than once a month",
          "About once a month",
          "About once a week",
          "A few times a week",
          "Daily or almost daily",
          "Unknown",
        ],
      },
      {
        name: "SmokingStatus",
        type: "select",
        label: "Have you smoked more than 100 cigarettes?",
        options: ["", "Yes", "No"],
      },
      { name: "SmokingYears", type: "number", label: "Years of Smoking" },
      { name: "BMI", type: "number", label: "BMI" },
    ],
    2: [
      { name: "DepressionStatus", type: "select", label: "Depression Status", options: ["", "Yes", "No"] },
      { name: "Diabetes", type: "select", label: "Diabetes", options: ["", "Yes", "No", "Unknown"] },
      { name: "Cholesterol", type: "select", label: "High Cholesterol", options: ["", "Yes", "No", "Unknown"] },
      { name: "BloodPressure", type: "select", label: "High Blood Pressure", options: ["", "Yes", "No", "Unknown"] },
      { name: "HeartAttack", type: "select", label: "History of Heart Attack", options: ["", "Yes", "No", "Unknown"] },
      { name: "HeartFailure", type: "select", label: "Heart Failure", options: ["", "Yes", "No", "Unknown"] },
      { name: "FamilyHistory", type: "select", label: "Family History of Dementia", options: ["", "Yes", "No", "Unknown"] },
      { name: "CognitiveTestScore", type: "number", label: "Cognitive Test Score" },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};
    const requiredFields = Object.keys(formData);
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      newErrors.general = `Please fill out all the required fields before submitting.`;
    }

    if (formData.Age < 14 || formData.Age > 120) {
      newErrors.Age = "Age must be between 14 and 120.";
    }
    if (parseInt(formData.EducationYears) >= parseInt(formData.Age)) {
      newErrors.EducationYears = "Years of education must be less than your age.";
    }
    if (parseInt(formData.SmokingYears) >= parseInt(formData.Age)) {
      newErrors.SmokingYears = "Years of smoking cannot be more than your age.";
    }
    if (formData.CognitiveTestScore < 0 || formData.CognitiveTestScore > 30) {
      newErrors.CognitiveTestScore = "Cognitive Test Score must be between 0 and 30.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to fetch prediction');

      const data = await response.json();
      setPrediction(data.prediction);
      setShowModal(true); // Show modal on success
      localStorage.removeItem("predictionFormData");
      setFormData({
        Name: '',
        Sex: '',
        Age: '',
        EducationYears: '',
        MaritalStatus: '',
        AlcoholFrequency: '',
        SmokingStatus: '',
        SmokingYears: '',
        BMI: '',
        DepressionStatus: '',
        SleepingProblems: [],
        Diabetes: '',
        Cholesterol: '',
        BloodPressure: '',
        HeartAttack: '',
        HeartFailure: '',
        FamilyHistory: '',
        CognitiveTestScore: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setPrediction('An error occurred while predicting.');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextSection = () => setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  const prevSection = () => setCurrentSection((prev) => Math.max(prev - 1, 0));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#424242] mb-6 text-center">Dementia Early Detection</h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {sections.map((section, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentSection(idx)}
                className={`flex items-center ${idx === currentSection ? 'text-[#48CFCB]' : 'text-gray-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{section.icon}</span>
                <span className="hidden sm:inline">{section.title}</span>
              </motion.button>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-[#48CFCB] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key={currentSection}>
            {formSections[currentSection].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-[#424242] mb-1">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#48CFCB] rounded-md shadow-sm focus:ring-[#48CFCB] focus:border-[#48CFCB]"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#48CFCB] rounded-md shadow-sm focus:ring-[#48CFCB] focus:border-[#48CFCB]"
                  />
                )}
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
              </div>
            ))}

            <div className="flex justify-between mt-8">
              <motion.button
                type="button"
                onClick={prevSection}
                className={`px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-colors ${
                  currentSection === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentSection === 0}
              >
                Previous
              </motion.button>

              {currentSection === sections.length - 1 ? (
                <motion.button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-[#48CFCB] hover:bg-[#229799] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit"}
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={nextSection}
                  className="px-4 py-2 rounded-md text-white bg-[#48CFCB] hover:bg-[#229799] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              )}
            </div>
          </motion.div>
        </form>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/depression-test")}
            className="flex items-center justify-center p-4 bg-[#F5F5F5] rounded-lg text-[#48CFCB] hover:bg-[#e0f7f7] transition-colors"
          >
            <FaHeartbeat className="mr-2" />
            Take Depression Test
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/cog-test")}
            className="flex items-center justify-center p-4 bg-[#F5F5F5] rounded-lg text-[#229799] hover:bg-[#e0f7f7] transition-colors"
          >
            <FaBrain className="mr-2" />
            Take Cognitive Test
          </motion.button>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <PredictionModal
              prediction={prediction}
              onClose={() => {
                setShowModal(false);
                setPrediction(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const PredictionModal = ({ prediction, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
    >
      <h2 className="text-2xl font-bold text-[#229799] mb-4">Prediction Result</h2>
      <p className="text-gray-700 mb-6">{prediction}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="px-6 py-2 bg-[#229799] text-white rounded-lg hover:bg-[#1b7d7a] transition"
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
);

export default PredictionForm;
