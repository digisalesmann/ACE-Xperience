// components/Cards/RecipeCard.js
import React from 'react'
import { motion } from 'framer-motion'
import { Star, Timer } from 'lucide-react'
import Link from '../Link.js' 

// NOTE: Ensure Link is correctly imported/defined in your project.

const RecipeCard = ({ recipe, index, className }) => {
    
    // 🛠️ FIX 1: Construct the correct image path from the public folder
    // Assumes images are in /public/images/
    const imagePath = `/images/${recipe.image}`

    // Determine the difficulty styling
    const difficultyClasses = 
        recipe.difficulty === 'Easy' ? 'bg-emerald-500/90 text-white' : 
        recipe.difficulty === 'Medium' ? 'bg-yellow-500/90 text-gray-900' : 
        'bg-red-600/90 text-white'

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, rotateZ: 2 }}
            animate={{ opacity: 1, x: 0, rotateZ: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, delay: index * 0.05 }} 
            // Ensures motion container fills the grid cell height
            className={`w-full cursor-pointer group h-full ${className || ''}`} 
        >
            {/* Link must also be h-full */}
            <Link href={`/recipes/${recipe.slug}`} className="block h-full">
                
                {/* Main Card Div: Use h-full and flex flex-col to enable equal height + sticky footer */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-[1.02] border-4 border-transparent group-hover:border-amber-500 h-full flex flex-col">
                    
                    {/* 🛠️ FIX 2: Use an <img> tag for the recipe image */}
                    <div className="relative h-48 w-full flex-shrink-0">
                        <img 
                            src={imagePath} 
                            alt={recipe.title}
                            // object-cover is essential to ensure the image fills the 12rem (h-48) box without distortion
                            className="h-full w-full object-cover object-center" 
                            loading="lazy" 
                        />
                        <div className="absolute top-0 right-0 p-3">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${difficultyClasses}`}>
                                {recipe.difficulty}
                            </span>
                        </div>
                    </div>

                    {/* Content area uses flex-grow to take up variable space */}
                    <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-500 transition line-clamp-2 flex-shrink-0">
                            {recipe.title}
                        </h3>
                        {/* Fixed height (h-14) for the excerpt is critical to stabilize card height */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-3 h-14">
                            {recipe.excerpt}
                        </p>
                        
                        {/* mt-auto pins the metadata (footer) to the bottom of the card */}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700 mt-auto">
                            {/* Rating */}
                            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                                <span>{recipe.rating.toFixed(1)}</span>
                            </div>
                            {/* Prep Time */}
                            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Timer className="w-4 h-4 text-amber-500 mr-1" />
                                <span>{recipe.prepTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default RecipeCard