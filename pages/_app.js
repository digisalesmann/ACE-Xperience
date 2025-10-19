// pages/_app.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import '../styles/global.css';

/**
 * Custom hook to reliably manage and restore scroll position site-wide.
 */
const useScrollRestoration = () => {
    const router = useRouter(); 

    useEffect(() => {
        // 1. CRITICAL: Manual control prevents the browser from fighting our script.
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // 2. Save the scroll position right before the route starts to change.
        const saveScrollPosition = (url) => {
            // Check if the route is changing to a new URL
            if (router.asPath !== url) {
                sessionStorage.setItem(`scrollPos:${router.asPath}`, window.scrollY.toString());
            }
        };

        // 3. Restore the scroll position after the component mounts.
        const restoreScrollPosition = () => {
            const savedScroll = sessionStorage.getItem(`scrollPos:${router.asPath}`);
            
            if (savedScroll) {
                // Use a minimal delay to allow layout to finish mounting
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedScroll, 10));
                    // Optional: Clean up the key after successful restoration
                    sessionStorage.removeItem(`scrollPos:${router.asPath}`);
                }, 10); 
            } else {
                 // Always scroll to the very top (0, 0) for a new, unscrolled page.
                 // This fixes the "starts from the bottom" issue.
                 window.scrollTo(0, 0);
            }
        };

        // Attach listeners
        router.events.on('routeChangeStart', saveScrollPosition);
        router.events.on('routeChangeComplete', restoreScrollPosition);

        // Run restoration once on initial mount
        restoreScrollPosition();

        // Cleanup
        return () => {
            router.events.off('routeChangeStart', saveScrollPosition);
            router.events.off('routeChangeComplete', restoreScrollPosition);
        };
    }, [router.events, router.asPath]);
};

function MyApp({ Component, pageProps }) {
    
    // Call the custom hook here to apply scroll restoration site-wide
    useScrollRestoration();

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;