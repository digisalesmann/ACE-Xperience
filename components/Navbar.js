'use client'
import React, { useState, useEffect, useCallback } from 'react';

// NOTE: Assuming Link is globally available or imported from the environment
// Since the environment treats this as a single file, I'll inline the Link structure for functionality.
const Link = ({ href, children, className, onClick, ...props }) => (
    <a href={href} className={className} onClick={onClick} {...props}>{children}</a>
);

// --- Icon & Motion Fallbacks (Internalized for single file use) ---
let motion = { div: (props) => <div {...props} /> }
let AnimatePresence = ({ children }) => <>{children}</>
try {
    const fm = require('framer-motion')
    motion = fm.motion
    AnimatePresence = fm.AnimatePresence
} catch (err) { /* no-op */ }

let Menu, X, Search, Sun, Moon, ShoppingCart, Euro, ArrowRight, ArrowLeft, Mail 
try {
    const lucide = require('lucide-react')
    Menu = lucide.Menu
    X = lucide.X
    Search = lucide.Search
    Sun = lucide.Sun
    Moon = lucide.Moon
    ShoppingCart = lucide.ShoppingCart 
    Euro = lucide.Euro
    ArrowRight = lucide.ArrowRight
    ArrowLeft = lucide.ArrowLeft
    Mail = lucide.Mail 
} catch (err) {
    Menu = () => <span aria-hidden="true" className="w-6 h-6">☰</span>
    X = () => <span aria-hidden="true" className="w-6 h-6">✕</span>
    Search = () => <span aria-hidden="true" className="w-5 h-5">🔍</span>
    Sun = (props) => <span role="img" aria-label="Sun icon" className="w-5 h-5" {...props}>☀️</span>
    Moon = (props) => <span role="img" aria-label="Moon icon" className="w-5 h-5" {...props}>🌙</span>
    ShoppingCart = () => <span aria-hidden="true" className="w-5 h-5">🛒</span> 
    Euro = () => <span aria-hidden="true" className="w-4 h-4">€</span> 
    ArrowRight = () => <span aria-hidden="true" className="w-5 h-5">→</span>
    ArrowLeft = () => <span aria-hidden="true" className="w-5 h-5">←</span>
    Mail = () => <span aria-hidden="true" className="w-5 h-5">✉️</span> 
}


// --- Custom Dark Mode Hook (Internalized) ---
const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
        const prefersDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
        
        const initialDark = (storedTheme === 'dark') || (!storedTheme && prefersDark);

        setDarkMode(initialDark);
        if (typeof document !== 'undefined') {
            document.documentElement.classList[initialDark ? 'add' : 'remove']('dark');
        }
    }, []); 

    const toggleTheme = useCallback(() => {
        setDarkMode(prev => {
            const newDarkMode = !prev;
            
            if (typeof document !== 'undefined') {
                document.documentElement.classList[newDarkMode ? 'add' : 'remove']('dark');
                localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
            }
            return newDarkMode;
        });
    }, []);

    return { darkMode, mounted, toggleTheme };
};

// --- Cart Persistence Hook (Kept for external Cart Icon) ---
const useCartCount = () => {
    const [count, setCount] = useState(0);

    const updateCartCount = useCallback(() => {
        try {
            const storedCart = localStorage.getItem('checkoutCart');
            if (storedCart) {
                const cartArray = JSON.parse(storedCart);
                if (Array.isArray(cartArray)) {
                    // Calculate total quantity of items
                    const total = cartArray.reduce((sum, item) => sum + (item.quantity || 0), 0);
                    setCount(total);
                }
            } else {
                setCount(0);
            }
        } catch (e) {
            console.error("Failed to parse cart data from localStorage:", e);
            setCount(0); // Reset on parse error
        }
    }, []);

    useEffect(() => {
        // Initial load
        updateCartCount();

        // Listen for storage events (e.g., cart updated by another page/tab)
        window.addEventListener('storage', updateCartCount);
        // Fallback: Check the cart periodically (e.g., when the tab gets focus)
        window.addEventListener('focus', updateCartCount); 

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('focus', updateCartCount);
        };
    }, [updateCartCount]);

    return count;
};

// --- NAV LINKS (Updated: Contact removed from main array) ---
// The desktop nav Contact link is styled separately as a button via its 'isPrimary' flag
const navLinks = [
    { title: 'Recipes', path: '/recipes' },
    { title: 'Baking & Sweets', path: '/baking' },
    { title: 'Quick Meals', path: '/meal' },
    { title: 'Tips & Techniques', path: '/tips' },
    { title: 'About Wendy', path: '/about' },
    // Removed: { title: 'Contact', path: '/contact', isPrimary: true }, 
];

