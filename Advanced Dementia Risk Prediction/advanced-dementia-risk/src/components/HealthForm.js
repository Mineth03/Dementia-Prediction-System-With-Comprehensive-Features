import React, { useState } from 'react';

const HealthForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    age: '',
    memory: '',
    mood: '',
    otherConditions: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Age:</label>
      <input type="number" name="age" value={formData.age} onChange={handleChange} required />
      
      <label>Memory Issues (Yes/No):</label>
      <input type="text" name="memory" value={formData.memory} onChange={handleChange} required />
      
      <label>Mood Issues (Yes/No):</label>
      <input type="text" name="mood" value={formData.mood} onChange={handleChange} required />
      
      <label>Other Conditions:</label>
      <input type="text" name="otherConditions" value={formData.otherConditions} onChange={handleChange} />
      
      <button type="submit">Submit</button>
    </form>
  );
};

export default HealthForm;
