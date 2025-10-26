'use client'

import React, { useState } from 'react'
import Link from 'next/link' 
import {
  HeartIcon,
  SparklesIcon,
  ChevronRightIcon,
  StarIcon,
  FireIcon,
} from '@heroicons/react/24/solid'


// --- Data Definitions ---
const featuredRecipes = [
    { slug: 'vanilla-cupcakes', title: 'Vanilla Cupcakes', excerpt: 'Light, airy vanilla sponge topped with fluffy buttercream. A foolproof basic.', image: 'images/cup.jpg', difficulty: 'Easy' },
    { slug: 'yogurt-parfait', title: 'Yogurt Parfait', excerpt: 'Layers of Greek yogurt, berries, and crunchy granola. Quick and nutritious.', image: 'images/parf.jpg', difficulty: 'Easy' },
    { slug: 'chocolate-cake', title: 'Rich Chocolate Fudge Cake', excerpt: 'Rich and decadent dessert perfect for any special occasion or craving.', image: 'images/cake.jpg', difficulty: 'Medium' },
    { slug: 'gizzdodo', title: 'Spicy Gizzdodo', excerpt: 'A fantastic mix of fried gizzard and sweet plantain pieces tossed in pepper sauce.', image: 'images/gizz.jpg', difficulty: 'Medium' },
]

const inspirationSections = [
    { title: 'Quick Meals', description: 'Under 30 minutes', image: 'images/food.webp', slug: 'meal' },
    { title: 'Baking & Sweets', description: 'Seasonal treats and festive desserts', image: 'images/bites.webp', slug: 'baking' },
    { title: 'Recipes', description: 'A collection of our favorite recipes', image: 'images/new.png', slug: 'vegan-favorites' },
]

const recipeOfTheWeek = {
    title: 'Creamy Yogurt Parfait Bliss',
    description: "Indulge in the perfect balance of creamy yogurt, crunchy granola, and fresh seasonal fruits. This easy guide shows you how to layer textures and flavors for a refreshing breakfast or a light, guilt-free dessert. Whether you prefer tangy Greek yogurt or a hint of honey sweetness, discover the art of creating a parfait that looks as good as it tastes.",
    image: 'images/parf.jpg',
    slug: 'yogurt-parfait',
    servings: '2 Parfaits',
    skillLevel: 'Easy',
}

// --- Extracted UI Components ---

const SectionHeader = ({ subTitle, title }) => (
    <header className="text-center mb-10 sm:mb-14">
        <h3 className="text-xs sm:text-sm font-semibold uppercase text-amber-600 dark:text-amber-500 tracking-widest mb-2">
            {subTitle}
        </h3>
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 font-serif inline-block relative pb-3">
            {title}
            <span className="absolute left-1/2 bottom-0 w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transform -translate-x-1/2"></span>
        </h2>
    </header>
)

