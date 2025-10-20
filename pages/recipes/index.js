// RecipesPage.jsx (or pages/recipes/index.js)
'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// Using lucide-react icons. NOTE: Menu is used for category, Filter is general filter.
import { Search, XCircle, Filter, Menu, ChevronDown, Clock, BarChart2 } from 'lucide-react' 

// --- Component Imports ---
import Link from '../../components/Link.js'
import RecipeCard from '../../components/Cards/RecipeCard.js' 
// --- Data Imports ---
// NOTE: Assuming your data is correctly exported from this path
import { allRecipes, categories, difficulties, ICON_MAP } from '../../data/recipesData'

// Utility function to get the correct icon component from the map
const getIcon = (iconKey) => ICON_MAP[iconKey] || Menu;

// -----------------------------------------------------------
// Collapsible Filter Group Component - (Refined Spacing)
// -----------------------------------------------------------
const CollapsibleFilterGroup = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    // Determine the header icon based on title content for aesthetics
    const Icon = title.includes('Category') ? Menu : Filter;

    return (
        <div className="border border-amber-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-none px-4 py-4 mb-6"> 
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white py-1"
            >
                <span className="flex items-center space-x-3"> 
                    <Icon className="w-6 h-6 text-amber-600" /> 
                    {title}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pt-4 border-t border-amber-100 dark:border-gray-700 mt-3"
                    >
                        <div className="space-y-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * FilterButton 
 */
const FilterButton = ({ item, active, onClick, colorClass }) => {
    // Get icon using the item's icon name from the data file
    const Icon = item.icon 
    
    const activeClasses = 
        colorClass === 'amber'
            ? 'bg-amber-600 text-white font-bold border-amber-700 shadow-md'
            : 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-md'
            
    const inactiveClasses = 'bg-amber-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-amber-200 dark:border-gray-700 hover:bg-amber-100 dark:hover:bg-gray-700'

    return (
        <button
            // Pass the item's filter key (string or null)
            onClick={() => onClick(item.filter)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 w-full text-left border 
                ${active ? activeClasses : inactiveClasses}`}
        >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span className="whitespace-nowrap flex-grow">{item.name}</span>
            {active && <span className="text-xs ml-auto">✓</span>}
        </button>
    )
}

// -----------------------------------------------------------
// Mobile Filter Drawer Component
// -----------------------------------------------------------
const MobileFilterDrawer = ({ 
    isOpen, 
    onClose, 
    categories, 
    difficulties, 
    selectedCategory, 
    setSelectedCategory, 
    selectedDifficulty, 
    setSelectedDifficulty,
    clearAllFilters
}) => {
    const FilterSection = ({ title, items, selected, setSelected, colorClass, HeaderIcon }) => (
        <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-amber-200 dark:border-gray-700 pb-2 flex items-center">
                <HeaderIcon className="w-5 h-5 mr-2 text-amber-600" />
                {title}
            </h3>
            <div className="flex flex-wrap gap-3">
                {items
                    // Exclude the 'All' option from the mobile list since it's implied by unselected
                    .filter(item => item.filter !== null) 
                    .map(item => {
                        // Get individual item icon from the data.js map
                        const Icon = item.icon 
                        
                        return (
                            <button
                                key={item.name}
                                onClick={() => setSelected(item.filter)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-200 border 
                                    ${selected === item.filter 
                                        ? 'bg-amber-600 text-white font-bold border-amber-700'
                                        : 'bg-amber-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-amber-200 dark:border-gray-700 hover:bg-amber-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                                <span className="whitespace-nowrap">{item.name}</span>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-amber-50 dark:bg-gray-950 p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                >
                    <div className="flex justify-between items-center mb-6 border-b pb-4 border-amber-200 dark:border-gray-800">
                        <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-white">Filter Recipes</h2>
                        <button onClick={onClose} className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 transition">
                            <XCircle size={32} />
                        </button>
                    </div>

                    <FilterSection 
                        title="By Category" 
                        items={categories} 
                        selected={selectedCategory} 
                        setSelected={setSelectedCategory} 
                        colorClass="amber"
                        HeaderIcon={Menu} // Using a standard icon for the header
                    />
                    
                    <FilterSection 
                        title="By Difficulty" 
                        items={difficulties} 
                        selected={selectedDifficulty} 
                        setSelected={setSelectedDifficulty} 
                        colorClass="emerald"
                        HeaderIcon={BarChart2} // Using a standard icon for the header
                    />

                    <div className="sticky bottom-0 bg-amber-50 dark:bg-gray-950 py-4 border-t border-amber-200 dark:border-gray-800 flex justify-between gap-4 mt-8">
                        <button 
                            onClick={() => { clearAllFilters(); onClose(); }}
                            className="w-1/2 py-3 text-sm font-semibold rounded-lg text-red-600 dark:text-red-400 border border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                        >
                            Clear & Close
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-1/2 py-3 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition shadow-lg"
                        >
                            Show Results
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
// -----------------------------------------------------------

// ====================================================================
// Page Component (RecipesPage) - FULLY UPDATED CODE
// ====================================================================
const RecipesPage = () => {
    // Initial filter state defaults to null, which maps to "All"
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedDifficulty, setSelectedDifficulty] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false) 

    // --- Filtering Logic (Retained) ---
    const filteredRecipes = useMemo(() => {
        let recipes = allRecipes
        const s = searchTerm.toLowerCase()
        recipes = recipes.filter(r => {
            // Category check: includes null (All) or specific match
            const categoryMatch = !selectedCategory || r.category === selectedCategory
            // Difficulty check: includes null (All) or specific match
            const difficultyMatch = !selectedDifficulty || r.difficulty === selectedDifficulty
            
            const searchMatch = !s || 
                r.title.toLowerCase().includes(s) ||
                r.excerpt.toLowerCase().includes(s) ||
                r.tags.some(t => t.toLowerCase().includes(s))
                
            return categoryMatch && difficultyMatch && searchMatch
        })
        return recipes
    }, [selectedCategory, selectedDifficulty, searchTerm])

    // --- Filter Handlers (Retained) ---
    const activeFilters = [
        selectedCategory ? { 
            type: 'category', 
            value: selectedCategory, 
            // Use find to get the correct name from the data array
            label: categories.find(c => c.filter === selectedCategory)?.name, 
            color: 'amber' 
        } : null,
        selectedDifficulty ? { 
            type: 'difficulty', 
            value: selectedDifficulty, 
            // Use find to get the correct name from the data array
            label: difficulties.find(d => d.filter === selectedDifficulty)?.name, 
            color: 'emerald' 
        } : null,
        searchTerm ? { type: 'search', value: searchTerm, label: `"${searchTerm}"`, color: 'red' } : null,
    ].filter(Boolean)
    
    const activeFiltersCount = activeFilters.length
    
    const clearAllFilters = () => {
        setSelectedCategory(null) // Reset to null (All)
        setSelectedDifficulty(null) // Reset to null (All)
        setSearchTerm('')
    }
    
    const removeFilter = (type) => {
        if (type === 'category') setSelectedCategory(null)
        if (type === 'difficulty') setSelectedDifficulty(null)
        if (type === 'search') setSearchTerm('')
    }
    
    // Get the display name for the current category, defaulting to the 'All Recipes' name
    const currentCategoryName = categories.find(c => c.filter === selectedCategory)?.name || categories.find(c => c.filter === null)?.name || 'All Recipes'


    return (
        <div className="min-h-screen bg-amber-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* 1. Header (Retained) */}
            <header className="w-full h-[250px] sm:h-[300px] overflow-hidden bg-gray-950 shadow-2xl relative z-10">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline // Crucial for mobile auto-playback
                    poster="/images/kitchen-poster.jpg" // Fallback image for older browsers/devices
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                >
                    {/* Replace '/videos/cooking-hero.mp4' with your video path */}
                    <source src="/videos/green.mp4" type="video/mp4" />
                    {/* Add other video formats (e.g., .webm) for better compatibility */}
                    Your browser does not support the video tag.
                </video>

                {/* Overlay Gradient (Keep this for text readability) */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
                
                {/* Hero Content (relative z-20 to ensure it's above the video) */}
                <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center p-6 sm:p-10">
                    <h1 className="text-4xl sm:text-6xl font-extrabold font-serif text-white drop-shadow-2xl tracking-tight">
                        The Mastered Recipe Library
                    </h1>
                    <p className="text-xl text-gray-300 mt-2 font-light italic border-l-4 border-amber-500 pl-4">
                        Discover {allRecipes.length}+ dishes crafted for culinary excellence.
                    </p>
                </div>
            </header>

            {/* 2. Main Content Wrapper: Sidebar + Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-10">
                
                {/* A. Desktop Filter Sidebar - FINAL CODE */}
                <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto pr-8 border-r border-amber-200 dark:border-gray-700 
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <h2 className="text-xl font-bold tracking-wider uppercase text-gray-900 dark:text-white mb-8 flex items-center">
                        <Filter className="w-6 h-6 mr-3 text-amber-600" /> 
                        REFINE YOUR SEARCH
                    </h2>
                    
                    <div className="mt-4">
                        <CollapsibleFilterGroup title="Recipe Category" defaultOpen={true}>
                            {categories.map(cat => (
                                <FilterButton 
                                    key={cat.name}
                                    item={cat}
                                    active={selectedCategory === cat.filter}
                                    onClick={setSelectedCategory}
                                    colorClass="amber"
                                />
                            ))}
                        </CollapsibleFilterGroup>
                    </div>

                    <div> 
                        <CollapsibleFilterGroup title="Skill Level" defaultOpen={true}>
                            {difficulties.map(diff => (
                                <FilterButton 
                                    key={diff.name}
                                    item={diff}
                                    active={selectedDifficulty === diff.filter}
                                    onClick={setSelectedDifficulty}
                                    colorClass="emerald"
                                />
                            ))}
                        </CollapsibleFilterGroup>
                    </div>
                    
                    {activeFiltersCount > 0 && (
                        <motion.button
                            key="clear-sidebar"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            onClick={clearAllFilters}
                            className="w-full mt-2 py-3 text-base font-semibold rounded-xl text-red-600 dark:text-red-400 border border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition flex items-center justify-center space-x-2 shadow-lg"
                        >
                            <XCircle className="w-5 h-5" />
                            <span>Clear All ({activeFiltersCount})</span>
                        </motion.button>
                    )}
                </aside>

                {/* B. Results & Mobile Filter Controls */}
                <section className="flex-grow min-w-0">
                    
                    <div className="sticky top-0 z-20 bg-amber-50 dark:bg-gray-900 pt-1 pb-4 mb-6"> 
                        
                        <div className="flex gap-4 items-center mb-4">
                            
                            <button 
                                onClick={() => setIsDrawerOpen(true)}
                                className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-amber-600 text-white font-semibold rounded-xl shadow-lg transition duration-200 hover:bg-amber-700 flex-shrink-0"
                                aria-label="Open Filters"
                            >
                                <Filter className="w-5 h-5" />
                                <span className="text-sm">Filters</span>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-white text-amber-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">{activeFiltersCount}</span>
                                )}
                            </button>

                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title, tag, or ingredient..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-inner focus:ring-amber-500 focus:border-amber-500 transition duration-200 text-base"
                                />
                            </div>
                        </div>
                        
                        <AnimatePresence>
                            {activeFiltersCount > 0 && (
                                <motion.div
                                    key="active-tags"
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }} 
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-wrap gap-2 items-center overflow-hidden py-2"
                                >
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 flex-shrink-0">Active:</span>
                                    {activeFilters.map(filter => (
                                        <motion.span
                                            key={filter.type}
                                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                            className={`flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap 
                                                ${filter.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300' : 
                                                filter.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300' : 
                                                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300'}`}
                                        >
                                            <span className='max-w-[150px] truncate'>{filter.label}</span>
                                            <button onClick={() => removeFilter(filter.type)} aria-label={`Remove ${filter.label} filter`} className="ml-1 opacity-75 hover:opacity-100 transition">
                                                <XCircle className="w-3 h-3" />
                                            </button>
                                        </motion.span>
                                    ))}
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm font-semibold text-red-700 dark:text-red-400 hover:text-red-800 transition flex items-center ml-2"
                                    >
                                        Reset
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mb-8 flex justify-between items-center border-b pb-2 border-amber-200 dark:border-gray-800">
                        <h2 className="text-3xl font-extrabold font-serif text-gray-900 dark:text-white">
                            {currentCategoryName} 
                            <span className="text-amber-600 text-3xl font-light ml-2">({filteredRecipes.length})</span>
                        </h2>
                    </div>

                    {/* Recipe Grid (Assuming RecipeCard.js implements h-full and flex logic for equal height) */}
                    <AnimatePresence mode="wait">
                        {filteredRecipes.length > 0 ? (
                            <motion.div
                                key="grid-container"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.5 }}
                                className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                            >
                                <AnimatePresence>
                                    {filteredRecipes.map((recipe, index) => (
                                        <RecipeCard 
                                            recipe={recipe} 
                                            key={recipe.id} 
                                            index={index} 
                                            // Pass h-full to the RecipeCard wrapper
                                            className="!w-full h-full"
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            // Empty State (Retained)
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-dashed border-amber-300 dark:border-gray-700"
                            >
                                <Search className="w-16 h-16 mx-auto text-amber-600 mb-4" strokeWidth={1.5} />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    No Masterpieces Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    Adjust your filters or try a broader search term. The perfect dish is waiting!
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition shadow-lg transform hover:scale-[1.03]"
                                >
                                    Reset All Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            {/* 3. Mobile Filter Drawer (Overlay) */}
            <MobileFilterDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                categories={categories}
                difficulties={difficulties}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDifficulty={selectedDifficulty}
                setSelectedDifficulty={setSelectedDifficulty}
                clearAllFilters={clearAllFilters}
            />

            {/* 4. Footer CTA (Retained) */}
            <section className="bg-gray-950 dark:bg-gray-800 py-16 text-center mt-12 shadow-2xl relative z-10">
                <div className="max-w-4xl mx-auto px-4">
                    <h3 className="text-4xl font-extrabold font-serif text-white mb-3">Chef's Featured Picks</h3>
                    <p className="text-lg text-gray-300 mb-8">
                        View our top-rated, trending recipes this week. You might just find your new favorite.
                    </p>
                    <Link
                        href="/meal"
                        className="inline-block px-10 py-4 text-xl font-bold bg-amber-600 text-white rounded-full shadow-2xl transition duration-300 hover:bg-amber-700 transform hover:-translate-y-1 tracking-wider ring-4 ring-amber-600/50"
                    >
                        View Popular Dishes <span className="ml-1">→</span>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default RecipesPage