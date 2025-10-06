// client/src/components/NavButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavButton.css';

function NavButton({ path, label, className = '' }) {
  return (
    <Link to={path} className={`nav-button ${className}`.trim()}>
      {label}
    </Link>
  );
}

export default NavButton;
