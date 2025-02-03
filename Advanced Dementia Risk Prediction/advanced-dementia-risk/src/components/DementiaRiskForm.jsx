import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

export default function DementiaRiskForm() {
  const [formData, setFormData] = useState({
    age: "",
    bloodPressure: "",
    cholesterol: "",
    cognitiveScore: "",
    memoryLoss: "",
    dailyActivities: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data: ", formData);
    // Call API or ML model for prediction
  };

  return (
    <Card className="max-w-md mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Dementia Risk Assessment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Age</Label>
            <Input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div>
            <Label>Blood Pressure (mmHg)</Label>
            <Input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} required />
          </div>
          <div>
            <Label>Cholesterol Level (mg/dL)</Label>
            <Input type="text" name="cholesterol" value={formData.cholesterol} onChange={handleChange} required />
          </div>
          <div>
            <Label>Cognitive Test Score</Label>
            <Input type="number" name="cognitiveScore" value={formData.cognitiveScore} onChange={handleChange} required />
          </div>
          <div>
            <Label>Memory Loss</Label>
            <Select name="memoryLoss" value={formData.memoryLoss} onChange={handleChange} required>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="mild">Mild</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
            </Select>
          </div>
          <div>
            <Label>Daily Activity Level</Label>
            <Select name="dailyActivities" value={formData.dailyActivities} onChange={handleChange} required>
              <SelectItem value="independent">Independent</SelectItem>
              <SelectItem value="some_assistance">Needs Some Assistance</SelectItem>
              <SelectItem value="dependent">Dependent</SelectItem>
            </Select>
          </div>
          <Button type="submit" className="w-full">Predict Risk</Button>
        </form>
      </CardContent>
    </Card>
  );
}

