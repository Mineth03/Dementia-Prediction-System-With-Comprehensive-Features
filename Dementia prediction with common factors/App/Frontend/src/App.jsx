import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import PredictionForm from "./pages/PredictionForm";
import CogTest from "./pages/CogTest";
import DepressionTest from "./pages/DepressionTest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PredictionForm />} />
        <Route path="/depression-test" element={<DepressionTest />} />
        <Route path="/cognitive-test" element={<CogTest />} />
      </Routes>
    </Router>
  );
}

export default App;
