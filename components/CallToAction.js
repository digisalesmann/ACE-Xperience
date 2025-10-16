// components/CallToAction.js

import React from 'react';

const CallToAction = () => {
  return (
    // Use the Sage Accent Color for the entire block background
    <div className="cta-box sage-accent-bg"> 
      <h2 className="cta-headline">Never Miss a Delicious Recipe!</h2>
      <p className="cta-subtext">Join the Wendilicious Family for weekly recipes, baking tips, and exclusive content delivered straight to your inbox.</p>
      
      <form className="cta-form">
        <input 
          type="email" 
          placeholder="Enter your email address" 
          required 
          className="cta-input"
        />
        <button type="submit" className="submit-button primary-dark-btn">
          Sign Me Up!
        </button>
      </form>
    </div>
  );
};

export default CallToAction;

// --- Concept Styling Notes (for CTA) ---
/* .sage-accent-bg {
    background-color: #A3B18A; // SAGE ACCENT
    color: #FFFFFF; // White text for high contrast
    padding: 40px 20px;
    text-align: center;
    border-radius: 5px;
}
.cta-headline {
    font-family: 'Serif Font', serif;
    font-size: 2.2rem;
    margin-bottom: 10px;
}
.primary-dark-btn {
    // A darker, grounding color to contrast with the Sage background
    background-color: #333333; // Charcoal
    color: #FFFFFF;
    padding: 12px 30px;
    border: none;
    cursor: pointer;
}
*/