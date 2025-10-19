'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    Utensils,
    Sparkles,
    Flame,
    Beaker,
    BookOpen,
    ChevronRight,
    Lightbulb,
    Layers,
    ListChecks,
    Hash,
    PlayCircle, 
} from 'lucide-react'


// =================================================================
// --- Data Definitions (Keeping these concise) ---
// =================================================================

const techniqueCategories = [
    {
        icon: Flame,
        title: 'Searing & Frying',
        tag: 'High Heat',
        description: 'Achieve the perfect crust on meats and understand oil smoke points for safe, effective frying.',
        slug: 'searing-frying',
        count: 7,
        image: 'images/pro.png',
    },
    {
        icon: Beaker,
        title: 'Bread Science & Yeast',
        tag: 'Precision',
        description: 'Demystify dough hydration, gluten structure, and fermentation for naturally leavened perfection.',
        slug: 'bread-science',
        count: 10,
        image: 'images/bread.png',
    },
    {
        icon: Utensils,
        title: 'Master Knife Skills',
        tag: 'The Core',
        description: 'From rock-chopping to julienning, master safety and speed for all kitchen prep tasks.',
        slug: 'knife-mastery',
        count: 5,
        image: 'images/knife.webp',
    },
    {
        icon: Sparkles,
        title: 'Flavor & Seasoning',
        tag: 'Art of Taste',
        description: 'Learn flavor layering, compound butter, and when to salt and pepper for maximum impact.',
        slug: 'flavor-seasoning',
        count: 8,
        image: 'images/sauce.webp',
    },
];

const skillsRoadmap = [
    { step: 1, title: 'Foundational Prep', skill: 'Knife Skills, Mise en Place', link: '/techniques/knife-mastery' },
    { step: 2, title: 'Heat Control', skill: 'Searing, Broiling, Roasting', link: '/techniques/searing-frying' },
    { step: 3, title: 'Sauce Construction', skill: 'Emulsification, Reduction', link: '/techniques/sauce-fundamentals' },
    { step: 4, title: 'Advanced Baking', skill: 'Yeast/Gluten Management', link: '/techniques/bread-science' },
];

const quickTips = {
    Timing: [
        { id: 1, title: 'The "Carryover" Cook', excerpt: 'Meats continue to cook after removal from heat. Account for a 5-10°F rise.', slug: 'carryover-cook' },
        { id: 2, title: 'Blanching Time', excerpt: 'Submerge vegetables in boiling water for 1-2 minutes, then immediately ice bath.', slug: 'blanching-guide' },
    ],
    Hacks: [
        { id: 3, title: 'Garlic Peeling Shake', excerpt: 'Separate whole garlic cloves instantly by shaking them between two metal bowls.', slug: 'garlic-peeling-hack' },
        { id: 4, title: 'Resting Meat Foil Tent', excerpt: 'Tent resting meat lightly with foil to keep it warm without steaming the crust.', slug: 'resting-meat-tip' },
    ],
    Substitutions: [
        { id: 5, title: 'Buttermilk Swap', excerpt: 'Mix 1 cup milk with 1 tbsp lemon juice or white vinegar; let sit 5 mins.', slug: 'buttermilk-swap' },
        { id: 6, title: 'Egg Replacement', excerpt: '1 egg often equals 1/4 cup of mashed banana or applesauce in baking.', slug: 'egg-replacement-guide' },
    ],
};

const tipTabs = ['Timing', 'Hacks', 'Substitutions'];


// ===============================================
// --- Core UI Components ---
// ===============================================

