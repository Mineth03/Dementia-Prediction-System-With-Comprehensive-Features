import React, { useState, useEffect, useRef } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import { FaUser, FaHeartbeat, FaHome, FaExchangeAlt, FaBrain, FaTasks, FaClipboardList, FaChartBar } from "react-icons/fa";

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

  const calculateSleepDysfunction = () => {
    const { SLEEP_APNEA, SLEEP_OTHER, SLEEP_REM } = formData;
  
    if (SLEEP_APNEA === "-1" || SLEEP_OTHER === "-1" || SLEEP_REM === "-1") {
      return -1; // Unknown
    }
  
    if (SLEEP_APNEA === "0" && SLEEP_OTHER === "0" && SLEEP_REM === "0") {
      return 0; // No Sleep Disorders
    }
  
    if (SLEEP_APNEA === "1" && SLEEP_OTHER === "0" && SLEEP_REM === "0") {
      return 3; // Sleep Apnea Only
    }
  
    if (SLEEP_APNEA === "0" && SLEEP_OTHER === "1" && SLEEP_REM === "0") {
      return 1; // Other Sleep Disorder Only
    }
  
    if (SLEEP_APNEA === "0" && SLEEP_OTHER === "0" && SLEEP_REM === "1") {
      return 2; // REM Sleep Disorder Only
    }
  
    if (SLEEP_APNEA === "1" && SLEEP_REM === "1" && SLEEP_OTHER === "0") {
      return 6; // Sleep Apnea + REM Disorder
    }
  
    if (SLEEP_APNEA === "1" && SLEEP_OTHER === "1" && SLEEP_REM === "0") {
      return 5; // Sleep Apnea + Other Sleep Disorder
    }
  
    if (SLEEP_REM === "1" && SLEEP_OTHER === "1" && SLEEP_APNEA === "0") {
      return 4; // REM Disorder + Other Sleep Disorder
    }
  
    return 7; // Severe Sleep Dysfunction (if all three are present)
  };

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
    { title: "Current Health Status of the Dementia Patient", icon: "🩺" }, 
    { title: "Current Lifestyle of the Patient", icon: "🛋️" }, 
    { title: "Patient's Behavioural Changes", icon: "🔄" },
    { title: "Health Conditions of the Patient", icon: "❤️" }, 
    { title: "Mental Health", icon: "🧠" },
    { title: "Functional Activities", icon: "🚶‍♂️" }, 
    { title: "Assessment Results", icon: "📊" }, 
];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Patient's Current Dementia Risk Level Assessment</h2>
      
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
          <select name="SEX" value={formData.SEX} onChange={handleChange} required className="border p-2 rounded-md w-full">
            <option value="select">Select</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
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
            
            <div className="space-y-2 mb-4">
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

            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label className="font-bold text-gray-800">Height (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} required className="border p-2 rounded-md w-full"/>
              </div>

              <div className="flex-1">
                <label className="font-bold text-gray-800">Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} required className="border p-2 rounded-md w-full" />              
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <label className="font-bold text-gray-800">BMI:</label>
              <span className="font-semibold">{formData.bmi || 'N/A'}</span>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                What is the patient’s most recent blood pressure reading?
              </label>
              <p className="text-gray-600 text-sm">
                Blood pressure is measured using two numbers:
                <ul className="list-disc ml-4">
                  <li><b>Systolic (Upper Number)</b> – The pressure when the heart beats</li>
                  <li><b>Diastolic (Lower Number)</b> – The pressure when the heart rests between beats</li>
                </ul>
                If you do not have a recent measurement, please leave blank.
              </p>

              <div className="flex space-x-4 mb-4">
                <div>
                  <label className="font-bold text-gray-800">Systolic (Upper Number)</label>
                  <input type="number" name="BPSYS" value={formData.BPSYS || ""} onChange={handleChange} className="border p-2 rounded-md w-full" />
                </div>

                <div>
                  <label className="font-bold text-gray-800">Diastolic (Lower Number)</label>
                  <input type="number" name="BPDIAS" value={formData.BPDIAS || ""} onChange={handleChange} className="border p-2 rounded-md w-full" />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                What is the patient’s most recent heart rate (pulse)?
              </label>
              <p className="text-gray-600 text-sm">
                Heart rate is the number of times the heart beats per minute. A normal resting heart rate for adults is between <b>60-100 beats per minute (bpm)</b>.  
                If you do not have a recent measurement, please leave blank.
              </p>
              <input type="number" name="HRATE" value={formData.HRATE || ""} onChange={handleChange} className="border p-2 rounded-md w-full" />
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient have vision problems?
              </label>
              <p className="text-gray-600 text-sm">
                Vision problems can affect daily activities and safety.
                Please select the option that best describes the patient's vision:
                <ul className="list-disc ml-4">
                  <li><b>No Vision Impairment:</b> The patient sees well without any issues.</li>
                  <li><b>Corrected Vision:</b> The patient has vision problems but uses glasses, contact lenses, or had surgery (e.g., cataract surgery) to improve vision.</li>
                  <li><b>Uncorrected Vision Loss:</b> The patient has difficulty seeing even with glasses or has untreated vision loss.</li>
                </ul>
              </p>
              <select name="VISIMP" value={formData.VISIMP || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient has no vision impairment</option>
                <option value="1">Yes, the patient has vision problems but uses glasses or other corrections</option>
                <option value="2">Yes, the patient has untreated vision loss</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient have hearing difficulties?
              </label>
              <p className="text-gray-600 text-sm">
                Hearing difficulties can affect communication and daily life.
                Please select the option that best describes the patient's hearing:
                <ul className="list-disc ml-4">
                  <li><b>No Hearing Impairment:</b> The patient hears well without any issues.</li>
                  <li><b>Hearing Impairment :</b> The patient has difficulty hearing, even with hearing aids.</li>
                  <li><b>Unknown :</b> It is unclear if the patient has hearing problems.</li>
                </ul>
              </p>
              <select name="HEARING" value={formData.HEARING || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient has no hearing impairment</option>
                <option value="1">Yes, the patient has hearing impairment</option>
                <option value="-1">Unknown</option>
              </select>
            </div>



          </div>          
        )}

        {/* Section 2: Current Health Status of the Dementia Patient */}
        {currentSection === 3 && (
          <div>
            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">Independence Level:</label>
              <select name="independence" value={formData.independence || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="Able to live independently">Able to live independently</option>
                <option value="Requires some assistance with complex activities">Requires some assistance with complex activities</option>
                <option value="Requires some assistance with basic activities">Requires some assistance with basic activities</option>
                <option value="Completely dependent">Completely dependent</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
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

          <div className="space-y-2 mb-4">
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

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient have sleep-related problems?
              </label>
              <p className="text-gray-600 text-sm">
                Sleep problems can affect a person's rest and overall health.    
              </p>
              <select name="HAS_SLEEP_PROBLEMS" value={formData.HAS_SLEEP_PROBLEMS || ""} onChange={handleChange} className="border p-2 w-full" required >
                <option value="">Select</option>
                <option value="0">No, the patient has no sleep-related problems</option>
                <option value="1">Yes, the patient has sleep-related problems</option>
              </select>
            </div>

            {formData.HAS_SLEEP_PROBLEMS === "1" && (
              <>
              {/* Insomnia Question */}
              <div className="space-y-2 mb-4"> 
                <label className="font-bold text-gray-800">
                  Does the patient have trouble sleeping (Insomnia)?
              </label>
              <p className="text-gray-600 text-sm">
                <b>Insomnia (or Hyposomnia)</b> is when a person has trouble falling asleep, staying asleep, or wakes up too early and cannot go back to sleep.  
                Symptoms may include:
                <ul className="list-disc ml-4">
                  <li>Difficulty falling asleep at night</li>
                  <li>Waking up frequently during the night</li>
                  <li>Feeling tired or sleepy during the day</li>
                  <li>Difficulty concentrating due to poor sleep</li>
                </ul>
              </p>

              <select name="INSOMN" value={formData.INSOMN || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient does not have insomnia</option>
                <option value="1">Yes, the patient is currently experiencing insomnia</option>
                <option value="2">Yes, the patient had insomnia in the past but no longer does</option>
                <option value="-1">Unknown</option>
              </select>
          </div>

          {/* Sleep Apnea Question */}
          <div className="space-y-2 mb-4">
            <label className="font-bold text-gray-800">
              Has the patient been diagnosed with Sleep Apnea?
            </label>
            <p className="text-gray-600 text-sm">
              <b>Sleep Apnea</b> is a condition where breathing stops and starts repeatedly during sleep.  
              Symptoms may include:
              <ul className="list-disc ml-4">
                <li>Loud snoring</li>
          <li>Gasping for air during sleep</li>
          <li>Feeling very tired during the day</li>
          <li>Morning headaches</li>
              </ul>
            </p>

            <select name="SLEEP_APNEA" value={formData.SLEEP_APNEA || ""} onChange={handleChange} className="border p-2 w-full" required>
              <option value="">Select</option>
              <option value="0">No</option>
              <option value="1">Yes</option>
              <option value="-1">Unknown</option>
            </select>
          </div>

          {/* REM Sleep Behavior Disorder Question */}
          <div className="space-y-2 mb-4">
            <label className="font-bold text-gray-800">
              Has the patient been diagnosed with REM Sleep Behavior Disorder?
            </label>
            <p className="text-gray-600 text-sm">
              <b>REM Sleep Behavior Disorder (RBD)</b> causes people to move, talk, or act out dreams while asleep.  
              Symptoms may include:
              <ul className="list-disc ml-4">
                <li>Kicking, punching, or jumping out of bed during sleep</li>
          <li>Vivid dreams that feel real</li>
          <li>Accidentally harming oneself or a bed partner while sleeping</li>
              </ul>
            </p>
            <select 
        name="SLEEP_REM" 
        value={formData.SLEEP_REM || ""} 
        onChange={handleChange} 
        className="border p-2 w-full" 
        required
      >
        <option value="">Select</option>
        <option value="0">No</option>
        <option value="1">Yes</option>
        <option value="-1">Unknown</option>
      </select>
    </div>

    {/* Other Sleep Problems Question */}
    <div className="space-y-2 mb-4">
      <label className="font-bold text-gray-800">
        Does the patient have other sleep problems?
      </label>
      <select 
        name="SLEEP_OTHER" 
        value={formData.SLEEP_OTHER || ""} 
        onChange={handleChange} 
        className="border p-2 w-full" 
        required
      >
        <option value="">Select</option>
        <option value="0">No</option>
        <option value="1">Yes</option>
        <option value="-1">Unknown</option>
      </select>
    </div>
  </>
)}
</div>
        )}

        {/* Section 4: Patient's Behavioural Changes */}
        {currentSection === 4 && (
          <div>
            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Has the patient experienced any difficulties with speaking or communicating?
              </label>
              <p className="text-gray-600 text-sm">
                Changes in speech can make it harder for the patient to express themselves or be understood. 
                Some common speech difficulties include:
                <ul className="list-disc ml-4">
                  <li>Speaking more slowly or struggling to find the right words</li>
                  <li>Slurring words or having unclear speech</li>
                  <li>Repeating words or sentences often</li>
                  <li>Difficulty understanding what others are saying</li>
                </ul>
                If the patient has had speech difficulties, please select whether they are **recent or happened in the past but have improved**.
              </p>

              <select name="SPEECH" value={formData.SPEECH || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient has no speech difficulties</option>
                <option value="1">Yes, the patient is currently experiencing speech difficulties</option>
                <option value="2">Yes, the patient had speech difficulties in the past but has improved</option>
                <option value="-1">Unknown</option>
              </select>
            </div> 

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Has the patient’s facial expression changed over time?
              </label>
              <p className="text-gray-600 text-sm">
                Some medical conditions can cause <b>reduced facial expressions</b>, making the patient appear less expressive or "emotionless".  
              </p>
              <select name="FACEXP" value={formData.FACEXP || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient has normal facial expressions</option>
                <option value="1">a slight reduction in facial expressions (a "poker face"), but still could be normal</option>
                <option value="2">Noticeably fewer facial expressions but still shows emotions</option>
                <option value="3">Difficulty making facial expressions, and their lips may remain slightly open.</option>
                <option value="4">Almost no facial expressions ("masked face"), and their lips remain significantly open.</option>
                <option value="-1">Untestable</option>
                </select>
            </div>
          </div>
        )}

        {/* Section 5: Health Conditions of the Patient */}
        {currentSection === 5 && (
          <div>
            <div className="space-y-2 mb-4">
              <small>Choose "Absent" if the patient has never had it, "Recent/Active" if it’s ongoing, or "Remote/Inactive" if it occurred in the past but no longer affects the patient.</small>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800 block">Diabetes</label>
              <select name="DIABET" value={formData.DIABET} onChange={handleChange} required className="border p-2 rounded-md w-full">
                <option value="select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800 block">Hypertension</label>
              <select name="HYPERTEN" value={formData.HYPERTEN} onChange={handleChange} required className="border p-2 rounded-md w-full">
                <option value="select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800 block">Hypercholesterolemia</label>
              <select name="HYPERCHO" value={formData.HYPERCHO} onChange={handleChange} required className="border p-2 rounded-md w-full">
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
  <select name="CVCHF" 
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
    <option value="0">No, the patient do rdiovascular diseases</option>
    <option value="1">Yes, the patient has been diagnosed with other cardiovascular diseases</option>
    <option value="-1">Unknown</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient ever had a Transient Ischemic Attack (TIA or "mini-stroke")?
  </label>
  <p className="text-gray-600 text-sm">
    A **TIA ("mini-stroke")** happens when blood flow to the brain is briefly blocked. Unlike a stroke, symptoms go away within a few minutes or hours.  
    Signs of a TIA may include:
    <ul className="list-disc ml-4">
      <li>Sudden weakness or numbness, especially on one side of the body</li>
      <li>Slurred speech or trouble understanding words</li>
      <li>Temporary vision problems</li>
      <li>Loss of balance or dizziness</li>
    </ul>
    Even though symptoms disappear, a **TIA is a warning sign of a future stroke** and should be taken seriously.
  </p>
  <select 
    name="TIA" 
    value={formData.TIA || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient has never had a TIA</option>
    <option value="1">Yes, the patient had a recent single TIA</option>
    <option value="2">Yes, the patient had a past single TIA</option>
    <option value="3">Yes, the patient had recent multiple TIAs</option>
    <option value="4">Yes, the patient had past multiple TIAs</option>
    <option value="-1">Unknown</option>    
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient ever had a stroke?
  </label>
  <p className="text-gray-600 text-sm">
    A <b>stroke</b> happens when blood flow to the brain is blocked or a blood vessel bursts, causing brain damage. 
    
    If the patient has had more than one stroke, please select whether the strokes were <b>recent or in the past</b>.
  </p>
  <select 
    name="STROKE" 
    value={formData.STROKE || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient has never had a stroke</option>
    <option value="1">Yes, the patient had a recent single stroke</option>
    <option value="3">Yes, the patient had a past single stroke</option>
    <option value="2">Yes, the patient had recent multiple strokes</option>
    <option value="4">Yes, the patient had past multiple strokes</option>
    <option value="-1">Unknown stroke history</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient ever had a head injury (Traumatic Brain Injury - TBI)?
  </label>
  <p className="text-gray-600 text-sm">
    A **Traumatic Brain Injury (TBI)** happens when the head is hit or shaken hard, which can affect memory, thinking, or behavior.  
    Symptoms may include:
    <ul className="list-disc ml-4">
      <li>Confusion or memory loss after a head injury</li>
      <li>Headache, dizziness, or nausea</li>
      <li>Changes in mood or behavior</li>
      <li>Difficulty concentrating or feeling mentally slow</li>
    </ul>
  </p>
  <select 
    name="TBI" 
    value={formData.TBI || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient has never had a head injury</option>
    <option value="1">Yes, the patient recently had a head injury</option>
    <option value="2">Yes, the patient had a head injury in the past but has recovered</option>
    <option value="-1">Unknown</option>
  </select>
</div>

{(formData.TBI === "1" || formData.TBI === "2") && (
  <div className="space-y-2">
    <label className="font-bold text-gray-800">
      Did the patient lose consciousness (black out) when they had the head injury?
    </label>
    <p className="text-gray-600 text-sm">
      **Loss of Consciousness (LOC)** means the patient fainted or blacked out due to the head injury.  
      If so, please select how long it lasted:
      <ul className="list-disc ml-4">
        <li>No LOC: The patient remained awake during the injury</li>
        <li>Brief LOC: Passed out for a few seconds or minutes</li>
        <li>Repeated LOC: Lost consciousness multiple times</li>
        <li>Extended LOC: Unconscious for **5 minutes or longer**</li>
      </ul>
    </p>
    <select 
      name="TBI_LOC" 
      value={formData.TBI_LOC || ""} 
      onChange={handleChange} 
      className="border p-2 w-full" 
      required
    >
      <option value="">Select</option>
      <option value="0">No, the patient did not lose consciousness</option>
      <option value="1">Yes, the patient had a brief loss of consciousness</option>
      <option value="2">Yes, the patient lost consciousness multiple times for short periods</option>
      <option value="3">Yes, the patient lost consciousness for 5 minutes or more</option>
      <option value="4">Yes, the patient lost consciousness multiple times for extended periods</option>
      <option value="5">Yes, but it happened a long time ago and is no longer a concern</option>
      <option value="-1">Unknown</option>
    </select>
  </div>
)}


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

        {/* Section 6: Mental Health */}
        {currentSection === 6 && (
          <div>
            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">Depression</label>
              <p className="text-gray-600 text-sm">
                Depression can affect mood, energy, and interest in activities.
                Please select the option that best describes the patient:
  </p>
  <select 
    name="DEPRESSION" 
    value={formData.DEPRESSION || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient does not show signs of depression</option>
    <option value="1">Yes, the patient has mild symptoms of depression</option>
    <option value="2">Yes, the patient has severe depression symptoms</option>
  </select>
</div>

            <div className="space-y-2">
              <label className="font-bold text-gray-800">
                Has the patient experienced noticeable emotional changes?
              </label>
              <p className="text-gray-600 text-sm">
                Emotional changes can affect the patient's mood, behavior, and reactions to situations.  
                Some common signs include:
                <ul className="list-disc ml-4">
                  <li>Feeling more anxious, worried, or easily upset</li>
                  <li>Becoming unusually sad, withdrawn, or uninterested in activities</li>
                  <li>Sudden mood swings (for example, happy one moment and angry the next)</li>
                  <li>Showing little or no emotional response to situations</li>
                </ul>
                If the patient has had emotional changes, please select whether they are **recent or happened in the past but have improved**.
              </p>
              <select name="EMOT" value={formData.EMOT || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient has not had emotional changes</option>
                <option value="1">Yes, the patient is currently experiencing emotional changes</option>
                <option value="2">Yes, the patient had emotional changes in the past but has improved</option>
                <option value="-1">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Has the patient ever been diagnosed with Bipolar Disorder?
              </label>
              <p className="text-gray-600 text-sm">
                <b>Bipolar Disorder</b> is a mental health condition that causes extreme mood swings, including:
                <ul className="list-disc ml-4">
                  <li>Periods of feeling very happy, energetic, or "high" (mania)</li>
                  <li>Periods of feeling very sad, hopeless, or tired (depression)</li>
                  <li>Sudden changes in mood, energy, or behavior</li>
                </ul>
                If unsure, please select **Unknown**.
              </p>
              <select name="BIPOLAR" value={formData.BIPOLAR || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient has never been diagnosed with Bipolar Disorder</option>
                <option value="1">Yes, the patient has been diagnosed</option>
                <option value="-1">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Has the patient ever been diagnosed with Schizophrenia?
              </label>
              <p className="text-gray-600 text-sm">
                <b>Schizophrenia</b> is a mental health condition that affects how a person thinks, feels, and behaves. 
                Symptoms may include:
                <ul className="list-disc ml-4">
                  <li>Hearing voices or seeing things that are not there (hallucinations)</li>
                  <li>Strong, unusual beliefs that are not based on reality (delusions)</li>
                  <li>Difficulty thinking clearly or expressing thoughts</li>
                  <li>Social withdrawal or lack of motivation</li>
                </ul>
                If unsure, please select <b>Unknown</b>.
                </p>
                <select name="SCHIZ" value={formData.SCHIZ || ""} onChange={handleChange} className="border p-2 w-full" required >
                  <option value="">Select</option>
                  <option value="0">No, the patient has never been diagnosed with Schizophrenia</option>
                  <option value="1">Yes, the patient has been diagnosed</option>
                  <option value="-1">Unknown</option>
                </select>
              </div> 

              <div className="space-y-2 mb-4">
                <label className="font-bold text-gray-800">
                  Has the patient been diagnosed with any other psychiatric or mental health condition?
                </label>
                <p className="text-gray-600 text-sm">
                  This includes conditions like:
                  <ul className="list-disc ml-4">
                    <li>Severe anxiety or panic disorder</li>
                    <li>Severe depression requiring medical treatment</li>
                    <li>Post-Traumatic Stress Disorder (PTSD)</li>
                    <li>Obsessive-Compulsive Disorder (OCD)</li>
                  </ul>
                  If unsure, please select <b>Unknown</b>.
                </p>
                <select name="PSYCDIS" value={formData.PSYCDIS || ""} onChange={handleChange} className="border p-2 w-full" required>
                  <option value="">Select</option>
                  <option value="0">No, the patient has no other psychiatric disorders</option>
                  <option value="1">Yes, the patient has been diagnosed with another psychiatric disorder</option>
                  <option value="-1">Unknown</option>
                </select>
            </div>
          </div>
        )} 

        {/* Section 7: Functional Activities */}
        {currentSection === 7 && (
          <div>
            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
    Does the patient have difficulty taking care of personal hygiene or daily self-care?
  </label>
  <p className="text-gray-600 text-sm">
    Personal care includes tasks like bathing, dressing, or brushing teeth.  
    If the patient has difficulty, please select the best option:
  </p>
  <select 
    name="PERSCARE" 
    value={formData.PERSCARE || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient can manage self-care independently</option>
    <option value="1">Yes, the patient needs some assistance</option>
    <option value="2">Yes, the patient is completely dependent on others</option>
  </select>
</div>

            {[
              { key: 'BILLS', label: 'Handling finances' },
              { key: 'REMDATES', label: 'Managing medications or remembering important dates' }
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

        {/* Section 8: Assessment Results */}
        {currentSection === 8 && (
          <div>
            <div className="mb-4">
              {riskLevel && (
                <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg">
                  <TiWarning size={30}
                  className={
                    riskLevel === 'Low' ? 'text-yellow-500' :
                    riskLevel === 'Moderate' ? 'text-orange-500' :
                    riskLevel === 'High' ? 'text-red-500' : ''
                }/>
                  <h2 className="text-2xl font-semibold">{riskLevel} Risk</h2>
                  <p className="text-gray-700">This risk level is based on the information provided.
                    If you have concerns, consider discussing with a medical professional for further evaluation.
                  </p>
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

     