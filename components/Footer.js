// components/Footer.js

import React from 'react';
import Link from './Link'; // Import the custom Link component

// ICONS object (assuming it's not used elsewhere, keep it here)
const ICONS = {
    Instagram: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
    ),
    Pinterest: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11c0 6.1-4 12-4 12v-5c0-1.6 1.1-3 2.5-3.4 1.4-.4 2.5 0 2.5 1.4 0 1-1 1.6-1.5 2.6-1 2-2 3.4-2 3.4s-1.8-1.5-1.5-3.8c.2-1.7 1.5-2.8 3-2.8 2 0 3.5 1.5 3.5 3.5s-1.5 3.5-3.5 3.5"></path><path d="M16 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"></path><path d="M8 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4"></path></svg>
    ),
    Facebook: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    ),
    YouTube: (
        // 🛠️ FIX APPLIED HERE: Removed the duplicate strokeLinecap
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" ry="2"></rect><path d="m10 9 5 3-5 3V9z"/></svg>
    ),
    // ... (rest of the ICONS object)
    Visa: (
        <span className="font-sans font-black italic text-base text-blue-800 dark:text-blue-400">VISA</span>
    ),
    MasterCard: (
        <span className="font-sans font-black text-base text-red-700 dark:text-red-400">M.C</span>
    ),
    Amex: (
        <span className="font-sans font-black text-base text-indigo-700 dark:text-indigo-400">AMEX</span>
    )
};


// Pro component for a cleaner link list structure (RETAINS EXISTING)
const LinkGroup = ({ title, links }) => (
    <div>
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-widest relative pb-2">
            {title}
            {/* Subtle underline for a premium look */}
            <span className="absolute left-0 bottom-0 w-8 h-[2px] bg-amber-500 rounded-full"></span>
        </h3>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            {links.map((link, index) => (
                <li key={index}>
                    <Link href={link.href} className="hover:text-amber-600 dark:hover:text-amber-400 transition duration-200">
                        {link.text}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

// New Back to Top Button Component
const BackToTop = () => (
    <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition duration-200 group"
        aria-label="Back to top"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        Back to Top
    </button>
);


export default function Footer() { 
    // Reusable component for social icons (RETAINS EXISTING)
    const SocialIcon = ({ children, label }) => (
        <a 
            href="#" 
            aria-label={label} 
            className="p-3 bg-white dark:bg-gray-800 text-amber-500 dark:text-amber-400 rounded-full hover:bg-amber-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg ring-2 ring-amber-500/30 dark:ring-amber-400/30"
        >
            {children}
        </a>
    );

    // Link Data (RETAINS EXISTING)
    const recipeLinks = [
        { text: 'All Recipes', href: '/recipes' },
        { text: 'Baking & Sweets', href: '/baking' },
        { text: 'Quick Meals (30-min)', href: '/recipes?filter=quick' },
        { text: 'Seasonal & Holiday', href: '/recipes?filter=seasonal' },
    ];

    const guideLinks = [
        { text: 'Tips & Techniques', href: '/tips' },
        { text: 'Pro Kitchen Tools', href: '/tools' },
        { text: 'Essential Pantry', href: '/pantry' },
        { text: 'Meal Prep Ideas', href: '/mealprep' },
    ];

    const premiumLinks = [ 
        { text: 'Masterclass Videos', href: '/premium/masterclass' },
        { text: 'Subscriber-Only Recipes', href: '/premium/exclusive' },
        { text: 'Ask-Me-Anything Sessions', href: '/premium/ama' },
        { text: 'Upgrade to Pro', href: '/upgrade' },
    ];

    const companyLinks = [
        { text: 'Our Story', href: '/about' },
        { text: 'Contact Wendy', href: '/contact' },
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms of Service', href: '/terms' },
    ];

    return (
        <footer className="bg-white dark:bg-gray-950 border-t-8 border-amber-500/50 dark:border-amber-500/30 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Section: Logo & Newsletter CTA (RETAINS EXISTING) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-gray-800 pb-12 mb-10">
                    <div className="mb-10 md:mb-0 max-w-lg pr-8">
                        <Link href="/" className="group inline-block">
                            <h2 className="text-6xl font-serif tracking-tighter leading-none transition-colors">
                                <span className="font-extrabold text-gray-900 dark:text-gray-100 italic transition-colors group-hover:text-amber-600">Ace</span>
                                <span className="font-semibold text-amber-500 dark:text-amber-400">X</span>
                            </h2>
                        </Link>
                        {/* SEO Tagline Added */}
                        <p className="mt-4 text-xl font-light text-gray-600 dark:text-gray-400">
                            Homemade cooking doesn't have to be hard. Unlock your kitchen potential with recipes & guides built for success.
                        </p>
                    </div>
                    
                    {/* Newsletter - Enhanced CTA (RETAINS EXISTING) */}
                    <div className="w-full md:w-auto md:min-w-[400px] p-6 bg-amber-50 dark:bg-gray-900 rounded-xl shadow-xl border border-amber-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                            Get Your Free Starter Kit
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Subscribe for weekly recipes and get notified about new content!
                        </p>
                        <div className="flex flex-col gap-3">
                            <input 
                                type="email" 
                                placeholder="Enter your email to get the kit..." 
                                className="w-full p-3 border border-amber-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-300 shadow-inner"
                            />
                            <button 
                                className="w-full px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition duration-300 transform active:scale-[.98] shadow-lg shadow-amber-500/50 dark:shadow-amber-500/30"
                            >
                                Send Me the Kit!
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mid Section: Links and Socials (RETAINS EXISTING) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 mb-10">
                    <LinkGroup title="Recipes" links={recipeLinks} />
                    <LinkGroup title="Cooking Guide" links={guideLinks} />
                    <LinkGroup title="AceX Pro" links={premiumLinks} /> 
                    <LinkGroup title="Company" links={companyLinks} />
                    
                    {/* Socials & Theme Toggle */}
                    <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-widest relative pb-2">
                            Connect
                            <span className="absolute left-0 bottom-0 w-8 h-[2px] bg-amber-500 rounded-full"></span>
                        </h3>
                        <div className="flex space-x-3">
                            <SocialIcon label="Instagram">{ICONS.Instagram}</SocialIcon>
                            <SocialIcon label="Pinterest">{ICONS.Pinterest}</SocialIcon>
                            <SocialIcon label="Facebook">{ICONS.Facebook}</SocialIcon>
                            <SocialIcon label="YouTube">{ICONS.YouTube}</SocialIcon>
                        </div>
                        <div className="mt-6">
                            <BackToTop />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Copyright & Trust */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800">

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} AceX Culinary Media. All rights reserved. 
                        <span className="text-amber-500 font-medium ml-1">The Gourmet Standard.</span>
                    </div>

                    {/* Accessibility & Contact */}
                    <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-600 flex justify-center space-x-4">
                        <Link href="/accessibility" className="hover:text-amber-500 transition">
                            Accessibility Statement
                        </Link>
                        <span>|</span>
                        <span>
                            Email: <a href="mailto:support@acex.com" className="hover:text-amber-500 transition">support@acex.com</a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}