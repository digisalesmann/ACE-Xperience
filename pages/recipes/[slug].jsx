'use client'
import React, { useMemo } from 'react'
import { useRouter } from 'next/router' 
import { motion } from 'framer-motion'
import { 
    Utensils, Clock, ChefHat, Star, Timer, TrendingUp,
    CheckCircle, ListOrdered, Lightbulb, Soup 
} from 'lucide-react' 

// IMPORTANT: Assuming this path is correct based on your setup
import { allRecipes } from '../../lib/data' 

// -------------------------------------------------------------------
// --- Helper Components (CleanTag is now ItalicTag) ---
// -------------------------------------------------------------------

/**
 * MetricTag: Cleaner card design for the key metrics bar. (UNCHANGED)
 */
const MetricTag = ({ Icon, label, value, color }) => (
    <div className="flex flex-col items-start p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full flex-1 min-w-[120px] transition duration-300 hover:shadow-md">
        <div className="flex items-center mb-1">
            <Icon className={`w-5 h-5 mr-2 ${color}`} />
            <span className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">{label}</span>
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{value}</span>
    </div>
)

/**
 * ItalicTag: Displays a non-metric tag as simple, italic, underlined text 
 * for a clean, typographic look in the hero section. (UPDATED)
 */
const ItalicTag = ({ label }) => (
    <span className="inline-block text-base font-light italic text-gray-300 dark:text-gray-400 mr-4 border-b border-gray-500/50 hover:text-white transition duration-150 cursor-pointer">
        {label}
    </span>
)

/**
 * FullRecipeContent: Dynamic content with ingredients/instructions. (UNCHANGED)
 */
