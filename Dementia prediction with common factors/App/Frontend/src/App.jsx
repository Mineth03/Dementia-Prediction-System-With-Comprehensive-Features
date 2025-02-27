import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import DepressionTest from "./pages/DepressionTest.jsx";
import CogTest from "./pages/CogTest.jsx";
import Profile from "./pages/Profile.jsx";
import Layout from "./components/Layout.jsx";
import PredictionForm from "./pages/PredictionForm.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import SlidingPuzzle from "./Games/SlidingPuzzle.jsx";
import FlipCards from "./Games/FlipCards.jsx";
import CrossWords from "./Games/CrossWords.jsx";
import Jigsaw from "./Games/Jigsaw.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
      <Route path="/depression-test" element={<Layout><DepressionTest /></Layout>} />
      <Route path="/prediction-form" element={<Layout><PredictionForm /></Layout>} />
      <Route path="/sliding-puzzle" element={<Layout><SlidingPuzzle /></Layout>} />
      <Route path="/flip-cards" element={<Layout><FlipCards /></Layout>} />
      <Route path="/cross-words" element={<Layout><CrossWords /></Layout>} />
      <Route path="/jigsaw" element={<Layout><Jigsaw /></Layout>} />
      
      <Route path="/cog-test" element={<CogTest />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
