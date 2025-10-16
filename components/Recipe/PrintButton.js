// components/Recipe/PrintButton.js

import React from 'react';

const PrintButton = ({ title }) => {
  const handlePrint = () => {
    // Standard browser print function
    window.print(); 
  };
  
  return (
    <button 
      className="utility-button print-button" 
      onClick={handlePrint}
      title={`Print the recipe for ${title}`}
    >
      🖨️ Print Recipe
    </button>
  );
};

export default PrintButton;