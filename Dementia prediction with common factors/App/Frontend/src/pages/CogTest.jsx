import { useState } from "react";

const CogTest = () => {
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});

  const guideSteps = [
    "Welcome to the Montreal Cognitive Assessment (MoCA) test.",
    "This test consists of multiple cognitive tasks to assess different mental abilities.",
    "You will be asked to perform various tasks, and the examiner will evaluate your responses.",
    "For each task, select 'Done Correctly' if the patient completes it successfully, otherwise select 'Unsatisfied'.",
    "Let's begin!"
  ];

  const questions = [
    { question: "Draw a clock showing '10 past 11'.", key: "clock" },
    { question: "What is this animal? (Lion)", key: "lion" },
    { question: "What is this animal? (Rhino)", key: "rhino" },
    { question: "What is this animal? (Camel)", key: "camel" },
    { question: "Repeat the numbers: 2-1-8-5-4", key: "forwardDigits" },
    { question: "Repeat them backward: 7-4-2", key: "backwardDigits" },
    { question: "Subtract 7 from 100 repeatedly.", key: "serial7s" },
    { question: "Repeat: 'The cat always hid under the couch when dogs were in the room.'", key: "sentence1" },
    { question: "Repeat: 'I only know that John is the one to help today.'", key: "sentence2" },
    { question: "What is the similarity between a train and a bicycle?", key: "abstract1" },
    { question: "What is the similarity between a watch and a ruler?", key: "abstract2" },
    { question: "Recall any of these words: Face, Velvet, Church, Daisy, Red", key: "recall" },
    { question: "What is the date today?", key: "date" },
    { question: "What is the month?", key: "month" },
    { question: "What is the year?", key: "year" },
    { question: "What is the day of the week?", key: "day" },
    { question: "What is the name of this place?", key: "place" },
    { question: "What city are we in?", key: "city" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  if (step === -1) {
    return (
      <div>
        <h2>Montreal Cognitive Assessment (MoCA) - Guide</h2>
        <ul>
          {guideSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
        <button onClick={() => setStep(0)}>Start Test</button>
      </div>
    );
  }

  if (step >= questions.length) {
    return (
      <div>
        <h2>Test Completed!</h2>
        <p>Your total MoCA score is: {score} / 30</p>
        {score >= 26 ? (
          <p>This is considered normal cognitive function.</p>
        ) : (
          <p>You may want to consult a medical professional for further evaluation.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2>Montreal Cognitive Assessment (MoCA)</h2>
      <form onSubmit={handleSubmit}>
        <p>{questions[step].question}</p>
        <select
          value={answers[questions[step].key] || ""}
          onChange={(e) => setAnswers({ ...answers, [questions[step].key]: e.target.value })}
          required
        >
          <option value="">Select an option</option>
          <option value="Done Correctly">Done Correctly</option>
          <option value="Unsatisfied">Unsatisfied</option>
        </select>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default CogTest;
