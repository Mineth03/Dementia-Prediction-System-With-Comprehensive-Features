import React, { useState, useEffect, useRef } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";

const DementiaRiskForm = () => {
  const [formData, setFormData] = useState({});
  const [riskLevel, setRiskLevel] = useState(null);
  const [currentSection, setCurrentSection] = useState(1);
  const formRef = useRef(null); // Add this line to create the form reference
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({});
  };

  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const heightMeters = height / 100;
      const bmiValue = (weight / (heightMeters * heightMeters)).toFixed(1);
      setFormData((prev) => ({ ...prev, bmi: bmiValue }));
    } else {
      setFormData((prev) => ({ ...prev, bmi: '' }));
    }
  }, [formData.height, formData.weight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const risk = Math.random() < 0.5 ? 'Low' : Math.random() < 0.8 ? 'Moderate' : 'High';
    setRiskLevel(risk); // Set risk level separately
    setSubmitted(true); // Hide button after submission
  };

  const handleClosePopup = () => {
    setRiskLevel(null);  // Close the popup
    formRef.current.reset();  // Reset the form
    setFormData({});  // Clear form data from state
  };
 
  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const heightMeters = height / 100;
      const bmiValue = (weight / (heightMeters * heightMeters)).toFixed(1);
      setFormData((prev) => ({ ...prev, bmi: bmiValue }));
    } else {
      setFormData((prev) => ({ ...prev, bmi: '' }));
    }
  }, [formData.height, formData.weight]);

  const handleNextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const getProgress = () => {
    return ((currentSection - 1) / (sections.length - 1)) * 100;
  };

  const sections = [
    { title: "Personal Information", icon: "👤" },
    { title: "Current Health Status of the Dementia Patient", icon: "❤️" },
    { title: "Current Lifestyle of the Patient", icon: "🌱" },
    { title: "Medical History", icon: "💉" },
    { title: "Functional Activities", icon: "🏃‍♂️" },
    { title: "Assessment Results", icon: "📊" },
  ];
  
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Patient's Current Dementia Risk Assessment</h2>
      
       {/* Progress Bar */}
       <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>

      {/* Section Title and Icon */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-2xl">{sections[currentSection - 1].icon}</span>
        <h3 className="text-xl font-semibold">{sections[currentSection - 1].title}</h3>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Information */}
        {currentSection === 1 && (
          <div>
            <div className="space-y-2">
          <label className="font-bold text-gray-800">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required className="border p-2 rounded-md w-full" />
        </div>

        <div className="space-y-2 mb-4">
          <label className="font-bold text-gray-800">Sex</label>
          <select name="sex" value={formData.sex} onChange={handleChange} required className="border p-2 rounded-md w-full">
            <option value="select">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="space-y-2 mb-4">          
          <label className="font-bold text-gray-800">Living Situation:</label>
          <div className="flex flex-col space-y-2">
            <label>
              <input
               type="radio" 
               name="LivingSituation" 
               value="Lives alone" 
               onChange={handleChange} 
              /> Lives alone
            </label>

            <label>
            <input 
            type="radio" 
            name="LivingSituation" 
            value="Lives with spouse or partner" 
            onChange={handleChange} 
            /> Lives with spouse or partner
            </label>

            <label>
              <input 
              type="radio" 
              name="LivingSituation" 
              value="Lives with relative or friend" 
              onChange={handleChange} 
              /> Lives with relative or friend, or children
            </label>

            <label>
              <input 
              type="radio" 
              name="LivingSituation" 
              value="Lives with group" 
              onChange={handleChange} 
              />  Lives with group (Elderly homes, Nursing homes etc)
            </label>

            <label>
              <input 
              type="radio"
              name="LivingSituation" 
              value="Other" 
              onChange={handleChange} 
              /> Other
            </label>
            </div>
            </div>
          </div>
        )}   

         {/* Section 2: Current Health Status of the Dementia Patient */}
         {currentSection === 2 && (
          <div>
            <div className="space-y-2">
              <label className="font-bold text-gray-800">Height (cm)</label>
              <input type="number"  name="height" value={formData.height} onChange={handleChange} required  className="border p-2 rounded-md w-full" />
            </div>
             
            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">Weight (kg)</label>
              <input type="number"   name="weight" value={formData.weight} onChange={handleChange} required  className="border p-2 rounded-md w-full" />              
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <label className="font-bold text-gray-800">BMI:</label>
              <span className="font-semibold">{formData.bmi || 'N/A'}</span>
            </div>
            <div className="space-y-2">
              <label className="font-bold text-gray-800">Current Dementia Type</label>
              <select 
              name="currentdementiaType"
              value={formData.currentdementiaType || ""}  
              onChange={handleChange} 
              className="border p-2 w-full"
              required
              >
                <option value="">Select</option>
                <option value="0">No Dementia</option> 
                <option value="1">Alzheimer’s Disease</option> 
                <option value="2">Lewy Body Disease</option>
                <option value="3">Vascular Dementia</option> 
                <option value="4">Frontotemporal Dementia</option>
                <option value="5">Mixed Dementia</option> 
                <option value="6">Other Type</option>
                <option value="-1">Unknown</option> 
                </select>
            </div>
          </div>
        )}

