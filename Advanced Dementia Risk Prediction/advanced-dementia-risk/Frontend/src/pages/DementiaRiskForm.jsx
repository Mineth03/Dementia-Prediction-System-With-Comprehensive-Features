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
  const [showIntroPopup, setShowIntroPopup] = useState(true); // New state for intro popup
  
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
  2: ["DEM_TYPE","HRATE", "VB12DEF","VISIMP", "HEARING", "MOT" ,"FOCL_STATUS"], // Current Health Status
  3: ["INDEPEND","SMOKING", "ALCFREQ", "APP", "HAS_SLEEP_PROBLEMS"], // Lifestyle
  4: ["SPEECH", "FACEXP", "URINEINC", "BOWLINC", "MOGAIT", "MOFALLS", "MOTREM","MOSLOW","MOMODE", "MOMOPARK"], // Behavioral Changes
  5: ["DIABET", "HYPERTEN", "HYPERCHO", "THYDIS", "CVANGINA","CVCHF", "CVHATT", "CVAFIB", "TIA", "STROKE", "TBI", "SEIZURES"], // Health Conditions
  6: ["DEPRESSION",  "BEANX", "BEDEL", "BEAGIT", "BEIRRIT", "BEDISIN", "APATHY", "ELAT", "EMOT", "BIPOLAR", "SCHIZ"], // Mental Health
  7: ["PERSCARE", "STAYHOME", "BILLS", "TAXES", "STOVE", "MEALPREP", "EVENTS","PAYATTN", "REMDATES","TRAVEL"], // Functional Activities
  8: ["COGMEM", "COGORI", "COGJUDG", "COGLANG", "COGVIS", "COGATTN", "COGFLUC","ABRUPT","NACCMOCA"], // Cognitive Function
};


const validateForm = (showErrors = false) => {
  let newErrors = {};
  let isValid = true;
  
  // Custom error messages for specific fields
  if (!formData.NACCAGE || formData.NACCAGE <= 17) {
    newErrors.NACCAGE = "Age is required and must be greater than 17.";
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
    // Scroll to top after state update
   window.scrollTo({ top: 0, behavior: 'smooth' });
  }   
};


const getInputClassName = (fieldName) => {
  return `w-full p-2 border ${errors[fieldName] ? "border-red-500" : "border-gray-300"} rounded`;
};  

// Button style - always blue with proper cursor states
const buttonStyle = {
  backgroundColor: isFormValid ? 'rgb(0, 106, 113)' : 'black',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  transition: 'background-color 0.3s',
  pointerEvents: 'auto'
};

