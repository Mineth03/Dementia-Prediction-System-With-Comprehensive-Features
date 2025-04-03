import React, { useState, useEffect, useRef } from 'react';
import { TiWarning } from "react-icons/ti";
import { AiOutlineQuestionCircle, AiOutlineClose } from "react-icons/ai";

const DementiaRiskForm = () => {
  const [formData, setFormData] = useState({});
  const [riskLevel, setRiskLevel] = useState(null);
  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null); // Add this line to create the form reference
  const [submitted, setSubmitted] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false); // to track form validity
  
  const resetForm = () => {
    setFormData({});
  };

    // Modified handleChange to clear errors when field is filled
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      
      // Clear error for this field if it's being filled
      if (value && errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    };

  
   // Automatically check required fields for each section
   const requiredFieldsBySection = {
    1: ["NACCAGE", "SEX", "NACCLIVS"], // Personal Information
    2: ["DEM_TYPE","HRATE"], // Current Health Status
    3: ["SMOKING", "ALCFREQ", "APP", "HAS_SLEEP_PROBLEMS"], // Lifestyle
    4: ["SPEECH"], // Behavioral Changes
    5: ["DIABET", "HYPERTEN", "HYPERCHO"], // Health Conditions
    6: ["DEPRESSION"], // Mental Health
    7: ["TRAVEL"], // Functional Activities
    8: ["NACCMOCA"], // Cognitive Function
  };


  const validateForm = (showErrors = false) => {
    let newErrors = {};
    let isValid = true;
  
    // Custom error messages for specific fields
    if (!formData.NACCAGE || formData.NACCAGE <= 0) {
      newErrors.NACCAGE = "Age is required and must be greater than 0.";
      isValid = false;
    }
  
    if (!formData.SEX || formData.SEX === "select") {
      newErrors.SEX = "Please select patient's sex.";
      isValid = false;
    }
  
    if (!formData.NACCLIVS) {
      newErrors.NACCLIVS = "Please select patient's current living situation.";
      isValid = false;
    }
  
    // Default validation for other required fields
    const requiredFields = requiredFieldsBySection[currentSection] || [];
    requiredFields.forEach((field) => {
      // Skip fields that already have custom errors
      if (newErrors[field]) return;
      
      if (!formData[field] || formData[field] === "select") {
        newErrors[field] = "This field is required.";
        isValid = false;
      }
    });
  
    if (showErrors) {
      setErrors(newErrors);
    }
    
    return isValid;
  };

  
 // Update the useEffect for auto-validation
 useEffect(() => {
  setIsFormValid(validateForm(false)); // Silent validation
}, [formData, currentSection]);

// Update handleNextSection
const handleNextSection = () => {
  const isValid = validateForm(true); // Always show errors on click
  
  if (isValid) {
    setCurrentSection(prev => {
      const next = prev + 1;
      return next <= 10 ? next : prev;
    });
  }
};


const getInputClassName = (fieldName) => {
  return `w-full p-2 border ${errors[fieldName] ? "border-red-500" : "border-gray-300"} rounded`;
};  

// Button style - always blue with proper cursor states
const buttonStyle = {
  backgroundColor: isFormValid ? 'darkblue' : 'black',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  transition: 'background-color 0.3s', 
  // Add pointer-events to ensure clicks work even when disabled
  pointerEvents: 'auto' // This ensures click handler always fires
};


  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const openPopup = (details) => {
    setPopupContent(details);
  };

  const closePopup = () => {
    setPopupContent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Define the exact features expected by the model
    const expectedFeatures = [
      "NACCAGE", "SEX", "NACCLIVS", "DEM_TYPE", "NACCBMI", "BPSYS", "BPDIAS", "HRATE", "VB12DEF",
      "VISIMP", "HEARING", "MOT", "RIGIDITY", "HANDMOVS", "FTAPS", "AMOVS", "LEGAGILITS", "SLOWING",
      "FOCL_STATUS", "INDEPEND", "SMOKING", "ALCFREQ", "APP", "HAS_SLEEP_PROBLEMS", "APNEA", "REMDIS",
      "NITE", "SPEECH", "FACEXP", "URINEINC", "BOWLINC", "MOGAIT", "MOFALLS", "MOTREM","MOSLOW",
       "MOMODE", "MOMOPARK", "INSOMN", "DIABET", "HYPERTEN", "HYPERCHO", "THYDIS", "CVANGINA",
      "CVCHF", "CVHATT", "CVAFIB", "CVOTHR", "TIA", "STROKE", "TBI", "TBI_LOC", "SEIZURES", "DEPRESSION",
      "BEANX", "BEDEL", "BEAGIT", "BEIRRIT", "BEDISIN", "APATHY", "ELAT", "EMOT", "BIPOLAR", "SCHIZ",
      "PSYCDIS", "ARISING", "POSTURE", "GAITDRISK", "POSSTAB", "BRADYKIN", "NACCBEHF", "BEPERCH",
      "COMPORT", "AFRAID", "PERSCARE", "STAYHOME", "BILLS", "TAXES", "STOVE", "MEALPREP", "EVENTS",
      "PAYATTN", "REMDATES", "TRAVEL", "COGMEM", "COGORI", "COGJUDG", "COGLANG", "COGVIS", "COGATTN",
      "COGFLUC", "COGOTHR", "ABRUPT", "NACCMOCA", "NACCADMD",	"NACCADEP",	"NACCAANX", "NACCAPSY", "NACCDBMD", "NACCLIPL",
      "NACCDIUR", "NACCPDMD", "NACCVASD", "NACCBETA" , "NACCAC" , "NACCAAAS", "NACCACEI", "NACCANGI", "NACCCCBS"

  ];

  // Features that need to be set to -1
   const featuresToSetNegative = [
  "VB12DEF", "VISIMP", "HEARING", "MOT", "RIGIDITY", "HANDMOVS", "FTAPS", "AMOVS", "LEGAGILITS", "SLOWING",
  "FOCL_STATUS","NACCADMD",	"NACCADEP",	"NACCAANX", "NACCAPSY", "NACCDBMD", "NACCLIPL","NACCDIUR",
  "NACCPDMD", "NACCVASD", "NACCBETA" , "NACCAC" , "NACCAAAS", "NACCACEI", "NACCANGI", "NACCCCBS" 
];

const cleanedFormData = Object.fromEntries(
  expectedFeatures.map((feature) => {
    if (featuresToSetNegative.includes(feature)) {
      return [feature, -1]; // Set these specific features to -1
    } else {
      return [feature, formData[feature] || "0"]; // Assign 0 if missing
    }
  })
);

console.log("Sending cleaned data:", cleanedFormData);

try {
  const response = await fetch("http://127.0.0.1:5001//predict_sev", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedFormData),
  });

  const data = await response.json();

  if (data.risk_level !== undefined) {
      // Convert numerical risk levels to text labels
      const riskLabels = ["Low", "Moderate", "High"];
      setRiskLevel(riskLabels[data.risk_level]);
      setSubmitted(true); 
  } else {
      console.error("Error in response:", data);
  }
} catch (error) {
  console.error("Error submitting form:", error);
}
};

