// components/Recipe/ServingAdjuster.js

import React, { useState } from 'react';

const ServingAdjuster = ({ initialServings, onServingsChange }) => {
  const [currentServings, setCurrentServings] = useState(initialServings);

  const adjust = (delta) => {
    const newServings = Math.max(1, currentServings + delta); // Ensure minimum of 1
    setCurrentServings(newServings);
    onServingsChange(newServings); // Pass the new value up to RecipeCardSchema
  };

  return (
    <div className="serving-adjuster">
      <label>Servings:</label>
      <button onClick={() => adjust(-1)} disabled={currentServings === 1}>
        –
      </button>
      <span className="current-servings">{currentServings}</span>
      <button onClick={() => adjust(1)}>
        +
      </button>
    </div>
  );
};

export default ServingAdjuster;