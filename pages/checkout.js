import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Send, Loader2, Euro, User, ArrowLeft, MapPin, Phone, MessageSquare, ClipboardList, Check, ArrowRight, ChevronDown, ShoppingCart
} from 'lucide-react';

// --- FIREBASE IMPORTS AND CONFIG ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Global variables injected by the environment (MANDATORY USE)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? initialAuthToken : null; 

// --- CONSTANTS ---
const DELIVERY_FEE = 5.00; // General site-wide delivery fee
const LIGHT_BG_COLOR = '#FBF5E5'; // Cream color for light mode
const VIEW_CHECKOUT = 'CHECKOUT';
const VIEW_SUCCESS = 'SUCCESS'; 

// Utility function to calculate subtotal
const calculateSubtotal = (cart) => cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

// --- CHECKOUT SUCCESS MESSAGE COMPONENT ---
const OrderSuccessPage = ({ totalAmount, resetApp }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto text-center p-8 sm:p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-t-8 border-green-600 dark:border-green-400"
    >
        <Check className="w-20 h-20 text-green-600 dark:text-green-400 mx-auto mb-6" />
        <h2 className="text-4xl font-serif font-black text-slate-800 dark:text-white mb-2">
            Order Confirmed!
        </h2>
        <p className="text-lg text-slate-700 dark:text-gray-300 mb-6">
            Your general site order has been successfully placed. Thank you!
        </p>
        <div className="mb-8 p-4 bg-green-50 dark:bg-slate-700 rounded-lg inline-block">
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">Total Charged: </span>
            <span className="text-2xl font-extrabold text-red-800 dark:text-amber-400 flex items-center justify-center"><Euro className="w-6 h-6 inline-block mr-1"/>{totalAmount.toFixed(2)}</span>
        </div>
        <motion.button
            onClick={resetApp}
            className="w-full py-3 bg-red-800 text-white rounded-lg font-bold flex items-center justify-center transition duration-300 hover:bg-red-900 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <ArrowLeft className="w-5 h-5 mr-2" /> Return to Menu
        </motion.button>
    </motion.div>
);


// --- UTILITY COMPONENT: ORDER SUMMARY CARD ---
const OrderSummaryCard = ({ cart, customerDetails, finalTotal, subtotal, totalItems }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Toggle logic for mobile screens only
    const toggleSummary = () => {
        // Only toggle if screen width is less than 1024px (Tailwind's lg breakpoint)
        if (typeof window !== 'undefined' && window.innerWidth < 1024) { 
            setIsExpanded(!isExpanded);
        }
    };

    // Determine if the summary should be expanded (always true on desktop, controlled by state on mobile)
    const shouldExpand = isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 1024);

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-2xl lg:shadow-lg border-t-8 border-red-800 dark:border-amber-400 lg:sticky lg:top-8 self-start">
            <motion.div 
                className="flex justify-between items-center cursor-pointer lg:cursor-default" 
                onClick={toggleSummary}
            >
                <h3 className="text-2xl font-bold font-serif flex items-center text-red-800 dark:text-amber-400">
                    <ShoppingCart className="w-6 h-6 mr-3" /> Order Summary
                </h3>
                <span className="lg:hidden text-slate-800 dark:text-gray-200 transition-transform duration-300">
                    <ChevronDown className={`w-6 h-6 ${isExpanded ? 'transform rotate-180' : ''}`} />
                </span>
            </motion.div>

            <AnimatePresence initial={false}>
                {shouldExpand && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 mt-4 space-y-2 text-slate-700 dark:text-gray-300 max-h-72 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <li key={item.id} className="flex justify-between border-b border-gray-100 dark:border-slate-700 py-1 list-none">
                                    <span className="font-medium text-sm sm:text-base">{item.quantity}x {item.name}</span>
                                    <span className="font-bold text-sm sm:text-base"><Euro className="w-4 h-4 inline-block -mt-0.5" />{(item.quantity * item.price).toFixed(2)}</span>
                                </li>
                            ))}
                        </div>
                        
                        <div className="pt-4 mt-4 border-t border-gray-300 dark:border-slate-600 space-y-2">
                            <div className="flex justify-between text-xl font-semibold text-slate-800 dark:text-white">
                                <span>Subtotal ({totalItems} items):</span>
                                <span><Euro className="w-5 h-5 inline-block -mt-1" />{subtotal.toFixed(2)}</span>
                            </div>
                            {customerDetails.deliveryType === 'delivery' && (
                                <div className="flex justify-between text-lg text-red-600 dark:text-amber-300">
                                    <span>Delivery Fee:</span>
                                    <span><Euro className="w-4 h-4 inline-block -mt-0.5" />{DELIVERY_FEE.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-3xl font-extrabold font-serif text-red-800 dark:text-amber-400 pt-3 border-t border-dashed border-gray-400 dark:border-slate-500">
                                <span>TOTAL:</span>
                                <span><Euro className="w-7 h-7 inline-block -mt-1" />{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- MAIN STANDALONE CHECKOUT COMPONENT ---

const StandaloneCheckout = ({ dbInstance, userId, initialCart, onOrderSuccess }) => {
    const [cart, setCart] = useState(initialCart); 
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        contact: '',
        address: '',
        deliveryType: 'pickup',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    // --- EFFECT: Keep cart data in localStorage persistent while on this page ---
    useEffect(() => {
        // Only run if the cart changes
        if (cart && cart.length > 0) {
            localStorage.setItem('checkoutCart', JSON.stringify(cart));
        } else if (cart.length === 0) {
             // If cart becomes empty during checkout (e.g., submission success), clear storage
            localStorage.removeItem('checkoutCart');
        }
    }, [cart]);

    // --- END EFFECT ---

    const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);
    const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    
    const finalTotal = useMemo(() => {
        return subtotal + (customerDetails.deliveryType === 'delivery' ? DELIVERY_FEE : 0);
    }, [subtotal, customerDetails.deliveryType]);


    // --- Validation and Submission Logic ---
    const validate = () => {
        let newErrors = {};
        if (!customerDetails.name.trim()) newErrors.name = 'Full Name is required.';
        if (!customerDetails.contact.trim()) newErrors.contact = 'Contact (Phone/Email) is required.';
        if (customerDetails.deliveryType === 'delivery' && !customerDetails.address.trim()) {
            newErrors.address = 'Delivery Address is required for delivery orders.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (totalItems === 0 || !userId || !dbInstance || isCheckingOut) return;
        
        if (!validate()) {
            setStatusMessage('Error: Please fill out all required fields.');
            return;
        }
        
        setIsCheckingOut(true);
        setStatusMessage('');

        const finalOrderData = {
            ...customerDetails,
            userId: userId,
            status: 'New',
            timestamp: serverTimestamp(),
            appId: appId,
            totalItems: totalItems,
            totalCost: finalTotal,
            items: cart.map(item => ({...item, totalPrice: item.quantity * item.price})),
            source: 'Site General Checkout',
        };

        try {
            // NOTE: LocalStorage will be cleared by handleOrderSuccess/useEffect after successful submission
            
            const userOrdersCollectionRef = collection(dbInstance, 'artifacts', appId, 'users', userId, 'site_orders');
            await addDoc(userOrdersCollectionRef, finalOrderData);
            
            setCart([]); 
            onOrderSuccess(finalTotal);
        } catch (error) {
            console.error("Error placing final order:", error);
            setStatusMessage('Error: Failed to submit order. Please check your connection.');
        } finally {
            setIsCheckingOut(false);
        }
    };
    
    if (totalItems === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-amber-400" />
                <h2 className="text-3xl font-serif font-bold dark:text-white">Your Cart is Empty</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400">Please add items to your cart before checking out.</p>
                <motion.button 
                    onClick={() => { window.history.back() }}
                    className="mt-6 py-3 px-6 bg-slate-800 text-amber-200 rounded-lg font-bold flex items-center justify-center mx-auto transition duration-300 hover:bg-slate-700 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Go Back to Menu
                </motion.button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        >
            <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-800 dark:text-white border-b-4 border-red-800 dark:border-amber-400 pb-2 mb-8">
                Secure Checkout
            </h1>
            
            {/* Status Message */}
            <AnimatePresence>
                {statusMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`text-center p-4 rounded-lg font-medium shadow-md transition-all
                            ${statusMessage.startsWith('Error') ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'}`}
                    >
                        {statusMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="lg:grid lg:grid-cols-3 lg:gap-10">
                
                {/* Column 1: Order Summary (33%) - Uses sticky and responsive collapse */}
                <div className="lg:col-span-1 mb-8 lg:mb-0">
                    <OrderSummaryCard
                        cart={cart}
                        customerDetails={customerDetails}
                        finalTotal={finalTotal}
                        subtotal={subtotal}
                        totalItems={totalItems}
                    />
                </div>

                {/* Column 2: Customer Form (66%) */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-8">
                        
                        <h3 className="text-3xl font-bold font-serif flex items-center text-slate-800 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-3">
                            <User className="w-7 h-7 mr-3 text-red-800 dark:text-amber-400" /> Shipping & Contact Details
                        </h3>

                        {/* Name and Contact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Full Name *</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={customerDetails.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className={`w-full p-3 border rounded-lg transition dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Phone or Email *</label>
                                <div className="relative">
                                    <input
                                        id="contact"
                                        type="text"
                                        name="contact"
                                        value={customerDetails.contact}
                                        onChange={handleChange}
                                        required
                                        placeholder="Phone number or email address"
                                        className={`w-full p-3 pl-10 border rounded-lg transition dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.contact ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                                    />
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                </div>
                                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                            </div>
                        </div>

                        {/* Delivery Type */}
                        <div className="space-y-3">
                            <p className="text-lg font-bold text-slate-800 dark:text-gray-100">Order Method *</p>
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition w-full sm:w-auto ${customerDetails.deliveryType === 'pickup' ? 'border-red-800 bg-red-50 dark:bg-slate-700 shadow-md' : 'border-gray-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-amber-400'}`}>
                                    <input
                                        type="radio"
                                        name="deliveryType"
                                        value="pickup"
                                        checked={customerDetails.deliveryType === 'pickup'}
                                        onChange={handleChange}
                                        className="form-radio text-red-800 h-5 w-5 mr-3"
                                    />
                                    <span className="font-semibold text-slate-800 dark:text-gray-200">Pickup (No fee)</span>
                                </label>
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition w-full sm:w-auto ${customerDetails.deliveryType === 'delivery' ? 'border-red-800 bg-red-50 dark:bg-slate-700 shadow-md' : 'border-gray-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-amber-400'}`}>
                                    <input
                                        type="radio"
                                        name="deliveryType"
                                        value="delivery"
                                        checked={customerDetails.deliveryType === 'delivery'}
                                        onChange={handleChange}
                                        className="form-radio text-red-800 h-5 w-5 mr-3"
                                    />
                                    <span className="font-semibold text-slate-800 dark:text-gray-200">Delivery (+€{DELIVERY_FEE.toFixed(2)} Fee)</span>
                                </label>
                            </div>
                        </div>

                        {/* Address Field (Conditional) */}
                        {customerDetails.deliveryType === 'delivery' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden space-y-2"
                            >
                                <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Delivery Address *</label>
                                <div className="relative">
                                    <input
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={customerDetails.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Street address, City, Postal Code"
                                        className={`w-full p-3 pl-10 border rounded-lg transition dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                                    />
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                </div>
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </motion.div>
                        )}

                        {/* Special Notes */}
                        <div className="space-y-2">
                            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Special Instructions / Notes (Optional)</label>
                            <div className="relative">
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="3"
                                    value={customerDetails.notes}
                                    onChange={handleChange}
                                    placeholder="e.g., allergies, gate code, leave at door"
                                    className="w-full p-3 pl-10 border border-gray-300 dark:border-slate-700 rounded-lg transition focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-900 dark:text-white resize-none"
                                ></textarea>
                                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isCheckingOut || totalItems === 0}
                            className={`w-full py-4 text-xl font-bold rounded-xl flex items-center justify-center transition duration-300 shadow-xl mt-6
                                ${isCheckingOut || totalItems === 0 
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                    : 'bg-red-800 text-white hover:bg-red-900 focus:ring-4 focus:ring-red-500/50'
                                }`}
                            whileHover={!isCheckingOut && totalItems > 0 ? { scale: 1.01 } : {}}
                            whileTap={!isCheckingOut && totalItems > 0 ? { scale: 0.98 } : {}}
                        >
                            {isCheckingOut ? (
                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            ) : (
                                <Send className="w-6 h-6 mr-3" />
                            )}
                            {isCheckingOut ? 'Submitting Order...' : `Pay & Place Order: €${finalTotal.toFixed(2)}`}
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};


// --- MAIN APP COMPONENT (Handles initialization and view switching) ---

const App = () => {
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [dbInstance, setDbInstance] = useState(null);
    const [currentView, setCurrentView] = useState(VIEW_CHECKOUT); 
    const [lastOrderTotal, setLastOrderTotal] = useState(0);

    // --- CORRECTION: Load cart from localStorage if available, otherwise use empty array ---
    const initialCartFromStorage = useMemo(() => {
        try {
            const storedCart = localStorage.getItem('checkoutCart');
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                // Return parsed cart if it's a valid, non-empty array
                if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                    return parsedCart;
                }
            }
        } catch (e) {
            console.error("Error loading cart from localStorage:", e);
        }
        // Strict fallback to an empty array
        return []; 
    }, []);

    // Initialize mockCart state with the determined initial value
    const [mockCart, setMockCart] = useState(initialCartFromStorage); 

    // 1. Firebase Initialization and Authentication
    useEffect(() => {
        if (!firebaseConfig.apiKey) {
            console.error("Firebase config is missing. Cannot initialize Firestore.");
            setUserId(crypto.randomUUID());
            setIsAuthReady(true);
            return;
        }

        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const authService = getAuth(app);
            
            setDbInstance(firestore);
            
            // Simplified Auth check for standalone initialization
            onAuthStateChanged(authService, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    try {
                        if (initialAuthToken) {
                            const userCredential = await signInWithCustomToken(authService, initialAuthToken);
                            setUserId(userCredential.user.uid);
                        } else {
                            const userCredential = await signInAnonymously(authService);
                            setUserId(userCredential.user.uid);
                        }
                    } catch (error) {
                        console.error("Authentication failed:", error);
                        setUserId(crypto.randomUUID()); 
                    }
                }
                setIsAuthReady(true);
            });
            
        } catch (e) {
            console.error("Failed to initialize or authenticate Firebase:", e);
            setUserId(crypto.randomUUID());
            setIsAuthReady(true);
        }
    }, []);
    
    // Handler for successful order submission
    const handleOrderSuccess = (total) => {
        setLastOrderTotal(total);
        setCurrentView(VIEW_SUCCESS);
        // Ensure local storage is cleared after successful submission
        localStorage.removeItem('checkoutCart'); 
    }
    
    // Handler to reset the app flow after success
    const resetApp = () => {
        // When resetting, we set cart back to empty and clear any lingering local storage.
        // We also rely on the window.history.back() button in the success screen to go back to the menu.
        setMockCart([]); 
        localStorage.removeItem('checkoutCart');
        setCurrentView(VIEW_CHECKOUT);
    }

    // Render the main content based on the current view state
    const renderMainContent = () => {
        if (currentView === VIEW_SUCCESS) {
            return <OrderSuccessPage totalAmount={lastOrderTotal} resetApp={resetApp} />;
        }
        
        // Default: Render Checkout View
        return (
            <StandaloneCheckout 
                initialCart={mockCart}
                dbInstance={dbInstance}
                userId={userId}
                onOrderSuccess={handleOrderSuccess}
            />
        );
    };

    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-slate-950" style={{ backgroundColor: LIGHT_BG_COLOR }}>
                <Loader2 className="w-10 h-10 text-red-700 animate-spin mr-4" />
                <p className="text-xl font-serif text-slate-800 dark:text-orange-200">Loading Checkout...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-gray-100 p-4 sm:p-8">
            {/* GLOBAL STYLE FIXES */}
            <style jsx global>{`
                body {
                    background-color: ${LIGHT_BG_COLOR}; /* Cream Color */
                    color: #1e293b;
                    min-height: 100vh;
                    transition: background-color 0.3s;
                }
                .dark body {
                    background-color: #0f172a; /* slate-900 */
                    color: #f1f5f9;
                }
            `}</style>
            
            {/* Main Content Area */}
            <main className="py-10 md:py-16">
                <AnimatePresence mode="wait">
                    {renderMainContent()}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default App;
