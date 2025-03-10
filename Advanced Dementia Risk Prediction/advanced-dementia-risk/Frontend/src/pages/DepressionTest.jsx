import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const DepressionTest = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div>
      <h1>Depression Test</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        videoConstraints={{ facingMode: "user" }}
      />
      <button onClick={capture} disabled={loading}>
        {loading ? "Processing..." : "Capture Image"}
      </button>

      {/* Display the result */}
      {result && (
        <div>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <div>
              <p>Depression Score: {result.score}</p>
              <p>Risk Category: {result.category}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DepressionTest;
