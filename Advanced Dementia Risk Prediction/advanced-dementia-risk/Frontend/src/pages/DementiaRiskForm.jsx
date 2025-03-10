import React, { useState, useEffect, useRef } from 'react';
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

  const calculateSleepDysfunction = () => {
    const { APNEA, NITE, SLEEP_REM } = formData;
  
    if (APNEA === "-1" || NITE === "-1" || SLEEP_REM === "-1") {
      return -1; // Unknown
    }
  
    if (APNEA === "0" && NITE === "0" && SLEEP_REM === "0") {
      return 0; // No Sleep Disorders
    }
  
    if (APNEA === "1" && NITE === "0" && SLEEP_REM === "0") {
      return 3; // Sleep Apnea Only
    }
  
    if (APNEA === "0" && NITE === "1" && SLEEP_REM === "0") {
      return 1; // Other Sleep Disorder Only
    }
  
    if (APNEA === "0" && NITE === "0" && SLEEP_REM === "1") {
      return 2; // REM Sleep Disorder Only
    }
  
    if (APNEA === "1" && SLEEP_REM === "1" && NITE === "0") {
      return 6; // Sleep Apnea + REM Disorder
    }
  
    if (APNEA === "1" && NITE === "1" && SLEEP_REM === "0") {
      return 5; // Sleep Apnea + Other Sleep Disorder
    }
  
    if (SLEEP_REM === "1" && NITE === "1" && APNEA === "0") {
      return 4; // REM Disorder + Other Sleep Disorder
    }
  
    return 7; // Severe Sleep Dysfunction (if all three are present)
  };


  const calculateCOGDP = () => {
    const { ABRUPT, COURSE } = formData;
    let cogdpValue = "";
  
    if (ABRUPT === "0" && COURSE === "1") cogdpValue = 2;
    else if (ABRUPT === "0" && COURSE === "3") cogdpValue = 2;
    else if (ABRUPT === "0" && COURSE === "4") cogdpValue = 3;
    else if (ABRUPT === "0" && COURSE === "2") cogdpValue = 4;
    else if (ABRUPT === "0" && COURSE === "5") cogdpValue = 1;
    else if (ABRUPT === "2" && COURSE === "1") cogdpValue = 4;
    else if (ABRUPT === "2" && COURSE === "2") cogdpValue = 6;
    else if (ABRUPT === "2" && COURSE === "3") cogdpValue = 4;
    else if (ABRUPT === "2" && COURSE === "4") cogdpValue = 5;
    else if (ABRUPT === "2" && COURSE === "5") cogdpValue = 6;
    else if (ABRUPT === "-4" || COURSE === "9") cogdpValue = 6;
  
    // Store the cogdpValue in formData for future use
    formData.COGDP = cogdpValue;
  
    return {
      value: cogdpValue,
      interpretation: getCOGDPInterpretation(cogdpValue)
    };
  };
  
  const getCOGDPInterpretation = (value) => {
    if (value === 1 || value === 2) return "Stable or Gradual Decline";
    if (value === 3) return "Fluctuating Symptoms or Mild Worsening";
    if (value === 4 || value === 5) return "Stepwise Worsening or Sudden Decline";
    if (value === 6) return "Severe Cognitive Decline (Abrupt Onset + Stepwise Course)";
    return "Invalid Selection";
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.risk_level) {
            setRiskLevel(data.risk_level);
        } else {
            console.error("Error in response:", data);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
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
    { title: "Cognitive Function Assessment & Test Scores", icon: "📝" }, 
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
          <input type="number" name="NACCAGE" value={formData.NACCAGE} onChange={handleChange} required className="border p-2 rounded-md w-full" />
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
               name="NACCLIVS" 
               value="1" 
               onChange={handleChange}                
              /> Lives alone
            </label>

            <label>
            <input 
            type="radio" 
            name="NACCLIVS" 
            value="2" 
            onChange={handleChange} 
            /> Lives with spouse or partner
            </label>

            <label>
              <input 
              type="radio" 
              name="NACCLIVS" 
              value="3" 
              onChange={handleChange} 
              /> Lives with relative or friend, or children
            </label>

            <label>
              <input 
              type="radio" 
              name="NACCLIVS" 
              value="4" 
              onChange={handleChange} 
              />  Lives with group (Elderly homes)
            </label>

            <label>
              <input 
              type="radio"
              name="NACCLIVS" 
              value="5" 
              onChange={handleChange} 
              /> Other(Nursing homes etc)
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
              name="DEM_TYPE"
              value={formData.DEM_TYPE || ""}  
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
                Has the patient been diagnosed with Vitamin B12 deficiency?
              </label>
              <p className="text-gray-600 text-sm">
                <b>Vitamin B12 deficiency</b>can cause symptoms such as:
                <ul className="list-disc ml-4">
                  <li>Fatigue, weakness, or dizziness</li>
                  <li>Memory problems or trouble concentrating</li>
                  <li>Numbness or tingling in the hands and feet</li>
                  <li>Pale skin or shortness of breath</li>
                </ul>
                If the patient has been diagnosed by a doctor, please select <b>"Yes"</b>.
                If unsure, select <b>"Unknown"</b>.
              </p>
              <select name="VB12DEF" value={formData.VB12DEF || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient does not have Vitamin B12 deficiency</option>
                <option value="1">Yes, the patient has been diagnosed with Vitamin B12 deficiency</option>
                <option value="-1">Unknown</option>
              </select>
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

            <div>
              {/* Initial Question: Does the patient have motor function issues? */}
              <div className="space-y-2 mb-4">
                <label className="font-bold text-gray-800">Does the patient experience any motor function issues?</label>
                <select name="MOT" value={formData.MOT || ""} onChange={handleChange} className="border p-2 w-full" required>
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>

  {/* Display Motor Function Questions ONLY if caregiver selects "Yes" */}
  {formData.MOT === "1" && (
    <div className="mt-4 p-4 border rounded-md bg-gray-100">
     
      {/* Rigidity */}
      <div className="space-y-2 mb-4">
        <label className="font-bold text-gray-800">Does the patient experience stiffness or resistance to movement in any part of the body?</label>
        <p className="text-gray-600 text-sm">
          **Rigidity** refers to stiffness in different body areas, including the neck, upper limbs, and lower limbs.
        </p>
        <select name="RIGIDITY" value={formData.RIGIDITY || ""} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
          <option value="-1">Unknown</option>
        </select>
      </div>

      {/* Hand Movements */}
      <div className="space-y-2 mt-4">
        <label className="font-bold text-gray-800">Does the patient show reduced or impaired hand movements?</label>
        <p className="text-gray-600 text-sm">
          This refers to difficulty in moving one or both hands smoothly.
        </p>
        <select name="HANDMOVS" value={formData.HANDMOVS || ""} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select</option>
          <option value="1">Yes, in one hand</option>
          <option value="2">Yes, in both hands</option>
          <option value="0">No</option>
        </select>
      </div>

      {/* Finger Taps */}
      <div className="space-y-2 mt-4">
        <label className="font-bold text-gray-800">Is the patient able to tap their fingers quickly and repeatedly on both hands?</label>
        <p className="text-gray-600 text-sm">
          This assesses fine motor skills by checking how well the patient can perform rapid finger tapping movements.
        </p>
        <select name="FTAPS" value={formData.FTAPS || ""} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select</option>
          <option value="1">Yes, in one hand</option>
          <option value="2">Yes, in both hands</option>
          <option value="0">No</option>
        </select>
      </div>

      {/* Alternating Hand Movements */}
      <div className="space-y-2 mt-4">
        <label className="font-bold text-gray-800">Can the patient perform alternating hand movements smoothly?</label>
        <p className="text-gray-600 text-sm">
          This evaluates coordination by checking if the patient can alternate hand movements easily.
        </p>
        <select name="AMOVS" value={formData.AMOVS || ""} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select</option>
          <option value="1">Yes, in one hand</option>
          <option value="2">Yes, in both hands</option>
          <option value="0">No</option>
        </select>
      </div>

      {/* Leg Agility */}
      <div className="space-y-2 mt-4">
        <label className="font-bold text-gray-800">Does the patient have difficulty moving or lifting their legs?</label>
        <p className="text-gray-600 text-sm">
          **Leg agility** assesses the ability to move both legs freely and with coordination.
        </p>
        <select name="LEGAGILITS" value={formData.LEGAGILITS || ""} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select</option>
          <option value="1">Yes, in one leg</option>
          <option value="2">Yes, in both legs</option>
          <option value="0">No</option>
        </select>
      </div>

      <div className="space-y-2">
  <label className="font-bold text-gray-800">
    Does the patient have slowness of fine motor movements on one or both sides?
  </label>
  <select 
    name="SLOWING" 
    value={formData.SLOWING || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
     <option value="">Select</option>
          <option value="1">Yes, in one leg</option>
          <option value="2">Yes, in both legs</option>
          <option value="0">No</option>
          <option value="-1">Unknown</option>
  </select>
</div>

             </div>
            )}
          </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
              Does the patient experience any focal deficits?               
              </label>
              <p className="text-gray-600 text-sm">
                Focal deficits refer to specific problems in the body that affect movement or sensation, typically pointing to a central nervous system disorder. These may include:
                <ul className="list-disc ml-4">
                  <li>Weakness or loss of strength in one part of the body</li>
                  <li>Loss of feeling (numbness) in certain areas</li>
                  <li>Difficulty controlling movements</li>
                  <li>Loss of coordination or balance</li>
                </ul>
                Please select the option that best describes the patient's condition:
              </p>
              <select name="FOCL_STATUS" value={formData.FOCL_STATUS || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient has no neurological deficits</option>
                <option value="1">Yes, the patient has symptoms but no significant movement or sensation loss</option>
                <option value="2">Yes, the patient has noticeable movement or sensation deficits</option>
                <option value="-1">Unknown</option>
              </select>
            </div>

          </div>          
        )}

        {/* Section 3: Current Health Status of the Dementia Patient */}
        {currentSection === 3 && (
          <div>
            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">Independence Level:</label>
              <select name="INDEPEND" value={formData.INDEPEND || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="1">Able to live independently</option>
                <option value="2">Requires some assistance with complex activities</option>
                <option value="3">Requires some assistance with basic activities</option>
                <option value="4">Completely dependent</option>
                <option value="9">Unknown</option>
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
                Has the patient had any appetite or eating problems in the past month?
              </label>
              <p className="text-gray-600 text-sm">
                Appetite changes can include:
                <ul className="list-disc ml-4">
                  <li>Eating much less or more than usual</li>
                  <li>Unintentional weight loss or gain</li>
                  <li>Not feeling hungry or forgetting to eat</li>
                  <li>Struggling to chew or swallow food</li>
                </ul>
              </p>
              <select name="APP" value={formData.APP || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient has no eating problems</option>
                <option value="1">Yes, the patient has mild appetite changes</option>
                <option value="2">Yes, the patient has moderate appetite issues</option>
                <option value="3">Yes, the patient has severe eating problems</option>
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
              <div className="mt-4 p-4 border rounded-md bg-gray-100">
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

            <select name="APNEA" value={formData.APNEA || ""} onChange={handleChange} className="border p-2 w-full" required>
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
            <select name="SLEEP_REM" value={formData.SLEEP_REM || ""} onChange={handleChange} className="border p-2 w-full" required>
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
        name="NITE" 
        value={formData.NITE || ""} 
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
                Has the patient stopped doing activities or lost interest in things they used to enjoy?
              </label>
  <p className="text-gray-600 text-sm">
    Losing interest in activities can mean:
    <ul className="list-disc ml-4">
      <li>No longer engaging in hobbies (reading, gardening, watching TV, etc.)</li>
      <li>Avoiding social gatherings or family interactions</li>
      <li>Spending most of the time inactive or uninterested in daily routines</li>
    </ul>
  </p>
  <select 
    name="DROPACT" 
    value={formData.DROPACT || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient is still engaged in activities</option>
    <option value="1">Yes, the patient has lost some interest in activities</option>
    <option value="2">Yes, the patient has stopped most activities</option>
    <option value="3">Yes, the patient has completely lost interest in all activities</option>
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

            <div className="space-y-2">
  <label className="font-bold text-gray-800">
    Has the patient experienced urinary incontinence (loss of bladder control)?
  </label>
  <p className="text-gray-600 text-sm">
    <b>Urinary incontinence</b> means the patient has trouble controlling their bladder, leading to accidental leakage.  
    This can include:
    <ul className="list-disc ml-4">
      <li>Leaking urine when coughing, sneezing, or laughing</li>
      <li>Sudden, strong urges to urinate but not making it in time</li>
      <li>Frequent nighttime urination</li>
    </ul>
    If unsure, please select <b>"Unknown"</b>.
  </p>
  <select 
    name="URINEINC" 
    value={formData.URINEINC || ""} 
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

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Has the patient experienced bowel incontinence (loss of bowel control)?
  </label>
  <p className="text-gray-600 text-sm">
    <b>Bowel incontinence</b> means the patient has difficulty controlling their bowel movements, leading to accidental leakage.  
    This can include:
    <ul className="list-disc ml-4">
      <li>Accidental leakage of stool</li>
      <li>Sudden urges to have a bowel movement but not making it in time</li>
      <li>Frequent episodes of diarrhea or constipation-related incontinence</li>
    </ul>
    If unsure, please select <b>"Unknown"</b>.
  </p>
  <select 
    name="BOWLINC" 
    value={formData.BOWLINC || ""} 
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

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Does the patient have difficulty walking or signs of a gait disorder?
  </label>
  <p className="text-gray-600 text-sm">
    Signs of a gait disorder include:
    <ul className="list-disc ml-4">
      <li>Shuffling or dragging feet</li>
      <li>Unsteady or imbalanced walking</li>
      <li>Taking smaller or slower steps</li>
    </ul>
  </p>
  <select 
    name="MOGAIT" 
    value={formData.MOGAIT || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No</option>
    <option value="1">Yes</option>
    <option value="9">Unknown</option>
  </select>
</div>

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Has the patient experienced falls recently?
  </label>
  <select 
    name="MOFALLS" 
    value={formData.MOFALLS || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
   <option value="">Select</option>
    <option value="0">No</option>
    <option value="1">Yes</option>
    <option value="9">Unknown</option>
  </select>
</div>

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Does the patient have tremors or shaking in their hands or body?
  </label>
  <select 
    name="MOTREM" 
    value={formData.MOTREM || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No</option>
    <option value="1">Yes</option>
    <option value="9">Unknown</option>
  </select>
</div>

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Has the patient been moving more slowly than usual?
  </label>
  <select 
    name="MOSLOW" 
    value={formData.MOSLOW || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No</option>
    <option value="1">Yes</option>
    <option value="9">Unknown</option>
  </select>
</div>

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Did the patient’s motor symptoms appear gradually or suddenly?
  </label>
  <select 
    name="MOMODE" 
    value={formData.MOMODE || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No motor symptoms</option>    
    <option value="1">Gradual</option>
    <option value="2">Subacute</option>
    <option value="3">Abrupt</option>
    <option value="4">Other</option>
    <option value="99">Unknown</option> 

  </select>
</div>

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Are the patient’s movement problems suggestive of Parkinsonism?
  </label>
  <select 
    name="MOMOPARK" 
    value={formData.MOMOPARK || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No</option>
    <option value="1">Yes</option>
    <option value="9">Unknown</option>
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
                <option value="0">No</option>
                <option value="1">Yes, Type I</option>
                <option value="2">Yes, Type II</option>
                <option value="3">Yes, other type</option>               
                <option value="-1">Not assessed or unknown</option>              
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800 block">Hypertension</label>
              <select name="HYPERTEN" value={formData.HYPERTEN} onChange={handleChange} required className="border p-2 rounded-md w-full">
                <option value="select">Select</option>
                <option value="0">Absent</option>
                <option value="1">Recent/Active</option>
                <option value="2">Remote/Inactive</option>
                <option value="-1">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800 block">Hypercholesterolemia</label>
              <select name="HYPERCHO" value={formData.HYPERCHO} onChange={handleChange} required className="border p-2 rounded-md w-full">
                <option value="select">Select</option>
                <option value="0">Absent</option>
                <option value="1">Recent/Active</option>
                <option value="2">Remote/Inactive</option>
                <option value="-1">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Has the patient been diagnosed with a thyroid disease?
              </label>
              <p className="text-gray-600 text-sm">
                <b>Thyroid disease</b> affects hormones that regulate energy, metabolism, and mood.  
                Common thyroid conditions include <b>hypothyroidism (underactive thyroid)</b> and <b>hyperthyroidism (overactive thyroid)</b>.
                Symptoms may include:
                <ul className="list-disc ml-4">
                  <li>Unexplained weight loss or weight gain</li>
                  <li>Fatigue or low energy</li>
                  <li>Feeling too cold or too hot</li>
                  <li>Changes in mood, anxiety, or depression</li>
                  <li>Swelling in the neck (thyroid enlargement)</li>
                </ul>
                If the patient has been diagnosed by a doctor, please select <b>"Yes"</b>.  
                If unsure, select <b>"Unknown"</b>.
              </p>
              <select name="THYDIS" value={formData.THYDIS || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient does not have thyroid disease</option>
                <option value="1">Yes, the patient has been diagnosed with thyroid disease</option>
                <option value="-1">Unknown</option>
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
              <select name="CVANGINA" value={formData.CVANGINA || ""} onChange={handleChange} className="border p-2 w-full" required>
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
              <select name="CVCHF" value={formData.CVCHF || ""} onChange={handleChange} className="border p-2 w-full"  required>
                <option value="">Select</option>
                <option value="0">Absent (No history of CHF)</option>
                <option value="1">Recent/Active (Currently diagnosed and experiencing symptoms)</option>
                <option value="2">Remote/Inactive (Had CHF in the past but no longer active)</option>
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
              A <b>cardiac arrest</b> is different from a heart attack—it is when the heart suddenly stops beating, requiring immediate emergency care.
              </p>
              <select name="CVHATT" value={formData.CVHATT || ""} onChange={handleChange} className="border p-2 w-full" required>
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
              <select name="CVOTHR" value={formData.CVOTHR || ""} onChange={handleChange} className="border p-2 w-full">
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
    A <b>TIA ("mini-stroke")</b> happens when blood flow to the brain is briefly blocked. Unlike a stroke, symptoms go away within a few minutes or hours.  
    Signs of a TIA may include:
    <ul className="list-disc ml-4">
      <li>Sudden weakness or numbness, especially on one side of the body</li>
      <li>Slurred speech or trouble understanding words</li>
      <li>Temporary vision problems</li>
      <li>Loss of balance or dizziness</li>
    </ul>
    Even though symptoms disappear, a <b>TIA is a warning sign of a future stroke</b> and should be taken seriously.
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
    A <b>Traumatic Brain Injury (TBI)</b> happens when the head is hit or shaken hard, which can affect memory, thinking, or behavior.  
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
              <select name="DEPRESSION" value={formData.DEPRESSION || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient does not show signs of depression</option>
                <option value="1">Yes, the patient has mild symptoms of depression</option>
                <option value="2">Yes, the patient has severe depression symptoms</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient seem anxious, nervous, or overly worried?
              </label>
              <p className="text-gray-600 text-sm">
                Anxiety can cause restlessness, excessive worry, or physical symptoms like a racing heartbeat.  
                Please select the best option:
              </p>
              <select name="BEANX" value={formData.BEANX || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient does not show signs of anxiety</option>
                <option value="1">Yes, the patient has mild anxiety</option>
                <option value="-1">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient believe things that are not true (delusions)?
              </label>
              <p className="text-gray-600 text-sm">
                Delusions are **false beliefs** that the patient strongly believes, even when they are not real.  
                Examples include:
                <ul className="list-disc ml-4">
                  <li>Believing someone is stealing from them when no one is</li>
                  <li>Thinking they are in danger when they are not</li>
                  <li>Believing they have special abilities or powers</li>
                 </ul>
              </p>
              <select name="BEDEL" value={formData.BEDEL || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient does not have delusions</option>
                <option value="1">Yes, the patient has mild delusions</option>
                <option value="-1">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient seem restless, agitated, or easily frustrated?
              </label>
              <p className="text-gray-600 text-sm">
                Agitation includes **restlessness, pacing, or getting upset easily.**  
                Please select the best option:
              </p>

              <select name="BEAGIT" value={formData.BEAGIT || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient does not show signs of agitation</option>
                <option value="1">Yes, the patient has mild agitation</option>
                <option value="-1">Unknown</option>
              </select>
           </div>

           <div className="space-y-2 mb-4">
            <label className="font-bold text-gray-800">
              Has the patient become more easily irritated or short-tempered?
            </label>
            <p className="text-gray-600 text-sm">
              Some patients may become more easily annoyed or upset than before. 
              Please select the best option:
            </p>
            <select name="BEIRRIT" value={formData.BEIRRIT || ""} onChange={handleChange} className="border p-2 w-full" required>
              <option value="">Select</option>
              <option value="0">No, the patient is not more irritable</option>
              <option value="1">Yes, the patient is somewhat more irritable</option>
              <option value="-1">Unknown</option>
             </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-800">
    Has the patient been acting impulsively or saying things without thinking?
  </label>
  <p className="text-gray-600 text-sm">
    **Disinhibition** means a person may act in ways that seem inappropriate or impulsive, such as:
    <ul className="list-disc ml-4">
      <li>Speaking or behaving in a way that is socially inappropriate</li>
      <li>Interrupting conversations or making rude comments</li>
      <li>Acting without considering the consequences</li>
      <li>Being unusually talkative or over-friendly with strangers</li>
    </ul>
  </p>
  <select 
    name="BEDISIN" 
    value={formData.BEDISIN || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient does not show disinhibition</option>
    <option value="1">Yes, the patient has mild disinhibition</option>
    <option value="-1">Unknown</option>
  </select>
</div>

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Has the patient been unusually happy, excited, or overly cheerful without reason?
  </label>
  <p className="text-gray-600 text-sm">
    **Elation** refers to an abnormal, excessive sense of happiness or excitement, such as:
    <ul className="list-disc ml-4">
      <li>Laughing or smiling excessively without an obvious reason</li>
      <li>Appearing overly energetic or "high-spirited" at inappropriate times</li>
      <li>Acting in a way that is unusually excited compared to their normal behavior</li>
    </ul>
  </p>
  <select 
    name="ELAT" 
    value={formData.ELAT || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient has normal emotional responses</option>
    <option value="1">Yes, the patient is slightly more elated than usual</option>
    <option value="-1">Unknown</option>
  </select>
</div>

<div className="space-y-2">
  <label className="font-bold text-gray-800">
    Has the patient lost motivation or interest in things, even when encouraged?
  </label>
  <p className="text-gray-600 text-sm">
    **Apathy** refers to a **lack of motivation, emotional response, or concern about things** that the patient used to care about.  
    This is different from depression—it means the patient **doesn’t feel interested or bothered by anything, even when others try to engage them.**  
    <br /><br />
    Signs of apathy include:
    <ul className="list-disc ml-4">
      <li>Lack of motivation to do daily tasks or Not responding when encouraged to do activities.</li>
      <li>Not wanting to participate in hobbies or social activities</li>
      <li>Appearing emotionally "flat" or uninterested in surroundings</li>
      <li>Not showing concern about personal care or hygiene</li>
      <li>Showing little to no emotion about good or bad events.</li>      
      <li>Feeling indifferent to social interactions, family, or personal well-being.</li>
    </ul>
  </p>
  <select 
    name="APATHY" 
    value={formData.APATHY || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" required
  >
    <option value="">Select</option>
    <option value="0">No, the patient is motivated and interested in activities</option>
    <option value="1">Yes, the patient has mild apathy</option>
    <option value="2">Yes, the patient has moderate apathy</option>
    <option value="3">Yes, the patient has severe apathy and shows no interest in activities</option>
  </select>
</div>






            <div className="space-y-2 mb-4">
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
                <option value="2">Remote/Inactive</option>
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
                  <option value="2">Remote/Inactive</option>
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
              <p className="text-gray-600 text-sm"> Personal care includes tasks like bathing, dressing, or brushing teeth.  
              If the patient has difficulty, please select the best option:
              </p>
              <select name="PERSCARE" value={formData.PERSCARE || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient can manage self-care independently</option>
                <option value="1">Yes, the patient needs some assistance</option>
                <option value="2">Yes, the patient is moderate dependent on others</option>
                <option value="3">Yes, the patient is severely dependent on others</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient prefer to stay at home rather than going out and doing new things?
              </label>
              <p className="text-gray-600 text-sm">
                Some patients may become less interested in leaving the house or engaging in activities outside their home.  
                This could include:
                <ul className="list-disc ml-4">
                  <li>Avoiding social gatherings or family events</li>
                  <li>Not wanting to go shopping, visit friends, or attend community activities</li>
                  <li>Feeling safer or more comfortable staying at home</li>
                </ul>
                Please select the option that best describes the patient's preference.
              </p>
              <select name="STAYHOME" value={formData.STAYHOME || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient enjoys going out and trying new things</option>
                <option value="1">Yes, the patient prefers to stay home but still goes out sometimes</option>
                <option value="2">Yes, the patient avoids going out and prefers staying home</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                In the past four weeks, has the patient had difficulty managing finances?
              </label>
              <p className="text-gray-600 text-sm">
                Managing finances includes tasks like:
                <ul className="list-disc ml-4">
                  <li>Writing checks or making payments</li>
                  <li>Paying bills on time</li>
                  <li>Balancing a checkbook or keeping track of money</li>
                  <li>Understanding banking or financial statements</li>
                </ul>
                <b>If the patient never handled finances before, avoids finances, or is now unable to manage them, please select "Not Interested / Never Did".</b>
              </p>

              <select name="BILLS" value={formData.BILLS || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient manages finances normally</option>
                <option value="1">Yes, the patient has some difficulty but can still do it alone</option>
                <option value="2">Yes, the patient requires assistance with finances</option>
                <option value="3">Yes, the patient is fully dependent on others for finances</option>
                <option value="8">The patient never managed finances or is no longer interested/able</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                In the past four weeks, has the patient had difficulty managing tax records or business affairs?
              </label>
              <p className="text-gray-600 text-sm">
                Managing tax records and business affairs includes tasks like:
                <ul className="list-disc ml-4">
                  <li>Gathering tax documents or financial records</li>
                  <li>Filing tax returns or understanding tax-related paperwork</li>
                  <li>Handling business affairs, investments, or legal documents</li>
                </ul>
                <b>If the patient never managed taxes before or is now unable to handle them, please select "Never Managed / No Longer Interested or Able".</b>
              </p>

              <select name="TAXES" value={formData.TAXES || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient manages tax records and business affairs normally</option>
                <option value="1">Yes, the patient has some difficulty but can still do it alone</option>
                <option value="2">Yes, the patient requires assistance with tax records or business affairs</option>
                <option value="3">Yes, the patient is fully dependent on others for taxes and business affairs</option>
                <option value="8">The patient never managed taxes or is no longer interested/able</option>
               </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                In the past four weeks, has the patient had difficulty using kitchen appliances (e.g., stove, kettle, coffee maker)?
              </label>
              <p className="text-gray-600 text-sm">
                This includes simple kitchen tasks like:
                <ul className="list-disc ml-4">
                  <li>Heating water or making a cup of coffee</li>
                  <li>Turning the stove on and off safely</li>
                  <li>Remembering to turn off appliances after use</li>
                </ul>
                <b>If the patient is no longer interested or able to use kitchen appliances, please select "No Longer Interested/Able".</b>
              </p>

              <select name="STOVE" value={formData.STOVE || ""}  onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient uses kitchen appliances normally</option>
    <option value="1">Yes, the patient has some difficulty but can still do it alone</option>
    <option value="2">Yes, the patient requires assistance with kitchen appliances</option>
    <option value="3">Yes, the patient is fully dependent on others for kitchen tasks</option>
    <option value="8">The patient is no longer interested/able to use kitchen appliances</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                In the past four weeks, has the patient had difficulty preparing meals?
              </label>
              <p className="text-gray-600 text-sm">
                Preparing a meal includes:
                <ul className="list-disc ml-4">
      <li>Planning and making a balanced meal</li>
      <li>Following a simple recipe</li>
      <li>Using kitchen tools and ingredients safely</li>
                </ul>
                <b>If the patient never cooked before or is now unable to prepare meals, please select "Never Did / No Longer Interested or Able".</b>
              </p>
              
              <select name="MEALPREP" value={formData.MEALPREP || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
    <option value="0">No, the patient prepares meals normally</option>
    <option value="1">Yes, the patient has some difficulty but can still do it alone</option>
    <option value="2">Yes, the patient requires assistance with meal preparation</option>
    <option value="3">Yes, the patient is fully dependent on others for meals</option>
    <option value="8">The patient never cooked or is no longer interested/able</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                In the past four weeks, has the patient had difficulty keeping track of current events?
              </label>
  <p className="text-gray-600 text-sm">
    This includes:
    <ul className="list-disc ml-4">
      <li>Following the news (TV, newspaper, online, or radio)</li>
      <li>Keeping up with local or world events</li>
      <li>Remembering major happenings in the community or country</li>
    </ul>
    **If the patient never followed current events or it was not noticed, select "Not Applicable".**
  </p>
  <select 
    name="EVENTS" 
    value={formData.EVENTS || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient keeps track of current events normally</option>
    <option value="1">Yes, the patient has some difficulty but still does it alone</option>
    <option value="2">Yes, the patient requires assistance to stay updated</option>
    <option value="3">Yes, the patient is fully dependent on others for information</option>
    <option value="8">Not Applicable (Never did / Not noticed)</option>
  </select>
            </div>

            <div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    In the past four weeks, has the patient had difficulty paying attention to and understanding a TV program, book, or magazine?
  </label>
  <p className="text-gray-600 text-sm">
    This includes:
    <ul className="list-disc ml-4">
      <li>Following a storyline in a book or TV show</li>
      <li>Understanding what they read or watch</li>
      <li>Maintaining focus without getting distracted</li>
    </ul>
    **If the patient never watched TV or read books, or this was not noticed, select "Not Applicable".**
  </p>
  <select 
    name="PAYATTN" 
    value={formData.PAYATTN || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="0">No, the patient pays attention normally</option>
    <option value="1">Yes, the patient has some difficulty but still follows along</option>
    <option value="2">Yes, the patient requires assistance to understand</option>
    <option value="3">Yes, the patient is fully dependent on others for explanations</option>
    <option value="8">Not Applicable (Never did / Not noticed)</option>
  </select>
            </div>

            <div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    In the past four weeks, has the patient had difficulty remembering important dates?
  </label>
  <p className="text-gray-600 text-sm">
    Important dates include:
    <ul className="list-disc ml-4">
      <li>Doctor’s appointments or medication schedules</li>
      <li>Family events, birthdays, or holidays</li>
      <li>Anniversaries or significant personal events</li>
    </ul>
    <b>If the patient never handled remembering dates, select "Not Applicable".</b>
  </p>
  <select 
    name="REMDATES" value={formData.REMDATES || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required>
    <option value="">Select</option>
    <option value="0">No, the patient remembers important dates normally</option>
    <option value="1">Yes, the patient has some difficulty but still remembers</option>
    <option value="2">Yes, the patient requires reminders or assistance</option>
    <option value="3">Yes, the patient is fully dependent on others for reminders</option>
    <option value="8">Not Applicable (Never did)</option>
  </select>
         </div>

         <div className="space-y-2 mb-4">
          <label className="font-bold text-gray-800">
            In the past four weeks, has the patient had difficulty traveling outside their neighborhood?
          </label>
          <p className="text-gray-600 text-sm">
            Traveling independently includes:
            <ul className="list-disc ml-4">
      <li>Driving safely</li>
      <li>Using public transportation (bus, train, taxi, etc.)</li>
      <li>Arranging for rides or navigating new places</li>
            </ul>
            <b>If the patient never traveled alone or this was not noticed, select "Not Applicable".</b>
          </p>

          <select name="TRAVEL" value={formData.TRAVEL || ""} onChange={handleChange} className="border p-2 w-full" required>
            <option value="">Select</option>
            <option value="0">No, the patient travels independently without difficulty</option>
    <option value="1">Yes, the patient has some difficulty but still manages alone</option>
    <option value="2">Yes, the patient requires assistance with travel</option>
    <option value="3">Yes, the patient is fully dependent on others for transportation</option>
    <option value="8">Not Applicable (Never did)</option>
            </select>
           </div>
           </div>
        )}   

        {currentSection === 8 && (  
          <div>
            <div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient shown noticeable memory problems compared to before?
  </label>
  <p className="text-gray-600 text-sm">
    Signs of memory problems include:
    <ul className="list-disc ml-4">
      <li>Forgetting recent conversations or events</li>
      <li>Repeating questions or stories frequently</li>
      <li>Struggling to recall familiar names or places</li>
    </ul>
  </p>
  <select 
    name="COGMEM" 
    value={formData.COGMEM || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" required>
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Does the patient have trouble knowing where they are or what time it is?
  </label>
  <p className="text-gray-600 text-sm">
    Signs of orientation problems include:
    <ul className="list-disc ml-4">
      <li>Getting lost in familiar places</li>
      <li>Not knowing the current date, year, or season</li>
      <li>Confusing day and night</li>
    </ul>
  </p>
  <select 
    name="COGORI" 
    value={formData.COGORI || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Does the patient have difficulty making decisions or solving problems?
  </label>
  <p className="text-gray-600 text-sm">
    Signs of judgment or problem-solving issues include:
    <ul className="list-disc ml-4">
      <li>Making poor financial or safety decisions</li>
      <li>Struggling to plan daily tasks (e.g., making a grocery list)</li>
      <li>Having trouble following multi-step instructions</li>
    </ul>
  </p>
  <select 
    name="COGJUDG" 
    value={formData.COGJUDG || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Has the patient developed difficulty speaking or understanding language?
  </label>
  <p className="text-gray-600 text-sm">
    Signs of language problems include:
    <ul className="list-disc ml-4">
      <li>Struggling to find the right words</li>
      <li>Difficulty following conversations</li>
      <li>Substituting incorrect words (e.g., saying "clock" instead of "phone")</li>
    </ul>
  </p>
  <select 
    name="COGLANG" 
    value={formData.COGLANG || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Does the patient have trouble recognizing objects or judging distances?
  </label>
  <p className="text-gray-600 text-sm">
    Signs of visuospatial issues include:
    <ul className="list-disc ml-4">
      <li>Difficulty recognizing faces or objects</li>
      <li>Struggling with depth perception (e.g., misjudging steps or curbs)</li>
      <li>Getting confused when reading maps or following directions</li>
    </ul>
  </p>
  <select 
    name="COGVIS" 
    value={formData.COGVIS || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Does the patient struggle to focus or pay attention?
  </label>
  <p className="text-gray-600 text-sm">
    Signs of attention problems include:
    <ul className="list-disc ml-4">
      <li>Getting easily distracted</li>
      <li>Struggling to stay engaged in a conversation</li>
      <li>Difficulty following a task from start to finish</li>
    </ul>
  </p>
  <select 
    name="COGATTN" 
    value={formData.COGATTN || ""} 
    onChange={handleChange} 
    className="border p-2 w-full" 
    required
  >
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Does the patient’s thinking ability fluctuate, with good and bad periods?
  </label>
  <p className="text-gray-600 text-sm">
    Signs of fluctuating cognition include:
    <ul className="list-disc ml-4">
      <li>Having clear, alert moments followed by periods of confusion</li>
      <li>Some days appearing completely normal, other days very forgetful</li>
      <li>Random periods of disorientation</li>
    </ul>
  </p>
  <select 
    name="COGFLUC" value={formData.COGFLUC || ""} onChange={handleChange} className="border p-2 w-full" required>
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
            </div>

            <div className="space-y-2 mb-4">
  <label className="font-bold text-gray-800">
    Does the patient have cognitive problems that don’t fit into the previous categories?
  </label>
  <select name="COGOTHR" value={formData.COGOTHR || ""} onChange={handleChange} className="border p-2 w-full" required>
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
             </div>




            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">Has the patient's memory or thinking ability declined suddenly?</label>
              <select name="ABRUPT" value={formData.ABRUPT || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the decline has been slow and gradual</option>
                <option value="1">Yes, the decline happened suddenly</option>
                <option value="-4">Unknown</option>  
               </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">How would you describe the patient’s cognitive decline pattern?</label>
              <select name="COURSE" value={formData.COURSE || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="1">Gradual Decline</option>
                <option value="3">Static (No Change)</option>
                <option value="4">Fluctuating Symptoms</option>
                <option value="2">Stepwise Decline</option>
                <option value="5">Improved Condition</option>
                <option value="-4">Unknown</option>  
               </select>
            </div>

    {formData.ABRUPT && formData.COURSE && (
      <div className="p-4 bg-gray-100 rounded-md mt-4">
        <h3 className="font-bold text-gray-800">Cognitive Decline Pattern</h3>
        <p>The patient's cognitive decline pattern is categorized as:</p>        
        <p><i>{calculateCOGDP().interpretation}</i></p>
      </div>
    )}
    
              <div className="space-y-2 mt-4">
                <label className="font-bold text-gray-800">Enter the patient's cognitive test score:</label>
                <input type="number" name="NACCMMSE" value={formData.NACCMMSE || ""} onChange={handleChange} className="border p-2 rounded-md w-full" required />
              </div>
    
   
  </div>
)}

  

        {/* Section 8: Assessment Results */}
        {currentSection === 9 && (
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
                <button type="button" onClick={handleNextSection} className="bg-blue-500 text-white py-2 px-4 rounded-md">
                  Next
                </button>
              )}
            </div>
          ) : (
            // For all other sections, show both "Previous" and "Next" buttons on the same line
            <div className="flex justify-between">
              {currentSection > 1 && !submitted && (
                <button type="button" onClick={handlePreviousSection} className="bg-gray-500 text-white py-2 px-4 rounded-md">
                  Previous
                </button>
              )}
              {currentSection < sections.length && (
                <button type="button" onClick={handleNextSection} className="bg-blue-500 text-white py-2 px-4 rounded-md">
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

     