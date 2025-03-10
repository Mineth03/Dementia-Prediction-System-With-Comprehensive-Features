import React, { useState } from 'react';

const HealthForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    // Demographics
    NACCAGE: '',
    SEX: '',
    EDUC: '',
    MARISTAT: '',
    NACCLIVS: '',

    // Family History
    NACCFAM: '',
    NACCFADM: '',
    
    // Medical Conditions
    Diabetes: '',
    Hypertension: '',
    Hypercholesterolemia: '',
    PD: '',
    Stroke: '',
    TIA: '',
    TBI: '',
    
    // Cognitive Function
    COGMEM: '',
    COGORI: '',
    COGJUDG: '',
    COGLANG: '',
    COGVIS: '',
    COGATTN: '',
    
    // Neuropsychiatric Symptoms
    Depression: '',
    Anxiety: '',
    Apathy: '',
    Delusions: '',
    Hallucinations: '',
    
    // Physical Examination & Vitals
    NACCBMI: '',
    BPSYS: '',
    BPDIAS: '',
    HRATE: '',
    
    // Functional Activities
    BILLS: '',
    REMDATES: '',
    PERSCARE: '',
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
      <h2>Demographics</h2>
      <label>Age:</label>
      <input type="number" name="NACCAGE" value={formData.NACCAGE} onChange={handleChange} required />

      <label>Sex:</label>
      <select name="SEX" value={formData.SEX} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <label>Education (Years):</label>
      <input type="number" name="EDUC" value={formData.EDUC} onChange={handleChange} required />

      <label>Marital Status:</label>
      <select name="MARISTAT" value={formData.MARISTAT} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="Single">Single</option>
        <option value="Married">Married</option>
        <option value="Divorced">Divorced</option>
        <option value="Widowed">Widowed</option>
      </select>

      <label>Living Situation:</label>
      <select name="NACCLIVS" value={formData.NACCLIVS} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="Alone">Alone</option>
        <option value="With Family">With Family</option>
        <option value="Assisted Living">Assisted Living</option>
      </select>

      <h2>Caregiver/Guardian Section</h2>
      <p>Please answer the following questions about the patient.</p>

      <h3>Family History</h3>
      <div>
        <label>Does the patient have a parent or sibling with cognitive impairment? (Yes/No)</label>
        <select name="NACCFAM" value={formData.NACCFAM} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div>
        <label>Is there evidence of a dominantly inherited Alzheimer's mutation in the patient's family? (Yes/No)</label>
        <select name="NACCFADM" value={formData.NACCFADM} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <h3>Medical Conditions</h3>
      {[
        { key: 'Diabetes', label: 'Diabetes' },
        { key: 'Hypertension', label: 'Hypertension' },
        { key: 'Hypercholesterolemia', label: 'Hypercholesterolemia' },
        { key: 'PD', label: "Parkinson’s disease" },
        { key: 'Stroke', label: 'Stroke' },
        { key: 'TIA', label: 'Transient ischemic attack (TIA)' },
        { key: 'TBI', label: 'Traumatic brain injury (TBI)' }
      ].map(({ key, label }) => (
        <div key={key}>
          <label>Has the patient ever been diagnosed with {label}? (Yes/No)</label>
          <select name={key} value={formData[key]} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      ))}

      <h3>Cognitive Function</h3>
      {[
        { key: 'COGMEM', label: 'memory impairment' },
        { key: 'COGORI', label: 'orientation impairment' },
        { key: 'COGJUDG', label: 'executive function impairment (judgment, planning, problem-solving)' },
        { key: 'COGLANG', label: 'language impairment' },
        { key: 'COGVIS', label: 'visuospatial function impairment' },
        { key: 'COGATTN', label: 'attention or concentration impairment' }
      ].map(({ key, label }) => (
        <div key={key}>
          <label>Does the patient currently exhibit {label}? (Yes/No)</label>
          <select name={key} value={formData[key]} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      ))}

      <h3>Functional Activities</h3>
      {[
        { key: 'BILLS', label: 'Handling finances (writing checks, paying bills, balancing a checkbook)' },
        { key: 'REMDATES', label: 'Managing medications or remembering important dates' },
        { key: 'PERSCARE', label: 'Performing personal care tasks' }
      ].map(({ key, label }) => (
        <div key={key}>
          <label>Does the patient have difficulty with {label}? (Yes/No)</label>
          <select name={key} value={formData[key]} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};

export default HealthForm;



  