{/* Section 2: Current Health Status of the Dementia Patient */}
    {currentSection === 3 && (
          <div>
          <div className="space-y-2">
            <label className="font-bold text-gray-800">Smoking Status:</label>
            <select 
            name="SMOKING"
            value={formData.SMOKING || ""} 
            onChange={handleChange} 
            className="border p-2 w-full"
            required
            >
              <option value="">Select</option>
              <option value="0">No, not smoking</option>
              <option value="1">Yes, currently smoking</option>
              </select>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-gray-800">Alcohol Consumption Frequency:</label>
            <select
            name="ALCFREQ" 
            value={formData.ALCFREQ || ""} 
            onChange={handleChange} 
            className="border p-2 w-full" 
            required
            >
              <option value="">Select</option>
              <option value="0">No alcohol consumption</option>
              <option value="1">Less than once a month</option>
              <option value="2">About once a month</option>
              <option value="3">About once a week</option>
              <option value="4">A few times a week</option>
              <option value="5">Daily or almost daily</option>   
              </select>
            </div>
          
<div className="space-y-2">
  <label className="font-bold text-gray-800">Independence Level:</label>
  <select 
  name="independence" 
  value={formData.independence || ""} 
  onChange={handleChange} 
  className="border p-2 w-full" 
  required
  >
    <option value="">Select</option>
    <option value="Able to live independently">Able to live independently</option>
    <option value="Requires some assistance with complex activities">
      Requires some assistance with complex activities
    </option>
    <option value="Requires some assistance with basic activities">
      Requires some assistance with basic activities
    </option>
    <option value="Completely dependent">Completely dependent</option>
    <option value="Unknown">Unknown</option>
  </select>
</div>
</div>
        )}

 {/* Section 4: Medical History */}
 {currentSection === 4 && (
  <div>
    <div className="space-y-2 mb-4">
    <small>Choose "Absent" if the patient has never had it, "Recent/Active" if it’s ongoing, or "Remote/Inactive" if it occurred in the past but no longer affects the patient.</small>
    </div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800 block">Hypertension</label>
  <select name="hypertension" value={formData.hypertension} onChange={handleChange} required className="border p-2 rounded-md w-full">
    <option value="select">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800 block">Diabetes</label>
  <select name="diabetes" value={formData.diabetes} onChange={handleChange} required className="border p-2 rounded-md w-full">
    <option value="select">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient experienced Angina?
  </label>
  <p className="text-gray-600 text-sm">
    Angina is a feeling of tightness, pressure, or pain in the chest. It usually happens when the heart is not getting enough oxygen.  
    Symptoms may include:
    <ul className="list-disc ml-4">
      <li>Chest pain or tightness, especially during activity or stress</li>
      <li>Pain that spreads to the arms, neck, jaw, or back</li>
      <li>Shortness of breath</li>
      <li>Feeling lightheaded or weak</li>
    </ul>
    Angina is not a disease,It’s a symptom and a warning sign of heart disease.
  </p>
  <select 
    name="CVANGINA" 
    value={formData.CVANGINA || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">Absent (No history of angina)</option>
    <option value="1">Recent/Active (Currently experiencing symptoms)</option>
    <option value="2">Remote/Inactive (Had angina in the past but no longer active)</option>    
  </select>
</div>


<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient been diagnosed with Congestive Heart Failure (CHF)?
  </label>
  <p className="text-gray-600 text-sm">
    CHF is a chronic condition where the heart becomes too weak to pump blood effectively. 
    Symptoms develop gradually and include:
    <ul className="list-disc ml-4">
      <li>Shortness of breath (especially when lying down)</li>
      <li>Fatigue and weakness</li>
      <li>Swelling in the legs, ankles, or feet</li>
      <li>Rapid or irregular heartbeat</li>
    </ul>
    A diagnosis of this condition can be identified by a cardiologist.If you didn't confirm  from a cardiologist make it as 'unknown'. 
  </p>
  <select 
    name="CVCHF" 
    value={formData.CVCHF || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">Absent (No history of CHF)</option>
    <option value="1">Recent/Active (Currently diagnosed and experiencing symptoms)</option>
    <option value="2">Remote/Inactive (Had CHF in the past but no longer active)</option>
    <option value="-1">Unknown</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient had a heart attack or cardiac arrest?
  </label>
  <p className="text-gray-600 text-sm">
    A heart attack is a sudden event caused by a blockage in the arteries, preventing oxygen from reaching the heart.
    Symptoms appear suddenly and may include:
    <ul className="list-disc ml-4">
      <li>Severe chest pain or pressure (can spread to the arm, neck, or jaw)</li>
      <li>Shortness of breath</li>
      <li>Cold sweats</li>
      <li>Dizziness or nausea</li>
    </ul>
    A **cardiac arrest** is different from a heart attack—it is when the heart suddenly stops beating, requiring immediate emergency care.
  </p>
  <select 
    name="CVHATT" 
    value={formData.CVHATT || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">Absent (No history of heart attack)</option>
    <option value="1">Recent/Active (Occurred recently and still affecting the patient)</option>
    <option value="2">Remote/Inactive (Occurred in the past but no longer active)</option>
  </select>
</div>


<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient ever been diagnosed with Atrial Fibrillation (an irregular heartbeat)?
  </label>
  <select name="CVAFIB" value={formData.CVAFIB} onChange={handleChange} required className="border p-2 w-full">
    <option value="">Select</option>
    <option value="0">Absent (No history of Atrial Fibrillation)</option>
    <option value="1">Recent/Active (Currently diagnosed with Atrial Fibrillation)</option>
    <option value="2">Remote/Inactive (Had Atrial Fibrillation in the past but no longer active)</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient been diagnosed with any other cardiovascular disease not mentioned previously?
  </label>
  <select 
    name="CVOTHR" value={formData.CVOTHR || ""} onChange={handleChange} className="border p-2 w-full" 
  >
    <option value="">Select</option>
    <option value="0">No, the patient does not have other cardiovascular diseases</option>
    <option value="1">Yes, the patient has been diagnosed with other cardiovascular diseases</option>
    <option value="-1">Unknown</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">Seizures:</label>
  <select name="SEIZURES" value={formData.SEIZURES || ""} onChange={handleChange} className="border p-2 w-full">
    <option value="">Select</option>
    <option value="0">Absent (No history of Seizures)</option>
    <option value="1">Recent/Active (Occurred recently and still affecting the patient)</option>
    <option value="2">Remote/Inactive (Occurred in the past but no longer active)</option>
    <option value="-1">Unknown</option>
    </select>
            </div>
          </div>
        )}

{currentSection === 5 && (
  <div>
    {[
      { key: 'BILLS', label: 'Handling finances' },
      { key: 'REMDATES', label: 'Managing medications or remembering important dates' },
      { key: 'PERSCARE', label: 'Performing personal care tasks' }
    ].map(({ key, label }) => (
      <div key={key}>
        <label className="font-bold text-gray-800">{label}</label>
        <select name={key} value={formData[key]} onChange={handleChange} required className="border p-2 w-full">
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    ))}
  </div>
)}                  

   {/* Section 6: Assessment Results */}
   {currentSection === 6 && (
          <div>
            <div className="mb-4">
              {riskLevel && (
                <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg">
                  <TiWarning
                  size={30}
                  className={
                  riskLevel === 'Low' ? 'text-yellow-500' :
                    riskLevel === 'Moderate' ? 'text-orange-500' :
                      riskLevel === 'High' ? 'text-red-500' : ''
                }
              />
                  <h2 className="text-2xl font-semibold">{riskLevel} Risk</h2>
                  <p className="text-gray-700">Based on the provided information, we recommend following up with your healthcare provider.</p>
                </div>
              )}
              {!riskLevel && (
                <p className="text-gray-800">Click below to assess the patient's risk of dementia.</p>
              )}
            </div>
            {!submitted && (
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">Assess Risk</button>
          )} 
            </div>
        )}

     
{/* Navigation Buttons */}
<div className="mt-4">
  {/* For the first section, only show the "Next" button on the right */}
  {currentSection === 1 ? (
    <div className="flex justify-end">
      {currentSection < sections.length && (
        <button
          type="button"
          onClick={handleNextSection}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Next
        </button>
      )}
    </div>
  ) : (
    // For all other sections, show both "Previous" and "Next" buttons on the same line
    <div className="flex justify-between">
       {currentSection > 1 && !submitted && (
        <button
          type="button"
          onClick={handlePreviousSection}
          className="bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Previous
        </button>
      )}
      {currentSection < sections.length && (
        <button
          type="button"
          onClick={handleNextSection}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Next
        </button>
      )}
    </div>
  )}
</div>

      </form>
    </div>
  );
};

export default DementiaRiskForm;

     