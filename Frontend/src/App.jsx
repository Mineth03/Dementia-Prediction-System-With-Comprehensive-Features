import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";
import LoginForm from "./pages/Login.jsx";
import DepressionTest from "./pages/DepressionTest.jsx";
import CogTest from "./pages/CogTest.jsx";
import Profile from "./pages/Profile.jsx";
import TrackingForm from "./pages/TrackingForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./components/Layout.jsx";
import PredictionForm from "./pages/PredictionForm.jsx";
import DementiaRiskForm from "./pages/DementiaRiskForm.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import SlidingPuzzle from "./Games/SlidingPuzzle.jsx";
import FlipCards from "./Games/FlipCards.jsx";
import CrossWords from "./Games/CrossWords.jsx";
import Jigsaw from "./Games/Jigsaw.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
      <Route path="/depression-test" element={<Layout><DepressionTest /></Layout>} />
      <Route path="/prediction-form" element={<Layout><PredictionForm /></Layout>} />
      <Route path="/sliding-puzzle" element={<Layout><SlidingPuzzle /></Layout>} />
      <Route path="/flip-cards" element={<Layout><FlipCards /></Layout>} />
      <Route path="/cross-words" element={<Layout><CrossWords /></Layout>} />
      <Route path="/jigsaw" element={<Layout><Jigsaw /></Layout>} />
      <Route path="/cog-test" element={<Layout><CogTest /></Layout>} />

      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/dementia-risk-form" element={<ProtectedRoute><Layout><DementiaRiskForm /></Layout></ProtectedRoute>} />
      <Route path="/trackingForm" element={<ProtectedRoute><Layout><TrackingForm /></Layout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