const SectionHeader = ({ subTitle, title, description = '' }) => (
    <header className="text-center mb-16 sm:mb-24 max-w-4xl mx-auto"> 
        <h3 className="text-md font-bold uppercase text-red-600 dark:text-red-400 tracking-[0.3em] mb-3">
            {subTitle}
        </h3>
        <h2 id={subTitle.toLowerCase().replace(/\s/g, '-')} className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-gray-100 font-serif inline-block relative pb-4">
            {title}
            <span className="absolute left-1/2 bottom-0 w-24 h-1.5 bg-amber-500 rounded-full transform -translate-x-1/2"></span> 
        </h2>
        {description && <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 px-4 sm:px-0">{description}</p>} 
    </header>
);

// --- 1. Video Hero Component (Responsive) ---
const VideoHeroSection = () => (
    // Removed margin/padding from the top level here to allow it to be truly full width
    <section className="relative w-full h-[600px] sm:h-[750px] overflow-hidden rounded-none sm:rounded-3xl shadow-3xl">
        
        {/* Video Background */}
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-30"
            src="/videos/vid.mp4" 
        >
            <source src="/images/hero-fallback.jpg" type="image/jpeg" /> 
        </video>

        {/* Overlay for contrast and a subtle gradient sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-black/30 dark:from-gray-950/90 dark:to-gray-950/40"></div>
        
        {/* Content Container - Use fixed padding and auto margins to center content correctly */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-20 max-w-7xl h-full flex flex-col justify-center mx-auto"> 
            <span className="text-xl font-bold uppercase text-amber-300 tracking-[0.4em] mb-4 flex items-center">
                <PlayCircle className='w-6 h-6 mr-3' /> KITCHEN MASTERY
            </span>
            <h1 className="text-5xl sm:text-7xl font-black text-white font-serif mb-8 leading-tight drop-shadow-lg">
                Cook with Confidence. Cook with Knowledge.
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 mb-12 max-w-lg drop-shadow-md">
                Stop guessing and start creating. Our comprehensive library breaks down advanced techniques into simple, repeatable steps.
            </p>

            <Link
                href="#categories"
                className="self-start inline-flex items-center px-10 py-4 text-xl font-extrabold bg-amber-500 text-gray-900 rounded-full shadow-2xl transition duration-300 hover:bg-amber-400 transform hover:scale-[1.03] active:scale-[0.98] ring-4 ring-amber-300/50"
            >
                <BookOpen className="w-6 h-6 mr-3" /> Explore the Library
            </Link>
        </div>
    </section>
);


const TechniqueCard = ({ category }) => {
    const IconComponent = category.icon;

    return (
        <Link 
            href={`/techniques/${category.slug}`}
            className="group block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 rounded-3xl"
        >
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.01] h-full flex flex-col items-start border border-gray-100 dark:border-gray-700">
                
                {/* Image Background */}
                <div className="w-full h-48 overflow-hidden relative">
                    <img
                        loading="lazy"
                        src={`/${category.image}`}
                        alt={`Visual cue for ${category.title}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 dark:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                    
                    {/* Icon and Tag overlay */}
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-end">
                        <div className="mr-3 p-2 bg-amber-500 rounded-xl shadow-lg">
                            {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                        </div>
                        <div className='flex flex-col'>
                            <span className="text-xs font-bold uppercase text-amber-300 mb-1 tracking-widest">{category.tag}</span>
                            <h3 className="text-2xl font-bold font-serif text-white drop-shadow-md">
                                {category.title}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow w-full">
                    <p className="text-gray-600 dark:text-gray-400 text-base mb-4 flex-grow">
                        {category.description}
                    </p>

                    {/* Footer / CTA */}
                    <div className="flex justify-between items-center w-full pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center">
                            <Layers className="w-4 h-4 mr-1 text-red-500" /> {category.count} Articles
                        </span>
                        <span className="text-red-600 font-bold flex items-center transition-transform group-hover:translate-x-1">
                            Start Module <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- Skills Roadmap Component ---
const SkillsRoadmapSection = () => (
    <section aria-labelledby="skills-roadmap-heading">
        <SectionHeader
            subTitle="Your Learning Journey"
            title="The 4-Step Culinary Roadmap"
            description="Follow our structured path to build your skills logically, moving from basic preparation to advanced techniques."
        />
        
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8">
            {skillsRoadmap.map((item, index) => (
                <Link
                    key={item.step}
                    href={item.link}
                    className="block group bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-xl border-t-4 border-amber-500/0 hover:border-amber-500 transition-all duration-300 hover:shadow-3xl transform hover:scale-[1.01]"
                >
                    <div className="flex items-start">
                        {/* Step Number */}
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-4 text-xl sm:text-2xl font-extrabold text-white bg-red-600 rounded-full flex-shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110">
                            {item.step}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow">
                            <h4 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white mb-1 group-hover:text-red-600 transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                                Focus Skill: <span className="font-semibold italic text-amber-600 dark:text-amber-400">{item.skill}</span>
                            </p>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-6 h-6 ml-4 text-gray-400 dark:text-amber-400 transition-transform duration-300 group-hover:translate-x-2 flex-shrink-0 mt-3" />
                    </div>
                </Link>
            ))}
        </div>
    </section>
);

// ===============================
// --- Tips & Techniques Page ---
// ===============================
const TipsAndTechniquesPage = () => {
    const [activeTipTab, setActiveTipTab] = useState(tipTabs[0]);

    return (
        // Main wrapper now controls page-level background and vertical padding
        <div className="min-h-screen bg-amber-50/50 dark:bg-gray-950 py-0 w-full flex flex-col items-center">
            
            {/* 1. Video Hero Section - Full width, no horizontal padding here */}
            <VideoHeroSection />
            
            {/* Main Content Container - **CRITICAL: mx-auto ensures centering. px-4 adds side padding on mobile.** */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 pt-16 sm:pt-24 pb-20">

                {/* 2. Technique Categories Grid */}
                <section id="categories" aria-labelledby="techniques-heading">
                    <SectionHeader
                        subTitle="Modular Learning"
                        title="Comprehensive Technique Modules"
                        description="Dive deep into practical modules covering core skills needed for advanced cooking."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {techniqueCategories.map((cat) => (
                            <TechniqueCard category={cat} key={cat.slug} />
                        ))}
                    </div>
                </section>
                
                {/* 3. Skills Roadmap Section */}
                <SkillsRoadmapSection />

                {/* 4. Digestible Tabbed Quick Tips */}
                <section aria-labelledby="quick-tips-heading">
                    <SectionHeader
                        subTitle="Quick Reference"
                        title="Top Tips & Essential Hacks"
                        description="Quick answers and simple hacks to troubleshoot common kitchen problems instantly."
                    />
                    
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700">
                        {/* Tab Navigation - **IMPROVEMENT: Removed potentially problematic negative margin and ensured consistent padding.** */}
                        <div className="flex flex-wrap justify-center border-b border-gray-200 dark:border-gray-700 mb-8">
                            {tipTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTipTab(tab)}
                                    className={`px-3 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-bold transition-all duration-300 mx-1 rounded-t-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 whitespace-nowrap
                                        ${activeTipTab === tab
                                            ? 'text-amber-600 dark:text-amber-400 border-b-4 border-amber-600 dark:border-amber-400'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <div className='flex items-center'>
                                        <Lightbulb className='w-5 h-5 mr-2 hidden sm:inline-block' />
                                        {tab}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content List */}
                        <div className="space-y-6">
                            {quickTips[activeTipTab].map((tip, index) => (
                                <Link 
                                    key={tip.id} 
                                    href={`/tips/${tip.slug}`} 
                                    className="block group bg-amber-50 dark:bg-gray-700/50 p-5 rounded-2xl shadow-sm border border-amber-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-amber-300 dark:hover:border-red-800"
                                >
                                    <div className="flex items-start">
                                        {/* Number/Icon */}
                                        <div className="flex items-center justify-center w-10 h-10 mr-4 text-lg font-extrabold text-white bg-red-600 rounded-full flex-shrink-0 shadow-md">
                                            {index + 1}
                                        </div>
                                        
                                        {/* Tip Content */}
                                        <div className="flex-grow">
                                            <h4 className="text-xl font-bold font-serif text-gray-900 dark:text-white mb-1 group-hover:text-red-600 transition-colors">
                                                {tip.title}
                                            </h4>
                                            <p className="text-gray-700 dark:text-gray-300 text-base">
                                                {tip.excerpt}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="w-6 h-6 ml-4 text-red-500 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0 mt-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* 5. Culinary Glossary Section */}
                <section aria-labelledby="glossary-heading">
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between flex-wrap border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                            <h3 id="glossary-heading" className="text-3xl font-extrabold font-serif text-gray-900 dark:text-white flex items-center mb-2 sm:mb-0">
                                <Hash className="w-7 h-7 mr-3 text-amber-500" /> Culinary Glossary
                            </h3>
                            <Link href="/glossary" className="text-red-600 font-bold flex items-center hover:underline">
                                Full A-Z List <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-lg">
                            {/* Mock Glossary Terms */}
                            <div>
                                <h4 className="font-extrabold text-amber-600 dark:text-amber-400">Deglaze:</h4>
                                <p className="text-gray-700 dark:text-gray-300 text-base">Adding liquid (wine/stock) to a hot pan after searing to dissolve caramelized bits (fond) into a sauce.</p>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-amber-600 dark:text-amber-400">Emulsify:</h4>
                                <p className="text-gray-700 dark:text-gray-300 text-base">Forcing two unmixable liquids (like oil and water/vinegar) to combine permanently (e.g., mayonnaise).</p>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-amber-600 dark:text-amber-400">Mise en Place:</h4>
                                <p className="text-gray-700 dark:text-gray-300 text-base">A French term meaning "everything in its place"; having all ingredients measured, chopped, and ready before cooking begins.</p>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-amber-600 dark:text-amber-400">Proofing:</h4>
                                <p className="text-gray-700 dark:text-gray-300 text-base">The final rise time for yeast dough before baking, allowing it to double in size and become airy.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Footer CTA Block */}
                <section className="text-center pt-10 pb-20">
                    <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-3xl border-2 border-red-500/30 dark:border-red-800/50 max-w-3xl mx-auto">
                        <h3 className="text-3xl font-extrabold font-serif text-gray-900 dark:text-white mb-4">
                            Ready to Apply Your New Skills?
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Put your mastery to the test with our full collection of recipes.
                        </p>
                        <Link
                            href="/recipes"
                            className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold bg-amber-500 text-white rounded-xl shadow-lg transition duration-300 hover:bg-amber-600 transform active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
                        >
                            View All Recipes <ChevronRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TipsAndTechniquesPage;