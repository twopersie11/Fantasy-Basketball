import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import NavButton from '../components/NavButton';
import './Home.css';

const Home = () => {
  return (
    <div>
      <Header />
      <div className="nav-buttons">
        <Link to="/team-performance-analysis">
          <NavButton label="Team Performance Analysis" />
        </Link>
        <Link to="/matchup-analyzer">
          <NavButton label="Matchup Analyzer" />
        </Link>
        <Link to="/fantasy-recommendations">
          <NavButton label="Fantasy Recommendations" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
