import React, { useState } from "react";

function DementiaPredictionApp() {
  // State to store user inputs
  const [userData, setUserData] = useState({
    age: "",
    gender: "",
    familyHistory: "",
    smokingStatus: "",
    diabeticStatus: "",
    cholesterolLevel: "",
    bloodPressure: "",
    heartRate: "",
    physicalActivity: "",
    bodyTemperature: "",
    weight: "",
    height: "",
    cognitiveTestScore: "",
    depressionLevel: "",
    MRIStatus: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handlePredict = () => {
    // Send userData to your backend or ML model for prediction
    console.log("Predicting with data:", userData);

    // Example of sending a POST request to the backend
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((result) => {
        alert(`Prediction Result: ${result.prediction}`);
      })
      .catch((error) => {
        console.error("Error during prediction:", error);
        alert("An error occurred while predicting.");
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Dementia Prediction App</h1>
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        {Object.keys(userData).map((field) => (
          <div key={field}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type="text"
              name={field}
              value={userData[field]}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}
        <div style={{ gridColumn: "span 2", textAlign: "center" }}>
          <button
            type="button"
            onClick={handlePredict}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Predict
          </button>
        </div>
      </form>
    </div>
  );
}

export default DementiaPredictionApp;
