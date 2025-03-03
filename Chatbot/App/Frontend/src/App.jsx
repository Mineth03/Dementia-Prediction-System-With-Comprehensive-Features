import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import DepressionTest from "./pages/DepressionTest.jsx";
import CogTest from "./pages/CogTest.jsx";
import Profile from "./pages/Profile.jsx";
import Layout from "./components/Layout.jsx";
import PredictionForm from "./pages/PredictionForm.jsx";
import NotFound from "./pages/NotFound.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx"; // ✅ Added import
import LoginForm from "./pages/Login.jsx"; // ✅ Added LoginForm import

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/depression-test" element={<Layout><DepressionTest /></Layout>} />
      <Route path="/prediction-form" element={<Layout><PredictionForm /></Layout>} />
      <Route path="/cog-test" element={<CogTest />} />
      <Route path="/register" element={<Layout><RegistrationForm /></Layout>} /> {/* Manuga Added this */}
      <Route path="/login" element={<Layout><LoginForm /></Layout>} /> {/* Manuga Added Login route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
