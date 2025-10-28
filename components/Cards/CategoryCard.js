import React from 'react';
import Link from 'next/link';

/**
 * A visually engaging, standalone card component for category navigation.
 * Uses Link internally to avoid Next.js hydration errors.
 */
const CategoryCard = ({ category }) => (
  <Link 
  href={`/${category.slug}`} 
  className="block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 rounded-2xl"
>

    <div className="relative h-full min-h-[280px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl">
      <img
        loading="lazy"
        src={`/${category.image}`}
        alt={`Explore ${category.title} recipes`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/600x800/94a3b8/white?text=Image+Error';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6">
        <div>
          <h3 className="text-3xl font-extrabold text-white font-serif mb-1 drop-shadow-lg">
            {category.title}
          </h3>
          <p className="text-amber-300 text-base font-medium drop-shadow-md">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  </Link>
);

export default CategoryCard;
