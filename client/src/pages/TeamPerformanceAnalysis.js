import React, { useEffect, useState } from 'react';
import { getTeamPerformance } from '../api';
import Header from '../components/Header';

const TeamPerformanceAnalysis = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTeamPerformance();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <h2>Team Performance Analysis</h2>
      {/* Render data here */}
    </div>
  );
};

export default TeamPerformanceAnalysis;
