import React, { useState } from 'react';
import axios from 'axios';

const PatientRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        stage_of_dementia: '',
        medications: [{ medication_name: '', dosage: '', scheduled_time: '', frequency: '' }],
        daily_routine: [{ routine_name: '', scheduled_time: '', frequency: '' }],
        brain_games: [{ game_name: '', scheduled_time: '', frequency: '' }],
        sleep_hours: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (index, e, field) => {
        const { name, value } = e.target;
        const updatedArray = [...formData[field]];
        updatedArray[index][name] = value;
        setFormData({ ...formData, [field]: updatedArray });
    };

    const addField = (field, newItem) => {
        setFormData({ ...formData, [field]: [...formData[field], newItem] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register-patient', formData);
            alert('Patient registered successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                age: '',
                stage_of_dementia: '',
                medications: [{ medication_name: '', dosage: '', scheduled_time: '', frequency: '' }],
                daily_routine: [{ routine_name: '', scheduled_time: '', frequency: '' }],
                brain_games: [{ game_name: '', scheduled_time: '', frequency: '' }],
                sleep_hours: ''
            });
        } catch (error) {
            console.error('Error registering patient:', error);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-xl font-bold text-center">Patient Registration</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                <select name="stage_of_dementia" value={formData.stage_of_dementia} onChange={handleInputChange} className="w-full p-2 border rounded" required>
                    <option value="">Select Dementia Stage</option>
                    <option value="Early">Early</option>
                    <option value="Middle">Middle</option>
                    <option value="Late">Late</option>
                </select>
                
                <h3 className="font-semibold">Medications</h3>
                {formData.medications.map((med, index) => (
                    <div key={index} className="space-y-2">
                        <input type="text" name="medication_name" placeholder="Medication Name" value={med.medication_name} onChange={(e) => handleArrayChange(index, e, 'medications')} className="w-full p-2 border rounded" required />
                        <input type="text" name="dosage" placeholder="Dosage" value={med.dosage} onChange={(e) => handleArrayChange(index, e, 'medications')} className="w-full p-2 border rounded" required />
                        <input type="time" name="scheduled_time" value={med.scheduled_time} onChange={(e) => handleArrayChange(index, e, 'medications')} className="w-full p-2 border rounded" required />
                    </div>
                ))}
                <button type="button" onClick={() => addField('medications', { medication_name: '', dosage: '', scheduled_time: '', frequency: '' })} className="bg-blue-500 text-white p-2 rounded">Add Medication</button>
                
                <h3 className="font-semibold">Daily Activities</h3>
                {formData.daily_routine.map((activity, index) => (
                    <div key={index} className="space-y-2">
                        <input type="text" name="routine_name" placeholder="Activity Name" value={activity.routine_name} onChange={(e) => handleArrayChange(index, e, 'daily_routine')} className="w-full p-2 border rounded" required />
                        <input type="time" name="scheduled_time" value={activity.scheduled_time} onChange={(e) => handleArrayChange(index, e, 'daily_routine')} className="w-full p-2 border rounded" required />
                    </div>
                ))}
                <button type="button" onClick={() => addField('daily_routine', { routine_name: '', scheduled_time: '', frequency: '' })} className="bg-blue-500 text-white p-2 rounded">Add Activity</button>
                
                <h3 className="font-semibold">Brain Games</h3>
                {formData.brain_games.map((game, index) => (
                    <div key={index} className="space-y-2">
                        <input type="text" name="game_name" placeholder="Game Name" value={game.game_name} onChange={(e) => handleArrayChange(index, e, 'brain_games')} className="w-full p-2 border rounded" required />
                        <input type="time" name="scheduled_time" value={game.scheduled_time} onChange={(e) => handleArrayChange(index, e, 'brain_games')} className="w-full p-2 border rounded" required />
                    </div>
                ))}
                <button type="button" onClick={() => addField('brain_games', { game_name: '', scheduled_time: '', frequency: '' })} className="bg-blue-500 text-white p-2 rounded">Add Brain Game</button>
                
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default PatientRegistration;
