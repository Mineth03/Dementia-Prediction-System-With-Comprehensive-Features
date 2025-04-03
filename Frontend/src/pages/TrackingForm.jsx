import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth for authenticated user data
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const PatientRegistration = () => {
  const { user } = useAuth(); // Get user data from AuthContext
  const navigate = useNavigate(); // For page navigation

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '',
    stage_of_dementia: '', precautions: '', recommended_sleeping_hours: '',
    medications: [{ medication_name: '', dosage: '', scheduled_time: '', frequency: '' }],
    daily_routines: [{ routine_name: '', scheduled_time: '', frequency: '' }]
  });

  // Autofill user data when the component loads
  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { medication_name: '', dosage: '', scheduled_time: '', frequency: '' }]
    });
  };

  const addRoutine = () => {
    setFormData({
      ...formData,
      daily_routines: [...formData.daily_routines, { routine_name: '', scheduled_time: '', frequency: '' }]
    });
  };

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const newMedications = [...formData.medications];
    newMedications[index][name] = value;
    setFormData({ ...formData, medications: newMedications });
  };

  const handleRoutineChange = (index, e) => {
    const { name, value } = e.target;
    const newRoutines = [...formData.daily_routines];
    newRoutines[index][name] = value;
    setFormData({ ...formData, daily_routines: newRoutines });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateAge = (age) => age >= 5 && age <= 120;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!validateEmail(formData.email)) errors.email = 'Invalid email.';
    if (!validateAge(formData.age)) errors.age = 'Age must be between 5 and 120.';
    if (Object.keys(errors).length) {
      alert(Object.values(errors).join(' '));
      return;
    }

    // Prepare payload with username and relevant data
    const payload = {
      username: user?.username || 'Anonymous',
      stage_of_dementia: formData.stage_of_dementia,
      recommended_sleeping_hours: formData.recommended_sleeping_hours,
      precautions: formData.precautions,
      medications: formData.medications,
      daily_routines: formData.daily_routines
    };

    try {
      const response = await fetch('http://localhost:5000/register-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        alert('Patient registered successfully!');
        navigate('/dashboard'); // Navigate to Dashboard after success
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to register patient. Please try again later.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Patient Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="input" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="input" required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="input" required />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} className="input" required />
            <select name="stage_of_dementia" value={formData.stage_of_dementia} onChange={handleInputChange} className="input" required>
              <option value="">Stage of Dementia</option>
              <option value="Early">Early</option>
              <option value="Middle">Middle</option>
              <option value="Late">Late</option>
            </select>
            <input type="number" name="recommended_sleeping_hours" placeholder="Recommended Sleeping Hours" value={formData.recommended_sleeping_hours} onChange={handleInputChange} className="input" required min="4" max="12" />
          </div>

          <textarea name="precautions" placeholder="Precautions" value={formData.precautions} onChange={handleInputChange} className="input w-full" rows="3" />

          {/* Medications */}
          <h2 className="text-xl font-semibold text-gray-700">Medications</h2>
          {formData.medications.map((med, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input name="medication_name" value={med.medication_name} onChange={(e) => handleMedicationChange(i, e)} className="input" placeholder="Medication Name" required />
              <input name="dosage" value={med.dosage} onChange={(e) => handleMedicationChange(i, e)} className="input" placeholder="Dosage" required />
              <input type="time" name="scheduled_time" value={med.scheduled_time} onChange={(e) => handleMedicationChange(i, e)} className="input" required />
              <select name="frequency" value={med.frequency} onChange={(e) => handleMedicationChange(i, e)} className="input" required>
                <option value="">Frequency</option>
                <option value="Daily">Daily</option>
                <option value="Once a Week">Once a Week</option>
                <option value="One Day Apart">One Day Apart</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addMedication} className="text-blue-600 hover:underline">+ Add Medication</button>

          {/* Routines */}
          <h2 className="text-xl font-semibold text-gray-700">Daily Routines</h2>
          {formData.daily_routines.map((r, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="routine_name" value={r.routine_name} onChange={(e) => handleRoutineChange(i, e)} className="input" placeholder="Routine Name" required />
              <input type="time" name="scheduled_time" value={r.scheduled_time} onChange={(e) => handleRoutineChange(i, e)} className="input" required />
              <select name="frequency" value={r.frequency} onChange={(e) => handleRoutineChange(i, e)} className="input" required>
                <option value="">Frequency</option>
                <option value="Daily">Daily</option>
                <option value="Once a Week">Once a Week</option>
                <option value="One Day Apart">One Day Apart</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addRoutine} className="text-blue-600 hover:underline">+ Add Routine</button>

          <div className="text-center pt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
