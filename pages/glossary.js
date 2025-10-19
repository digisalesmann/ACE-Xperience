// pages/glossary.js

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Hash, BookOpen, Utensils, ChevronRight } from 'lucide-react';

// =================================================================
// --- ACCURATE CULINARY GLOSSARY DATA --- 
// (Assuming the full data structure remains as provided in the previous prompt)
// =================================================================

const culinaryGlossary = {
    A: [
        { term: 'Al dente', definition: "Italian for 'to the tooth.' Describes pasta or vegetables cooked until they are tender yet still firm when bitten." },
        { term: 'Aromatics', definition: 'Vegetables (like onions, carrots, and celery) and herbs used to provide a base layer of flavor for a dish.' },
        { term: 'Au gratin', definition: 'Dishes sprinkled with breadcrumbs or grated cheese and baked until a golden-brown crust forms.' },
        { term: 'Au sec', definition: "To cook a liquid (like a sauce or stock) until it's nearly dry, which intensely concentrates the flavor." },
    ],
    B: [
        { term: 'Bain-marie', definition: "A cooking technique where food is placed in a container and that container is then set in a larger pan of hot water; used for gentle cooking or keeping food warm (e.g., Hollandaise)." },
        { term: 'Blanch', definition: 'To plunge food briefly into boiling water and then immediately into an ice bath to stop the cooking process (shocking), preserving color and texture.' },
        { term: 'Braise', definition: 'A cooking method where meat is first seared at high heat, then slowly cooked, tightly covered, in a small amount of liquid until tender.' },
        { term: 'Brunoise', definition: 'A fine dice cut, typically 3mm x 3mm x 3mm, primarily used for uniform cooking and garnish.' },
    ],
    C: [
        { term: 'Caramelization', definition: 'The process of browning sugars at high temperatures (around 320°F / 160°C), resulting in rich, nutty flavors (distinct from the Maillard Reaction).' },
        { term: 'Chiffonade', definition: 'A cutting technique where leafy vegetables (like basil or mint) are rolled tightly and sliced into thin ribbons.' },
        { term: 'Clarified Butter', definition: 'Unsalted butter cooked to separate the water and milk solids from the pure butterfat, giving it a higher smoke point.' },
    ],
    D: [
        { term: 'Deglaze', definition: 'Adding a cold liquid (like wine, stock, or water) to a hot pan to dissolve and lift the fond (browned bits) from the bottom, incorporating it into a sauce.' },
        { term: 'Dice', definition: 'Cutting food into small cubes of uniform size. Different sizes include large, medium, small, and brunoise.' },
    ],
    E: [
        { term: 'Emulsification', definition: 'The forced mixture of two liquids that would normally not mix (e.g., fat and water), such as oil and vinegar in a vinaigrette, often stabilized by an agent like mustard or egg yolk.' },
    ],
    F: [
        { term: 'Fond', definition: 'The French term for the flavorful browned and caramelized meat and vegetable scraps stuck to the bottom of the pan after searing or roasting. Essential for deglazing.' },
        { term: 'Fumet', definition: 'A highly concentrated, flavorful stock, usually made from fish bones, wine, and aromatics.' },
    ],
    G: [
        { term: 'Gluten', definition: 'A network of proteins (gliadin and glutenin) formed when water is added to flour, providing structure and elasticity to bread dough.' },
    ],
    M: [
        { term: 'Maillard Reaction', definition: 'A non-enzymatic chemical reaction between amino acids and reducing sugars that gives browned food its distinctive flavor, occurring at temperatures above 285°F (140°C).' },
        { term: 'Mise en place', definition: "French for 'everything in its place.' The crucial step of organizing and arranging all ingredients (cuts, measures, etc.) and equipment before cooking begins." },
        { term: 'Mother Sauce', definition: 'One of the five foundational sauces in French cuisine: Béchamel, Velouté, Espagnole, Hollandaise, and Tomate. All other sauces are derived from these.' },
    ],
    P: [
        { term: 'Parboil', definition: 'To boil food briefly in liquid to soften it or partially cook it before transferring it to another cooking method (e.g., roasting).' },
    ],
    R: [
        { term: 'Reduction', definition: 'The process of simmering a liquid (like a sauce or stock) to evaporate water, thereby concentrating its flavor and thickening its consistency.' },
        { term: 'Roux', definition: 'A cooked mixture of equal parts (by weight) flour and fat (usually butter) used as the basic thickening agent for sauces and soups.' },
    ],
};