const RecipeCard = ({ recipe, isNew = false }) => (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
        {isNew && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg flex items-center gap-1">
                <SparklesIcon className="w-3 h-3" />
                NEW
            </div>
        )}
        <div className="h-52 overflow-hidden relative group">
            <img
                loading="lazy"
                src={`/${recipe.image}`}
                alt={recipe.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://placehold.co/600x400/94a3b8/white?text=Image+Error'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-serif line-clamp-2">
                {recipe.title}
            </h4>
            <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    recipe.difficulty === 'Easy' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                }`}>
                    {recipe.difficulty}
                </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">
                {recipe.excerpt}
            </p>
            <Link
                href={`/recipes/${recipe.slug}`}
                className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-semibold text-sm transition-colors duration-200 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
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
        <div className="relative h-full min-h-[280px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl">
            <img
                loading="lazy"
                src={`/${category.image}`}
                alt={`Explore ${category.title} recipes`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://placehold.co/600x800/94a3b8/white?text=Image+Error'
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
)


// --- Home Page ---
const HomePage = () => {
    const [email, setEmail] = useState('')

    const handleSubscribe = (e) => {
        e.preventDefault()
        console.log('Subscribing:', email)
        setEmail('')
    }

    return (
        <>
            {/* Hero Section */}
            <section 
                className="relative w-full mb-20 sm:mb-24 h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden flex items-center justify-center text-center px-4 sm:px-6"
                aria-labelledby="hero-heading"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/ff.webp')" }}
                    role="img"
                    aria-label="Image of a delicious meal spread on a wooden table"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div> 
                </div>

                <div className="relative z-10 max-w-5xl text-center px-4">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <FireIcon className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white">Fresh Recipes Every Week</span>
                    </div>
                    
                    <h1 
                        id="hero-heading"
                        className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-5 sm:mb-6 drop-shadow-2xl font-serif text-white leading-tight"
                    >
                        Gather. Create.
                        <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 text-transparent bg-clip-text block mt-2">
                            Savor.
                        </span>
                    </h1>
                    
                    <p className="text-lg sm:text-2xl text-gray-100 mb-10 sm:mb-12 drop-shadow-lg max-w-3xl mx-auto leading-relaxed font-light">
                        From cozy family dinners to weekend indulgences, discover recipes
                        made with love, simple ingredients, and a dash of joy.
                    </p>
                    
                    <Link
                        href="/recipes"
                        className="inline-flex items-center justify-center px-10 py-4 sm:px-12 sm:py-5 text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-2xl transition duration-300 hover:from-amber-600 hover:to-orange-600 hover:shadow-3xl transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                    >
                        <SparklesIcon className="w-6 h-6 mr-2" /> 
                        Explore Recipes
                    </Link>
                </div>
            </section>

            <div className="max-w-7xl mx-auto"> 
                {/* Recipe of the Week */}
                <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border-2 border-amber-200 dark:border-amber-900/30">
                        <div className="lg:w-1/2 h-72 sm:h-96 lg:h-auto overflow-hidden relative group">
                            <img
                                src={`/${recipeOfTheWeek.image}`}
                                alt="Artisan sourdough loaf, feature recipe of the week"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <StarIcon className="w-5 h-5 text-amber-500" />
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Featured</span>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-3">
                                <HeartIcon className="w-5 h-5 text-red-500" />
                                <span className="text-xs sm:text-sm font-bold uppercase text-red-500 tracking-widest">
                                    Weekly Feature
                                </span>
                            </div>
                            
                            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 font-serif mb-4 sm:mb-5 leading-tight">
                                {recipeOfTheWeek.title}
                            </h2>
                            
                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                                {recipeOfTheWeek.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {recipeOfTheWeek.servings}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {recipeOfTheWeek.skillLevel}
                                    </span>
                                </div>
                            </div>
                            
                            <Link
                                href={`/recipes/${recipeOfTheWeek.slug}`}
                                className="self-start px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 hover:shadow-2xl active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
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
            <section className="py-16 sm:py-20 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800" aria-labelledby="newsletter-heading">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="relative overflow-hidden p-8 sm:p-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        
                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <h3 id="newsletter-heading" className="text-3xl sm:text-4xl font-bold text-white font-serif mb-3">
                                    Join Wendy's Table
                                </h3>
                                <p className="text-base sm:text-lg text-amber-50">
                                    Get weekly recipes, baking tips, and exclusive content delivered straight to your inbox.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                                <label htmlFor="email-input" className="sr-only">Email Address</label>
                                <input
                                    id="email-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="flex-grow px-5 py-4 border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-amber-100 rounded-xl focus:ring-4 focus:ring-white/50 focus:border-white transition duration-300 focus:outline-none"
                                />
                                <button
                                    onClick={handleSubscribe}
                                    className="px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 sm:py-24 bg-white dark:bg-gray-950" aria-labelledby="about-wendy-heading">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-2xl opacity-20"></div>
                            <img
                                loading="lazy"
                                src="/images/wendyy.jpg"
                                alt="Wendy, the author, smiling in her kitchen" 
                                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-amber-500 shadow-2xl"
                            />
                        </div>
                        
                        <div className="text-center md:text-left flex-1">
                            <h3 id="about-wendy-heading" className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-serif mb-4">
                                Hello, I'm Wendy!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                                I'm passionate about making delicious food accessible to everyone. From complicated bakes to 15-minute meals, I share all the tips and tricks I've learned over the years.
                            </p>
                            <Link
                                href="/about"
                                className="inline-flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-bold text-lg transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
                            >
                                Read My Full Story
                                <ChevronRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage