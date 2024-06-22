// Create and manage routes for application
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TeamPerformanceAnalysis from './pages/TeamPerformanceAnalysis';
import MatchupAnalyzer from './pages/MatchupAnalyzer';
import FantasyRecommendations from './pages/FantasyRecommendations';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team-performance-analysis" element={<TeamPerformanceAnalysis />} />
        <Route path="/matchup-analyzer" element={<MatchupAnalyzer />} />
        <Route path="/fantasy-recommendations" element={<FantasyRecommendations />} />
      </Routes>
    </Router>
  );
};

export default App;
