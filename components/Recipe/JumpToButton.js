// components/Recipe/JumpToButton.js

import React from 'react';

const JumpToButton = ({ onClick }) => {
  return (
    // Use the Sage Green Accent Color for high contrast
    <button 
      className="jump-to-recipe-button" 
      onClick={onClick}
    >
      <span className="icon">⬇️</span> JUMP TO RECIPE
    </button>
  );
};

export default JumpToButton;