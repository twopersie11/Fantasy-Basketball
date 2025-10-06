import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TeamPerformanceAnalysis from './pages/TeamPerformanceAnalysis';
import MatchupAnalyzer from './pages/MatchupAnalyzer';
import FantasyRecommendations from './pages/FantasyRecommendations';
import Home from './pages/Home';
import './components/Header.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kobe" element={<TeamPerformanceAnalysis />} />
        <Route path="/michael" element={<MatchupAnalyzer />} />
        <Route path="/lebron" element={<FantasyRecommendations />} />
      </Routes>
    </Router>
  );
}

export default App;
