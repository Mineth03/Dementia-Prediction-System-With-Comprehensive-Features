import React, { useState } from 'react';

const PredictionForm = () => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    Name: '',
    Age: '',
    Gender: '',
    Education: '',
    SmokingStatus: '',
    SmokingYears: '',
    AlcoholConsumption: '',
    PhysicalActivity: '',
    BMI: '',
    BloodPressure: '',
    CholesterolLevel: '',
    DiabetesStatus: '',
    FamilyHistory: '',
    DepressionStatus: '',
    SleepQuality: '',
    CognitiveTestScore: '',
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    const requiredFields = {
      1: ['Name', 'Age', 'Gender', 'Education'],
      2: ['SmokingStatus', 'SmokingYears', 'AlcoholConsumption'],
      3: ['PhysicalActivity', 'BMI', 'BloodPressure', 'CholesterolLevel', 'DiabetesStatus', 'FamilyHistory', 'DepressionStatus', 'SleepQuality', 'CognitiveTestScore'],
    };

    const fieldsToCheck = requiredFields[page];
    const isValid = fieldsToCheck.every(field => formData[field].trim() !== '');

    if (isValid) {
      setPage(page + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const simulatedPrediction = Math.random().toFixed(2);
    setPrediction(simulatedPrediction);
  };

  return (
    <div>
      <h1>Dementia Risk Prediction</h1>
      <form onSubmit={handleSubmit}>
        {page === 1 && (
          <div>
            <h3>Personal Information</h3>
            <label>Name: <input type="text" name="Name" value={formData.Name} onChange={handleChange} required /></label>
            <label>Age: <input type="text" name="Age" value={formData.Age} onChange={handleChange} required /></label>
            <label>Gender: <input type="text" name="Gender" value={formData.Gender} onChange={handleChange} required /></label>
            <label>Education: <input type="text" name="Education" value={formData.Education} onChange={handleChange} required /></label>
          </div>
        )}

        {page === 2 && (
          <div>
            <h3>Smoking and Alcoholic Status</h3>
            <label>Smoking status: <input type="text" name="SmokingStatus" value={formData.SmokingStatus} onChange={handleChange} required /></label>
            <label>Years of smoking: <input type="text" name="SmokingYears" value={formData.SmokingYears} onChange={handleChange} required /></label>
            <label>Alcohol Consumption: <input type="text" name="AlcoholConsumption" value={formData.AlcoholConsumption} onChange={handleChange} required /></label>
          </div>
        )}

        {page === 3 && (
          <div>
            <h3>Health Conditions</h3>
            <label>Physical Activity: <input type="text" name="PhysicalActivity" value={formData.PhysicalActivity} onChange={handleChange} required /></label>
            <label>BMI: <input type="text" name="BMI" value={formData.BMI} onChange={handleChange} required /></label>
            <label>Blood Pressure: <input type="text" name="BloodPressure" value={formData.BloodPressure} onChange={handleChange} required /></label>
            <label>Cholesterol Level: <input type="text" name="CholesterolLevel" value={formData.CholesterolLevel} onChange={handleChange} required /></label>
            <label>Diabetes Status: <input type="text" name="DiabetesStatus" value={formData.DiabetesStatus} onChange={handleChange} required /></label>
            <label>Family History: <input type="text" name="FamilyHistory" value={formData.FamilyHistory} onChange={handleChange} required /></label>
            <label>Depression Status: <input type="text" name="DepressionStatus" value={formData.DepressionStatus} onChange={handleChange} required /></label>
            <label>Sleep Quality: <input type="text" name="SleepQuality" value={formData.SleepQuality} onChange={handleChange} required /></label>
            <label>Cognitive Test Score: <input type="text" name="CognitiveTestScore" value={formData.CognitiveTestScore} onChange={handleChange} required /></label>
          </div>
        )}

        {page < 3 && <button type="button" onClick={handleNext}>Next</button>}
        {page === 3 && <button type="submit">Predict</button>}
      </form>

      {prediction !== null && (
        <div>
          <h2>Prediction Result:</h2>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
