'use client'

import React from 'react'
import Link from 'next/link' 
import {
  ClockIcon,
  HeartIcon,
  SparklesIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'


// --- Data Definitions ---
// (Kept local for standalone file; ideally moved to lib/constants.js)
const featuredRecipes = [
    { slug: 'recipe-1', title: 'Summer Salad with Vinaigrette', excerpt: 'Light and refreshing seasonal greens with a zesty lemon dressing.', image: 'images/white.png', prepTime: '15 min' },
    { slug: 'recipe-2', title: 'Spicy Chicken Stir Fry', excerpt: 'Quick weeknight meal with bold Asian flavors and plenty of veggies.', image: 'images/fry.webp', prepTime: '20 min' },
    { slug: 'recipe-3', title: 'Rich Chocolate Fudge Cake', excerpt: 'Rich and decadent dessert perfect for any special occasion or craving.', image: 'images/choco.webp', prepTime: '45 min' },
    { slug: 'recipe-4', title: 'Artisan Veggie Pizza', excerpt: 'Homemade whole-wheat dough topped with fresh seasonal garden vegetables.', image: 'images/pizza.jpg', prepTime: '1 hour' },
]

const inspirationSections = [
    { title: 'Quick Meals', description: 'Under 30 minutes', image: 'images/food.webp', slug: 'quick-meals' },
    { title: 'Holiday Baking', description: 'Seasonal treats and festive desserts', image: 'images/bites.webp', slug: 'holiday-baking' },
    { title: 'Vegan Favorites', description: 'Plant-based deliciousness for everyone', image: 'images/vegan.webp', slug: 'vegan-favorites' },
]

const recipeOfTheWeek = {
    title: 'Rustic Sourdough Loaf (The Ultimate Guide)',
    description: "Achieve the perfect rise and tang with Wendy's fail-proof, step-by-step sourdough recipe. Perfect for beginners and advanced bakers alike!",
    image: 'images/loaf.webp',
    slug: 'rustic-sourdough-loaf',
    prepTime: '30 min',
    cookTime: '4 hours (rest time)',
}

// --- Extracted UI Components (Internalized) ---

const SectionHeader = ({ subTitle, title }) => (
    <header className="text-center mb-8 sm:mb-12">
        <h3 className="text-xs sm:text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-widest mb-1">
            {subTitle}
        </h3>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 font-serif inline-block relative pb-2">
            {title}
            <span className="absolute left-1/2 bottom-0 w-16 h-1 bg-amber-500 rounded-full transform -translate-x-1/2"></span>
        </h2>
    </header>
)

const RecipeCard = ({ recipe, isNew = false }) => (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        {isNew && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                NEW
            </div>
        )}
        <div className="h-48 overflow-hidden">
            <img
                loading="lazy"
                src={`/${recipe.image}`}
                alt={recipe.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://placehold.co/600x400/94a3b8/white?text=Image+Error'
                }}
            />
        </div>
        <div className="p-5">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif line-clamp-2">
                {recipe.title}
            </h4>
            <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 mb-4" aria-label={`Preparation time: ${recipe.prepTime}`}>
                <ClockIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>Prep: {recipe.prepTime}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {recipe.excerpt}
            </p>
            <Link
                href={`/recipes/${recipe.slug}`}
                className="text-amber-600 hover:text-amber-700 font-semibold text-sm transition-colors duration-200 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
            >
                View Recipe
                <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    </div>
)

const CategoryCard = ({ category }) => (
    <Link 
        href={`/categories/${category.slug}`} 
        className="block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 rounded-2xl"
    >
        <div className="relative h-full rounded-2xl overflow-hidden shadow-xl group cursor-pointer transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl">
            <img
                loading="lazy"
                src={`/${category.image}`}
                alt={`Explore ${category.title} recipes`} // Enhanced alt text
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://placehold.co/600x800/94a3b8/white?text=Image+Error'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                    <h3 className="text-3xl font-extrabold text-white font-serif mb-1 drop-shadow-lg">
                        {category.title}
                    </h3>
                    <p className="text-amber-300 text-lg font-medium">
                        {category.description}
                    </p>
                </div>
            </div>
        </div>
    </Link>
)


