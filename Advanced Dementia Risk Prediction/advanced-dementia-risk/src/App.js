import React, { useState } from 'react';
import HealthForm from './components/HealthForm';
// import Result from './components/Result';

const App = () => {
  const [formData, setFormData] = useState(null);

  const handleSubmit = (data) => {
    setFormData(data);
    console.log('Submitted Data:', data);
    // You can send this data to an API or ML model here
  };

  return (
    <div>
      <h1>Dementia Risk Assessment</h1>
      <HealthForm onSubmit={handleSubmit} />
    </div>
  );
};

export default App;


