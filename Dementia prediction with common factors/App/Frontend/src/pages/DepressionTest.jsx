import { useState, useRef } from "react";
import axios from "axios";

const DepressionTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const videoRef = useRef(null);  // To reference the video element
  const canvasRef = useRef(null); // To reference the canvas for capturing images

  // Start webcam stream
  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        setErrorMsg("Error accessing webcam: " + err);
      });
  };

  // Capture the image from the webcam feed
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas size to match video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the image on canvas to raw image data (binary)
    canvas.toBlob((blob) => {
      processImage(blob); // Send the captured image to the backend
    }, "image/jpeg");
  };

  // Process the captured image (send it to backend)
  const processImage = async (blob) => {
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("image", blob);

    try {
      const response = await axios.post("http://localhost:5000/faceAnalysis", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error processing image", error);
      setErrorMsg("Error processing image, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md p-4 shadow-lg bg-white">
        <h2 className="text-xl font-semibold text-center mb-4">Depression Risk Test</h2>

        <div className="mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="100%"
            height="auto"
            style={{ borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
          />
        </div>

        <button
          onClick={startWebcam}
          className="w-full mb-4 p-2 bg-blue-500 text-white font-semibold rounded-md"
        >
          Start Webcam
        </button>

        <button
          onClick={captureImage}
          disabled={loading}
          className="w-full mb-4 p-2 bg-green-500 text-white font-semibold rounded-md"
        >
          {loading ? "Processing..." : "Capture & Analyze"}
        </button>

        {errorMsg && (
          <div className="text-red-500 text-center mb-4">{errorMsg}</div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {result && (
          <div className="mt-4 p-3 border rounded-lg text-center">
            <p className="text-lg font-bold">Depression Risk Score: {result.score.toFixed(4)}</p>
            <p className="text-md text-gray-700">Category: {result.category}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepressionTest;
