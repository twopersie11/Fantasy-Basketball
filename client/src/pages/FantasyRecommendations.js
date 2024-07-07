// client/src/pages/FantasyRecommendations.js
import React, { useEffect, useState } from 'react';
import NavButton from '../components/NavButton';
import logo from "../images/Fr.png"

function FantasyRecommendations() {
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
          <NavButton path="/" label="⇦   Return to Home" />
      </div>

      <section>
        <h2>Historical Data Insights</h2>
      </section>
      {/* Render the data correctly */}
      {data.data && <p>{data.data}</p>}
    </div>
  );
}

export default FantasyRecommendations;
