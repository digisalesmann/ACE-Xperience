// components/Recipe/RecipePostLayout.js

import React from 'react';
import JumpToButton from './JumpToButton';
import RecipeCardSchema from './RecipeCardSchema';
// Import a utility to manage scrolling to the recipe card
import { scrollToElement } from '../../lib/utils'; 

const RecipePostLayout = ({ recipe }) => {
  // A unique ID is critical to link the 'Jump To' button to the card
  const recipeCardId = "recipe-card-content"; 

  // --- Premium Design Implementation: Clean & Stylish Layout ---
  return (
    <article className="recipe-article">
      
      {/* 1. Header & Title (H1) */}
      <header className="recipe-header">
        <h1 className="serif-font">{recipe.title}</h1>
        <div className="recipe-meta">
          <span className="meta-item">By Wendy |</span>
          <span className="meta-item">Rating: {recipe.rating} ★★★★★</span> 
        </div>
      </header>

      {/* 2. Featured Image */}
      <figure className="featured-image-container">
        <img 
          src={recipe.featuredImage} 
          alt={`A stunning photo of ${recipe.title}`} 
          className="featured-image"
        />
      </figure>

      {/* 3. The CRITICAL UX Element: Jump to Recipe Button */}
      <div className="jump-button-wrapper">
        <JumpToButton 
          onClick={() => scrollToElement(recipeCardId)} 
        />
      </div>

      {/* 4. The Intro/Story Section */}
      <section className="recipe-story">
        <div className="story-content">
          {/* This content comes from the fetched recipe data (e.g., Markdown/HTML) */}
          <div dangerouslySetInnerHTML={{ __html: recipe.storyHtml }} />
        </div>
      </section>

      {/* 5. The Recipe Card: The SEO and Functional Core */}
      <section id={recipeCardId} className="recipe-card-section">
        {/* The RecipeCardSchema component handles the structured data and layout */}
        <RecipeCardSchema recipe={recipe} />
      </section>

      {/* 6. Call to Action and Related Content */}
      <aside className="post-sidebar">
        {/* Placeholder for future CallToAction component (Email sign-up) */}
        {/* <CallToAction /> */} 
      </aside>

      {/* Placeholder for Related Recipes component (encourage browsing) */}
      {/* <RelatedRecipes category={recipe.category} /> */}

    </article>
  );
};

export default RecipePostLayout;