// client/src/pages/TeamPerformanceAnalysis.js
import React, { useEffect, useState } from 'react';
import NavButton from '../components/NavButton';
import logo from '../images/ma.png'

function MatchupAnalyzer() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('http://localhost:4000/kobe')
      .then(response => response.json())
      .then(data => setData(data))
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

export default MatchupAnalyzer;
