// pages/tips/[slug].js

import React from 'react';
import { useRouter } from 'next/router'; // <-- CRITICAL: Use useRouter for Pages Router
import { 
    ChevronLeft, Lightbulb, Clock, Layers, AlertTriangle, 
    Zap, Utensils
} from 'lucide-react';
import Link from 'next/link';

// =================================================================
// --- Data and Utility Functions (Replicated from the index page for now) ---
// =================================================================

const quickTipsData = {
    Timing: [
        { 
            id: 1, 
            title: 'The "Carryover" Cook', 
            excerpt: 'Meats continue to cook after removal from heat. Account for a 5-10°F rise.', 
            slug: 'carryover-cook',
            category: 'Timing',
            content: 'The phenomenon of carryover cooking means meat internal temperatures will rise even after being taken out of the oven or off the stove. This is due to thermal energy trapped in the center. For large roasts or steaks, pull the meat 5-10°F (3-5°C) before your desired final temperature to achieve perfect results. Always use a digital thermometer!',
            details: ['Essential for roasts and steaks.', 'Prevents dry, overcooked edges.', 'Resting is mandatory for juicy results.'],
            icon: Clock,
        },
        { 
            id: 2, 
            title: 'Blanching Time', 
            excerpt: 'Submerge vegetables in boiling water for 1-2 minutes, then immediately ice bath.', 
            slug: 'blanching-guide',
            category: 'Timing',
            content: 'Blanching is a two-part process: briefly boiling vegetables to set their color and tenderize them, followed immediately by an ice bath (shocking) to halt the cooking process. This preserves vibrant color, texture, and nutrients, especially important for freezing vegetables.',
            details: ['Use a large pot of heavily salted water.', 'Ice bath must be genuinely cold.', 'Do not crowd the pot.'],
            icon: Layers,
        },
    ],
    Hacks: [
        { 
            id: 3, 
            title: 'Garlic Peeling Shake', 
            excerpt: 'Separate whole garlic cloves instantly by shaking them between two metal bowls.', 
            slug: 'garlic-peeling-hack',
            category: 'Hacks',
            content: 'This quick hack exploits centrifugal force. Place the whole head of garlic in two metal bowls (or containers), invert one over the other, and shake violently for 30 seconds. The cloves will separate, and the impact will often cause the papery skins to peel right off.',
            details: ['Works best with fresh, large garlic.', 'Slightly crush the head before starting.', 'A quick, simple time-saver.'],
            icon: Zap,
        },
        { 
            id: 4, 
            title: 'Resting Meat Foil Tent', 
            excerpt: 'Tent resting meat lightly with foil to keep it warm without steaming the crust.', 
            slug: 'resting-meat-tip',
            category: 'Hacks',
            content: 'When resting meat, tent it loosely with foil rather than wrapping it tightly. Wrapping traps steam, which softens the beautiful crust (sear) you worked so hard to achieve. The tent allows some steam to escape while still insulating the protein to keep it warm.',
            details: ['Crucial for crispy chicken skin.', 'Resting allows juices to redistribute.', '10-15 minute rest is standard for roasts.'],
            icon: Utensils,
        },
    ],
    Substitutions: [
        { 
            id: 5, 
            title: 'Buttermilk Swap', 
            excerpt: 'Mix 1 cup milk with 1 tbsp lemon juice or white vinegar; let sit 5 mins.', 
            slug: 'buttermilk-swap',
            category: 'Substitutions',
            content: 'Buttermilk is essential for tender baked goods because its acidity reacts with baking soda. If you don\'t have real buttermilk, create a perfect substitute by combining milk (any kind) with a tablespoon of acid (lemon juice or white vinegar) and letting it curdle for five minutes. The texture and acidity will closely mimic the real thing.',
            details: ['The curdling creates the necessary acid.', 'Essential for pancakes and biscuits.', 'A reliable last-minute fix.'],
            icon: Layers,
        },
        { 
            id: 6, 
            title: 'Egg Replacement', 
            excerpt: '1 egg often equals 1/4 cup of mashed banana or applesauce in baking.', 
            slug: 'egg-replacement-guide',
            category: 'Substitutions',
            content: 'In vegan or egg-free baking, mashed banana or unsweetened applesauce can replace eggs, primarily serving as binders and moisture sources. Remember, this works best in recipes where the egg\'s leavening property (like in a meringue) is not the main goal.',
            details: ['Do not over-mix batter with replacements.', 'Ideal for quick breads and muffins.', 'Flax egg is also a great option.'],
            icon: Lightbulb,
        },
    ],
};

/**
 * Finds the tip data item based on the unique slug.
 */
const getTipBySlug = (slug) => {
    // Flatten the categories into a single array of tips
    const allTips = Object.values(quickTipsData).flat();
    return allTips.find(item => item.slug === slug) || null;
};

// =================================================================
// --- Main Dynamic Tip Page Component (Pages Router Syntax) ---
// =================================================================

const TipDetailPage = () => {
    // FIX: Use useRouter().query to access the dynamic slug in the Pages Router
    const router = useRouter();
    const { slug } = router.query; 

    // Show a loading state until the router has finished determining the query
    if (!slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50/50 dark:bg-gray-950">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Loading quick tip...
                </p>
            </div>
        );
    }

    const tipData = getTipBySlug(slug);
    const TipIcon = tipData ? tipData.icon : AlertTriangle;

    // --- 1. Handle Not Found State ---
    if (!tipData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg">
                    <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tip Not Found (404)</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The quick tip you are looking for ({slug}) doesn't exist.
                    </p>
                    <Link href="/tips" className="text-amber-600 font-semibold hover:underline flex items-center justify-center">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tips
                    </Link>
                </div>
            </div>
        );
    }

    // --- 2. Render Found Data ---
    return (
        <div className="min-h-screen bg-amber-50/50 dark:bg-gray-950 pt-16 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Link */}
                <Link href="/tips" className="text-red-600 font-bold hover:underline mb-8 inline-flex items-center">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Tips & Hacks
                </Link>

                {/* Header */}
                <header className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-2xl border-t-4 border-amber-500 mb-12">
                    <div className="flex items-start mb-4">
                        <TipIcon className='w-10 h-10 sm:w-16 sm:h-16 mr-6 text-red-600 flex-shrink-0' />
                        <div>
                            <p className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">CATEGORY: {tipData.category}</p>
                            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-gray-900 dark:text-white">
                                {tipData.title}
                            </h1>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6">
                        <p className="text-xl text-gray-700 dark:text-gray-300">
                            Summary: <span className="font-semibold text-amber-600 dark:text-amber-400">{tipData.excerpt}</span>
                        </p>
                    </div>
                </header>

                {/* Content Section */}
                <section className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mb-6 flex items-center">
                        <Lightbulb className="w-6 h-6 mr-3 text-red-600" /> The Full Explanation
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                        {tipData.content}
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-amber-500/50 pb-2 mb-4">
                        Key Takeaways
                    </h3>
                    <ul className="space-y-3">
                        {tipData.details.map((detail, index) => (
                            <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                                <span className="text-amber-600 dark:text-amber-400 mr-3 mt-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </span>
                                {detail}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                        <Link
                            href="/tips"
                            className="inline-flex items-center px-8 py-3 text-lg font-bold bg-red-600 text-white rounded-xl shadow-lg transition duration-300 hover:bg-red-700 transform active:scale-[0.98] ring-4 ring-red-300/50"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" /> Back to All Quick Tips
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TipDetailPage;