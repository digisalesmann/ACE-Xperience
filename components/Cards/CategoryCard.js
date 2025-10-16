import React from 'react';
import Link from 'next/link'; 

/**
 * A visually engaging, standalone card component for category navigation.
 * Uses Link internally to avoid Next.js hydration errors.
 */
const CategoryCard = ({ category }) => {
  // Use a placeholder image if the path is missing 
  const fallbackImage = category.image || "https://placehold.co/600x400/333333/ffffff?text=Inspiration";
  
  return (
    // The component returns the Link as the root element, 
    // satisfying the hydration expectation.
    <Link 
        href={category.link} 
        className="block relative h-64 w-full rounded-2xl overflow-hidden shadow-xl 
                   transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
    >
        {/* Background Image with subtle transition for hover effect */}
        <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110" 
            style={{ backgroundImage: `url(${fallbackImage})` }}
        >
            {/* Scrim/Overlay for text readability */}
            <div className="absolute inset-0 bg-charcoal/40"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
            <h3 className="text-3xl font-bold serif-font text-shadow-lg">{category.title}</h3>
            <p className="text-sm mt-1 text-center">{category.description}</p>
            {/* Call-to-action button */}
            <span className="mt-4 px-4 py-2 text-sm font-semibold bg-sage-accent hover:bg-sage-dark rounded-full transition shadow-md">
                Explore
            </span>
        </div>
    </Link>
  );
};

export default CategoryCard;
