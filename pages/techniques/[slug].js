// pages/techniques/[slug].js

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router' // <-- Import for Pages Router access
import { 
    ChevronLeft, Flame, Beaker, Utensils, Sparkles, AlertTriangle, 
    CookingPot, BookOpen, Clock, Layers, ChevronRight
} from 'lucide-react'

// =================================================================
// --- SLUG GENERATION UTILITY & DATA --- 
// =================================================================

const toKebabCase = (text) => {
    if (!text) return ''
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
}

/**
 * Generates the detailed roadmap slug (e.g., 1-foundational-prep-knife-skills-mise-en-place)
 */
const generateRoadmapSlug = (item) => {
    const titleSlug = toKebabCase(item.title)
    const skillSlug = toKebabCase(item.skill || item.tag)
    return `${item.step}-${titleSlug}-${skillSlug}`.replace(/^-+|-+$/g, '')
}


// --- DATA DEFINITIONS ---

// Modular Learning Categories (simple slugs)
const techniqueCategories = [
    {
        icon: Flame,
        title: 'Searing & Frying',
        tag: 'High Heat Control',
        description: 'Achieve the perfect crust on meats (Maillard reaction) and understand oil smoke points for safe, effective frying and pan sauces.',
        slug: 'searing-frying',
        key_concept: 'Maillard Reaction',
    },
    {
        icon: Beaker,
        title: 'Bread Science & Yeast',
        tag: 'Precision Baking',
        description: 'Demystify dough hydration, control gluten structure, and manage fermentation timelines for naturally leavened perfection.',
        slug: 'bread-science',
        key_concept: 'Gluten Development',
    },
    {
        icon: Utensils,
        title: 'Master Knife Skills',
        tag: 'Essential Foundation',
        description: "From the safety 'claw' grip to julienning, master safety and speed for consistent and efficient vegetable and meat prep.",
        slug: 'knife-mastery',
        key_concept: 'Mise en Place',
    },
    {
        icon: Sparkles,
        title: 'Flavor & Seasoning',
        tag: 'Art of Taste',
        description: 'Learn flavor layering, how to build a base (soffritto/mirepoix), and when to salt for maximum impact and depth.',
        slug: 'flavor-seasoning',
        key_concept: 'Flavor Pairing',
    },
]

// Detailed Roadmap Data (steps with full content)
const baseSkillsRoadmap = [
    { 
        step: 1, 
        title: 'Foundational Prep', 
        skill: 'Knife Skills, Mise en Place', 
        categorySlug: 'knife-mastery', // Associate with a module
        icon: Utensils,
        content: "Mastering the knife is the most crucial step. Focus on the 'claw' grip for safety and the rock-chopping motion for efficiency. Mise en Place (everything in its place) ensures a smooth cooking process, reducing stress and time-sensitive errors.",
        prerequisite: 'None',
        estimated_time: '2 hours',
        details: [
            { name: 'The Claw Grip & Safety', description: 'Protecting your fingertips by keeping them curled under while guiding the blade.' },
            { name: 'Classic Cuts', description: 'Mastering the Brunoise (3mm dice) and Julienne (2mm sticks) for uniform cooking.' },
            { name: 'Mise en Place Workflow', description: 'Setting up all stations (dry, wet, cooking, finishing) before heat is applied.' },
        ],
    },
    { 
        step: 2, 
        title: 'Heat Control', 
        skill: 'Searing, Broiling, Roasting', 
        categorySlug: 'searing-frying', // Associate with a module
        icon: Flame,
        content: "Understanding how heat transfers is key to developing texture and flavor. High heat (searing) develops the Maillard reaction (browning), while controlled oven heat (roasting) cooks protein evenly without drying.",
        prerequisite: 'Step 1: Foundational Prep',
        estimated_time: '3 hours',
        details: [
            { name: 'Maillard vs. Caramelization', description: 'Understanding the difference between protein browning and sugar browning.' },
            { name: 'Smoke Points of Fats', description: 'Selecting the right oil (e.g., grapeseed, butter) for the temperature of the pan.' },
            { name: 'Resting Proteins', description: 'Allowing meat carryover cook time and redistributing internal juices for tenderness.' },
        ],
    },
    { 
        step: 3, 
        title: 'Sauce Construction', 
        skill: 'Emulsification, Reduction', 
        categorySlug: 'flavor-seasoning', // Associate with a module
        icon: Sparkles,
        content: "Sauces provide moisture, flavor, and elegance. Emulsification (binding fat and liquid, like in a vinaigrette or hollandaise) and Reduction (concentrating flavor by evaporating water) are core skills.",
        prerequisite: 'Step 2: Heat Control',
        estimated_time: '4 hours',
        details: [
            { name: 'Building a Roux', description: 'Creating the fat-flour base for thickening classic sauces (béchamel, velouté).' },
            { name: 'Achieving Stable Emulsions', description: 'Using egg yolks or mustard as stabilizers to prevent separation.' },
            { name: 'Deglazing for Fond', description: 'Adding liquid to the pan to lift the caramelized bits (fond) into the sauce base.' },
        ],
    },
    { 
        step: 4, 
        title: 'Advanced Baking', 
        skill: 'Yeast/Gluten Management', 
        categorySlug: 'bread-science', // Associate with a module
        icon: Beaker,
        content: "Baking is precise chemistry. Gluten management (developing the protein network) gives dough structure, and controlling yeast activity determines the final rise, flavor, and crumb texture.",
        prerequisite: 'All steps recommended',
        estimated_time: '6 hours',
        details: [
            { name: 'The Autolyse Technique', description: 'Resting flour and water before kneading to aid hydration and smooth gluten development.' },
            { name: 'Kneading for Windowpane', description: 'Testing gluten elasticity by stretching the dough thin enough to see light through it.' },
            { name: 'Hydration Calculations', description: 'Measuring the ratio of water to flour to achieve specific bread textures (e.g., Focaccia, Baguette).' },
        ],
    },
]

