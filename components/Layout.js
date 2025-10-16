// components/Layout.js

import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; // Assuming Footer is defined elsewhere

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-amber-50 text-gray-900 dark:bg-gray-900 dark:text-white font-sans antialiased transition-colors duration-300">
            
            <Navbar /> 

            {/* FIX: Set pt-20 (5rem) to clear the Navbar's fixed height (h-20/h-16 depending on interpretation, h-20 is safer for large logo/padding) */}
            <main className="flex-grow pt-20">
                {children}
            </main>
            
            <Footer />
        </div>
    );
};