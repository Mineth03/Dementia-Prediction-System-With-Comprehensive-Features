import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCamera } from 'react-icons/fa';

const DepressionTest = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      sendImageToAPI(imageSrc);
    } else {
      setResult({ error: "Failed to capture image. Please try again." });
    }
  };

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
      setResult({ error: "Error processing the image. Try again." });
    } finally {
      setLoading(false);
    }
  };

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
      className="min-h-screen bg-[#F5F5F5] p-6 flex items-center justify-center"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-6xl">
        {showInstructions ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#424242] max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-[#229799] mb-6">Depression Test Instructions</h2>
            <ul className="list-disc list-inside text-left text-lg space-y-3 mb-8">
              <li>Ensure you're in a well-lit environment.</li>
              <li>Keep a neutral facial expression.</li>
              <li>Look directly into the camera.</li>
              <li>Click "Got It" to start the test.</li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInstructions(false)}
              className="px-8 py-3 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition-colors"
            >
              Got It
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            {/* Webcam + Capture */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-[#229799] mb-4">Live Camera</h1>
              <div className="border-4 border-[#48CFCB] rounded-xl overflow-hidden shadow-md w-full">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-md"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={capture}
                disabled={loading}
                className="mt-6 w-full px-6 py-3 bg-[#48CFCB] text-white rounded-lg hover:bg-[#229799] transition-colors flex items-center justify-center"
              >
                <FaCamera className="mr-2" />
                {loading ? "Processing..." : "Capture Image"}
              </motion.button>
            </div>

            {/* Result */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold text-[#424242] mb-6">Result</h2>
              <div className="bg-gray-100 rounded-xl p-6 w-full shadow-inner min-h-[200px] flex items-center justify-center">
                {result ? (
                  result.error ? (
                    <p className="text-red-600 text-lg font-semibold">{result.error}</p>
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-2">
                        Depression Score: <span className="text-[#229799]">{result.score}</span>
                      </p>
                      <p className="text-xl text-[#424242]">
                        Risk Category: <span className="font-bold text-[#48CFCB]">{result.category}</span>
                      </p>
                    </div>
                  )
                ) : (
                  <p className="text-gray-500">Your result will appear here after capturing an image.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DepressionTest;