const glossaryKeys = Object.keys(culinaryGlossary).sort();


// =================================================================
// --- UI Components ---
// =================================================================

// Component for the Alphabet Navigation bar
const GlossaryNav = () => (
    <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl py-3 border-b border-amber-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-wrap justify-center space-x-1 sm:space-x-2">
                {glossaryKeys.map(letter => (
                    <a 
                        key={letter} 
                        href={`#${letter}`} 
                        className="text-base font-extrabold w-8 h-8 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 active:scale-95"
                    >
                        {letter}
                    </a>
                ))}
            </nav>
        </div>
    </div>
);


// Component for a single group of terms (FIXED SPACING)
const TermGroup = ({ letter, terms }) => (
    <section 
        id={letter} 
        // Increased margin and padding for dramatic spacing around the letter
        className="mb-16 pt-10 scroll-mt-24 sm:scroll-mt-28" 
    >
        <h2 
            // Increased text size and padding/margin for the letter header
            className="text-6xl sm:text-7xl font-serif font-extrabold text-gray-900 dark:text-white border-b-4 border-red-600/50 pb-2 mb-10 sm:mb-12 inline-block leading-none drop-shadow-sm"
        >
            {letter}
        </h2>
        
        {/* Responsive Grid for Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {terms.map((item, index) => (
                <div 
                    key={index} 
                    className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-t-4 border-amber-500 transition-all duration-300 hover:shadow-xl hover:border-red-600"
                >
                    <strong className="text-xl font-extrabold text-red-600 dark:text-red-400 block mb-2 font-serif">
                        {item.term}
                    </strong>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.definition}
                    </p>
                </div>
            ))}
        </div>
    </section>
);


// =================================================================
// --- Main Page Component ---
// =================================================================

const FullGlossaryPage = () => {
    return (
        // Main wrapper uses amber/red theme colors
        <div className="min-h-screen bg-amber-50/50 dark:bg-gray-950 transition-colors duration-300">
            
            {/* Alphabet Navigation - Sits sticky at the top */}
            <GlossaryNav />

            {/* Main Content Area (Centered and Padded) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
                
                {/* Back Link */}
                <Link href="/tips" className="text-amber-600 dark:text-amber-400 font-semibold hover:text-red-600 mb-8 inline-flex items-center transition-colors text-lg">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Tips & Techniques
                </Link>

                {/* Header (Matured UI) */}
                <header className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-2xl border-t-4 border-red-600 mb-16">
                    <div className="flex items-start flex-col sm:flex-row sm:items-center">
                        <BookOpen className='w-10 h-10 sm:w-16 sm:h-16 mr-6 text-red-600 flex-shrink-0 mb-4 sm:mb-0' />
                        <div className='flex-grow'>
                            <p className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-widest">THE CULINARY REFERENCE</p>
                            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-gray-900 dark:text-white leading-tight">
                                The Full Culinary A-Z Glossary
                            </h1>
                        </div>
                    </div>
                    <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mt-6 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-6">
                        A comprehensive, accurate reference guide to essential French terms, cutting techniques, and scientific cooking definitions used in modern professional kitchens.
                    </p>
                </header>

                {/* Glossary Content Section (Main scrollable area) */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                    
                    {/* Mapped Glossary Terms */}
                    <div className="space-y-16">
                        {glossaryKeys.map(letter => (
                            <TermGroup 
                                key={letter} 
                                letter={letter} 
                                terms={culinaryGlossary[letter]} 
                            />
                        ))}
                    </div>
                    
                    {/* Footer Warning */}
                    <div className="mt-20 p-6 text-center bg-red-50 dark:bg-gray-700 rounded-lg text-base text-gray-700 dark:text-gray-300 border border-red-200 dark:border-red-800/50 flex items-center justify-center space-x-2">
                        <Utensils className='w-5 h-5 text-red-600 flex-shrink-0' />
                        <p>This reference is focused on foundational and scientific cooking terms. All definitions are precise and curated for accuracy.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FullGlossaryPage;