// --- Home Page ---
const HomePage = () => {
    return (
        <>
            {/* Hero Section */}
            <section 
                // Removed max-w-7xl mx-auto to fix the gap issue
                className="relative w-full mb-16 sm:mb-20 h-[450px] sm:h-[550px] md:h-[650px] overflow-hidden flex items-center justify-center text-center px-4 sm:px-6"
                aria-labelledby="hero-heading"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/wendy.png')" }}
                    role="img" // ARIA role for background image
                    aria-label="Image of a delicious meal spread on a wooden table"
                >
                    <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div> 
                </div>

                <div className="relative z-10 max-w-4xl text-center">
                    <h2 
                        id="hero-heading"
                        className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-3 sm:mb-4 drop-shadow-3xl font-serif bg-gradient-to-r from-amber-300 via-orange-200 to-amber-400 text-transparent bg-clip-text"
                    >
                        Gather. Create. Savor.
                    </h2>
                    <p className="text-base sm:text-xl text-gray-50 mb-8 sm:mb-10 drop-shadow-lg max-w-prose mx-auto">
                        From cozy family dinners to weekend indulgences, discover recipes
                        made with love, simple ingredients, and a dash of joy.
                    </p>
                    <Link
                        href="/recipes"
                        className="inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-bold bg-amber-500 text-white rounded-xl shadow-2xl transition duration-300 hover:bg-amber-600 hover:shadow-3xl transform hover:scale-[1.03] active:scale-[0.98] ring-4 ring-amber-300/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" /> Start Cooking
                    </Link>
                </div>
            </section>

            {/* Added max-w-7xl mx-auto here to contain the rest of the content */}
            <div className="max-w-7xl mx-auto"> 
                {/* Recipe of the Week */}
                <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 dark:border-gray-700">
                        <div className="lg:w-1/2 h-64 sm:h-80 lg:h-auto overflow-hidden">
                            <img
                                src={`/${recipeOfTheWeek.image}`}
                                alt={`A rustic sourdough loaf, feature recipe of the week`} // Enhanced alt text
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                        <div className="lg:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                            <span className="text-xs sm:text-sm font-bold uppercase text-red-500 tracking-widest mb-2 flex items-center">
                                <HeartIcon className="w-4 h-4 mr-1" /> Weekly Feature
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 font-serif mb-3 sm:mb-4">
                                {recipeOfTheWeek.title}
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                                {recipeOfTheWeek.description}
                            </p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base p-3 bg-amber-50 dark:bg-gray-700 rounded-lg">
                                {/* FIX: Ensure items align perfectly with flex-col, then items-center on small screens+ */}
                                <div className="flex items-center space-x-2">
                                    <ClockIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                    <span className="font-semibold">
                                        Prep: {recipeOfTheWeek.prepTime}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ClockIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                    <span className="font-semibold">
                                        Total: {recipeOfTheWeek.cookTime}
                                    </span>
                                </div>
                            </div>
                            <Link
                                href={`/recipes/${recipeOfTheWeek.slug}`}
                                className="self-start px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold bg-amber-500 text-white rounded-lg shadow-xl hover:bg-amber-600 transform hover:translate-x-1 hover:shadow-2xl active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
                            >
                                Get the Recipe →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Featured Recipes */}
                <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        subTitle="Weekly Favorites"
                        title="Our Most Loved Recipes"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {featuredRecipes.map((r, i) => (
                            <RecipeCard recipe={r} key={r.slug} isNew={i === 0} />
                        ))}
                    </div>
                </section>

                {/* Inspiration Categories */}
                <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        subTitle="What to Cook Today?"
                        title="Find Your Inspiration"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {inspirationSections.map((cat) => (
                            <CategoryCard category={cat} key={cat.slug} />
                        ))}
                    </div>
                </section>
            </div>

            {/* Newsletter */}
            <section className="py-12 sm:py-16 bg-amber-100 dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-800" aria-labelledby="newsletter-heading">
                <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl">
                    <div className="md:w-1/2 mb-6 md:mb-0 text-center md:text-left flex flex-col">
                        {/* UPDATED ICON and alignment: EnvelopeOpenIcon is a better fit */}
                        <h3 id="newsletter-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-serif mb-2">
                            Join Wendy’s Table
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Get weekly recipes, baking tips, and exclusive content delivered
                            straight to your inbox.
                        </p>
                    </div>
                    <form
                        className="md:w-1/2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <label htmlFor="email-input" className="sr-only">Email Address</label>
                        <input
                            id="email-input"
                            type="email"
                            placeholder="Enter your email address"
                            required
                            className="flex-grow p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-white rounded-xl focus:ring-amber-500 focus:border-amber-500 transition duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
                        />
                        <button
                            type="submit"
                            className="px-5 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 sm:py-20 bg-amber-50 dark:bg-gray-900" aria-labelledby="about-wendy-heading">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
                    <img
                        loading="lazy"
                        src="/images/kenny.jpg"
                        alt="Wendy, the author, smiling in her kitchen" 
                        className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-amber-500 shadow-2xl"
                    />
                    <div className="text-center md:text-left">
                        {/* FIX: Ensure text is aligned left on mobile by making the container text-center then md:text-left */}
                        <h3 id="about-wendy-heading" className="text-3xl font-bold text-gray-900 dark:text-white font-serif mb-2 flex items-center justify-center md:justify-start">
                            Hello, I'm
                            Wendy!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                            I'm passionate about making delicious food accessible to
                            everyone. From complicated bakes to 15-minute meals, I share all
                            the tips and tricks I've learned.
                        </p>
                        <Link
                            href="/about"
                            className="text-amber-500 hover:text-amber-600 font-semibold text-base transition-colors duration-200 flex items-center justify-center md:justify-start group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
                        >
                            Read My Full Story{' '}
                            <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage