// hooks/useScrollRestoration.js
import { useEffect } from 'react';
import { useRouter } from 'next/router'; // Use 'next/navigation' for App Router

const useScrollRestoration = () => {
    const router = useRouter(); // Use useRouter for Pages Router

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            // Tell the browser NOT to handle scroll restoration
            window.history.scrollRestoration = 'manual';
        }

        // 1. Function to save scroll position on the page being left
        const saveScrollPosition = (url) => {
            // Use the URL path as a unique key
            sessionStorage.setItem(`scrollPos:${router.asPath}`, window.scrollY.toString());
        };

        // 2. Function to restore scroll position on the new page
        const restoreScrollPosition = () => {
            // Check if we navigated back to a previously visited page
            const savedScroll = sessionStorage.getItem(`scrollPos:${router.asPath}`);
            
            if (savedScroll) {
                // Use a slight delay to allow layout shifts to finish
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedScroll, 10));
                    // Optional: Clean up the key after restoration
                    sessionStorage.removeItem(`scrollPos:${router.asPath}`);
                }, 50); 
            } else {
                // Default behavior: scroll to top for a new destination
                window.scrollTo(0, 0);
            }
        };

        // Attach listeners to router events
        router.events.on('routeChangeStart', saveScrollPosition);
        router.events.on('routeChangeComplete', restoreScrollPosition);

        // Run restoration once on initial mount (for initial load or hard refresh)
        restoreScrollPosition();

        // Cleanup
        return () => {
            router.events.off('routeChangeStart', saveScrollPosition);
            router.events.off('routeChangeComplete', restoreScrollPosition);
        };
    }, [router.events, router.asPath]);
};

export default useScrollRestoration;