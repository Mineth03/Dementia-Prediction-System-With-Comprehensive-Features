import React, { useState } from 'react';
import HealthForm from './components/HealthForm';
import Result from './components/Result';

const App = () => {
  const [risk, setRisk] = useState('');

  const handleSubmit = (data) => {
    // Simple example: You can replace this with your model prediction logic
    const riskPrediction = calculateRisk(data);
    setRisk(riskPrediction);
  };

  const calculateRisk = (data) => {
    // Simple logic: You can replace it with your risk prediction model
    if (data.memory === 'Yes' && data.mood === 'Yes') {
      return 'High Risk';
    }
    return 'Low Risk';
  };

  return (
    <div>
      <h1>Dementia Risk Prediction</h1>
      <HealthForm onSubmit={handleSubmit} />
      {risk && <Result risk={risk} />}
    </div>
  );
};

export default App;

