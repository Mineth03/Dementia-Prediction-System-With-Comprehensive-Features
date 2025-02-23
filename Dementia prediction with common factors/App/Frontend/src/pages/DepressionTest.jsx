import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const DepressionTest = () => {
  const webcamRef = useRef(null);  // To hold the webcam reference
  const [result, setResult] = useState(null);  // To store the result from the API

  // Capture the image from the webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    sendImageToAPI(imageSrc);
  };

  // Send the captured image to Flask API
  const sendImageToAPI = (image) => {
    const formData = new FormData();
    // Convert image to a Blob (this is important to send as form data)
    const byteArray = base64ToArrayBuffer(image.split(',')[1]);  // Extract the base64 image part
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    formData.append('image', blob, 'webcam-image.jpg');

    // Send the form data to the Flask API
    axios.post('http://localhost:5000/faceAnalysis', formData)
      .then((response) => {
        // Handle the response from the Flask API
        setResult(response.data);
      })
      .catch((error) => {
        console.error('Error sending image:', error);
        setResult({ error: 'Error processing the image. Try again.' });
      });
  };

  // Function to convert base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  return (
    <div>
      <h1>Depression Test</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        videoConstraints={{
          facingMode: "user",
        }}
      />
      <button onClick={capture}>Capture Image</button>

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
