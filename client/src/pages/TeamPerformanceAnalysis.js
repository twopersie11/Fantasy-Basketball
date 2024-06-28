// client/src/pages/TeamPerformanceAnalysis.js
import React, { useEffect, useState } from 'react';
import '../components/Header.css';
import './TeamPerformanceAnalysis.css';
import NavButton from '../components/NavButton';
import logo from '../images/tpa.png'

function TeamPerformanceAnalysis() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('http://localhost:4000/kobe')
      .then(response => response.json())
      .then(data => {
        console.log("Data fetched for TeamPerformanceAnalysis: ", data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error)); // Add error handling
  }, []);

  return (
    <div>
      <header>
        <img src={logo} alt="NBALogo" className="nbalogo"/>
      </header>

      <div>
          <NavButton path="/" label="Back" />
      </div>

      {/* Render the data correctly */}
      {data.data && <p>{data.data}</p>}
    </div>
  );
}

export default TeamPerformanceAnalysis;
