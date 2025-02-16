import React, { useState, useEffect } from 'react';

const PatientLog = ({ registrationData }) => {
    const [logData, setLogData] = useState({});

    // Initialize logData based on registration data
    useEffect(() => {
        if (registrationData) {
            const initialLog = {
                medications: registrationData.medications.map((med) => ({
                    medication_name: med.medication_name,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    taken: false // Default value for each medication
                })),
                daily_routine: registrationData.daily_routine.map((routine) => ({
                    routine_name: routine.routine_name,
                    scheduled_time: routine.scheduled_time,
                    frequency: routine.frequency,
                    completed: false // Default value for each activity
                }))
            };
            setLogData(initialLog);
        }
    }, [registrationData]);

    // Handle input changes for logging medications or routines
    const handleLogChange = (type, index, e) => {
        const { name, checked } = e.target;
        const newLogData = { ...logData };
        newLogData[type][index][name] = checked; // Update the "taken" or "completed" field
        setLogData(newLogData);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(logData); // Log data can be sent to backend
        // Example: POST request to save the daily log
        fetch('http://localhost:5000/patient-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData)
        })
        .then(response => response.json())
        .then(data => alert('Daily log saved successfully!'))
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h2>Daily/Weekly Log</h2>
            <form onSubmit={handleSubmit}>
                {/* Medications Log */}
                <h3>Medications</h3>
                {logData.medications && logData.medications.map((med, index) => (
                    <div key={index}>
                        <label>
                            {med.medication_name} ({med.frequency}):
                            <input
                                type="checkbox"
                                name="taken"
                                checked={med.taken}
                                onChange={(e) => handleLogChange('medications', index, e)}
                            />
                            Taken
                        </label>
                    </div>
                ))}

                {/* Daily Routine Log */}
                <h3>Daily Routine</h3>
                {logData.daily_routine && logData.daily_routine.map((routine, index) => (
                    <div key={index}>
                        <label>
                            {routine.routine_name} ({routine.frequency}):
                            <input
                                type="checkbox"
                                name="completed"
                                checked={routine.completed}
                                onChange={(e) => handleLogChange('daily_routine', index, e)}
                            />
                            Completed
                        </label>
                    </div>
                ))}

                <button type="submit">Submit Log</button>
            </form>
        </div>
    );
};

export default PatientLog;