const RequiredLabel = ({ text }) => (
  <label className="font-bold text-gray-800">
    {text} <span className="text-red-500">*</span>
  </label>
);


  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const heightMeters = height / 100;
      const bmiValue = (weight / (heightMeters * heightMeters)).toFixed(1);
      setFormData((prev) => ({ ...prev, NACCBMI: bmiValue }));
    } else {
      setFormData((prev) => ({ ...prev, NACCBMI: '' }));
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

  const medicationQuestions = [   
     {      
      question: "Is the person currently taking any medication for managing cognitive symptoms of dementia?",
      details: `  
        There are certain medications that help manage cognitive symptoms of dementia. Please indicate whether the person is currently taking any of the following medications:  

        🔷 **Cholinesterase Inhibitors** *(Used for Alzheimer’s, Dementia with Lewy Bodies, Parkinson’s Disease Dementia, and Mixed Dementia)*  
          ⭕ **Donepezil (Aricept®)** – The most commonly prescribed dementia medication.  
          ⭕ **Rivastigmine (Exelon®)** – Usually given when donepezil causes side effects or isn’t suitable for medical reasons.  
          ⭕ **Galantamine (Razadyne®)** – Rarely prescribed. While it can treat Alzheimer’s symptoms, doctors usually prefer donepezil or rivastigmine first. It is also unclear whether galantamine helps with dementia with Lewy bodies or Parkinson’s disease dementia.  

          🧠 A healthy brain relies on **acetylcholine**, a chemical that helps nerve cells communicate.  
          - In **Alzheimer’s disease and dementia with Lewy bodies**, acetylcholine levels decline, making it harder for nerve cells to communicate.  
          - **Cholinesterase inhibitors** work by boosting acetylcholine levels, helping lessen or stabilize symptoms for a limited time
          - However, as dementia progresses and more brain cells are damaged, **the effectiveness of these medications declines**. Eventually, the symptoms will worsen again.  

          ⚠️ **Possible Side Effects:** Nausea, diarrhea, vomiting, stomach upset, loss of appetite, weight loss, low heart rate, tiredness, vivid dreams, or muscle cramps.  

        🔷 **Memantine (Namenda®)**  
          - Unlike cholinesterase inhibitors, **memantine works by regulating glutamate**, a chemical that can become excessive in Alzheimer’s, damaging nerve cells.  
          - Memantine helps protect nerve cells and supports cognitive function in **moderate to severe Alzheimer’s disease and Dementia with Lewy Bodies**.  
          - It may improve **confusion, daily functioning (e.g., dressing), and behavioral symptoms like aggression or delusions**.  
          - **Doctors often combine memantine with a cholinesterase inhibitor** because the two drugs work in different ways and may complement each other. This combination may be more beneficial in late-stage Alzheimer’s than using a cholinesterase inhibitor alone.  

          ⚠️ **Possible Side Effects:** Headache, dizziness, confusion, constipation.  

      While none of these drugs are approved for use in mild cognitive impairment (MCI), some clinicians may prescribe them.    
      `,
      name: "NACCADMD"
    } ,
    {
      question: "Is the person currently taking any medication to help with mood or depression?",
      details: (
        <>
          <p>There are certain medications that help manage <strong>depression and mood disturbances</strong> in individuals with dementia. Please indicate whether the person is currently taking any of the following medications:</p>
          
          <br />
          <strong>🔷 Selective Serotonin Reuptake Inhibitors (SSRIs) – Most Commonly Prescribed</strong>
          <p>SSRIs are the first-choice medications for treating depression and mood symptoms in people with dementia. They may help <strong>reduce aggression, improve impulse control, enhance mood, and reduce apathy</strong>.</p>
          
          <ul>
            <li>⭕ <strong>Citalopram (Celexa®)</strong></li>
            <li>⭕ <strong>Escitalopram (Lexapro®)</strong></li>
            <li>⭕ <strong>Fluoxetine (Prozac®)</strong> – Less commonly used due to <strong>many drug interactions</strong> and staying in the body for a long time.</li>
            <li>⭕ <strong>Sertraline (Zoloft®)</strong></li>
          </ul>

          <br />
          <strong>🔷 Other Antidepressants (Not SSRIs) That May Be Useful</strong>
          <p>These medications work differently from SSRIs but may still be beneficial for some individuals:</p>
          
          <ul>
            <li>⭕ <strong>Bupropion (Wellbutrin®)</strong></li>
            <li>⭕ <strong>Duloxetine (Cymbalta®)</strong></li>
            <li>⭕ <strong>Mirtazapine (Remeron®)</strong> – Sometimes used for <strong>appetite stimulation and sleep disturbances</strong>.</li>
            <li>⭕ <strong>Trazodone (Desyrel®)</strong> – Commonly used to <strong>help with sleep and agitation</strong>.</li>
            <li>⭕ <strong>Venlafaxine (Effexor®)</strong></li>
          </ul>

          <br />
          <strong>🔴 Common Antidepressants to Avoid in Dementia</strong>
          <p>Some antidepressants can <strong>worsen cognitive symptoms</strong> by affecting brain chemicals involved in memory and thinking. These medications should be avoided in people with dementia:</p>
          
          <ul>
            <li>❌ <strong>Paroxetine (Paxil®)</strong></li>
            <li>❌ <strong>Amitriptyline (Elavil®)</strong></li>
            <li>❌ <strong>Nortriptyline (Pamelor®, Aventyl®)</strong></li>
            <li>❌ <strong>Desipramine (Norpramin®)</strong></li>
            <li>❌ <strong>Imipramine (Tofranil®)</strong></li>
          </ul>

          <br />
          <strong>⚠️ Why Should These Be Avoided?</strong>
          <p>- These medications have <strong>anticholinergic properties</strong>, which can <strong>worsen memory, thinking, and counteract dementia medications</strong>.</p>
          <p>- Can cause <strong>confusion, constipation, dry mouth, blurred vision, dizziness, and increase the risk of falls</strong>.</p>

          <br />
          <strong>🔷 Safer Medications to Consider</strong>
          <p>- The <strong>SSRIs and other antidepressants listed above</strong> are generally considered safer.</p>
          <p>- Finding the right medication may require <strong>adjusting the dose</strong> or trying <strong>different antidepressants or combinations</strong> to achieve the best results.</p>
        </>
      ),
      name: "NACCADEP"
    },
    {
      question: "Is the person currently taking any medication to help with anxiety?",
      details: (
        <>
          <p>There are certain medications that help manage <strong>anxiety</strong> in individuals with dementia. Please indicate whether the person is currently taking any of the following medications:</p>
          
          <br />
          <strong>🔷 Common Benzodiazepines (To Avoid in Older Adults)</strong>
          <p>Benzodiazepines are often used to treat anxiety, but in older adults, they can cause confusion, sedation, and increase the risk of falls. It is essential to use these medications cautiously or avoid them:</p>
          
          <ul>
            <li>⭕ <strong>Diazepam (Valium®)</strong></li>
            <li>⭕ <strong>Lorazepam (Ativan®)</strong></li>
            <li>⭕ <strong>Alprazolam (Xanax®)</strong></li>
            <li>⭕ <strong>Clonazepam (Klonopin®)</strong></li>
            <li>⭕ <strong>Temazepam (Restoril®)</strong></li>
            <li>⭕ <strong>Chlordiazepoxide (Librium®)</strong></li>
          </ul>
  
          <br />
          <strong>🔴 Anticholinergic Medications to Avoid</strong>
          <p>Some medications with anticholinergic properties, such as those used for anxiety, can worsen cognitive symptoms in people with dementia. These medications should be avoided:</p>
          
          <ul>
            <li>❌ <strong>Hydroxyzine (Atarax®)</strong></li>
          </ul>
  
          <br />
          <strong>⚠️ Why Should These Be Avoided?</strong>
          <p>- These medications can cause <strong>confusion, excessive sedation, dizziness, and increase the risk of falls</strong>.</p>
          <p>- It takes a long time for the body to clear these drugs, leading to lingering effects into the next day or accumulation over time.</p>
          <p>- Combining these drugs with alcohol or other sedating medications can significantly increase the risk of excessive sedation, drowsiness, and dizziness.</p>
  
          <br />
          <strong>🔷 Safer Medications to Consider</strong>
          <p>There are alternative medications that can help manage anxiety with fewer side effects:</p>
          
          <ul>
            <li>⭕ <strong>Citalopram (Celexa®)</strong></li>
            <li>⭕ <strong>Escitalopram (Lexapro®)</strong></li>
            <li>⭕ <strong>Venlafaxine (Effexor®)</strong></li>
            <li>⭕ <strong>Mirtazapine (Remeron®)</strong></li>
            <li>⭕ <strong>Buspirone (Buspar®)</strong></li>
          </ul>
  
          <br />
          <p>These antidepressants are typically considered safer and can help manage both <strong>anxiety</strong> and <strong>depression</strong> symptoms effectively. As with any medication, finding the right treatment may require adjustments to the dosage or trying different options.</p>
        </>
      ),
      name: "NACCAANX"
    },
    {
      question: "Is the person currently taking any medication to manage hallucinations, delusions, severe agitation, or aggression?",
      details: (
        <>
          <p>There are certain medications that help manage <strong>hallucinations, delusions, severe agitation, and aggression</strong> in individuals with dementia.</p> 
          <br />
          <p>These medications block the effects of dopamine, a chemical messenger in your brain that can increase hallucinations and delusions and alter rational thought. However, the potential benefits of these medications must be weighed against the risks, which may include cognitive and movement problems, weight gain, and even increased risk of death:</p>
          
          <br />
          <strong>🔷 Common Antipsychotic Medications (To Avoid in Dementia)</strong>
          <p>Typical or first-generation antipsychotics are often used to treat severe agitation and aggression but come with significant risks in dementia patients:</p>
          
          <ul>
            <li>❌ <strong>Haloperidol (Haldol®)</strong></li>
            <li>❌ <strong>Chlorpromazine (Thorazine®)</strong></li>
            <li>❌ <strong>Thioridazine (Mellaril®)</strong></li>
            <li>❌ <strong>Perphenazine (Trilafon®)</strong></li>
          </ul>
  
          <br />
          <strong>⚠️ Why Should These Be Avoided?</strong>
          <p>- These medications can worsen <strong>memory, thinking, and movement</strong> and increase the risk of <strong>falls, stroke, and death</strong>.</p>
  
          <br />
          <strong>🔷 Safer Medications to Consider</strong>
          <p>For managing <strong>hallucinations, delusions, agitation, and aggression</strong>, there are safer medications to consider:</p>
          
          <ul>
            <li>⭕ <strong>Memory medications</strong> (e.g., Donepezil, Rivastigmine) and <strong>antidepressants</strong> (e.g., Citalopram, Escitalopram) can help with agitation and hallucinations and are typically first-line treatments.</li>
            <li>⭕ <strong>Atypical or second-generation antipsychotics</strong> may be used when first-line treatments are ineffective. While they carry similar risks to typical antipsychotics, they are safer alternatives with less frequent side effects:</li>
            <ul>
              <li>⭕ <strong>Quetiapine (Seroquel®)</strong></li>
              <li>⭕ <strong>Risperidone (Risperdal®)</strong></li>
              <li>⭕ <strong>Aripiprazole (Abilify®)</strong></li>
              <li>⭕ <strong>Olanzapine (Zyprexa®)</strong></li>
              <li>⭕ <strong>Clozapine (Clozaril®)</strong></li>
            </ul>
          </ul>
  
          <br />
          <p>These atypical antipsychotics should still be used at the lowest effective dose for the shortest duration to minimize adverse effects, such as weight gain, movement problems, and cardiovascular issues.</p>
        </>
      ),
      name: "NACCAPSY"
    },      
    {
      question: "Is the person currently taking any medication for diabetes?",
      details: "(e.g., Insulin, Metformin, or other diabetes pills)",
      name: "NACCDBMD"
    },
    {
      question: "Is the person currently taking any medication to lower cholesterol or fats in the blood?",
      details: "(e.g., Statins like Atorvastatin, Simvastatin)",
      name: "NACCLIPL"
    },
    {
      question: "Is the person currently taking any diuretic medication",
      details: "(e.g., diuretic medication)",
      name: "NACCDIUR"
    },
    {
      question: "Is the person currently taking any medication to help with Parkinson’s disease symptoms?",
      details: "(e.g., Levodopa, Carbidopa, Ropinirole)",
      name: "NACCPDMD"
    },
    {
      question: "Is the person currently taking any medication to improve blood flow or circulation?",
      details: "(e.g., Vasodilators like Nitroglycerin)",
      name: "NACCVASD"
    },
    {
      question: "Is the person currently taking any beta-blocker medications, including both cardioselective and non-cardioselective beta-blockers?",
      details: (
        <>
          <p>There are certain medications called <strong>beta blockers</strong> that primarily work by slowing down the heart. They do this by blocking the action of hormones like adrenaline. Beta blockers are <strong>prescription-only medicines</strong>.</p>
  
          <br />
          <strong>🔷 Commonly Used Beta Blockers</strong>
          <p>Some commonly prescribed beta blockers include:</p>
  
          <ul>
            <li>⭕ <strong>Atenolol</strong> (also called Tenormin)</li>
            <li>⭕ <strong>Bisoprolol</strong> (also called Cardicor or Emcor)</li>
            <li>⭕ <strong>Carvedilol</strong></li>
            <li>⭕ <strong>Labetalol</strong> (also called Trandate)</li>
            <li>⭕ <strong>Metoprolol</strong> (also called Betaloc or Lopresor)</li>
            <li>⭕ <strong>Propranolol</strong> (also called Inderal or Angilol)</li>
            <li>⭕ <strong>Sotalol</strong></li>
          </ul>
  
          <br />
          <strong>🔷 Uses for Beta Blockers</strong>
          <p>Beta blockers may be used to treat:</p>
  
          <ul>
            <li>⭕ <strong>Angina</strong> – chest pain caused by narrowing of the arteries supplying the heart</li>
            <li>⭕ <strong>Heart failure</strong> – failure of the heart to pump enough blood around the body</li>
            <li>⭕ <strong>Atrial fibrillation</strong> – irregular heartbeat</li>
            <li>⭕ <strong>Heart attack</strong> – when blood supply to the heart is suddenly blocked</li>
            <li>⭕ <strong>High blood pressure</strong> – often used when other medicines have not worked</li>
          </ul>
  
          <p>Less commonly, beta blockers are used to prevent migraines or treat conditions such as:</p>
  
          <ul>
            <li>⭕ <strong>Overactive thyroid (hyperthyroidism)</strong></li>
            <li>⭕ <strong>Anxiety</strong></li>
            <li>⭕ <strong>Tremor</strong></li>
            <li>⭕ <strong>Glaucoma</strong> – used as eye drops</li>
          </ul>
  
          <br />
          <strong>🔷 Cautions with Other Medicines</strong>
          <p>Beta blockers may interact with other medications. Inform your doctor if you're taking:</p>
  
          <ul>
            <li>⭕ Other medicines for <strong>high blood pressure</strong> – may lower blood pressure too much, causing dizziness or fainting</li>
            <li>⭕ Other medicines for an <strong>irregular heartbeat</strong> (e.g., amiodarone, flecainide)</li>
            <li>⭕ Medicines that can <strong>lower blood pressure</strong> (e.g., antidepressants, nitrates for chest pain, baclofen, tamsulosin for enlarged prostate, Parkinson’s disease medicines like levodopa)</li>
            <li>⭕ Medicines for <strong>asthma or COPD</strong> – some beta blockers can worsen breathing problems</li>
            <li>⭕ Medicines for <strong>diabetes</strong>, particularly insulin – beta blockers may mask symptoms of low blood sugar</li>
            <li>⭕ Medicines for <strong>nose or sinus congestion</strong>, cold remedies, and allergy medications</li>
            <li>⭕ <strong>Non-steroidal anti-inflammatory drugs (NSAIDs)</strong>, such as ibuprofen – may increase blood pressure</li>
          </ul>
  
          <br />
          <strong>⚠️ Side Effects of Beta Blockers</strong>
          <p>Most people taking beta blockers experience mild side effects that improve over time. Contact your doctor if symptoms persist.</p>
  
          <ul>
            <li>⭕ Feeling <strong>tired, dizzy, or lightheaded</strong> (signs of a slow heart rate)</li>
            <li>⭕ <strong>Cold fingers or toes</strong> – beta blockers may affect blood supply</li>
            <li>⭕ <strong>Difficulties sleeping or nightmares</strong></li>
            <li>⭕ <strong>Difficulty getting an erection</strong> or other sexual difficulties</li>
            <li>⭕ <strong>Feeling sick</strong></li>
          </ul>
  
          <p>Less common but serious side effects include:</p>
  
          <ul>
            <li>⭕ <strong>Depression</strong></li>
            <li>⭕ <strong>Shortness of breath</strong></li>
            <li>⭕ <strong>Trouble sleeping</strong></li>
          </ul>
  
          <p>Beta blockers, especially those that affect both the heart and blood vessels, are generally <strong>not recommended for people with asthma</strong> due to the risk of severe asthma attacks.</p>
  
          <p>If you have <strong>diabetes</strong>, beta blockers may mask signs of low blood sugar, such as a rapid heartbeat, so it’s important to monitor blood sugar levels regularly.</p>
  
          <p>Some beta blockers may also affect cholesterol and triglyceride levels, causing a temporary rise in triglycerides and a slight decrease in good cholesterol (HDL).</p>
  
          <br />
          <strong>⚠️ Do Not Stop Beta Blockers Suddenly</strong>
          <p>Stopping beta blockers abruptly may increase the risk of a heart attack or other heart problems. Always consult your doctor before making changes to your medication.</p>
        </>
      ),
      name: "NACCBETA"
    },
    {
      question: "Is the person currently taking any anti-clotting or blood-thinning medications?",
    details: (
      <>
        <p>There are certain medications that help prevent <strong>blood clots</strong> and reduce the risk of serious conditions such as strokes and heart attacks.</p> 
        <br />
        <p>These medications are called <strong>anticoagulants</strong> and are commonly prescribed to people at high risk of developing blood clots. They work by interrupting the process involved in the formation of clots, although they do not make the blood "thinner" in a literal sense. Anticoagulants are often referred to as <strong>"blood-thinning" medications</strong>.</p>
        
        <br />
        <strong>🔷 Types of Anticoagulants</strong>
        <p>Some commonly prescribed anticoagulants include:</p>
        
        <ul>
          <li>⭕ <strong>Warfarin</strong></li>
          <li>⭕ <strong>Direct Oral Anticoagulants (DOACs)</strong>:</li>
          <ul>
            <li>⭕ <strong>Rivaroxaban</strong></li>
            <li>⭕ <strong>Dabigatran</strong></li>
            <li>⭕ <strong>Apixaban</strong></li>
            <li>⭕ <strong>Edoxaban</strong></li>
          </ul>
          <li>⭕ <strong>Heparin (Injection)</strong></li>
        </ul>

        <br />
        <strong>🔷 When Are Anticoagulants Used?</strong>
        <p>Anticoagulants are used to prevent serious problems such as:</p>
        
        <ul>
          <li>⭕ <strong>Strokes or Transient Ischaemic Attacks (Mini-Strokes)</strong></li>
          <li>⭕ <strong>Heart Attacks</strong></li>
          <li>⭕ <strong>Deep Vein Thrombosis (DVT)</strong></li>
          <li>⭕ <strong>Pulmonary Embolism</strong></li>
        </ul>
        <p>They may be prescribed if you have a history of blood clots, conditions like <strong>atrial fibrillation</strong>, or if you’ve recently undergone surgery and are at risk of developing a clot during recovery.</p>
        
        <br />
        <strong>🔷 Other Anti-Clotting or Blood-Thinning Medications</strong>
        <p>In addition to the commonly used anticoagulants, there are several other medications that are used to manage blood clotting, including:</p>
        
        <ul>
          <li>⭕ <strong>Heparin-related medications</strong>: Enoxaparin, Dalteparin, Danaparoid, Ardeparin, Tinzaparin, Heparin Flush</li>
          <li>⭕ <strong>Other blood thinners</strong>: Aspirin, Dipyridamole, Ticlopidine, Clopidogrel, Cilostazol, Prasugrel, Ticagrelor, etc.</li>
          <li>⭕ <strong>Other anticoagulants</strong>: Anisindione, Dicumarol, Lepirudin, Argatroban, Bivalirudin, Desirudin, Fondaparinux</li>
        </ul>

        <br />
        <strong>⚠️ Side Effects of Anticoagulants</strong>
        <p>Like all medications, anticoagulants can cause side effects. The most common side effect is <strong>excessive bleeding</strong>, which can manifest as:</p>
        
        <ul>
          <li>⭕ Passing blood in urine</li>
          <li>⭕ Passing blood when pooing or having black stool</li>
          <li>⭕ Severe bruising</li>
          <li>⭕ Prolonged nosebleeds</li>
          <li>⭕ Bleeding gums</li>
          <li>⭕ Vomiting blood or coughing up blood</li>
          <li>⭕ Heavy periods in women</li>
        </ul>
        
        <p>Despite the risk of bleeding, for most people, the benefits of taking anticoagulants outweigh the risks.</p>
      </>
    ),
      name: "NACCAC"
    },
    {
      question: "Is the person currently taking any antiadrenergic agents, including both peripherally and centrally acting antiadrenergic agents?",
      details: (
        <>
          <p>Antiadrenergic agents work by <strong>reducing the stimulation of the sympathetic nervous system</strong>, which helps to lower blood pressure. They act by inhibiting the release and action of catecholamines such as <strong>epinephrine, norepinephrine, and dopamine</strong>, which are released in response to stress.</p>
  
          <br />
          <strong>🔷 How Centrally Acting Antiadrenergic Agents Work</strong>
          <p>These agents specifically <strong>block alpha-adrenergic receptors in the central nervous system</strong>, leading to:</p>
  
          <ul>
            <li>⭕ Reduced stimulation of the heart and blood vessels</li>
            <li>⭕ A slower and less forceful heartbeat</li>
            <li>⭕ Relaxation of blood vessels</li>
            <li>⭕ Overall <strong>decrease in blood pressure</strong></li>
          </ul>
  
          <p>Centrally acting antiadrenergic agents are primarily used to <strong>treat hypertension</strong> (high blood pressure).</p>
  
          <br />
          <strong>🔷 Common Antiadrenergic Agents</strong>
          <p>Some commonly used antiadrenergic agents include:</p>
  
          <ul>
            <li>⭕ <strong>Guanethidine</strong></li>
            <li>⭕ <strong>Prazosin</strong></li>
            <li>⭕ <strong>Reserpine</strong></li>
            <li>⭕ <strong>Terazosin</strong></li>
            <li>⭕ <strong>Guanadrel</strong></li>
            <li>⭕ <strong>Doxazosin</strong></li>
            <li>⭕ <strong>Mecamylamine</strong></li>
            <li>⭕ <strong>Rauwolfia serpentina</strong></li>
            <li>⭕ <strong>Deserpidine</strong></li>
            <li>⭕ <strong>Tamsulosin</strong></li>
            <li>⭕ <strong>Alfuzosin</strong></li>
            <li>⭕ <strong>Silodosin</strong></li>
            <li>⭕ <strong>Dutasteride-tamsulosin</strong></li>
            <li>⭕ <strong>Clonidine</strong></li>
            <li>⭕ <strong>Guanabenz</strong></li>
            <li>⭕ <strong>Methyldopa</strong></li>
            <li>⭕ <strong>Guanfacine</strong></li>
          </ul>
  
          <br />
          <strong>⚠️ Side Effects of Antiadrenergic Agents</strong>
          <p>Some individuals may experience side effects while taking these medications, including:</p>
  
          <ul>
            <li>⭕ <strong>Dizziness or lightheadedness</strong> – due to reduced blood pressure</li>
            <li>⭕ <strong>Fatigue</strong> or feeling unusually tired</li>
            <li>⭕ <strong>Dry mouth</strong></li>
            <li>⭕ <strong>Slow heart rate (bradycardia)</strong></li>
            <li>⭕ <strong>Depression</strong> or mood changes</li>
            <li>⭕ <strong>Sexual dysfunction</strong></li>
          </ul>
  
          <p>Less commonly, serious side effects may occur, such as:</p>
  
          <ul>
            <li>⭕ <strong>Severe drops in blood pressure</strong> – leading to fainting</li>
            <li>⭕ <strong>Heart rhythm abnormalities</strong></li>
            <li>⭕ <strong>Swelling in the lower extremities</strong></li>
          </ul>
  
          <br />
          <strong>🔷 Cautions and Drug Interactions</strong>
          <p>Antiadrenergic agents may interact with other medications. Inform your doctor if you are taking:</p>
  
          <ul>
            <li>⭕ Other <strong>blood pressure medications</strong> – can lead to excessive blood pressure reduction</li>
            <li>⭕ <strong>Antidepressants</strong> – some can enhance the sedative effects</li>
            <li>⭕ <strong>Beta blockers</strong> – combination may cause extreme slow heart rate or dizziness</li>
            <li>⭕ <strong>Medications for heart disease</strong> or heart rhythm disorders</li>
            <li>⭕ <strong>Alcohol</strong> – may increase drowsiness and dizziness</li>
          </ul>
  
          <br />
          <strong>⚠️ Do Not Stop Antiadrenergic Agents Suddenly</strong>
          <p>Stopping these medications suddenly may cause <strong>rebound hypertension</strong> (a sudden spike in blood pressure) or other complications. Always consult your doctor before discontinuing use.</p>
        </>
      ),
      name: "NACCAAAS"
    },
    {
      question: "Is the person currently taking any NACCACEI?",
      details: "(e.g., NACCACEI",
      name: "NACCACEI"
    },
    {
      question: "Is the person currently taking any NACCANGI",
      details: "(e.g., NACCANGI)",
      name: "NACCANGI"
    },
    {
      question: "Is the person currently taking any NACCCCBS",
      details: "(e.g., NACCCCBS)",
      name: "NACCCCBS"
    }
  ];
  
  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const heightMeters = height / 100;
      const bmiValue = (weight / (heightMeters * heightMeters)).toFixed(1);
      setFormData((prev) => ({ ...prev, NACCBMI: bmiValue }));
    } else {
      setFormData((prev) => ({ ...prev, NACCBMI: '' }));
    }
  }, [formData.height, formData.weight]);

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
    { title: "Current Medication Usage", icon: "💊" },
    { title: "Assessment Results", icon: "📊" }, 
];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Patient's Current Dementia Severity Assessment</h2>
      
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
            <RequiredLabel text="Age" />
            <input type="number" name="NACCAGE" value={formData.NACCAGE} onChange={handleChange} required className={getInputClassName("NACCAGE")} />
          {errors.NACCAGE && <p className="text-red-500">{errors.NACCAGE}</p>} 
        </div>

        <div className="space-y-2 mb-4">
            <RequiredLabel text="Sex" />
            <select name="SEX" value={formData.SEX} onChange={handleChange} required className={getInputClassName("SEX")}>
            <option value="select">Select</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
          {errors.SEX && <p className="text-red-500">{errors.SEX}</p>}
        </div>

        <div className="space-y-2 mb-4">
          <RequiredLabel text="Living Situation" />
          <div className="flex flex-col space-y-2">
            {[
              { value: "1", label: "Lives alone" },
              { value: "2", label: "Lives with spouse or partner" },
              { value: "3", label: "Lives with relative or friend, or children" },
              { value: "4", label: "Lives with group (Elderly homes)" },
              { value: "5", label: "Other (Nursing homes, etc.)" },
            ].map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="NACCLIVS"
                  value={option.value}
                  onChange={handleChange}                  
                  checked={formData.NACCLIVS === option.value}                  
                />{" "}
                {option.label}
              </label>
            ))}
            </div>
            {errors.NACCLIVS && <p className="text-red-500">{errors.NACCLIVS}</p>}
            </div>
          </div>
        )}   

        {/* Section 2: Current Health Status of the Dementia Patient */}
        {currentSection === 2 && (
          <div>
            
            <div className="space-y-2 mb-4">
              <RequiredLabel text="Current Dementia Type" />                                       
              <select name="DEM_TYPE" value={formData.DEM_TYPE || ""} onChange={handleChange} required  className={getInputClassName("DEM_TYPE")}>
                <option value="">Select</option>
                <option value="0">No Dementia Diagnosis</option> 
                <option value="1">Alzheimer’s Disease</option> 
                <option value="2">Lewy Body Disease</option>
                <option value="3">Vascular Dementia</option> 
                <option value="4">Frontotemporal Dementia</option>
                <option value="5">Mixed Dementia</option> 
                <option value="6">Other Type</option>
                <option value="-1">Unknown</option> 
                </select>
                {errors.DEM_TYPE && <p className="text-red-500">{errors.DEM_TYPE}</p>}
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <RequiredLabel text="Height (cm)" />                
                <input type="number" name="height" value={formData.height} onChange={handleChange} required className="border p-2 rounded-md w-full"/>
              </div>

              <div className="flex-1">
                <RequiredLabel text="Weight (kg)" />               
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} required className="border p-2 rounded-md w-full" />              
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <label className="font-bold text-gray-800">BMI:</label>
              <span className="font-semibold">{formData.NACCBMI || 'N/A'}</span>
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
              <RequiredLabel text="What is the patient’s most recent heart rate (pulse)?" />              
              <p className="text-gray-600 text-sm">
                Heart rate is the number of times the heart beats per minute. A normal resting heart rate for adults is between <b>60-100 beats per minute (bpm)</b>.  
                If you do not have a recent measurement, please leave blank.
              </p>
              <input type="number" name="HRATE" value={formData.HRATE || ""} onChange={handleChange} className={getInputClassName("HRATE")} />
              {errors.HRATE && <p className="text-red-500">{errors.HRATE}</p>} 
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
    <option value="1">Yes</option>
    <option value="0">No</option>
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
    <option value="1">Yes</option>
    <option value="0">No</option>
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
    <option value="1">Yes</option>
    <option value="0">No</option>
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
    <option value="1">Yes</option>
    <option value="0">No</option>
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
    <option value="1">Yes</option>
    <option value="0">No</option>
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
    <option value="1">Yes</option>
    <option value="0">No</option>
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
              <select name="COGFLUC" value={formData.COGFLUC || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient have cognitive problems that don’t fit into the previous categories?
              </label>
              <select name="COGOTHR" value={formData.COGOTHR || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
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
    
            <div className="space-y-2 mt-4">
              <label className="font-bold text-gray-800">Enter the patient's cognitive test score:</label>
              <input type="number" name="NACCMOCA" value={formData.NACCMOCA || ""} onChange={handleChange} className="border p-2 rounded-md w-full" required />
            </div>   
   
      </div>
    )}

      {currentSection === 9 && (
        <div>
          {medicationQuestions.map((med, index) => (
            <div key={index} className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <label className="font-semibold">{index + 1}. {med.question}</label>
                <AiOutlineQuestionCircle 
                  className="text-blue-500 cursor-pointer text-xl" 
                  onClick={() => openPopup(med.details)} 
                />
              </div>
              <div className="flex space-x-4">
                <label><input type="radio" name={med.name} value="Yes" onChange={handleChange} /> Yes</label>
                <label><input type="radio" name={med.name} value="No" onChange={handleChange} /> No</label>
                <label><input type="radio" name={med.name} value="Not Sure" onChange={handleChange} /> Not Sure</label>
              </div>
            </div>
          ))}
        </div>
      )}

      {popupContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-2xl w-96 max-h-[80vh] overflow-y-auto relative">
            <AiOutlineClose
            className="absolute top-3 right-3 text-gray-500 cursor-pointer text-2xl hover:text-gray-700" 
            onClick={closePopup} 
            />
          <div className="text-gray-700 whitespace-pre-line">{popupContent}</div>
        </div>
       </div>
      )}  


        {/* Section 10: Assessment Results */}
        {currentSection === 10 && (
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
                  <h2 className="text-2xl font-semibold">{riskLevel} Severity</h2>
                  <p className="text-gray-700">This Result is based on the information provided.
                    If you have concerns, consider discussing with a medical professional for further evaluation.
                  </p>
                </div>
              )}
              {!riskLevel && (
                <p className="text-gray-800">Click below to assess the patient's risk of dementia.</p>
              )}
            </div>
            {!submitted && (
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full" onClick={handleSubmit}>
                Assess Risk
              </button>                   
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
                style={buttonStyle}
                onClick={handleNextSection}
                // Remove disabled attribute so clicks always work
                aria-disabled={!isFormValid}
              >
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
                 <button
                 type="button"
                 style={buttonStyle}
                 onClick={handleNextSection}
                 // Remove disabled attribute so clicks always work
                 aria-disabled={!isFormValid}
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

     