const FullRecipeContent = ({ recipe }) => {
    
    if (!recipe.ingredients || !recipe.instructions) {
        return (
            <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 rounded-xl mt-12">
                <p className="text-lg font-semibold text-red-600 dark:text-red-300">
                    Error: Detailed ingredient and instruction data is missing for this recipe.
                </p>
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 mt-12"> 
            
            {/* 1. Instructions Column (Main Content - Takes 2/3 space) */}
            <div className="lg:col-span-2 space-y-12 order-2 lg:order-1">
                
                {/* Instructions / Method - Clean, carded steps */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="p-4 sm:p-0"
                >
                    <h3 className="text-3xl font-serif font-extrabold text-gray-900 dark:text-white mb-8 flex items-center">
                        <ListOrdered className="w-7 h-7 mr-3 text-red-500" /> 
                        Preparation Steps
                    </h3>
                    <ol className="list-none space-y-6">
                        {recipe.instructions.map((step, index) => (
                            <li key={index} className="flex items-start bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md transition duration-200 hover:shadow-lg border-l-4 border-amber-500 dark:border-amber-600">
                                <div className="flex-shrink-0 mr-4">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xl shadow-lg">
                                        {index + 1}
                                    </span>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-300 pt-0.5 leading-relaxed">
                                    {step}
                                </p>
                            </li>
                        ))}
                    </ol>
                </motion.section>

                {/* Pro Tip/Notes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-xl shadow-lg"
                >
                    <div className="flex items-start space-x-3">
                        <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-300 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-1">Culinary Note ({recipe.difficulty} Level)</p>
                            <p className="text-gray-700 dark:text-gray-300 italic">
                                {recipe.difficulty === 'Hard' ? "Mastering this requires practice; focus on ingredient quality and precise timing." : "Keep it simple! Follow the instructions carefully for a perfect result and don't overmix."}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 2. Ingredients Column (Sidebar - Takes 1/3 space) */}
            <div className="lg:col-span-1 order-1 lg:order-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl lg:sticky lg:top-8" 
                >
                    <h3 className="text-3xl font-serif font-extrabold text-amber-600 mb-6 flex items-center border-b pb-3 border-gray-200 dark:border-gray-700">
                        <Utensils className="w-7 h-7 mr-3" />
                        Ingredients List
                    </h3>
                    <ul className="space-y-4">
                        {recipe.ingredients.map((ing, index) => (
                            <li key={index} className="flex flex-col sm:flex-row sm:items-center justify-between text-base border-b border-gray-100 dark:border-gray-700 pb-3">
                                <span className="flex items-center text-gray-800 dark:text-gray-200 font-medium">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                                    {ing.item}
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white flex-shrink-0 ml-4 text-right sm:text-left text-sm mt-1 sm:mt-0">
                                    {ing.qty} {ing.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};


// -------------------------------------------------------------------
// ⭐️ Main Slug Page Component 
// -------------------------------------------------------------------
const RecipeSlugPage = () => {
    const router = useRouter(); 

    const recipe = useMemo(() => {
        const slug = router.query.slug; 
        if (slug) {
            return allRecipes.find(r => r.slug === slug);
        }
        return null;
    }, [router.query.slug]);

    if (!recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-2xl font-serif text-gray-700 dark:text-gray-300">
                    {router.query.slug ? 'Recipe Not Found (404).' : 'Loading recipe data...'}
                </p>
            </div>
        )
    }

    const difficultyColor = {
        Easy: "text-emerald-500",
        Medium: "text-amber-500",
        Hard: "text-red-500",
    }[recipe.difficulty] || "text-gray-500";
    
    const StarIcon = Star;
    const fullStars = Math.round(recipe.rating);
    const starDisplay = Array(5).fill(0).map((_, i) => (
        <StarIcon 
            key={i} 
            className={`w-5 h-5 ${i < fullStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400/50'}`} 
        />
    ));


    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans">
            
            {/* 1. IMMERSIVE HERO SECTION */}
            <div className="relative w-full h-[450px] sm:h-[600px] overflow-hidden">
                <motion.img 
                    src={`/images/${recipe.image}`} 
                    alt={recipe.title}
                    className="w-full h-full object-cover brightness-75"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/40 to-transparent"></div>
                
                {/* Hero Content - LIFTED TO AVOID METRIC BAR OVERLAP */}
                <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 p-6 sm:p-12 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="text-lg font-semibold text-amber-400 uppercase tracking-widest mb-1">{recipe.category}</p>
                        <h1 className="text-4xl sm:text-7xl font-extrabold font-serif text-white leading-tight drop-shadow-lg">
                            {recipe.title}
                        </h1>
                        <p className="text-xl text-gray-300 mt-4 max-w-3xl italic font-light hidden sm:block">{recipe.excerpt}</p>
                        
                        {/* Rating and Tags underneath title - NOW USING ItalicTag */}
                        <div className="flex flex-wrap items-center mt-6">
                            <div className="flex items-center space-x-1 mr-6">
                                {starDisplay}
                                <span className="ml-2 text-lg font-bold text-white">{recipe.rating}</span>
                                <span className="text-gray-400">(45 reviews)</span>
                            </div>
                            <div className="flex flex-wrap items-center">
                                {/* Renamed from CleanTag to ItalicTag, added space-x-4 container to ItalicTag itself */}
                                {recipe.tags.map(tag => <ItalicTag key={tag} label={tag} />)}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA - Reduced negative margin */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
                
                {/* Metrics Bar (Compact, Card Style) */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800"
                >
                    <MetricTag Icon={Timer} label="Prep Time" value={recipe.prepTime} color="text-amber-600" />
                    <MetricTag Icon={Clock} label="Cook Time" value={recipe.cookTime} color="text-amber-600" />
                    <MetricTag Icon={TrendingUp} label="Difficulty" value={recipe.difficulty} color={difficultyColor} />
                    <MetricTag Icon={Soup} label="Category" value={recipe.category} color="text-blue-500" />
                </motion.div>

                {/* Detailed Recipe Content */}
                <FullRecipeContent recipe={recipe} />

            </main>
        </div>
    )
}

export default RecipeSlugPage