const handlePreviousSection = () => {
  if (currentSection > 1) {
    setCurrentSection(currentSection - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const openPopup = (details) => {
  setPopupContent(details);
};

const closePopup = () => {
  setPopupContent(null);
};

// Close intro popup and start the form
const startForm = () => {
  setShowIntroPopup(false);
};

const handleSubmit = async (e) => {
  e.preventDefault();
    
  // Define the exact features expected by the model
  const expectedFeatures = [
    "NACCAGE", "SEX", "NACCLIVS", "DEM_TYPE", "NACCBMI", "BPSYS", "BPDIAS", "HRATE", "VB12DEF",
    "VISIMP", "HEARING", "MOT", "RIGIDITY", "HANDMOVS", "FTAPS", "AMOVS", "LEGAGILITS", "SLOWING",
    "FOCL_STATUS", "INDEPEND", "SMOKING", "ALCFREQ", "APP", "HAS_SLEEP_PROBLEMS", "INSOMN", "APNEA",
     "REMDIS", "NITE", "SPEECH", "FACEXP", "URINEINC", "BOWLINC", "MOGAIT", "MOFALLS", "MOTREM","MOSLOW",
    "MOMODE", "MOMOPARK", "DIABET", "HYPERTEN", "HYPERCHO", "THYDIS", "CVANGINA",
    "CVCHF", "CVHATT", "CVAFIB", "CVOTHR", "TIA", "STROKE", "TBI", "TBI_LOC", "SEIZURES", "DEPRESSION",
    "BEANX", "BEDEL", "BEAGIT", "BEIRRIT", "BEDISIN", "APATHY", "ELAT", "EMOT", "BIPOLAR", "SCHIZ",
    "PSYCDIS", "PERSCARE", "STAYHOME", "BILLS", "TAXES", "STOVE", "MEALPREP", "EVENTS",
    "PAYATTN", "REMDATES", "TRAVEL", "COGMEM", "COGORI", "COGJUDG", "COGLANG", "COGVIS", "COGATTN",
    "COGFLUC", "COGOTHR", "ABRUPT", "NACCMOCA", "NACCADMD",	"NACCADEP",	"NACCAANX", "NACCAPSY", "NACCDBMD", "NACCLIPL",
    "NACCDIUR", "NACCPDMD", "NACCVASD", "NACCBETA" , "NACCAC" , "NACCAAAS", "NACCACEI", "NACCANGI", "NACCCCBS"
  ];

  // Features that need to be set to -1
   const featuresToSetNegative = [
    "NACCAGE", "VB12DEF", "VISIMP", "HEARING", "FOCL_STATUS", "INDEPEND", "APP", "SPEECH", "FACEXP", 
    "URINEINC", "BOWLINC", "MOGAIT", "MOFALLS", "MOTREM","MOSLOW", "MOMODE", "MOMOPARK", 
    "DIABET", "HYPERCHO", "THYDIS", "CVOTHR","TIA", "TBI_LOC", "SEIZURES", "BEANX", "BEDEL", "BEAGIT", 
    "BEIRRIT", "BEDISIN", "APATHY", "ELAT", "EMOT", "BIPOLAR", "SCHIZ",
    "PSYCDIS", "EVENTS","PAYATTN", "COGORI", "COGJUDG", "COGLANG", "COGVIS", "COGATTN",
    "COGFLUC", "COGOTHR", "ABRUPT","NACCADMD","NACCAANX", "NACCAPSY",
  "NACCVASD", "NACCAAAS", "NACCACEI", "NACCANGI"  
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
      details: (
        <>
          <p>There are certain medications that help manage cognitive symptoms of dementia. Please indicate whether the person is currently taking any of the following medications:</p>  
  
          <br />
          <strong>🔷 Cholinesterase Inhibitors (Used for Alzheimer’s, Dementia with Lewy Bodies, Parkinson’s Disease Dementia, and Mixed Dementia)</strong>
          <ul>
            <li>⭕ <strong>Donepezil (Aricept®)</strong> – The most commonly prescribed dementia medication.</li>
            <li>⭕ <strong>Rivastigmine (Exelon®)</strong> – Usually given when donepezil causes side effects or isn't suitable for medical reasons.</li>
            <li>⭕ <strong>Galantamine (Razadyne®)</strong> – Rarely prescribed. While it can treat Alzheimer's symptoms, doctors usually prefer donepezil or rivastigmine first. It is also unclear whether galantamine helps with dementia with Lewy bodies or Parkinson's disease dementia.</li>
          </ul>
  
          <p>A healthy brain relies on <strong>acetylcholine</strong>, a chemical that helps nerve cells communicate.</p>
          <ul>
            <li>In <strong>Alzheimer's disease and dementia with Lewy bodies</strong>, acetylcholine levels decline, making it harder for nerve cells to communicate.</li>
            <li><strong>Cholinesterase inhibitors</strong> work by boosting acetylcholine levels, helping lessen or stabilize symptoms for a limited time.</li>
            <li>However, as dementia progresses and more brain cells are damaged, <strong>the effectiveness of these medications declines</strong>. Eventually, the symptoms will worsen again.</li>
          </ul>
  
          <p>⚠️ <strong>Possible Side Effects:</strong> Nausea, diarrhea, vomiting, stomach upset, loss of appetite, weight loss, low heart rate, tiredness, vivid dreams, or muscle cramps.</p>
  
          <br />
          <strong>🔷 Memantine (Namenda®)</strong>
          <ul>
            <li>Unlike cholinesterase inhibitors, <strong>memantine works by regulating glutamate</strong>, a chemical that can become excessive in Alzheimer's, damaging nerve cells.</li>
            <li>Memantine helps protect nerve cells and supports cognitive function in <strong>moderate to severe Alzheimer's disease and Dementia with Lewy Bodies</strong>.</li>
            <li>It may improve <strong>confusion, daily functioning (e.g., dressing), and behavioral symptoms like aggression or delusions</strong>.</li>
            <li><strong>Doctors often combine memantine with a cholinesterase inhibitor</strong> because the two drugs work in different ways and may complement each other. This combination may be more beneficial in late-stage Alzheimer's than using a cholinesterase inhibitor alone.</li>
          </ul>
  
          <p>⚠️ <strong>Possible Side Effects:</strong> Headache, dizziness, confusion, constipation.</p>
  
          <p>While none of these drugs are approved for use in mild cognitive impairment (MCI), some clinicians may prescribe them.</p>
        </>
      ),
      name: "NACCADMD"
    },
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
      question: "Is the person currently using any diabetes medications to help manage blood sugar levels?",
      details: (
        <>
          <p>Diabetes medications are designed to help people, primarily those with Type 2 diabetes, manage their blood sugar (glucose) levels. They may need to take more than one type of medication, including both insulin and oral pills, depending on their specific treatment plan. Medications are often used alongside lifestyle changes, such as diet and exercise, to achieve optimal blood glucose control.</p>
          <br />
          <strong>🔷 Types of Diabetes Medications</strong>
          <p>Oral diabetes medications are typically prescribed for people with Type 2 diabetes or prediabetes. These medications help regulate blood glucose levels by addressing insulin resistance, a key issue in Type 2 diabetes.</p>
          <p>For people with Type 1 diabetes, insulin injections or pumps are necessary as there are no oral medications for this condition.</p>
          <br />
          <strong>🔷 Common Types of Oral Diabetes Medications:</strong>
          <ul>
            <li>⭕ <strong>Alpha-glucosidase Inhibitors:</strong> Block the breakdown of starches and some sugars in the intestines, lowering blood glucose levels. Common medications include Acarbose (Precose®) and Miglitol (Glyset®).</li>
            <li>⭕ <strong>Biguanides:</strong> Reduce the amount of glucose produced by the liver and make muscle tissue more sensitive to insulin. Metformin (Glucophage®) is the most commonly prescribed biguanide.</li>
            <li>⭕ <strong>Bile Acid Sequestrants (BASs):</strong> Help lower blood glucose and cholesterol by preventing bile acids from being reabsorbed. The main BAS for Type 2 diabetes is Colesevelam (Welchol®).</li>
            <li>⭕ <strong>Dopamine-2 Agonists:</strong> Help reverse insulin resistance by resetting the circadian rhythm. Bromocriptine (Cycloset®) is the FDA-approved drug in this category.</li>
            <li>⭕ <strong>DPP-4 Inhibitors (Gliptins):</strong> Improve blood sugar control by prolonging the action of GLP-1, which helps regulate glucose levels. Examples include Alogliptin (Nesina®) and Sitagliptin (Januvia®).</li>
            <li>⭕ <strong>Meglitinides (Glinides):</strong> Stimulate the pancreas to release insulin before meals. Nateglinide (Starlix®) and Repaglinide (Prandin®) are examples.</li>
            <li>⭕ <strong>SGLT2 Inhibitors:</strong> Help remove excess glucose through urine. Medications include Canagliflozin (Invokana®) and Empagliflozin (Jardiance®).</li>
            <li>⭕ <strong>Sulfonylureas:</strong> Stimulate insulin production from the pancreas. Common examples are Glimepiride (Amaryl®) and Glipizide (Glucotrol®).</li>
            <li>⭕ <strong>Thiazolidinediones (TZDs):</strong> Improve insulin sensitivity in muscle and fat tissues and reduce glucose production in the liver. Rosiglitazone (Avandia®) and Pioglitazone (Actos®) are commonly prescribed TZDs.</li>
          </ul>
    
          <br />
          <strong>⚠️ Possible Side Effects</strong>
          <p>Diabetes medications can cause side effects, depending on the type. Some common side effects include:</p>
          <ul>
            <li>🔺 Gastrointestinal issues like diarrhea, bloating, or nausea.</li>
            <li>🔺 Low blood sugar (hypoglycemia), especially with sulfonylureas and meglitinides.</li>
            <li>🔺 Weight gain (more common with some medications like TZDs and sulfonylureas).</li>
            <li>🔺 Risk of urinary tract infections and yeast infections with SGLT2 inhibitors.</li>
          </ul>
  
          <br />
          <strong>🔷 Key Considerations</strong>
          <p>Managing Type 2 diabetes involves a combination of lifestyle changes and medications. Your healthcare provider will work with you to determine the best treatment plan, which may involve:</p>
          <ul>
            <li>⭕ Modifications to diet and exercise.</li>
            <li>⭕ Regular blood sugar monitoring.</li>
            <li>⭕ Close communication with your healthcare provider to adjust medications as needed.</li>
          </ul>
  
          <br />
          <strong>🔷 Hypoglycemia Awareness</strong>
          <p>One of the key risks with certain oral diabetes medications (like sulfonylureas and meglitinides) is low blood sugar (hypoglycemia). Symptoms of hypoglycemia can include:</p>
          <ul>
            <li>⭕ Shaking, sweating, or dizziness.</li>
            <li>⭕ Intense hunger or irritability.</li>
            <li>⭕ Rapid heartbeat and difficulty thinking clearly.</li>
          </ul>
          <p>To treat hypoglycemia, consume 15 grams of carbohydrates (e.g., half a banana or half a cup of apple juice), and recheck your blood sugar after 15 minutes. If it's still low, repeat the process.</p>
  
          <br />
          <strong>🔷 Drug Interactions</strong>
          <p>Diabetes medications can interact with other drugs, so it's crucial to inform your healthcare provider about all the medications you're currently taking, including over-the-counter drugs and supplements. Some medications may increase the risk of hypoglycemia, while others may interfere with the effectiveness of your diabetes treatment.</p>
        </>
      ),
      name: "NACCDBMD"
    },
    {
      question: "Is the person currently taking any medication to help lower cholesterol levels (e.g., Statins, PCSK9 inhibitors, or other antihyperlipidemic drugs)?",
      details: (
        <>
          <p>Cholesterol-lowering medications are used to reduce cholesterol levels and lower the risk of heart attacks and strokes. These medications are typically prescribed when lifestyle changes (diet and exercise) haven't been sufficient to control cholesterol levels.</p>
        
          <br />
          <strong>🔷 Types of Antihyperlipidemic Medications</strong>
          <p>Common types of cholesterol-lowering medications include:</p>
        
          <ul>
            <li>⭕ <strong>Statins</strong> – First-line treatment for high cholesterol, improving blood vessel health (e.g., Atorvastatin, Rosuvastatin).</li>
            <li>⭕ <strong>PCSK9 Inhibitors</strong> – Used for people who can't tolerate statins (e.g., Alirocumab, Evolocumab).</li>
            <li>⭕ <strong>Fibrates</strong> – Help reduce triglycerides (e.g., Fenofibrate, Gemfibrozil).</li>
            <li>⭕ <strong>Bile Acid Sequestrants</strong> – Reduce LDL cholesterol (e.g., Cholestyramine, Colesevelam).</li>
            <li>⭕ <strong>Cholesterol Absorption Inhibitors</strong> – Prevent cholesterol absorption in the intestine (e.g., Ezetimibe).</li>
            <li>⭕ <strong>Niacin</strong> – Increases HDL cholesterol and lowers LDL (e.g., Niacor, Niaspan).</li>
            <li>⭕ <strong>Omega-3 Fatty Acids</strong> – Lower triglycerides (e.g., Lovaza, Vascepa).</li>
            <li>⭕ <strong>Adenosine Triphosphate-Citrate Lyase (ACL) Inhibitors</strong> – Lower LDL cholesterol (e.g., Bempedoic acid).</li>
          </ul>
        
          <br />
          <strong>⚠️ Importance of These Medications</strong>
          <p>These medications are essential for lowering the risk of cardiovascular diseases, especially when lifestyle changes alone are not enough. They help improve cholesterol levels, which can prevent heart attacks and strokes.</p>
        
          <br />
          <strong>🔷 Potential Side Effects</strong>
          <p>Possible side effects of antihyperlipidemic medications may include:</p>
        
          <ul>
            <li>Muscle pain, fatigue, stomach upset, constipation, and liver enzyme abnormalities.</li>
            <li>Injection site reactions, flu-like symptoms (for PCSK9 inhibitors).</li>
            <li>Stomach issues like bloating or nausea (for bile acid sequestrants and fibrates).</li>
          </ul>
  
          <p>In many cases, the muscle pain associated with statins is not caused by the drug but by the expectation of the side effect. It's important to follow a healthy diet and exercise plan in conjunction with these medications to maximize their effectiveness.</p>
  
          <br />
          <strong>Overview of Common Antihyperlipidemic Medications:</strong>
          <p>Here's a summary of the benefits and possible side effects for common cholesterol medications:</p>
          
          <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>Drug Class</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Benefits</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Possible Side Effects</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>Statins (Atorvastatin, Rosuvastatin, etc.)</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Decrease LDL and triglycerides; slightly increase HDL</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Muscle pain, increased blood sugar, liver enzyme elevation</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>Cholesterol Absorption Inhibitors (Ezetimibe)</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Decreases LDL and triglycerides; slightly increases HDL</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Stomach pain, diarrhea, fatigue</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>PCSK9 Inhibitors (Alirocumab, Evolocumab)</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Decrease LDL</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Injection site reactions, flu-like symptoms</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>Citrate Lyase Inhibitors (Bempedoic Acid)</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Decrease LDL</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Muscle spasms, joint pain, gout</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>Bile Acid Sequestrants (Cholestyramine, Colesevelam)</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Decrease LDL</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Constipation, bloating, nausea, gas</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>Fibrates (Fenofibrate, Gemfibrozil)</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Decrease triglycerides, modestly decrease LDL, increase HDL</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Nausea, stomach pain, muscle pain</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>Niacin (Niacor, Niaspan)</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Decreases LDL and triglycerides; increases HDL</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Flushing, itching, stomach upset</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>Omega-3 Fatty Acids (Lovaza, Vascepa)</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Decrease triglycerides</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>Fishy taste, belching, increased risk of bleeding</td>
              </tr>
            </tbody>
          </table>
        
          <br />
          <strong>🔷 Benefits of Antihyperlipidemic Medications</strong>
          <p>These medications help significantly reduce the risk of heart disease and stroke by:</p>
        
          <ul>
            <li>Decreasing LDL (bad) cholesterol.</li>
            <li>Reducing triglyceride levels.</li>
            <li>Increasing HDL (good) cholesterol.</li>
          </ul>
        </>
      ),
      name: "NACCLIPL"
    },
    {
      question: "Is the person currently taking any diuretic medications?",
        details: (
          <>
            <p>
              <strong>Diuretics</strong> ― commonly known as <strong>water pills</strong> ― are medications that help the body eliminate excess fluid and salt by increasing urine production. They are commonly used to manage conditions such as high blood pressure, heart failure, and fluid retention.
            </p>
  
            <br />
            <strong>🔷 How Diuretics Work</strong>
            <p>
              Diuretics work by causing your kidneys to excrete more sodium into your urine. The sodium takes water with it from your blood, decreasing the amount of fluid flowing through your blood vessels. This leads to:
            </p>
  
            <ul>
              <li>⭕ <strong>Lower blood pressure</strong></li>
              <li>⭕ <strong>Reduced fluid buildup</strong> in the lungs, abdomen, and legs</li>
              <li>⭕ <strong>Decreased workload on the heart</strong>, especially in cases of heart failure</li>
              <li>⭕ <strong>Wider blood vessels</strong>, easing blood flow</li>
            </ul>
  
            <br />
            <strong>🔷 Conditions Diuretics Treat</strong>
            <ul>
              <li>⭕ High blood pressure</li>
              <li>⭕ Heart failure</li>
              <li>⭕ Cardiomyopathy</li>
              <li>⭕ Pulmonary edema</li>
              <li>⭕ Ascites (abdominal fluid buildup)</li>
              <li>⭕ Kidney failure</li>
              <li>⭕ Nephrotic syndrome</li>
              <li>⭕ High intraocular or intracranial pressure</li>
            </ul>
  
            <br />
            <strong>🔷 Types of Diuretics</strong>
  
            <ul>
              <li>
                <strong>🟩 Thiazide Diuretics</strong> – Used primarily for high blood pressure. Examples:
                <ul>
                  <li>▪️ Hydrochlorothiazide (Microzide)</li>
                  <li>▪️ Chlorthalidone</li>
                  <li>▪️ Metolazone</li>
                  <li>▪️ Indapamide</li>
                </ul>
              </li>
              <li>
                <strong>🟦 Loop Diuretics</strong> – Preferred for people with low kidney function (low GFR) or heart failure. Examples:
                <ul>
                  <li>▪️ Furosemide (Lasix)</li>
                  <li>▪️ Torsemide (Demadex)</li>
                  <li>▪️ Bumetanide</li>
                </ul>
              </li>
              <li>
                <strong>🟨 Potassium-Sparing Diuretics</strong> – Preserve potassium levels while reducing fluid. Examples:
                <ul>
                  <li>▪️ Amiloride</li>
                  <li>▪️ Triamterene (Dyrenium)</li>
                  <li>▪️ Spironolactone (Aldactone)</li>
                  <li>▪️ Eplerenone (Inspra)</li>
                </ul>
              </li>
              <li>
                <strong>🟧 Combination Pills</strong> – Combine two types, such as:
                <ul>
                  <li>▪️ Triamterene and hydrochlorothiazide</li>
                </ul>
              </li>
            </ul>
  
            <br />
            <strong>🔷 Administration</strong>
            <p>
              Diuretics are usually taken once or twice a day, ideally in the morning to prevent nighttime urination. They are most effective when taken at the same time each day.
            </p>
  
            <br />
            <strong>⚠️ Side Effects</strong>
            <ul>
              <li>⭕ Upset stomach, gas, or diarrhea</li>
              <li>⭕ Fatigue or headaches</li>
              <li>⭕ Gout or joint pain</li>
              <li>⭕ Hair loss</li>
              <li>⭕ Low potassium (in non-potassium-sparing types)</li>
              <li>⭕ Muscle cramps</li>
              <li>⭕ Higher blood sugar (especially in people with diabetes)</li>
              <li>⭕ Erectile dysfunction</li>
              <li>⭕ Dehydration or constipation</li>
            </ul>
  
            <p>
              Most people tolerate diuretics well, but regular monitoring of kidney function and electrolytes (especially potassium) is important.
            </p>
  
            <br />
            <strong>🔷 Drug Interactions</strong>
            <p>Tell your doctor about any other medications or supplements you're taking. Diuretics may interact with:</p>
            <ul>
              <li>⭕ <strong>Cyclosporine</strong> (Restasis)</li>
              <li>⭕ <strong>Antidepressants</strong> such as fluoxetine (Prozac) and venlafaxine (Effexor XR)</li>
              <li>⭕ <strong>Lithium</strong></li>
              <li>⭕ <strong>Digoxin</strong> (Digox)</li>
              <li>⭕ <strong>Other blood pressure medications</strong></li>
            </ul>
            <br />
            <strong>🔷 Risks and Monitoring</strong>
            <p>
              If not taken with adequate fluid intake or at too high a dose, diuretics can lead to <strong>dehydration</strong> and <strong>electrolyte imbalances</strong>. Your doctor may adjust your dosage or check blood work periodically.
            </p>
  
            <p>
              ⚠️ <strong>People with kidney or liver conditions</strong> should consult their doctor before using diuretics.
            </p>
          </>
        ),
      name: "NACCDIUR"
    },
    {
      question: "Is the person currently taking any medication related to Parkinson's disease?",
      details: (
        <>
          <p>Parkinson's disease medications help manage symptoms and improve quality of life. Please indicate whether the person is currently taking any of the following medications:</p>
  
          <ul>
            <li>✅ <strong>Levodopa + Carbidopa</strong> (e.g., Sinemet®, Duopa®) – Most effective for improving motor symptoms by replenishing dopamine in the brain.</li>
            <li>✅ <strong>Dopamine Agonists</strong> (e.g., Pramipexole, Ropinirole, Rotigotine) – Mimic dopamine effects. Often first-line due to fewer long-term side effects.</li>
            <li>✅ <strong>MAO-B Inhibitors</strong> (e.g., Selegiline, Rasagiline, Safinamide) – Slow dopamine breakdown and may slow disease progression.</li>
            <li>✅ <strong>COMT Inhibitors</strong> (e.g., Entacapone, Tolcapone, Opicapone) – Help levodopa last longer in the brain.</li>
            <li>✅ <strong>Amantadine</strong> – Used for mild symptoms or involuntary movements caused by levodopa.</li>
            <li>✅ <strong>Anticholinergics</strong> (e.g., Benztropine, Trihexyphenidyl) – Used rarely due to memory-related side effects, especially in older adults.</li>
            <li>✅ <strong>Adenosine A2A Antagonists</strong> (e.g., Istradefylline) – Helps improve motor symptom control, especially during OFF periods.</li>
          </ul>
  
          <br />
          <strong>🔷 Levodopa + Carbidopa</strong>
          <p>Levodopa combined with carbidopa is the most common medication for Parkinson's disease. It helps replenish dopamine, which is essential for controlling movement.</p>
          <p><strong>Common Side Effects:</strong> Nausea, vomiting, dizziness, headache, daytime sleepiness. In older adults, confusion, hallucinations, and delusions may occur. Abruptly stopping or reducing the dose can lead to parkinsonism hyperpyrexia syndrome, a life-threatening condition.</p>
  
          <br />
          <strong>🔷 Dopamine Agonists</strong>
          <p>Dopamine agonists mimic the effects of dopamine in the brain and are often used as first-line treatments with fewer long-term side effects.</p>
          <p><strong>Common Side Effects:</strong> Hallucinations, delusions, confusion, drowsiness, nausea, vomiting, dry mouth, dizziness, and feeling faint upon standing. These side effects usually resolve over time but can be more prominent in older individuals.</p>
  
          <br />
          <strong>🔷 MAO-B Inhibitors</strong>
          <p>These medications slow the breakdown of dopamine and may help slow disease progression.</p>
          <p><strong>Common Side Effects:</strong> Heartburn, nausea, dry mouth, dizziness. Less common side effects include confusion, nightmares, and hallucinations.</p>
  
          <br />
          <strong>🔷 COMT Inhibitors</strong>
          <p>COMT inhibitors help extend the effects of Levodopa by preventing its breakdown in the brain.</p>
          <p><strong>Common Side Effects:</strong> Diarrhea, dyskinesia (involuntary movements).</p>
  
          <br />
          <strong>🔷 Amantadine</strong>
          <p>Amantadine is used to reduce tremors and rigidity and can also help with the side effects of Levodopa.</p>
          <p><strong>Common Side Effects:</strong> Difficulty concentrating, confusion, insomnia, nightmares, agitation, hallucinations, and leg swelling.</p>
  
          <br />
          <strong>🔷 Anticholinergic Medications</strong>
          <p>These medications can control tremors but are rarely used in older individuals due to memory-related side effects.</p>
          <p><strong>Common Side Effects:</strong> Cognitive deficits, dry mouth, blurred vision, sedation, delirium, hallucinations, constipation, urinary retention.</p>
  
          <br />
          <strong>🔷 Adenosine A2A Antagonists</strong>
          <p>These medications target receptors in the brain to reduce tremors and stiffness.</p>
          <p><strong>Common Side Effects:</strong> Headache, dizziness, nausea, and insomnia.</p>
  
          <br />
          <strong>⚠️ Important Considerations</strong>
          <p>- These medications should be monitored carefully for side effects such as dizziness, nausea, confusion, and hallucinations.</p>
          <p>- Dosage adjustments may be necessary to achieve the best balance between effectiveness and side effects.</p>
          <p>- Regular assessments of the patient's response to medications are crucial for ongoing management.</p>
  
        </>
      ),
      name: "NACCPDMD"
    },
    {
      question: "Is the person currently taking any vasodilator medications to help manage high blood pressure, heart conditions, or improve blood flow?",
      details: (
        <>
          <p>Vasodilators are medications that help relax and widen blood vessels, making it easier for blood to flow through the body. These medications are commonly prescribed to treat conditions like high blood pressure, heart failure, and chest pain.</p>
          <br />
          <strong>🔷 Common Vasodilator Medications</strong>
          <p>Here are some medications in the vasodilator category:</p>
          <ul>
            <li>⭕ <strong>Hydralazine (Apresoline®):</strong> Often used to treat high blood pressure and heart failure.</li>
            <li>⭕ <strong>Minoxidil (Loniten®):</strong> Used to treat severe high blood pressure. It is also a component of topical treatments for hair loss (Rogaine®).</li>
            <li>⭕ <strong>Sodium Nitroprusside (Nitropress®):</strong> Used in emergencies to rapidly lower blood pressure in severe hypertension or during heart failure crises.</li>
            <li>⭕ <strong>Nitroglycerin (Nitrostat®, Nitro-Dur®, Minitran®):</strong> Commonly used to treat chest pain (angina) by relaxing coronary arteries and increasing blood flow to the heart.</li>
            <li>⭕ <strong>Alprostadil (Caverject®):</strong> Used to treat erectile dysfunction and sometimes to manage heart conditions.</li>
            <li>⭕ <strong>Nesiritide (Natrecor®):</strong> Used for short-term treatment of severe heart failure, helping to relax the heart and blood vessels to improve circulation.</li>
          </ul>
  
          <br />
          <strong>⚠️ Possible Side Effects</strong>
          <p>While vasodilators can be effective, they may cause certain side effects, including:</p>
          <ul>
            <li>🔺 Headaches or dizziness, especially when standing up quickly.</li>
            <li>🔺 Low blood pressure, which can cause fainting or weakness.</li>
            <li>🔺 Swelling in the feet and ankles.</li>
            <li>🔺 Possible allergic reactions, such as skin rash or swelling.</li>
          </ul>
  
          <br />
          <strong>🔷 Benefits of Vasodilators</strong>
          <p>Vasodilators can help improve blood flow by relaxing blood vessels. Some key benefits include:</p>
          <ul>
            <li>⭕ Reducing high blood pressure and helping to manage heart failure.</li>
            <li>⭕ Providing relief from angina (chest pain) by improving the oxygen supply to the heart.</li>
            <li>⭕ Improving circulation to vital organs and reducing the strain on the heart.</li>
          </ul>
  
          <br />
          <strong>🔷 Important Considerations</strong>
          <p>It's important to monitor blood pressure regularly while taking vasodilators, as they can cause a significant drop in blood pressure. Make sure to consult with your healthcare provider about any potential interactions with other medications you are taking.</p>
        </>
      ),
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
            <li>⭕ Medicines that can <strong>lower blood pressure</strong> (e.g., antidepressants, nitrates for chest pain, baclofen, tamsulosin for enlarged prostate, Parkinson's disease medicines like levodopa)</li>
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
  
          <p>If you have <strong>diabetes</strong>, beta blockers may mask signs of low blood sugar, such as a rapid heartbeat, so it's important to monitor blood sugar levels regularly.</p>
  
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
          <p>They may be prescribed if you have a history of blood clots, conditions like <strong>atrial fibrillation</strong>, or if you've recently undergone surgery and are at risk of developing a clot during recovery.</p>
          
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
      question: "Is the person currently taking any ACE (angiotensin-converting enzyme) inhibitors?",
      details: (
        <>
          <p>
            There are certain medications called <strong>ACE (angiotensin-converting enzyme) inhibitors</strong> that are used to <strong>lower blood pressure and protect the heart and kidneys</strong>. These are commonly prescribed to manage conditions like <strong>high blood pressure, heart failure, and kidney disease</strong>. They work by preventing your body from producing angiotensin II, a substance that narrows blood vessels and increases blood pressure.
          </p>
  
          <br />
          <strong>🔷 What do ACE inhibitors help with?</strong>
          <ul>
            <li>✔️ High blood pressure (hypertension)</li>
            <li>✔️ Heart failure</li>
            <li>✔️ Post-heart attack treatment</li>
            <li>✔️ Prevention of heart attacks and strokes</li>
            <li>✔️ Kidney protection, especially in people with diabetes</li>
            <li>✔️ Treatment of kidney conditions like proteinuria, nephrotic syndrome, and glomerular disease</li>
          </ul>
  
          <br />
          <strong>How do they work?</strong>
          <p>
            ACE inhibitors stop the enzyme that turns angiotensin I into angiotensin II. This results in <strong>relaxed blood vessels, reduced salt retention, and better blood pressure control</strong>. They also increase the amount of bradykinin, a natural compound that helps relax blood vessels.
          </p>
  
          <br />
          <strong>Common ACE Inhibitor Medications:</strong>
          <ul>
            <li>⭕ Benazepril (Lotensin®)</li>
            <li>⭕ Captopril (Capoten®)</li>
            <li>⭕ Enalapril (Epaned®, Vasotec®)</li>
            <li>⭕ Lisinopril (Qbrelis®, Zestril®, Prinivil®)</li>
            <li>⭕ Ramipril (Altace®)</li>
            <li>⭕ Quinapril (Accupril®)</li>
            <li>⭕ Trandolapril (Mavik®)</li>
            <li>⭕ Fosinopril, Moexipril, Perindopril</li>
          </ul>
  
          <br />
          <strong>⚠️ Side Effects to Watch For:</strong>
          <ul>
            <li> Dry, persistent cough</li>
            <li> Dizziness or lightheadedness</li>
            <li> Fatigue or weakness</li>
            <li> Swelling (angioedema) — rare but serious</li>
            <li> Nausea or upset stomach</li>
            <li> Metallic taste or decreased ability to taste</li>
          </ul>
  
          <br />
          <strong>🛑 When Should ACE Inhibitors Be Avoided?</strong>
          <ul>
            <li>🚫 History of severe swelling (angioedema)</li>
            <li>🚫 Past allergic reaction to ACE inhibitors</li>
            <li>🚫 Severe kidney disease or renal artery narrowing</li>
          </ul>
  
          <br />
          <strong>⚡ Interactions and Precautions:</strong>
          <ul>
            <li>❌ NSAIDs (like ibuprofen) may reduce effectiveness or harm kidneys</li>
            <li>❌ Medications that alter potassium/sodium levels</li>
            <li>❌ Angiotensin receptor blockers (ARBs) — can increase risk of kidney issues or hyperkalemia</li>
            <li>❌ Aliskiren — a renin inhibitor that may cause serious side effects when combined</li>
          </ul>
  
          <p>⚠️ Avoid salt substitutes containing potassium unless advised by a healthcare provider. Spicy foods (capsaicin) may worsen ACE-inhibitor-related cough but are not harmful.</p>
  
          <br />
          <strong>📅 Monitoring:</strong>
          <p>Kidney function and electrolyte levels should be checked at least once a year. Dose adjustments may be needed based on lab results or side effects. Never stop ACE inhibitors abruptly without consulting a healthcare provider.</p>
        </>
      ),
      name: "NACCACEI"
    },
    {
      question: "Is the person currently taking any angiotensin II receptor blockers (ARBs)?",
      details: (
        <>
          <p>Angiotensin II receptor blockers (ARBs) are medications used to treat high blood pressure, heart failure, kidney disease, and reduce the risk of heart attacks and strokes.</p>
          <br />
          <p>ARBs work by blocking the effects of angiotensin II, a protein that narrows blood vessels, raising blood pressure. By blocking its action, ARBs help relax the blood vessels, allowing blood to flow more freely and lowering blood pressure.</p>
          
          <br />
          <strong>🔷 Common Angiotensin II Receptor Blockers (ARBs)</strong>
          <p>Some of the most commonly prescribed ARBs include:</p>
          
          <ul>
            <li>⭕ <strong>Azilsartan medoxomil (Edarbi®)</strong></li>
            <li>⭕ <strong>Candesartan (Atacand®)</strong></li>
            <li>⭕ <strong>Eprosartan mesylate (Teveten®)</strong></li>
            <li>⭕ <strong>Irbesartan (Avapro®)</strong></li>
            <li>⭕ <strong>Losartan potassium (Cozaar®)</strong></li>
            <li>⭕ <strong>Olmesartan (Benicar®)</strong></li>
            <li>⭕ <strong>Telmisartan (Micardis®)</strong></li>
            <li>⭕ <strong>Valsartan (Diovan® and Prexxartan®)</strong></li>
          </ul>
          
          <br />
          <strong>⚠️ What Are the Side Effects of ARBs?</strong>
          <p>ARBs are generally well-tolerated, but they may cause some side effects:</p>
          
          <ul>
            <li>❌ <strong>Dizziness</strong> (most common)</li>
            <li>❌ <strong>Kidney function changes</strong> (more likely if there's pre-existing kidney disease)</li>
            <li>❌ <strong>Elevated potassium levels</strong> (Hyperkalemia)</li>
          </ul>
  
          <br />
          <strong>🔷 Types of ARBs and Their Uses</strong>
          <p>ARBs are typically prescribed for:</p>
          <ul>
            <li>⭕ <strong>High blood pressure</strong> (Hypertension)</li>
            <li>⭕ <strong>Heart failure</strong> (Helps the heart pump more blood)</li>
            <li>⭕ <strong>Kidney disease</strong> (Especially in patients with diabetes)</li>
            <li>⭕ <strong>Prevention of stroke</strong> (Reduces the risk of stroke by lowering blood pressure)</li>
            <li>⭕ <strong>Heart attack recovery</strong> (Helps reduce damage post-heart attack)</li>
            <li>⭕ <strong>Fatty liver disease</strong> (Prevents liver inflammation)</li>
          </ul>
          
          <br />
          <strong>⚠️ Important Considerations</strong>
          <p>ARBs are safe when taken as prescribed, but be cautious about:</p>
          <ul>
            <li>❌ <strong>Potassium supplements or potassium-sparing diuretics</strong> (Can increase potassium levels)</li>
            <li>❌ <strong>Salt substitutes</strong> containing potassium chloride (May cause potassium overload)</li>
            <li>❌ <strong>Heavy alcohol use</strong> (May worsen blood pressure)</li>
          </ul>
        </>
      ),   
      name: "NACCANGI"
    },
    {
      question: "Is the person currently taking any Calcium Channel Blockers (CCBs)",
      details: (
        <>
          <p>Calcium Channel Blockers (CCBs) are medications that help limit how your body uses calcium, which is essential for the functioning of your heart and circulatory system. By slowing down calcium entry into cells, these medications can lower blood pressure, prevent heart rhythm problems, and more.</p>
          <br />
          <p>These medications work by targeting specific calcium channels in the body, which can relax blood vessels, reduce heart rate, and help improve blood flow. However, like all medications, the benefits must be weighed against the potential risks:</p>
          
          <br />
          <strong>🔷 Common Calcium Channel Blockers</strong>
          <p>Calcium channel blockers come in two main types, each with different effects:</p>
          
          <ul>
            <li><strong>Dihydropyridines:</strong> Target blood vessels, causing them to relax and reduce blood pressure. Common examples include:</li>
            <ul>
              <li>⭕ <strong>Amlodipine (Norvasc®)</strong></li>
              <li>⭕ <strong>Felodipine (Plendil®)</strong></li>
              <li>⭕ <strong>Nifedipine (Adalat®)</strong></li>
            </ul>
            <li><strong>Non-dihydropyridines:</strong> Target both the heart and blood vessels. They are often used for treating heart rhythm problems. Examples include:</li>
            <ul>
              <li>⭕ <strong>Diltiazem (Cardizem®)</strong></li>
              <li>⭕ <strong>Verapamil (Calan®)</strong></li>
            </ul>
          </ul>
          
          <br />
          <strong>⚠️ Possible Side Effects</strong>
          <p>While calcium channel blockers are effective, they can cause side effects depending on the type used:</p>
          <ul>
            <li>🔺 <strong>Dihydropyridines:</strong> May cause lightheadedness, dizziness, headaches, or swelling in the limbs.</li>
            <li>🔺 <strong>Non-dihydropyridines:</strong> May lead to constipation, slow heartbeat (bradycardia), and a reduction in heart pumping ability.</li>
          </ul>
  
          <br />
          <strong>🔷 Benefits of Calcium Channel Blockers</strong>
          <p>CCBs are commonly prescribed because they are effective in treating various heart and circulatory problems. They can:</p>
          <ul>
            <li>⭕ Lower blood pressure and prevent heart rhythm problems.</li>
            <li>⭕ Be used alongside other medications to address multiple conditions simultaneously.</li>
            <li>⭕ Offer a better alternative when other medications aren't suitable due to side effects or interactions.</li>
          </ul>
  
          <br />
          <strong>🔷 Important Considerations</strong>
          <p>While taking calcium channel blockers, it's essential to be aware of possible drug interactions. For example, CCBs may interact with certain blood pressure medications and other treatments, so it is crucial to consult with a healthcare provider before combining medications.</p>
        </>
      ),
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

    // Render the intro popup if showIntroPopup is true
    if (showIntroPopup) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative mx-10 my-10 p-8">
            <h2 className="text-2xl font-bold mb-4">Important Information Before You Begin</h2>
            
            <div className="space-y-4 mb-6">
              <p>
                <strong>This Current Dementia Severity Status assesing form is comprehensive and divided into clear sections</strong> which includes detailed questions to accurately assess the patient's current dementia severity status.
              </p>
              
              <p>
                <strong>Why is it long?</strong> Dementia affects many aspects of a person's health and daily life. To provide an accurate assessment, we need to understand patient's:
              </p>
              
              <ul className="list-disc ml-6 space-y-2">              
                <li>Medical history and current health conditions</li>
                <li>Cognitive function and behavioral changes</li>
                <li>Daily living activities and independence</li>
                <li>Medication usage and lifestyle factors</li>
              </ul>
              
              <p>
            <strong>What you'll get:</strong> Once you've completed all sections, you’ll receive a personalized assessment of the patient’s dementia severity status — categorized as Low, Moderate, or High.
          </p>              
              
            </div>
            
            <div className="flex justify-center">
          <button
            onClick={startForm}
            className="bg-[rgb(0,106,113)] hover:bg-[rgb(72, 166, 167)] text-white font-bold py-2 px-6 rounded-md transition duration-200"
          >
            Continue to Form
          </button>
        </div>
      </div>
    </div>
  );
}

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
              <select name="DEM_TYPE" value={formData.DEM_TYPE || ""} onChange={handleChange} required className={getInputClassName("DEM_TYPE")}>
                <option value="">Select</option>
                <option value="0">No Dementia Diagnosis</option> 
                <option value="1">Alzheimer’s Disease</option> 
                <option value="2">Lewy Body Disease</option>
                <option value="3">Vascular Dementia</option> 
                <option value="4">Frontotemporal Dementia</option>
                <option value="5">Mixed Dementia</option> 
                <option value="6">Other Type</option>               
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
              <RequiredLabel text="Has the patient been diagnosed with Vitamin B12 deficiency?" />              
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
              <select name="VB12DEF" value={formData.VB12DEF || ""} onChange={handleChange} className={getInputClassName("VB12DEF")}>
                <option value="">Select</option>
                <option value="0">No, the patient does not have Vitamin B12 deficiency</option>
                <option value="1">Yes, the patient has been diagnosed with Vitamin B12 deficiency</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.VB12DEF && <p className="text-red-500">{errors.VB12DEF}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Does the patient have vision problems?" />
              <p className="text-gray-600 text-sm">
                Vision problems can affect daily activities and safety.
                Please select the option that best describes the patient's vision:
                <ul className="list-disc ml-4">
                  <li><b>No Vision Impairment:</b> The patient sees well without any issues.</li>
                  <li><b>Corrected Vision:</b> The patient has vision problems but uses glasses, contact lenses, or had surgery (e.g., cataract surgery) to improve vision.</li>
                  <li><b>Uncorrected Vision Loss:</b> The patient has difficulty seeing even with glasses or has untreated vision loss.</li>
                  <li><b>Unknown :</b> It is unclear if the patient has vision problems</li>
                </ul>
              </p>
              <select name="VISIMP" value={formData.VISIMP || ""} onChange={handleChange} className={getInputClassName("VISIMP")}>
                <option value="">Select</option>
                <option value="0">No, the patient has no vision impairment</option>
                <option value="1">Yes, the patient has vision problems but uses glasses or other corrections</option>
                <option value="2">Yes, the patient has untreated vision loss</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.VISIMP && <p className="text-red-500">{errors.VISIMP}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Does the patient have hearing difficulties?" />
              <p className="text-gray-600 text-sm">
                Hearing difficulties can affect communication and daily life.
                Please select the option that best describes the patient's hearing:
                <ul className="list-disc ml-4">
                  <li><b>No Hearing Impairment:</b> The patient hears well without any issues.</li>
                  <li><b>Hearing Impairment :</b> The patient has difficulty hearing, even with hearing aids.</li>
                  <li><b>Unknown :</b> It is unclear if the patient has hearing problems.</li>
                </ul>
              </p>
              <select name="HEARING" value={formData.HEARING || ""} onChange={handleChange} required className={getInputClassName("SEX")}>
                <option value="">Select</option>
                <option value="0">No, the patient has no hearing impairment</option>
                <option value="1">Yes, the patient has hearing impairment</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.SEX && <p className="text-red-500">{errors.SEX}</p>}
            </div>

            <div>
              {/* Initial Question: Does the patient have motor function issues? */}
              <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient experience any motor function issues?" />
                <select name="MOT" value={formData.MOT || ""} onChange={handleChange} className="border p-2 w-full" required>
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                {errors.SEX && <p className="text-red-500">{errors.SEX}</p>}
              </div>

              {/* Display Motor Function Questions ONLY if caregiver selects "Yes" */}
              {formData.MOT === "1" && (
                <div className="mt-4 p-4 border rounded-md bg-gray-100">
                  {/* Rigidity */}
                  <div className="space-y-2 mb-4">

                    <label className="font-bold text-gray-800">Does the patient experience stiffness or resistance to movement in any part of the body?</label>
                    <p className="text-gray-600 text-sm">
                      <b>Rigidity</b> refers to stiffness in different body areas, including the neck, upper limbs, and lower limbs.
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
                      <b>Leg agility</b> assesses the ability to move both legs freely and with coordination.
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
                    <select name="SLOWING" value={formData.SLOWING || ""} onChange={handleChange} className="border p-2 w-full" required>
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
            <RequiredLabel text="Does the patient experience any focal deficits?" />
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
              <select name="FOCL_STATUS" value={formData.FOCL_STATUS || ""} onChange={handleChange} required className={getInputClassName("FOCL_STATUS")}>
                <option value="">Select</option>
                <option value="0">No, the patient has no neurological deficits</option>
                <option value="1">Yes, the patient has symptoms but no significant movement or sensation loss</option>
                <option value="2">Yes, the patient has noticeable movement or sensation deficits</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.FOCL_STATUS && <p className="text-red-500">{errors.FOCL_STATUS}</p>}
            </div>
          </div>          
        )}

        {/* Section 3: Current Health Status of the Dementia Patient */}
        {currentSection === 3 && (
          <div>
            <div className="space-y-2 mb-4">
            <RequiredLabel text="Independence Level:" />
              <select name="INDEPEND" value={formData.INDEPEND || ""} onChange={handleChange} required className={getInputClassName("INDEPEND")}>
                <option value="">Select</option>
                <option value="1">Able to live independently</option>
                <option value="2">Requires some assistance with complex activities</option>
                <option value="3">Requires some assistance with basic activities</option>
                <option value="4">Completely dependent</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.INDEPEND && <p className="text-red-500">{errors.INDEPEND}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Smoking Status:" />
              <label className="font-bold text-gray-800"></label>
              <select name="SMOKING" value={formData.SMOKING || ""} onChange={handleChange} required className={getInputClassName("SMOKING")}>
                <option value="">Select</option>              
                <option value="1">Yes, currently smoking</option>
                <option value="0">No, not smoking</option>
              </select>
              {errors.SMOKING && <p className="text-red-500">{errors.SMOKING}</p>}
          </div>

          <div className="space-y-2 mb-4">
            <RequiredLabel text="Alcohol Consumption Frequency:" />
              <select name="ALCFREQ" value={formData.ALCFREQ || ""} onChange={handleChange} required className={getInputClassName("ALCFREQ")}>
              <option value="">Select</option>
              <option value="0">No alcohol consumption</option>
              <option value="1">Less than once a month</option>
              <option value="2">About once a month</option>
              <option value="3">About once a week</option>
              <option value="4">A few times a week</option>
              <option value="5">Daily or almost daily</option>   
              </select>
              {errors.ALCFREQ && <p className="text-red-500">{errors.ALCFREQ}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Has the patient had any appetite or eating problems in the past month?" />
              <p className="text-gray-600 text-sm">
                Appetite changes can include:
                <ul className="list-disc ml-4">
                  <li>Eating much less or more than usual</li>
                  <li>Unintentional weight loss or gain</li>
                  <li>Not feeling hungry or forgetting to eat</li>
                  <li>Struggling to chew or swallow food</li>
                </ul>
              </p>
              <select name="APP" value={formData.APP || ""} onChange={handleChange} required className={getInputClassName("APP")}>
                <option value="">Select</option>                
                <option value="1">Yes</option> 
                <option value="0">No</option>        
              </select>
              {errors.APP && <p className="text-red-500">{errors.APP}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Does the patient have sleep-related problems?" />
              <p className="text-gray-600 text-sm">
                Sleep problems can affect a person's rest and overall health.    
              </p>
              <select name="HAS_SLEEP_PROBLEMS" value={formData.HAS_SLEEP_PROBLEMS || ""} onChange={handleChange} required className={getInputClassName("HAS_SLEEP_PROBLEMS")}>
                <option value="">Select</option>
                <option value="1">Yes, the patient has sleep-related problems</option>
                <option value="0">No, the patient has no sleep-related problems</option>
              </select>
              {errors.HAS_SLEEP_PROBLEMS && <p className="text-red-500">{errors.HAS_SLEEP_PROBLEMS}</p>}
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
              <option value="0">No, the patient does not have apnea</option>
                <option value="1">Yes, the patient is currently experiencing apnea</option>
                <option value="2">Yes, the patient had apnea in the past but no longer does</option>
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
              <option value="0">No, the patient does not have REM Sleep Behavior Disorder</option>
                <option value="1">Yes, the patient is currently experiencing REM Sleep Behavior Disorder</option>
                <option value="2">Yes, the patient had REM Sleep Behavior Disorder in the past but no longer does</option>
              <option value="-1">Unknown</option>
            </select>
          </div>

          {/* Other Sleep Problems Question */}
          <div className="space-y-2 mb-4">
            <label className="font-bold text-gray-800">
              Does the patient have other sleep problems?
            </label>
            <select name="NITE" value={formData.NITE || ""} onChange={handleChange} className="border p-2 w-full" required>
              <option value="">Select</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
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
            <p className="mb-6 text-gray-900">
              <i><b>In this section, for the some questions below:</b> If unsure, please select <b>"Untestable"</b> or <b>"Unknown"</b> .
              If the patient has had Behavioural Changes, please select whether they are <b>recent or happened in the past but have improved</b>.</i>
            </p>
         
            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient experienced any difficulties with speaking or communicating?" />
  <p className="text-gray-600 text-sm">
    Changes in speech can make it harder for the patient to express themselves or be understood. 
    Some common speech difficulties include:
    <ul className="list-disc ml-4">
      <li>Speaking more slowly or struggling to find the right words</li>
      <li>Slurring words or having unclear speech</li>
      <li>Repeating words or sentences often</li>
      <li>Difficulty understanding what others are saying</li>
    </ul>                
  </p>

  <select name="SPEECH" value={formData.SPEECH || ""} onChange={handleChange} required className={getInputClassName("SPEECH")}>
    <option value="">Select</option>
    <option value="0">Normal</option>
    <option value="1">Slight loss of expression, diction, and/or volume</option>
    <option value="2">Monotone, slurred but understandable; moderately impaired</option>
    <option value="3">Marked impairment, difficult to understand</option>
    <option value="4">Unintelligible</option>
    <option value="-1">Untestable</option>
  </select>

  {errors.SPEECH && <p className="text-red-500">{errors.SPEECH}</p>}
</div>


            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient’s facial expression changed over time?" />
              <p className="text-gray-600 text-sm">
                Some medical conditions can cause <b>reduced facial expressions</b>, making the patient appear less expressive or "emotionless".  
              </p>
              <select name="FACEXP" value={formData.FACEXP || ""} onChange={handleChange} required className={getInputClassName("FACEXP")}>
                <option value="">Select</option>
                <option value="0">No, the patient has normal facial expressions</option>
                <option value="1">A slight reduction in facial expressions (a "poker face"), but still could be normal</option>
                <option value="2">Noticeably fewer facial expressions but still shows emotions</option>
                <option value="3">Difficulty making facial expressions, and their lips may remain slightly open.</option>
                <option value="4">Almost no facial expressions ("masked face"), and their lips remain significantly open.</option>
                <option value="-1">Untestable</option>
                </select>
                {errors.FACEXP && <p className="text-red-500">{errors.FACEXP}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Has the patient experienced urinary incontinence (loss of bladder control)?" />
              <p className="text-gray-600 text-sm">
                <b>Urinary incontinence</b> means the patient has trouble controlling their bladder, leading to accidental leakage. 
                This can include:
                <ul className="list-disc ml-4">
                  <li>Leaking urine when coughing, sneezing, or laughing</li>
                  <li>Sudden, strong urges to urinate but not making it in time</li>
                  <li>Frequent nighttime urination</li>
                </ul>
              </p>
              <select name="URINEINC" value={formData.URINEINC || ""} onChange={handleChange} required className={getInputClassName("URINEINC")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Untestable</option>
              </select>
              {errors.URINEINC && <p className="text-red-500">{errors.URINEINC}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Smoking Status:" />
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
              </p>
              <select name="BOWLINC" value={formData.BOWLINC || ""} onChange={handleChange} required className={getInputClassName("BOWLINC")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Untestable</option>
              </select>
              {errors.BOWLINC && <p className="text-red-500">{errors.BOWLINC}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Does the patient have difficulty walking or signs of a gait disorder?" />
              <p className="text-gray-600 text-sm">
                Signs of a gait disorder include:
                <ul className="list-disc ml-4">
                  <li>Shuffling or dragging feet</li>
                  <li>Unsteady or imbalanced walking</li>
                  <li>Taking smaller or slower steps</li>
                </ul>
              </p>
              <select name="MOGAIT" value={formData.MOGAIT || ""} onChange={handleChange} required className={getInputClassName("MOGAIT")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.MOGAIT && <p className="text-red-500">{errors.MOGAIT}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient experienced falls recently?" />              
              <select name="MOFALLS" value={formData.MOFALLS || ""} onChange={handleChange} required className={getInputClassName("MOFALLS")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.MOFALLS && <p className="text-red-500">{errors.MOFALLS}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Does the patient have tremors or shaking in their hands or body?" />
              <select name="MOTREM" value={formData.MOTREM || ""} onChange={handleChange} required className={getInputClassName("MOTREM")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.MOTREM && <p className="text-red-500">{errors.MOTREM}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Has the patient been moving more slowly than usual?" />              
              <select name="MOSLOW" value={formData.MOSLOW || ""} onChange={handleChange} required className={getInputClassName("MOSLOW")}>
                <option value="">Select</option>                
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.MOSLOW && <p className="text-red-500">{errors.MOSLOW}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Did the patient’s motor symptoms appear gradually or suddenly?" />
              <select name="MOMODE" value={formData.MOMODE || ""} onChange={handleChange} required className={getInputClassName("MOMODE")}>
                <option value="">Select</option>
                <option value="0">No motor symptoms</option> 
                <option value="1">Gradual</option>
                <option value="2">Subacute</option>
                <option value="3">Abrupt</option>
                <option value="4">Other</option>
                <option value="-1">Unknown</option>
              </select>   
              {errors.MOMODE && <p className="text-red-500">{errors.MOMODE}</p>}           
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Are the patient’s movement problems suggestive of Parkinsonism?" />              
              <select name="MOMOPARK" value={formData.MOMOPARK || ""} onChange={handleChange}  required className={getInputClassName("MOMOPARK")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.MOMOPARK && <p className="text-red-500">{errors.MOMOPARK}</p>}
            </div>
          </div>
        )}

        {/* Section 5: Health Conditions of the Patient */}
        {currentSection === 5 && (
          <div>
            <div className="space-y-2 mb-4">
              Choose "Absent" if the patient has never had it, "Recent/Active" if it’s ongoing, or "Remote/Inactive" if it occurred in the past but no longer affects the patient.
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Diabetes" />                        
              <select name="DIABET" value={formData.DIABET} onChange={handleChange} required className={getInputClassName("DIABET")}>
                <option value="select">Select</option>
                <option value="0">No</option>
                <option value="1">Yes, Type I</option>
                <option value="2">Yes, Type II</option>
                <option value="3">Yes, other type</option>               
                <option value="-1">Not assessed or unknown</option>              
              </select>
              {errors.DIABET && <p className="text-red-500">{errors.DIABET}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Hypertension" />              
              <select name="HYPERTEN" value={formData.HYPERTEN} onChange={handleChange} required className={getInputClassName("HYPERTEN")}>
                <option value="select">Select</option>
                <option value="0">Absent</option>
                <option value="1">Recent/Active</option>
                <option value="2">Remote/Inactive</option>             
              </select>
              {errors.HYPERTEN && <p className="text-red-500">{errors.HYPERTEN}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Hypercholesterolemia" />              
              <select name="HYPERCHO" value={formData.HYPERCHO} onChange={handleChange} required className={getInputClassName("HYPERCHO")}>
                <option value="select">Select</option>
                <option value="0">Absent</option>
                <option value="1">Recent/Active</option>
                <option value="2">Remote/Inactive</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.HYPERCHO && <p className="text-red-500">{errors.HYPERCHO}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient been diagnosed with a thyroid disease?" />
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
              <select name="THYDIS" value={formData.THYDIS || ""} onChange={handleChange} required className={getInputClassName("THYDIS")}>
                <option value="">Select</option>
                <option value="0">No, the patient does not have thyroid disease</option>
                <option value="1">Yes, the patient has been diagnosed with thyroid disease</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.THYDIS && <p className="text-red-500">{errors.THYDIS}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient experienced Angina?" />
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
              <select name="CVANGINA" value={formData.CVANGINA || ""} onChange={handleChange} required className={getInputClassName("CVANGINA")}>
                <option value="">Select</option>
                <option value="0">Absent (No history of angina)</option>
                <option value="1">Recent/Active (Currently experiencing symptoms)</option>
                <option value="2">Remote/Inactive (Had angina in the past but no longer active)</option>    
              </select>
              {errors.CVANGINA && <p className="text-red-500">{errors.CVANGINA}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient been diagnosed with Congestive Heart Failure (CHF)?" />              
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
              <select name="CVCHF" value={formData.CVCHF || ""} onChange={handleChange} required className={getInputClassName("CVCHF")}>
                <option value="">Select</option>
                <option value="0">Absent (No history of CHF)</option>
                <option value="1">Recent/Active (Currently diagnosed and experiencing symptoms)</option>
                <option value="2">Remote/Inactive (Had CHF in the past but no longer active)</option>
              </select>
              {errors.CVCHF && <p className="text-red-500">{errors.CVCHF}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient had a heart attack or cardiac arrest?" />              
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
              <select name="CVHATT" value={formData.CVHATT || ""} onChange={handleChange} required className={getInputClassName("CVHATT")}>
                <option value="">Select</option>
                <option value="0">Absent (No history of heart attack)</option>
                <option value="1">Recent/Active (Occurred recently and still affecting the patient)</option>
                <option value="2">Remote/Inactive (Occurred in the past but no longer active)</option>
              </select>
              {errors.CVHATT && <p className="text-red-500">{errors.CVHATT}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Has the patient ever been diagnosed with Atrial Fibrillation (an irregular heartbeat)?" />              
              <select name="CVAFIB" value={formData.CVAFIB} onChange={handleChange} required className={getInputClassName("CVAFIB")}>
                <option value="">Select</option>
                <option value="0">Absent (No history of Atrial Fibrillation)</option>
                <option value="1">Recent/Active (Currently diagnosed with Atrial Fibrillation)</option>
                <option value="2">Remote/Inactive (Had Atrial Fibrillation in the past but no longer active)</option>
              </select>
              {errors.CVAFIB && <p className="text-red-500">{errors.CVAFIB}</p>}
            </div>

            <div className="space-y-2 mb-4">              
              <label className="font-bold text-gray-800">
                Has the patient been diagnosed with any other cardiovascular disease not mentioned previously?
              </label>
              <select name="CVOTHR" value={formData.CVOTHR || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="0">No, the patient do carrdiovascular diseases</option>
                <option value="1">Yes, the patient has been diagnosed with other cardiovascular diseases</option>
                <option value="2">Remote/Inactive</option>
                <option value="-1">Unknown</option>
              </select>              
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient ever had a Transient Ischemic Attack (TIA or mini-stroke)?" />
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
              <select name="TIA" value={formData.TIA || ""} onChange={handleChange} required className={getInputClassName("TIA")}>
              <option value="">Select</option>
              <option value="0">No, the patient has never had a TIA</option>
              <option value="1">Yes, the patient had a recent single TIA</option>
              <option value="2">Yes, the patient had a past single TIA</option>
              <option value="3">Yes, the patient had recent multiple TIAs</option>
              <option value="4">Yes, the patient had past multiple TIAs</option>
              <option value="-1">Unknown</option>
              </select>
            {errors.TIA && <p className="text-red-500">{errors.TIA}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient ever had a stroke?" />  
              <p className="text-gray-600 text-sm">
                A <b>stroke</b> happens when blood flow to the brain is blocked or a blood vessel bursts, causing brain damage. 
                If the patient has had more than one stroke, please select whether the strokes were <b>recent or in the past</b>.
              </p>
              <select name="STROKE" value={formData.STROKE || ""} onChange={handleChange} required className={getInputClassName("STROKE")}>
                <option value="">Select</option>
                <option value="0">No, the patient has never had a stroke</option>
                <option value="1">Yes, the patient had a recent single stroke</option>
                <option value="3">Yes, the patient had a past single stroke</option>
                <option value="2">Yes, the patient had recent multiple strokes</option>
                <option value="4">Yes, the patient had past multiple strokes</option>
              </select>
              {errors.STROKE && <p className="text-red-500">{errors.STROKE}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient ever had a head injury (Traumatic Brain Injury - TBI)?" />
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
              <select name="TBI" value={formData.TBI || ""}  onChange={handleChange} required className={getInputClassName("TBI")}>
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
<RequiredLabel text="Seizures:" />  
  <select name="SEIZURES" value={formData.SEIZURES || ""} required className={getInputClassName("SEIZURES")}>
    <option value="">Select</option>
    <option value="0">Absent (No history of Seizures)</option>
    <option value="1">Recent/Active (Occurred recently and still affecting the patient)</option>
    <option value="2">Remote/Inactive (Occurred in the past but no longer active)</option>
    <option value="-1">Unknown</option>
    </select>
    {errors.SEIZURES && <p className="text-red-500">{errors.SEIZURES}</p>}
</div>
</div>
)}

        {/* Section 6: Mental Health */}
        {currentSection === 6 && (
          <div>
            <div className="space-y-2 mb-4">
              <RequiredLabel text="Depression" />              
              <p className="text-gray-600 text-sm">
                Depression can affect mood, energy, and interest in activities.
                Please select the option that best describes the patient:
              </p>
              <select name="DEPRESSION" value={formData.DEPRESSION || ""} onChange={handleChange} required className={getInputClassName("DEPRESSION")}>
                <option value="">Select</option>
                <option value="0">No, the patient does not show signs of depression</option>
                <option value="1">Yes, the patient has mild symptoms of depression</option>
                <option value="2">Yes, the patient has severe depression symptoms</option>
              </select>
              {errors.DEPRESSION && <p className="text-red-500">{errors.DEPRESSION}</p>}
            </div>

            <div className="space-y-2 mb-4">
            <RequiredLabel text="Does the patient seem anxious, nervous, or overly worried?" />
              <p className="text-gray-600 text-sm">
                Anxiety can cause restlessness, excessive worry, or physical symptoms like a racing heartbeat.  
                Please select the best option:
              </p>
              <select name="BEANX" value={formData.BEANX || ""} onChange={handleChange} required className={getInputClassName("BEANX")}>
                <option value="">Select</option>
                <option value="0">No, the patient does not show signs of anxiety</option>
                <option value="1">Yes, the patient has mild anxiety</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.BEANX && <p className="text-red-500">{errors.BEANX}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient believe things that are not true (delusions)?" />              
              <p className="text-gray-600 text-sm">
                Delusions are <b>false beliefs</b> that the patient strongly believes, even when they are not real.  
                Examples include:
                <ul className="list-disc ml-4">
                  <li>Believing someone is stealing from them when no one is</li>
                  <li>Thinking they are in danger when they are not</li>
                  <li>Believing they have special abilities or powers</li>
                 </ul>
              </p>
              <select name="BEDEL" value={formData.BEDEL || ""} onChange={handleChange} required className={getInputClassName("BEDEL")}>
                <option value="">Select</option>
                <option value="0">No, the patient does not have delusions</option>
                <option value="1">Yes, the patient has mild delusions</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.BEDEL && <p className="text-red-500">{errors.BEDEL}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient seem restless, agitated, or easily frustrated?" />              
              <p className="text-gray-600 text-sm">
                Agitation includes **restlessness, pacing, or getting upset easily.**  
                Please select the best option:
              </p>

              <select name="BEAGIT" value={formData.BEAGIT || ""} onChange={handleChange} required className={getInputClassName("BEAGIT")}>
                <option value="">Select</option>
                <option value="0">No, the patient does not show signs of agitation</option>
                <option value="1">Yes, the patient has mild agitation</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.BEAGIT && <p className="text-red-500">{errors.BEAGIT}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient become more easily irritated or short-tempered?" />            
              <p className="text-gray-600 text-sm">
                Some patients may become more easily annoyed or upset than before. 
                Please select the best option:
              </p>
              <select name="BEIRRIT" value={formData.BEIRRIT || ""} onChange={handleChange} required className={getInputClassName("BEIRRIT")}>
                <option value="">Select</option>
                <option value="0">No, the patient is not more irritable</option>
                <option value="1">Yes, the patient is somewhat more irritable</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.BEIRRIT && <p className="text-red-500">{errors.BEIRRIT}</p>}
            </div>

            <div className="space-y-2">
              <RequiredLabel text="Has the patient been acting impulsively or saying things without thinking?" />              
              <p className="text-gray-600 text-sm">
                <b>Disinhibition</b> means a person may act in ways that seem inappropriate or impulsive, such as:
                <ul className="list-disc ml-4">
                  <li>Speaking or behaving in a way that is socially inappropriate</li>
                  <li>Interrupting conversations or making rude comments</li>
                  <li>Acting without considering the consequences</li>
                  <li>Being unusually talkative or over-friendly with strangers</li>
                </ul>
              </p>
              <select name="BEDISIN" value={formData.BEDISIN || ""} onChange={handleChange} required className={getInputClassName("BEDISIN")}>
                <option value="">Select</option>
                <option value="0">No, the patient does not show disinhibition</option>
                <option value="1">Yes, the patient has mild disinhibition</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.BEDISIN && <p className="text-red-500">{errors.BEDISIN}</p>}
            </div>

            <div className="space-y-2">
              <RequiredLabel text="Has the patient lost motivation or interest in things, even when encouraged?" />
              <p className="text-gray-600 text-sm">
                <b>Apathy</b> refers to a <b>lack of motivation, emotional response, or concern about things</b> that the patient used to care about.  
                This is different from depression—it means the patient <b>doesn’t feel interested or bothered by anything, even when others try to engage them.</b>  
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

              <select name="APATHY" value={formData.APATHY || ""} onChange={handleChange} required className={getInputClassName("APATHY")}>
                <option value="">Select</option>
                <option value="0">No, the patient is motivated and interested in activities</option>
                <option value="1">Yes, the patient has mild apathy</option>
                <option value="2">Yes, the patient has moderate apathy</option>
                <option value="3">Yes, the patient has severe apathy and shows no interest in activities</option>
                <option value="-1">Unknown</option> 
              </select>
              {errors.APATHY && <p className="text-red-500">{errors.APATHY}</p>}
            </div>

            <div className="space-y-2">
              <RequiredLabel text="Has the patient been unusually happy, excited, or overly cheerful without reason?" />             
              <p className="text-gray-600 text-sm">
                <b>Elation</b> refers to an abnormal, excessive sense of happiness or excitement, such as:
                <ul className="list-disc ml-4">
                  <li>Laughing or smiling excessively without an obvious reason</li>
                  <li>Appearing overly energetic or "high-spirited" at inappropriate times</li>
                  <li>Acting in a way that is unusually excited compared to their normal behavior</li>
                </ul>
              </p>
              <select name="ELAT" value={formData.ELAT || ""} onChange={handleChange} required className={getInputClassName("ELAT")}>
                <option value="">Select</option>
                <option value="0">No, the patient has normal emotional responses</option>
                <option value="1">Yes, the patient is slightly more elated than usual</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.ELAT && <p className="text-red-500">{errors.ELAT}</p>}
            </div>            

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient experienced noticeable emotional changes?" />                        
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
              <select name="EMOT" value={formData.EMOT || ""} onChange={handleChange} required className={getInputClassName("EMOT")}>
                <option value="">Select</option>
                <option value="0">No, the patient has not had emotional changes</option>
                <option value="1">Yes, the patient is currently experiencing emotional changes</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.EMOT && <p className="text-red-500">{errors.EMOT}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient ever been diagnosed with Bipolar Disorder?" />              
              <p className="text-gray-600 text-sm">
                <b>Bipolar Disorder</b> is a mental health condition that causes extreme mood swings, including:
                <ul className="list-disc ml-4">
                  <li>Periods of feeling very happy, energetic, or "high" (mania)</li>
                  <li>Periods of feeling very sad, hopeless, or tired (depression)</li>
                  <li>Sudden changes in mood, energy, or behavior</li>
                </ul>
                If unsure, please select <b>Unknown</b>.
              </p>
              <select name="BIPOLAR" value={formData.BIPOLAR || ""} onChange={handleChange} required className={getInputClassName("BIPOLAR")}>
                <option value="">Select</option>
                <option value="0">No, the patient has never been diagnosed with Bipolar Disorder</option>
                <option value="1">Yes, the patient has been diagnosed</option>
                <option value="2">Remote/Inactive</option>
                <option value="-1">Unknown</option>               
              </select>
              {errors.BIPOLAR && <p className="text-red-500">{errors.BIPOLAR}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient ever been diagnosed with Schizophrenia?" />              
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
                <select name="SCHIZ" value={formData.SCHIZ || ""} onChange={handleChange} required className={getInputClassName("SCHIZ")}>
                  <option value="">Select</option>
                  <option value="0">No, the patient has never been diagnosed with Schizophrenia</option>
                  <option value="1">Yes, the patient has been diagnosed</option>
                  <option value="2">Remote/Inactive</option>
                  <option value="-1">Unknown</option>
                </select>
                {errors.SCHIZ && <p className="text-red-500">{errors.SCHIZ}</p>}
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
                  <option value="2">Remote/Inactive</option>
                  <option value="-1">Unknown</option>
                </select>                
            </div>
          </div>
        )} 

        {/* Section 7: Functional Activities */}
        {currentSection === 7 && (          
          <div>
            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient have difficulty taking care of personal hygiene or daily self-care?" />              
              <p className="text-gray-600 text-sm"> Personal care includes tasks like bathing, dressing, or brushing teeth.  
              If the patient has difficulty, please select the best option:
              </p>
              <select name="PERSCARE" value={formData.PERSCARE || ""} onChange={handleChange} required className={getInputClassName("PERSCARE")}>
                <option value="">Select</option>
                <option value="0">No, the patient can manage self-care independently</option>
                <option value="1">Yes, the patient needs some assistance</option>
                <option value="2">Yes, the patient is moderate dependent on others</option>
                <option value="3">Yes, the patient is severely dependent on others</option>
              </select>
              {errors.PERSCARE && <p className="text-red-500">{errors.PERSCARE}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient prefer to stay at home rather than going out and doing new things?" />              
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
              <select name="STAYHOME" value={formData.STAYHOME || ""} onChange={handleChange} required className={getInputClassName("STAYHOME")}>
                <option value="">Select</option>
                <option value="0">No, the patient enjoys going out and trying new things</option>
                <option value="1">Yes, the patient prefers to stay home but still goes out sometimes</option>
                <option value="2">Yes, the patient avoids going out and prefers staying home</option>
              </select>
              {errors.STAYHOME && <p className="text-red-500">{errors.STAYHOME}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="In the past four weeks, has the patient had difficulty managing finances?" />              
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

              <select name="BILLS" value={formData.BILLS || ""} onChange={handleChange} required className={getInputClassName("BILLS")}>
                <option value="">Select</option>
                <option value="0">No, the patient manages finances normally</option>
                <option value="1">Yes, the patient has some difficulty but can still do it alone</option>
                <option value="2">Yes, the patient requires assistance with finances</option>
                <option value="3">Yes, the patient is fully dependent on others for finances</option>
                <option value="4">The patient never managed finances or is no longer interested/able</option>
              </select>
              {errors.BILLS && <p className="text-red-500">{errors.BILLS}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="In the past four weeks, has the patient had difficulty managing tax records or business affairs?" />              
              <p className="text-gray-600 text-sm">
                Managing tax records and business affairs includes tasks like:
                <ul className="list-disc ml-4">
                  <li>Gathering tax documents or financial records</li>
                  <li>Filing tax returns or understanding tax-related paperwork</li>
                  <li>Handling business affairs, investments, or legal documents</li>
                </ul>
                <b>If the patient never managed taxes before or is now unable to handle them, please select "Never Managed / No Longer Interested.</b>
              </p>

              <select name="TAXES" value={formData.TAXES || ""} onChange={handleChange} required className={getInputClassName("TAXES")}>
                <option value="">Select</option>
                <option value="0">No, the patient manages tax records and business affairs normally</option>
                <option value="1">Yes, the patient has some difficulty but can still do it alone</option>
                <option value="2">Yes, the patient requires assistance with tax records or business affairs</option>
                <option value="3">Yes, the patient is fully dependent on others for taxes and business affairs</option>
                <option value="4">The patient never managed taxes or is no longer interested</option>
               </select>
               {errors.TAXES && <p className="text-red-500">{errors.TAXES}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="In the past four weeks, has the patient had difficulty using kitchen appliances (e.g., stove, kettle, coffee maker)?" />
              <p className="text-gray-600 text-sm">
                This includes simple kitchen tasks like:
                <ul className="list-disc ml-4">
                  <li>Heating water or making a cup of coffee</li>
                  <li>Turning the stove on and off safely</li>
                  <li>Remembering to turn off appliances after use</li>
                </ul>
                <b>If the patient is no longer interested or able to use kitchen appliances, please select "No Longer Interested".</b>
              </p>

              <select name="STOVE" value={formData.STOVE || ""}  onChange={handleChange} required className={getInputClassName("STOVE")}>
                <option value="">Select</option>
                <option value="0">No, the patient uses kitchen appliances normally</option>
                <option value="1">Yes, the patient has some difficulty but can still do it alone</option>
                <option value="2">Yes, the patient requires assistance with kitchen appliances</option>
                <option value="3">Yes, the patient is fully dependent on others for kitchen tasks</option>
                <option value="4">The patient is no longer interested to use kitchen appliances</option>
              </select>
              {errors.STOVE && <p className="text-red-500">{errors.STOVE}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="In the past four weeks, has the patient had difficulty preparing meals?" />              
              <p className="text-gray-600 text-sm">
                Preparing a meal includes:
                <ul className="list-disc ml-4">
                  <li>Planning and making a balanced meal</li>
                  <li>Following a simple recipe</li>
                  <li>Using kitchen tools and ingredients safely</li>
                </ul>
                <b>If the patient never cooked before or is now unable to prepare meals, please select "Never Did / No Longer Interested or Able".</b>
              </p>
              
              <select name="MEALPREP" value={formData.MEALPREP || ""} onChange={handleChange} required className={getInputClassName("MEALPREP")}>
                <option value="">Select</option>
                <option value="0">No, the patient prepares meals normally</option>
                <option value="1">Yes, the patient has some difficulty but can still do it alone</option>
                <option value="2">Yes, the patient requires assistance with meal preparation</option>
                <option value="3">Yes, the patient is fully dependent on others for meals</option>
                <option value="4">The patient never cooked or is no longer interested/able</option>
              </select>
              {errors.MEALPREP && <p className="text-red-500">{errors.MEALPREP}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="In the past four weeks, has the patient had difficulty keeping track of current events?" />              
              <p className="text-gray-600 text-sm">
                This includes:
                <ul className="list-disc ml-4">
                  <li>Following the news (TV, newspaper, online, or radio)</li>
                  <li>Keeping up with local or world events</li>
                  <li>Remembering major happenings in the community or country</li>
                </ul>
                <b>If the patient never followed current events or it was not noticed, select "Not Applicable".</b>
              </p>
              <select name="EVENTS" value={formData.EVENTS || ""} onChange={handleChange} required className={getInputClassName("EVENTS")}>
                <option value="">Select</option>
                <option value="0">No, the patient keeps track of current events normally</option>
                <option value="1">Yes, the patient has some difficulty but still does it alone</option>
                <option value="2">Yes, the patient requires assistance to stay updated</option>
                <option value="3">Yes, the patient is fully dependent on others for information</option>
                <option value="4">Not Applicable (Never did)</option>
                <option value="-1">Not noticed</option>
              </select>
              {errors.EVENTS && <p className="text-red-500">{errors.EVENTS}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="In the past four weeks, has the patient had difficulty paying attention to and understanding a TV program, book, or magazine?" />
              <p className="text-gray-600 text-sm">
                This includes:
                <ul className="list-disc ml-4">
                  <li>Following a storyline in a book or TV show</li>
                  <li>Understanding what they read or watch</li>
                  <li>Maintaining focus without getting distracted</li>
                </ul>
                <b>If the patient never watched TV or read books, or this was not noticed, select "Not Applicable".</b>
              </p>

              <select name="PAYATTN" value={formData.PAYATTN || ""} onChange={handleChange} required className={getInputClassName("PAYATTN")}>
                <option value="">Select</option>
                <option value="0">No, the patient pays attention normally</option>
                <option value="1">Yes, the patient has some difficulty but still follows along</option>
                <option value="2">Yes, the patient requires assistance to understand</option>
                <option value="3">Yes, the patient is fully dependent on others for explanations</option>
                <option value="4">Not Applicable (Never did / Not noticed)</option>
                <option value="-1">Not noticed</option> 
              </select>
              {errors.PAYATTN && <p className="text-red-500">{errors.PAYATTN}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="In the past four weeks, has the patient had difficulty remembering important dates?" />
              <p className="text-gray-600 text-sm">
                Important dates include:
                <ul className="list-disc ml-4">
                  <li>Doctor’s appointments or medication schedules</li>
                  <li>Family events, birthdays, or holidays</li>
                  <li>Anniversaries or significant personal events</li>
                </ul>
                <b>If the patient never handled remembering dates, select "Not Applicable".</b>
              </p>
            <select name="REMDATES" value={formData.REMDATES || ""} onChange={handleChange} required className={getInputClassName("REMDATES")}>
              <option value="">Select</option>
              <option value="0">No, the patient remembers important dates normally</option>
              <option value="1">Yes, the patient has some difficulty but still remembers</option>
              <option value="2">Yes, the patient requires reminders or assistance</option>
              <option value="3">Yes, the patient is fully dependent on others for reminders</option>
              <option value="4">Not Applicable (Never did)</option>
            </select>
            {errors.REMDATES && <p className="text-red-500">{errors.REMDATES}</p>}
         </div>

         <div className="space-y-2 mb-4">
          <RequiredLabel text="In the past four weeks, has the patient had difficulty traveling outside their neighborhood?" />          
          <p className="text-gray-600 text-sm">
            Traveling independently includes:
            <ul className="list-disc ml-4">
              <li>Driving safely</li>
              <li>Using public transportation (bus, train, taxi, etc.)</li>
              <li>Arranging for rides or navigating new places</li>
            </ul>
            <b>If the patient never traveled alone or this was not noticed, select "Not Applicable".</b>
          </p>

          <select name="TRAVEL" value={formData.TRAVEL || ""} onChange={handleChange} required className={getInputClassName("TRAVEL")}>
            <option value="">Select</option>
            <option value="0">No, the patient travels independently without difficulty</option>
            <option value="1">Yes, the patient has some difficulty but still manages alone</option>
            <option value="2">Yes, the patient requires assistance with travel</option>
            <option value="3">Yes, the patient is fully dependent on others for transportation</option>
            <option value="4">Not Applicable (Never did)</option>
          </select>
          {errors.TRAVEL && <p className="text-red-500">{errors.TRAVEL}</p>}
          </div>
        </div>
        )}   

        {currentSection === 8 && (  
          <div>
            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient shown noticeable memory problems compared to before?" />
              <p className="text-gray-600 text-sm">
                Signs of memory problems include:
                <ul className="list-disc ml-4">
                  <li>Forgetting recent conversations or events</li>
                  <li>Repeating questions or stories frequently</li>
                  <li>Struggling to recall familiar names or places</li>
                </ul>
              </p>
              <select name="COGMEM" value={formData.COGMEM || ""} onChange={handleChange} required className={getInputClassName("COGMEM")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              {errors.COGMEM && <p className="text-red-500">{errors.COGMEM}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient have trouble knowing where they are or what time it is?" />
              <p className="text-gray-600 text-sm">
                Signs of orientation problems include:
                <ul className="list-disc ml-4">
                  <li>Getting lost in familiar places</li>
                  <li>Not knowing the current date, year, or season</li>
                  <li>Confusing day and night</li>
                </ul>
              </p>
              <select name="COGORI" value={formData.COGORI || ""} onChange={handleChange} required className={getInputClassName("COGORI")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.COGORI && <p className="text-red-500">{errors.COGORI}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient have difficulty making decisions or solving problems?" />
              <p className="text-gray-600 text-sm">
                Signs of judgment or problem-solving issues include:
                <ul className="list-disc ml-4">
                  <li>Making poor financial or safety decisions</li>
                  <li>Struggling to plan daily tasks (e.g., making a grocery list)</li>
                  <li>Having trouble following multi-step instructions</li>
                </ul>
              </p>
              <select name="COGJUDG" value={formData.COGJUDG || ""} onChange={handleChange} required className={getInputClassName("COGJUDG")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.COGJUDG && <p className="text-red-500">{errors.COGJUDG}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Has the patient developed difficulty speaking or understanding language?" />
              <p className="text-gray-600 text-sm">
                Signs of language problems include:
                <ul className="list-disc ml-4">
                  <li>Struggling to find the right words</li>
                  <li>Difficulty following conversations</li>
                  <li>Substituting incorrect words (e.g., saying "clock" instead of "phone")</li>
                </ul>
              </p>
              <select name="COGLANG" value={formData.COGLANG || ""} onChange={handleChange} required className={getInputClassName("COGLANG")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.COGLANG && <p className="text-red-500">{errors.COGLANG}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient have trouble recognizing objects or judging distances?" />
              <p className="text-gray-600 text-sm">
                Signs of visuospatial issues include:
                <ul className="list-disc ml-4">
                  <li>Difficulty recognizing faces or objects</li>
                  <li>Struggling with depth perception (e.g., misjudging steps or curbs)</li>
                  <li>Getting confused when reading maps or following directions</li>
                </ul>
              </p>
              <select name="COGVIS" value={formData.COGVIS || ""} onChange={handleChange} required className={getInputClassName("COGVIS")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.COGVIS && <p className="text-red-500">{errors.COGVIS}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient struggle to focus or pay attention?" />
              <p className="text-gray-600 text-sm">
                Signs of attention problems include:
                <ul className="list-disc ml-4">
                  <li>Getting easily distracted</li>
                  <li>Struggling to stay engaged in a conversation</li>
                  <li>Difficulty following a task from start to finish</li>
                </ul>
              </p>
              <select name="COGATTN" value={formData.COGATTN || ""} onChange={handleChange} required className={getInputClassName("COGATTN")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.COGATTN && <p className="text-red-500">{errors.COGATTN}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <RequiredLabel text="Does the patient’s thinking ability fluctuate, with good and bad periods?" />
              <p className="text-gray-600 text-sm">
                Signs of fluctuating cognition include:
              <ul className="list-disc ml-4">
                <li>Having clear, alert moments followed by periods of confusion</li>
                <li>Some days appearing completely normal, other days very forgetful</li>
                <li>Random periods of disorientation</li>
              </ul>
              </p>
              <select name="COGFLUC" value={formData.COGFLUC || ""} onChange={handleChange} required className={getInputClassName("COGFLUC")}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
              {errors.COGFLUC && <p className="text-red-500">{errors.COGFLUC}</p>}
            </div>

            <div className="space-y-2 mb-4">
              <label className="font-bold text-gray-800">
                Does the patient have cognitive problems that don’t fit into the previous categories?
              </label>
              <select name="COGOTHR" value={formData.COGOTHR || ""} onChange={handleChange} className="border p-2 w-full" required>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
                <option value="-1">Unknown</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
               <RequiredLabel text="Has the patient's memory or thinking ability declined suddenly?" />
               <select name="ABRUPT" value={formData.ABRUPT || ""} onChange={handleChange} required className={getInputClassName("ABRUPT")}>
                <option value="">Select</option>
                <option value="0">No, the decline has been slow and gradual</option>
                <option value="1">Yes, the decline happened suddenly</option>
                <option value="-1">Unknown</option>  
               </select>
               {errors.ABRUPT && <p className="text-red-500">{errors.ABRUPT}</p>}
            </div>           
    
            <div className="space-y-2 mt-4">
              <RequiredLabel text="Enter the patient's cognitive test score:" />              
              <input type="number" name="NACCMOCA" value={formData.NACCMOCA || ""} onChange={handleChange} required className={getInputClassName("NACCMOCA")} />
              {errors.NACCMOCA && <p className="text-red-500">{errors.NACCMOCA}</p>} 
            </div>     
      </div>
    )}

{currentSection === 9 && (
  <div>
    {medicationQuestions.map((med, index) => {
      // Determine if this is one of the special medication questions that needs "Not Sure" option
      const isSpecialMedication = [
        "NACCADMD", "NACCAANX", "NACCAPSY", "NACCVASD", 
        "NACCAAAS", "NACCACEI", "NACCANGI"
      ].includes(med.name);

      return (
        <div key={index} className="mb-4">
          {/* Question row with self-stretching container */}
          <div className="flex items-center">
            {/* Question text container that can grow and wrap */}
            <div className="flex-1">
              <label className="font-semibold">
                {index + 1}. {med.question}
              </label>
            </div>

            {/* Icon container (fixed size, centered vertically) */}
            <div className="flex items-center justify-center w-6 h-auto ml-2">
              <AiOutlineQuestionCircle 
                className="text-blue-500 cursor-pointer text-xl"
                onClick={() => openPopup(med.details)} 
              />
            </div>
          </div>

          <div className={`flex justify-between mt-2 px-6 ${isSpecialMedication ? 'space-x-2' : 'space-x-4'}`}>
            <label className="inline-flex items-center flex-grow justify-center">
              <input 
                type="radio" 
                name={med.name} 
                value="Yes" 
                onChange={handleChange} 
                className="mr-2" 
                checked={formData[med.name] === "Yes"}
              />
              Yes
            </label>
            <label className="inline-flex items-center flex-grow justify-center">
              <input 
                type="radio" 
                name={med.name} 
                value="No" 
                onChange={handleChange} 
                className="mr-2" 
                checked={formData[med.name] === "No"}
              />
              No
            </label>
            {isSpecialMedication && (
              <label className="inline-flex items-center flex-grow justify-center">
                <input 
                  type="radio" 
                  name={med.name} 
                  value="Not Sure" 
                  onChange={handleChange} 
                  className="mr-2" 
                  checked={formData[med.name] === "Not Sure"}
                />
                Not Sure
              </label>
            )}
          </div>           
        </div>
      );
    })}
  </div>
)}

    {popupContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative my-10">
          {/* Close button */}
        <div className="sticky top-0 right-0 p-3 flex justify-end bg-white z-10">
          <button 
            onClick={closePopup}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
        </div>

          {/* Content starts after the close button with increased margin around the content */}
          <div className="pt-10 p-10 text-gray-700 whitespace-pre-line">
            {popupContent}
          </div>
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
            }
          />
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
      <button
        type="submit"
        className="bg-[rgb(0,106,113)] text-white p-2 rounded-md w-full"
        onClick={handleSubmit}
      >
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