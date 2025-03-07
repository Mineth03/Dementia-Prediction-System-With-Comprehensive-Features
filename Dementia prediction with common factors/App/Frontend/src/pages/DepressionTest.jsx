import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { motion } from 'framer-motion';

const DepressionTest = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true); // Controls whether to show instructions

  // Capture the image from the webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      sendImageToAPI(imageSrc);
    } else {
      console.error("Failed to capture image.");
      setResult({ error: "Failed to capture image. Please try again." });
    }
  };

  // Send the captured image to Flask API
  const sendImageToAPI = async (imageBase64) => {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      const blob = base64ToBlob(imageBase64);
      formData.append('image', blob, 'webcam-image.jpg');

      const response = await axios.post('http://localhost:5000/faceAnalysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Error sending image:", error);
      setResult({ error: "Error processing the image. Try again." });
    } finally {
      setLoading(false);
    }
  };

  // Convert base64 to Blob
  const base64ToBlob = (base64Data) => {
    const byteString = atob(base64Data.split(',')[1]);
    const arrayBuffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        
        {showInstructions ? (
          // Instructions Section
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-800"
          >
            <h2 className="text-3xl font-bold mb-4">Depression Test Instructions</h2>
            <ul className="text-left mb-6 list-disc list-inside text-lg">
              <li>Ensure you are in a well-lit environment.</li>
              <li>Keep a neutral facial expression.</li>
              <li>Look directly at the camera.</li>
              <li>Press the "Got It" button to begin.</li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInstructions(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got It
            </motion.button>
          </motion.div>
        ) : (
          // Depression Test Section
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-800"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Depression Test</h1>
            <div className="border rounded-lg overflow-hidden">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={capture}
              disabled={loading}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              {loading ? "Processing..." : "Capture Image"}
            </motion.button>

            {/* Display the result */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gray-50 rounded-lg"
              >
                {result.error ? (
                  <p className="text-red-600 font-semibold">{result.error}</p>
                ) : (
                  <div>
                    <p className="text-xl font-semibold">Depression Score: <span className="text-blue-600">{result.score}</span></p>
                    <p className="text-lg text-gray-700">Risk Category: <span className="font-bold text-indigo-600">{result.category}</span></p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DepressionTest;
