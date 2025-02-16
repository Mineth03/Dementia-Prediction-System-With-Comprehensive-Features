import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../assets/PredictionForm.css';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
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
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapFormDataToBackend = (formData) => {
    return {
      NAME: formData.Name,
      SEX: formData.Sex,
      NACCAGEB: formData.Age,
      EDUC: formData.EducationYears,
      MARISTAT: formData.MaritalStatus,
      ALCFREQ: formData.AlcoholFrequency,
      TOBAC100: formData.SmokingStatus,
      SMOKYRS: formData.SmokingYears,
      NACCBMI: formData.BMI,
      Depression: formData.DepressionStatus,
      SLEEPAP: formData.SleepingProblems.join(','),
      DIABETES: formData.Diabetes,
      HYPERCHO: formData.Cholesterol,
      HYPERTEN: formData.BloodPressure,
      CVHATT: formData.HeartAttack,
      CVCHF: formData.HeartFailure,
      NACCFAM: formData.FamilyHistory,
      COGTEST: formData.CognitiveTestScore
    };
  };

  const navigate = useNavigate(); // Initialize navigation

  const handleDepressionTest = () => {
    navigate("/depression-test"); // Redirect to Depression Test page
  };

  const handleCognitiveTest = () => {
    navigate("/cognitive-test"); // Redirect to Cognitive Test page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const backendData = mapFormDataToBackend(formData); // Mapping form data to backend format

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error('Error:', error);
      setPrediction('An error occurred while predicting.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Dementia Risk Prediction</h1>
      <form onSubmit={handleSubmit}>
        <h3>Personal Information</h3>
        <label>Name: <input type="text" name="Name" value={formData.Name} onChange={handleChange} required /></label>
        <label>Sex:
          <select name="Sex" value={formData.Sex} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>Age: <input type="number" name="Age" value={formData.Age} onChange={handleChange} required /></label>
        <label>Education Years: <input type="number" name="EducationYears" value={formData.EducationYears} onChange={handleChange} required /></label>
        <label>Marital Status:
          <select name="MaritalStatus" value={formData.MaritalStatus} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
            <option value="Separated">Separated</option>
            <option value="Never married">Never married</option>
            <option value="Living as married/domestic partner">Living as married/domestic partner</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <h3>Lifestyle Factors</h3>
        <label>Alcohol Using Frequency:
          <select name="AlcoholFrequency" value={formData.AlcoholFrequency} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Less than once a month">Less than once a month</option>
            <option value="About once a month">About once a month</option>
            <option value="About once a week">About once a week</option>
            <option value="A few times a week">A few times a week</option>
            <option value="Daily or almost daily">Daily or almost daily</option>
            <option value="Unknown">Unknown</option>
          </select>
        </label>
        <label>Smoking Status (More than 100 cigarettes):
          <select name="SmokingStatus" value={formData.SmokingStatus} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>Smoking Years: <input type="number" name="SmokingYears" value={formData.SmokingYears} onChange={handleChange} required /></label>
        <label>BMI: <input type="number" name="BMI" value={formData.BMI} onChange={handleChange} required /></label>

        <h3>Health Conditions</h3>
        <label>Depression Status:
          <select name="DepressionStatus" value={formData.DepressionStatus} onChange={(e) => setFormData({...formData, DepressionStatus: e.target.value})} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <button type="button" onClick={handleDepressionTest}>Take Depression Test</button>
        </label>

        <label>Sleeping Problems:</label>
        <div className="multi-choice">
          {[
            "Loud snoring",
            "Gasping for air during sleep",
            "Awakening with a dry mouth",
            "Morning headache",
            "Difficulty staying asleep",
            "Excessive daytime sleepiness",
            "Difficulty paying attention while awake",
            "Irritability",
          ].map((option, index) => (
            <label key={index}>
              <input
                type="checkbox"
                name="SleepingProblems"
                value={option}
                checked={formData.SleepingProblems.includes(option)}
                onChange={(e) => {
                  const { value, checked } = e.target;
                  setFormData((prevData) => ({
                    ...prevData,
                    SleepingProblems: checked
                      ? [...prevData.SleepingProblems, value]
                      : prevData.SleepingProblems.filter((item) => item !== value),
                  }));
                }}
              />
              {option}
            </label>
          ))}
        </div>

        <label>Diabetes:
          <select name="Diabetes" value={formData.Diabetes} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </label>
        <label>Cholesterol:
          <select name="Cholesterol" value={formData.Cholesterol} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </label>
        <label>Blood Pressure:
          <select name="BloodPressure" value={formData.BloodPressure} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </label>
        <label>Heart Attack:
          <select name="HeartAttack" value={formData.HeartAttack} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </label>
        <label>Heart Failure:
          <select name="HeartFailure" value={formData.HeartFailure} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </label>
        <label>Family History:
          <select name="FamilyHistory" value={formData.FamilyHistory} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </label>
        <label>Cognitive Test Score:
          <input type="number" name="CognitiveTestScore" value={formData.CognitiveTestScore} onChange={(e) => setFormData({...formData, CognitiveTestScore: e.target.value})} required />
          <button type="button" onClick={handleCognitiveTest}>Take Cognitive Test</button>
        </label>

        <button type="submit" disabled={loading}>Predict</button>
      </form>

      {loading && <p>Loading...</p>}

      {prediction !== null && !loading && (
        <div>
          <h2>Prediction Result:</h2>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