// Process the data to create slugs (Performed once outside the component)
const detailedSkillsRoadmap = baseSkillsRoadmap.map(item => ({
    ...item,
    slug: generateRoadmapSlug(item),
    link: `/techniques/${generateRoadmapSlug(item)}`,
}))

// --- LOOKUP FUNCTIONS ---

/**
 * Finds a single detailed step by its unique roadmap slug.
 */
const getRoadmapStepBySlug = (slug) => {
    return detailedSkillsRoadmap.find(item => item.slug === slug)
}

/**
 * Finds a category object by its simple slug (e.g., 'searing-frying').
 */
const getCategoryBySlug = (slug) => {
    return techniqueCategories.find(item => item.slug === slug)
}

/**
 * Gets all roadmap steps that belong to a specific category slug.
 */
const getStepsByCategoryId = (categorySlug) => {
    return detailedSkillsRoadmap.filter(item => item.categorySlug === categorySlug)
}


// =================================================================
// --- UI Components for Different Page Types ---
// =================================================================

/**
 * Renders the detailed content for a single Roadmap step (e.g., Step 1: Foundational Prep).
 */
const TechniqueStepPage = ({ stepData }) => {
    const StepIcon = stepData.icon

    return (
        <div className="bg-amber-50/50 dark:bg-gray-950 pt-16 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Link */}
                <Link href="/tips" className="text-red-600 font-bold hover:underline mb-8 inline-flex items-center transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Roadmap Overview
                </Link>

                {/* Header */}
                <header className="bg-white dark:bg-gray-800 p-6 sm:p-12 rounded-3xl shadow-2xl border-t-4 border-red-600 mb-10 sm:mb-12">
                    <div className="flex items-start flex-col sm:flex-row sm:items-center mb-4">
                        <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mr-6 text-2xl font-extrabold text-white bg-red-600 rounded-full flex-shrink-0 shadow-lg mb-4 sm:mb-0">
                            {stepData.step}
                        </div>
                        <div>
                            <p className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">CULINARY ROADMAP MODULE</p>
                            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-gray-900 dark:text-white leading-tight">
                                {stepData.title}
                            </h1>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 flex items-center">
                            <CookingPot className='w-5 h-5 mr-2 text-amber-600 dark:text-amber-400' />
                            Prerequisite: <span className='font-semibold'>{stepData.prerequisite}</span>
                        </p>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 flex items-center">
                            <Clock className='w-5 h-5 mr-2 text-amber-600 dark:text-amber-400' />
                            Time Estimate: <span className='font-semibold'>{stepData.estimated_time}</span>
                        </p>
                    </div>
                </header>

                {/* Content Section */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-red-600 dark:text-red-400 mb-6">
                        <StepIcon className="w-8 h-8 mr-3" />
                        <h2 className="text-2xl font-bold font-serif">Focus Skill: {stepData.skill}</h2>
                    </div>
                    {/* The content rendering uses dangerouslySetInnerHTML to process the bold markdown (**) */}
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: stepData.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>


                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-amber-500/50 pb-2 mb-4">
                        Key Learning Points & Techniques
                    </h3>
                    <ul className="space-y-4 pl-0">
                        {stepData.details.map((detail, index) => (
                            <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                                <span className="text-amber-600 dark:text-amber-400 mr-3 mt-1 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </span>
                                <div>
                                    <strong className='text-gray-900 dark:text-white'>{detail.name}:</strong> 
                                    <span className='ml-2'>{detail.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                        <Link
                            href={`/techniques/${stepData.slug}/full-guide`}
                            className="inline-flex items-center px-8 py-3 text-lg font-bold bg-amber-500 text-gray-900 rounded-xl shadow-lg transition duration-300 hover:bg-amber-600 transform active:scale-[0.98] ring-4 ring-amber-300/50"
                        >
                            <BookOpen className='w-5 h-5 mr-3'/> 
                            Start Full Lesson <ChevronRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}

/**
 * Renders the landing page for a Modular Learning Category (e.g., /techniques/searing-frying).
 * This page lists the relevant Roadmap steps.
 */
const ModuleLandingPage = ({ categoryData, relatedSteps }) => {
    const ModuleIcon = categoryData.icon

    return (
        <div className="bg-amber-50/50 dark:bg-gray-950 pt-16 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Link */}
                <Link href="/tips" className="text-red-600 font-bold hover:underline mb-8 inline-flex items-center transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Main Techniques
                </Link>

                {/* Header */}
                <header className="bg-white dark:bg-gray-800 p-6 sm:p-12 rounded-3xl shadow-2xl border-t-4 border-amber-600 mb-10 sm:mb-12">
                    <div className="flex items-start flex-col sm:flex-row sm:items-center mb-4">
                        <ModuleIcon className="w-10 h-10 sm:w-16 sm:h-16 mr-6 text-amber-600 flex-shrink-0 mb-4 sm:mb-0" />
                        <div>
                            <p className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">MODULAR LEARNING FOCUS</p>
                            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-gray-900 dark:text-white leading-tight">
                                {categoryData.title}
                            </h1>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6">
                        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
                            Key Concept: <span className='font-semibold text-red-600 dark:text-red-400'>{categoryData.key_concept}</span>
                        </p>
                        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">
                            {categoryData.description}
                        </p>
                    </div>
                </header>

                {/* Related Roadmap Steps */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mb-6 flex items-center border-b border-red-500/50 pb-2">
                        <Layers className="w-6 h-6 mr-3 text-red-600" /> Roadmap Steps in this Module ({relatedSteps.length})
                    </h2>
                    
                    <div className="space-y-4">
                        {relatedSteps.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.link} 
                                className="block group bg-amber-50 dark:bg-gray-700/50 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:bg-amber-100 dark:hover:bg-gray-700 border-l-4 border-amber-500 hover:border-red-600"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center w-8 h-8 mr-4 text-lg font-bold text-white bg-red-600 rounded-full flex-shrink-0 shadow-lg">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Focus: {item.skill}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 ml-4 text-red-500 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    {relatedSteps.length === 0 && (
                        <p className="text-gray-600 dark:text-gray-400 italic py-4">
                            No specific Roadmap steps found for this module yet.
                        </p>
                    )}
                </section>
            </div>
        </div>
    )
}

// =================================================================
// --- Main Dynamic Route Component (Pages Router Logic) ---
// =================================================================

const TechniqueDetailPage = () => {
    const router = useRouter()
    const { slug } = router.query 
    
    // 1. Loading State
    if (!slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50/50 dark:bg-gray-950">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Loading technique details...
                </p>
            </div>
        )
    }

    // 2. Data Lookup
    const stepData = getRoadmapStepBySlug(slug)
    const categoryData = getCategoryBySlug(slug)

    let pageContent = null

    if (stepData) {
        // Case A: The slug matches a detailed Roadmap Step (e.g., 1-foundational-prep-...)
        pageContent = <TechniqueStepPage stepData={stepData} />
    } else if (categoryData) {
        // Case B: The slug matches a broad Modular Learning Category (e.g., searing-frying)
        const relatedSteps = getStepsByCategoryId(categoryData.slug)
        pageContent = <ModuleLandingPage categoryData={categoryData} relatedSteps={relatedSteps} />
    } else {
        // Case C: 404 Not Found
        pageContent = (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg">
                    <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Technique Not Found (404)</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The culinary technique or module you are looking for ({slug}) doesn't exist.
                    </p>
                    <Link href="/tips" className="text-amber-600 font-semibold hover:underline flex items-center justify-center">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Roadmap
                    </Link>
                </div>
            </div>
        )
    }
    
    // 3. Render the correct page content
    return pageContent
}

export default TechniqueDetailPage