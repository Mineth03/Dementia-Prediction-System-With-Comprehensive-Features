import React, { useState } from 'react';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    field6: '',
    field7: '',
    field8: '',
    field9: '',
    field10: '',
    field11: '',
    field12: '',
    field13: '',
    field14: '',
    field15: '',
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you can call your model to get the prediction
    // For now, we'll just simulate a prediction
    const simulatedPrediction = Math.random().toFixed(2);
    setPrediction(simulatedPrediction);

    // If you have an API endpoint for your model, you can do something like this:
    // const response = await fetch('/api/predict', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData),
    // });
    // const result = await response.json();
    // setPrediction(result.prediction);
  };

  return (
    <div>
      <h1>Dementia Risk Prediction</h1>
      <form onSubmit={handleSubmit}>
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i}>
            <label htmlFor={`field${i + 1}`}>Field {i + 1}:</label>
            <input
              type="text"
              id={`field${i + 1}`}
              name={`field${i + 1}`}
              value={formData[`field${i + 1}`]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Predict</button>
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