// --- CHECKOUT LINK COMPONENT (Cart Icon) ---
const CheckoutLink = ({ cartCount, onClick }) => {
    return (
        <Link 
            href="/checkout" 
            className="relative text-gray-700 dark:text-gray-200 hover:text-amber-500 transition 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full p-2"
            onClick={onClick}
            aria-label={`View Cart (${cartCount} items)`}
        >
            <ShoppingCart size={24} />
            
            {cartCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 
                                 text-xs font-bold w-5 h-5 bg-red-600 text-white rounded-full 
                                 flex items-center justify-center border-2 border-white dark:border-gray-900">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </Link>
    );
};

// --- NAVBAR MAIN COMPONENT ---
export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { darkMode, mounted, toggleTheme } = useDarkMode(); 
    const cartCount = useCartCount(); // Get persistent cart count

    const toggleMenu = useCallback(() => {
        setMenuOpen((prev) => {
            const newState = !prev;
            if (typeof document !== 'undefined') {
                document.body.style.overflow = newState ? 'hidden' : 'unset'; 
            }
            return newState;
        });
    }, []);
    
    // Placeholder during hydration
    if (!mounted) {
        return (
            <nav 
                className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 
                dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800
                transition-all duration-300 shadow-sm h-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                    <h1 className="text-3xl font-extrabold font-serif tracking-tight text-gray-900 dark:text-white">
                        Ace Xperience
                    </h1>
                </div>
            </nav>
        );
    }

    return (
        <nav
            aria-label="Main Navigation"
            className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 
            dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800
            transition-all duration-300 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4 h-20">

                <Link href="/" className="group" aria-label="AceX Home">
                    <h1 className="text-4xl font-serif tracking-tight transition-colors">
                        <span className="font-extrabold text-gray-900 dark:text-gray-100 italic transition-colors group-hover:text-amber-600">
                            Ace
                        </span>
                        <span className="font-semibold text-amber-500 dark:text-amber-400">
                            X
                        </span>
                    </h1>
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center space-x-8" role="menubar">
                    {/* Render standard links */}
                    {navLinks.map((link) => (
                        <li key={link.title} role="none">
                            <Link
                                href={link.path}
                                role="menuitem"
                                className="relative text-gray-700 dark:text-gray-200 font-medium 
                                hover:text-amber-500 transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm p-1 -m-1"
                            >
                                {link.title}
                                <span className="absolute bottom-[-5px] left-0 w-full h-[2px] bg-amber-500 
                                transform scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        </li>
                    ))}
                    
                    {/* Desktop Contact Link (Styled as a Button) */}
                    <li role="none">
                        <Link
                            href="/contact"
                            role="menuitem"
                            className="px-4 py-2 text-white bg-red-600 rounded-full font-bold transition duration-200 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-md"
                        >
                            Contact
                        </Link>
                    </li>
                </ul>

                <div className="flex items-center space-x-4">
                    {/* Universal Cart/Checkout Link (Visible on all screens) */}
                    <CheckoutLink cartCount={cartCount} />

                    {/* Dark Mode Toggle (Top) */}
                    <button
                        onClick={toggleTheme}
                        className="text-gray-700 dark:text-gray-200 hover:text-amber-500 transition p-2 rounded-full border border-transparent hover:border-amber-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {darkMode ? (
                                <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Sun size={20} />
                                </motion.div>
                            ) : (
                                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Moon size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                    
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-gray-700 dark:text-gray-200 hover:text-amber-500 transition p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full"
                        onClick={toggleMenu}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="md:hidden absolute w-full bg-white dark:bg-gray-950 border-t border-gray-200 
                        dark:border-gray-800 shadow-xl rounded-b-xl overflow-y-auto max-h-[80vh]"
                        role="dialog"
                        aria-modal="true"
                    >
                        <ul className="flex flex-col p-4 space-y-2" role="menu">
                            {/* Mobile Links */}
                            {navLinks.map((link) => (
                                <li key={link.title} role="none">
                                    <Link
                                        href={link.path}
                                        role="menuitem"
                                        className="block p-3 rounded-lg text-lg font-medium 
                                        text-gray-800 dark:text-gray-100 hover:bg-amber-50 dark:hover:bg-gray-800 
                                        transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                        onClick={toggleMenu}
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                            
                            {/* Mobile Menu Contact Link (Styled as Primary - Red Background) */}
                            <li className="pt-3 border-t border-gray-200 dark:border-gray-800 mt-2" role="none">
                                <Link
                                    href="/contact" 
                                    role="menuitem"
                                    className="p-3 rounded-lg text-lg font-medium 
                                    bg-red-100 text-red-800 dark:bg-gray-800 dark:text-red-400 
                                    hover:bg-red-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 flex items-center justify-between"
                                    onClick={toggleMenu}
                                >
                                    <span>Contact Us</span>
                                    <Mail size={20} />
                                </Link>
                            </li>
                            
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}