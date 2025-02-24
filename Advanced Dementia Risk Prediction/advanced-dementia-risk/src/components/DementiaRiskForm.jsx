import React, { useState, useEffect } from 'react';
import Button from "./ui/Button";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import Input from "./ui/Input";
import Label from "./ui/Label";
import Select from "./ui/Select";
import SelectItem from "./ui/SelectItem";

const DementiaRiskForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: 'select',
    LivingSituation: 'select',
    height: '',
    weight: '',
    bmi: '',
    dementiaType: 'select',
    smoking: 'select',
    alcoholFrequency: 'select',
    hypertension: 'select',
    diabetes: 'select', 

    // Functional Activities
    BILLS: '',
    REMDATES: '',
    PERSCARE: '',

    riskLevel: 'Pending'
  });

  // Function to update form values
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate BMI dynamically when height or weight changes
  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const heightMeters = height / 100; // Convert cm to meters
      const bmiValue = (weight / (heightMeters * heightMeters)).toFixed(1);
      setFormData((prev) => ({ ...prev, bmi: bmiValue }));
    } else {
      setFormData((prev) => ({ ...prev, bmi: '' }));
    }
  }, [formData.height, formData.weight]);

  // Dummy risk level prediction function
  const handleSubmit = (e) => {
    e.preventDefault();
    const risk = Math.random() < 0.5 ? 'Low' : Math.random() < 0.8 ? 'Moderate' : 'High';
    setFormData({ ...formData, riskLevel: risk });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="space-y-2">
            <Label>Age</Label>
            <Input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Sex</Label>
            <Select name="sex" value={formData.sex} onChange={handleChange} required>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Living Situation:</Label>
            <Select name="LivingSituation" value={formData.sex} onChange={handleChange} required>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="Alone">Alone</SelectItem>
              <SelectItem value="With Family">With Family</SelectItem>
              <SelectItem value="Assisted Living">Assisted Living</SelectItem>
            </Select>
          </div>
          
          <h3 className="text-lg font-semibold">Current Status of the dementia patient</h3>
          <div className="space-y-2">
            <Label>Height (cm)</Label>
            <Input type="number" name="height" value={formData.height} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
          </div>
          <div className="flex items-center space-x-2">
            <Label>BMI:</Label>
            <span className="font-semibold">{formData.bmi || 'N/A'}</span>
          </div>
          <div className="space-y-2">
            <Label>Dementia Type</Label>
            <Select name="dementiaType" value={formData.dementiaType} onChange={handleChange} required>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="0">No Dementia</SelectItem>
              <SelectItem value="1">Alzheimer’s Disease</SelectItem>
              <SelectItem value="2">Lewy Body Disease</SelectItem>
              <SelectItem value="3">Vascular Dementia</SelectItem>
              <SelectItem value="4">Frontotemporal Dementia</SelectItem>
              <SelectItem value="5">Mixed Dementia</SelectItem>
              <SelectItem value="6">Other Types</SelectItem>
            </Select>
          </div>

          <h3 className="text-lg font-semibold">Lifestyle Factors</h3>
          <div className="space-y-2">
            <Label>Smoking</Label>
            <Select name="smoking" value={formData.smoking} onChange={handleChange} required>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Alcohol Frequency</Label>
            <Select name="alcoholFrequency" value={formData.alcoholFrequency} onChange={handleChange} required>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="Never">Never</SelectItem>
              <SelectItem value="Occasionally">Occasionally</SelectItem>
              <SelectItem value="Frequently">Frequently</SelectItem>
            </Select>
          </div>

          <h3 className="text-lg font-semibold">Medical History</h3>
          <div className="space-y-2">
            <Label>Hypertension</Label>
            <Select name="hypertension" value={formData.hypertension} onChange={handleChange} required>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Diabetes</Label>
            <Select name="diabetes" value={formData.diabetes} onChange={handleChange} required>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </Select>
          </div>         
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
          <div className="text-lg font-bold">Risk Level: {formData.riskLevel}</div>
          <Button type="submit">Predict Risk</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DementiaRiskForm;




