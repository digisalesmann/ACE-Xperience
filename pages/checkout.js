import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Send, Loader2, Euro, User, ArrowLeft, MapPin, Phone, MessageSquare, ClipboardList, Check, ArrowRight, ChevronDown, ShoppingCart, Banknote, Clock
} from 'lucide-react';

// --- FIREBASE IMPORTS AND CONFIG ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Global variables injected by the environment (MANDATORY USE)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : { apiKey: 'mock-key' };
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? initialAuthToken : null; 

// --- CONSTANTS ---
const DELIVERY_FEE = 5.00; 
const LIGHT_BG_COLOR = '#FBF5E5'; 
const VIEW_CHECKOUT = 'CHECKOUT';
const VIEW_PAYMENT = 'PAYMENT'; 
const VIEW_SUCCESS = 'SUCCESS'; 

// --- REAL-WORLD STATUS CODES ---
const STATUS_PENDING_CONFIRMATION = '01_PENDING_CONFIRMATION';
const STATUS_PAYMENT_INITIATED = '02_PAYMENT_INITIATED';

// --- MOCK BANK TRANSFER DETAILS (Used to display to the user) ---
// !!! IMPORTANT: REPLACE THESE WITH YOUR REAL, PUBLIC-FACING BANK DETAILS !!!
const MOCK_BANK_DETAILS = {
    accountName: 'YOUR COMPANY NAME LTD', // <--- REPLACE THIS
    IBAN: 'YOUR_IBAN_NUMBER',            // <--- REPLACE THIS (e.g., DE1234567890...)
    BIC: 'YOURBIC',                      // <--- REPLACE THIS (e.g., COBADEFFXXX)
    // The reference MUST be unique per order for easy reconciliation
    reference: (orderId) => `SITE-ORDER-${orderId.toUpperCase()}`, 
    bank: 'Online Bank of Commerce',
};

// Utility function to calculate subtotal
const calculateSubtotal = (cart) => cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

// --- UTILITY COMPONENT: ORDER SUMMARY CARD ---
const OrderSummaryCard = ({ cart, customerDetails, finalTotal, subtotal, totalItems }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const toggleSummary = () => {
        // Only toggle if window width indicates a small screen (less than lg)
        if (typeof window !== 'undefined' && window.innerWidth < 1024) { 
            setIsExpanded(!isExpanded);
        }
    };

    const shouldExpand = isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 1024);

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-2xl lg:shadow-lg border-t-8 border-red-800 dark:border-amber-400 lg:sticky lg:top-8 self-start">
            <motion.div 
                // Enhanced touch target and visual feedback for the toggle area on mobile
                className="flex justify-between items-center py-2 cursor-pointer lg:cursor-default" 
                onClick={toggleSummary}
            >
                <h3 className="text-2xl font-bold font-serif flex items-center text-red-800 dark:text-amber-400">
                    <ShoppingCart className="w-6 h-6 mr-3" /> Order Summary
                </h3>
                <span className="lg:hidden text-slate-800 dark:text-gray-200 transition-transform duration-300">
                    {/* Rotate icon to indicate expansion state */}
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
                        {/* Scrollable area for long cart lists */}
                        <div className="pt-4 mt-2 space-y-2 text-slate-700 dark:text-gray-300 max-h-72 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <li key={item.id} className="flex justify-between border-b border-gray-100 dark:border-slate-700 py-2 list-none">
                                    <span className="font-medium text-sm sm:text-base">{item.quantity}x {item.name}</span>
                                    <span className="font-bold text-sm sm:text-base"><Euro className="w-4 h-4 inline-block -mt-0.5" />{(item.quantity * item.price).toFixed(2)}</span>
                                </li>
                            ))}
                        </div>
                        
                        <div className="pt-4 mt-4 border-t border-gray-300 dark:border-slate-600 space-y-2">
                            {/* Subtotal */}
                            <div className="flex justify-between text-xl font-semibold text-slate-800 dark:text-white">
                                <span>Subtotal ({totalItems} items):</span>
                                <span><Euro className="w-5 h-5 inline-block -mt-1" />{subtotal.toFixed(2)}</span>
                            </div>
                            {/* Delivery Fee */}
                            {customerDetails.deliveryType === 'delivery' && (
                                <div className="flex justify-between text-lg text-red-600 dark:text-amber-300">
                                    <span>Delivery Fee:</span>
                                    <span><Euro className="w-4 h-4 inline-block -mt-0.5" />{DELIVERY_FEE.toFixed(2)}</span>
                                </div>
                            )}
                            {/* Final Total */}
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


// --- BANK TRANSFER PAYMENT SCREEN COMPONENT (Enhanced Mobile Detail Item) ---
const BankTransferPayment = ({ finalOrderData, finalTotal, onPaymentConfirmed, onGoBack, isSubmitting }) => {
    // Use the pre-generated ID for the reference
    const orderReference = useMemo(() => MOCK_BANK_DETAILS.reference(finalOrderData.orderId), [finalOrderData.orderId]);

    const copyToClipboard = (text, message) => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => alert(`${message} copied to clipboard!`))
                .catch(err => console.error('Failed to copy text: ', err));
        } else {
            alert(`Please manually copy the ${message}: ${text}`);
        }
    };

    const handleConfirm = () => {
        onPaymentConfirmed({ 
            ...finalOrderData, 
            paymentMethod: 'Bank Transfer', 
            paymentReference: orderReference, 
            status: STATUS_PAYMENT_INITIATED, 
        });
    }

    // ENHANCED: DetailItem component for better mobile layout of long codes
    const DetailItem = ({ icon: Icon, label, value, copyValue, copyLabel }) => (
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-3 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center text-slate-700 dark:text-gray-300 mb-1 sm:mb-0">
                <Icon className="w-5 h-5 mr-3 text-red-800 dark:text-amber-400 flex-shrink-0" />
                <span className="font-medium">{label}:</span>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto mt-1 sm:mt-0">
                {/* Use break-all to ensure long IBANs don't cause horizontal overflow on small screens */}
                <span className="text-lg font-bold font-mono mr-3 text-slate-900 dark:text-white break-all">{value}</span>
                <motion.button
                    onClick={() => copyToClipboard(copyValue || value, copyLabel || label)}
                    className="p-2 text-sm text-red-800 dark:text-amber-400 bg-red-50 dark:bg-slate-700 rounded-md hover:bg-red-100 dark:hover:bg-slate-600 transition flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                >
                    <ClipboardList className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-8"
        >
            <h2 className="text-3xl font-serif font-black flex items-center text-red-800 dark:text-amber-400 border-b-2 border-red-100 dark:border-slate-700 pb-3">
                <Banknote className="w-8 h-8 mr-3" /> Secure Bank Transfer Details
            </h2>
            

            <div className="text-center p-4 bg-red-50 dark:bg-slate-700 rounded-lg">
                <p className="text-xl font-semibold text-slate-800 dark:text-white">
                    Please transfer the exact amount:
                </p>
                <p className="text-5xl font-extrabold font-serif text-red-800 dark:text-amber-400 my-2 flex items-center justify-center">
                    <Euro className="w-8 h-8 mr-2" />{finalTotal.toFixed(2)}
                </p>
                <p className="text-sm text-red-600 dark:text-amber-300 flex items-center justify-center mt-3">
                    Crucial: You must use the reference below for fast processing.
                </p>
            </div>

            <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Your Unique Transfer Information</h3>
                <DetailItem icon={User} label="Account Name" value={MOCK_BANK_DETAILS.accountName} />
                <DetailItem icon={Banknote} label="IBAN" value={MOCK_BANK_DETAILS.IBAN} />
                <DetailItem icon={Send} label="Reference / Purpose" value={orderReference} copyValue={orderReference} copyLabel="Order Reference" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-300 dark:border-slate-600">
                <motion.button
                    onClick={onGoBack}
                    // Full width on mobile, half width on sm+
                    className="w-full sm:w-1/2 py-3 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-gray-300 rounded-lg font-bold flex items-center justify-center transition duration-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 inline-block" /> Go Back
                </motion.button>
                <motion.button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    // Full width on mobile, half width on sm+
                    className={`w-full sm:w-1/2 py-3 text-xl font-bold rounded-xl flex items-center justify-center transition duration-300 shadow-lg 
                        ${isSubmitting ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-800 text-white hover:bg-red-900'}`}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    type="button"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    ) : (
                        <Check className="w-6 h-6 mr-3" />
                    )}
                    {isSubmitting ? 'Finalizing Order...' : 'I Have Completed the Transfer'}
                </motion.button>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By clicking "I Have Completed the Transfer," your order is logged with status `{STATUS_PAYMENT_INITIATED}`. We will process it after confirming the funds have cleared using the unique reference.
            </p>
        </motion.div>
    );
};


// --- CHECKOUT SUCCESS MESSAGE COMPONENT (Minor wording update) ---
const OrderSuccessPage = ({ totalAmount, resetApp }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto text-center p-8 sm:p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-t-8 border-green-600 dark:border-green-400"
    >
        <Check className="w-20 h-20 text-green-600 dark:text-green-400 mx-auto mb-6" />
        <h2 className="text-4xl font-serif font-black text-slate-800 dark:text-white mb-2">
            Order Successfully Recorded!
        </h2>
        <p className="text-lg text-slate-700 dark:text-gray-300 mb-6">
            Your order is now in Payment Initiated status. We will notify you once your bank transfer for €{totalAmount.toFixed(2)} is confirmed and the order moves to processing.
        </p>
        <div className="mb-8 p-4 bg-green-50 dark:bg-slate-700 rounded-lg inline-block">
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">Next Step: </span>
            <span className="text-2xl font-extrabold text-red-800 dark:text-amber-400 flex items-center justify-center">Wait for Confirmation</span>
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


// --- MAIN STANDALONE CHECKOUT COMPONENT ---
const StandaloneCheckout = ({ dbInstance, userId, initialCart, onOrderSuccess, setCurrentView }) => {
    const [cart, setCart] = useState(initialCart); 
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    
    // Tracks the temporary order data, including the unique ID, before final submission
    const [paymentDetails, setPaymentDetails] = useState(null); 

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
        if (typeof window !== 'undefined') {
            if (cart && cart.length > 0) {
                localStorage.setItem('checkoutCart', JSON.stringify(cart));
            } else if (cart.length === 0) {
                localStorage.removeItem('checkoutCart');
            }
        }
    }, [cart]);

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

    // STEP 1: Form submission -> Validate -> Move to Payment Screen (Pre-submission)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (totalItems === 0 || !userId || !dbInstance) {
            if(totalItems === 0) setStatusMessage('Error: Your cart is empty.');
            return;
        }
        
        if (!validate()) {
            setStatusMessage('Error: Please fill out all required fields.');
            if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        // --- REAL LOGIC: Generate unique ID now for payment reference ---
        const uniqueOrderId = crypto.randomUUID();

        // Prepare the base order data, setting the initial status
        const baseOrderData = {
            ...customerDetails,
            userId: userId,
            orderId: uniqueOrderId, // Crucial unique ID for reconciliation
            status: STATUS_PENDING_CONFIRMATION, // Initial status
            timestamp: serverTimestamp(),
            appId: appId,
            totalItems: totalItems,
            totalCost: finalTotal,
            items: cart.map(item => ({...item, totalPrice: item.quantity * item.price})),
            source: 'Site General Checkout',
        };

        // Move to the payment screen, carrying the unique order data
        setPaymentDetails(baseOrderData);
        setCurrentView(VIEW_PAYMENT); 
        setStatusMessage('');
    };

    // STEP 2: Payment Confirmation -> Submit order to Firestore (Final action)
    const handlePaymentConfirmation = async (dataWithPaymentDetails) => {
        if (!dbInstance || isSubmittingOrder) return;
        
        setIsSubmittingOrder(true);
        setStatusMessage('');

        try {
            if (dbInstance.mock) {
                console.log(`MOCK: Order ${dataWithPaymentDetails.orderId} submitted with status '${STATUS_PAYMENT_INITIATED}'.`);
            } else {
                // Use the new, structured collection path
                const userOrdersCollectionRef = collection(dbInstance, 'artifacts', appId, 'users', userId, 'site_orders');
                await addDoc(userOrdersCollectionRef, dataWithPaymentDetails);
            }
            
            setCart([]); 
            onOrderSuccess(finalTotal);
        } catch (error) {
            console.error("Error placing final order after payment confirmation:", error);
            setStatusMessage('Error: Failed to submit order. Please check your connection.');
            setCurrentView(VIEW_CHECKOUT); 
        } finally {
            setIsSubmittingOrder(false);
            setPaymentDetails(null);
        }
    };

    if (totalItems === 0 && !paymentDetails) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-amber-400" />
                <h2 className="text-3xl font-serif font-bold dark:text-white">Your Cart is Empty</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400">Please add items to your cart before checking out.</p>
                <motion.button 
                    onClick={() => { if (typeof window !== 'undefined') window.history.back(); }}
                    className="mt-6 py-3 px-6 bg-slate-800 text-amber-200 rounded-lg font-bold flex items-center justify-center mx-auto transition duration-300 hover:bg-slate-700 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Go Back to Menu
                </motion.button>
            </div>
        );
    }
    
    // RENDER: Bank Transfer Screen
    if (paymentDetails) {
        return (
            <BankTransferPayment
                finalOrderData={paymentDetails}
                finalTotal={finalTotal}
                onPaymentConfirmed={handlePaymentConfirmation}
                onGoBack={() => {
                    setCurrentView(VIEW_CHECKOUT);
                    setPaymentDetails(null); // Clear payment details when going back
                }}
                isSubmitting={isSubmittingOrder}
            />
        );
    }

    // RENDER: Main Checkout Form (Enhanced Spacing)
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
                
                <div className="lg:col-span-1 mb-8 lg:mb-0">
                    <OrderSummaryCard
                        cart={cart}
                        customerDetails={customerDetails}
                        finalTotal={finalTotal}
                        subtotal={subtotal}
                        totalItems={totalItems}
                    />
                </div>

                <div className="lg:col-span-2">
                    <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-8">
                        
                        <h3 className="text-3xl font-bold font-serif flex items-center text-slate-800 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-3">
                            <User className="w-7 h-7 mr-3 text-red-800 dark:text-amber-400" /> Shipping & Contact Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold uppercase text-amber-600 dark:text-amber-400 mb-2 tracking-wider">Full Name *</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={customerDetails.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    // Enhanced input styling with amber focus and smoother transition
                                    className={`w-full p-4 border rounded-xl transition duration-300 shadow-sm dark:bg-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-200/50 focus:border-amber-500 text-lg
                                        ${errors.name ? 'border-red-500 ring-red-200' : 'border-gray-300 dark:border-gray-700'}`}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                            </div>

                            {/* Phone or Email Field - Placeholder alignment FIX applied */}
                            <div>
                                <label htmlFor="contact" className="block text-sm font-bold uppercase text-amber-600 dark:text-amber-400 mb-2 tracking-wider">Phone or Email *</label>
                                <div className="relative">
                                    <input
                                        id="contact"
                                        type="text"
                                        name="contact"
                                        value={customerDetails.contact}
                                        onChange={handleChange}
                                        required
                                        placeholder="Phone number or email address"
                                        // pl-12 is kept here to push the text past the icon (icon is 1.5rem wide + 1rem padding = 2.5rem total offset)
                                        className={`w-full p-4 pl-12 border rounded-xl transition duration-300 shadow-sm dark:bg-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-200/50 focus:border-amber-500 text-lg
                                            ${errors.contact ? 'border-red-500 ring-red-200' : 'border-gray-300 dark:border-gray-700'}`}
                                    />
                                    {/* Icon position left-4 to align with pl-12 padding. Using 'Phone' from lucide-react. */}
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 dark:text-amber-400" />
                                </div>
                                {errors.contact && <p className="text-red-500 text-sm mt-2">{errors.contact}</p>}
                            </div>
                        </div>

                        {/* Delivery Type - Styled Radio Buttons as Selection Cards */}
                        <div className="space-y-4">
                            <p className="text-xl font-serif font-extrabold text-gray-900 dark:text-gray-100 mt-6">Choose Order Method</p>
                            <div className="flex flex-wrap gap-4 sm:gap-6">

                                {/* Pickup Option */}
                                <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition duration-300 flex-1 min-w-[200px]
                                    ${customerDetails.deliveryType === 'pickup'
                                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/40 shadow-lg ring-4 ring-amber-200/50'
                                        : 'border-gray-300 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400'
                                    }`}
                                >
                                    {/* Custom Radio Button Style */}
                                    <input
                                        type="radio"
                                        name="deliveryType"
                                        value="pickup"
                                        checked={customerDetails.deliveryType === 'pickup'}
                                        onChange={handleChange}
                                        className="hidden" // Hide native radio button
                                    />
                                    <div className="flex items-center">
                                        {/* Custom Circular Radio Indicator */}
                                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition duration-300
                                            ${customerDetails.deliveryType === 'pickup'
                                                ? 'border-amber-600 bg-amber-600 shadow-md'
                                                : 'border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700'
                                            }`}
                                        >
                                            {customerDetails.deliveryType === 'pickup' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-white dark:bg-gray-900"></span>
                                            )}
                                        </div>
                                        <span className="font-extrabold text-lg text-gray-800 dark:text-gray-100">
                                            Pickup <span className="text-sm font-normal text-amber-600 dark:text-amber-400">(No Fee)</span>
                                        </span>
                                    </div>
                                </label>

                                {/* Delivery Option */}
                                <label className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition duration-300 flex-1 min-w-[200px]
                                    ${customerDetails.deliveryType === 'delivery'
                                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/40 shadow-lg ring-4 ring-amber-200/50'
                                        : 'border-gray-300 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="deliveryType"
                                        value="delivery"
                                        checked={customerDetails.deliveryType === 'delivery'}
                                        onChange={handleChange}
                                        className="hidden" // Hide native radio button
                                    />
                                    <div className="flex items-center">
                                        {/* Custom Circular Radio Indicator */}
                                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition duration-300
                                            ${customerDetails.deliveryType === 'delivery'
                                                ? 'border-amber-600 bg-amber-600 shadow-md'
                                                : 'border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700'
                                            }`}
                                        >
                                            {customerDetails.deliveryType === 'delivery' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-white dark:bg-gray-900"></span>
                                            )}
                                        </div>
                                        <span className="font-extrabold text-lg text-gray-800 dark:text-gray-100">
                                            Delivery <span className="text-sm font-normal text-amber-600 dark:text-amber-400">(+€{DELIVERY_FEE.toFixed(2)} Fee)</span>
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Address Field (Conditional) - Using a placeholder for the motion component */}
                        {customerDetails.deliveryType === 'delivery' && (
                            <div
                                className="overflow-hidden space-y-2"
                            >
                                <label htmlFor="address" className="block text-sm font-bold uppercase text-amber-600 dark:text-amber-400 mb-2 tracking-wider">Delivery Address *</label>
                                <div className="relative">
                                    <input
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={customerDetails.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Street address, City, Postal Code"
                                        className={`w-full p-4 pl-12 border rounded-xl transition duration-300 shadow-sm dark:bg-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-200/50 focus:border-amber-500 text-lg
                                            ${errors.address ? 'border-red-500 ring-red-200' : 'border-gray-300 dark:border-gray-700'}`}
                                    />
                                    {/* Using MapPin from lucide-react */}
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 dark:text-amber-400" />
                                </div>
                                {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address}</p>}
                            </div>
                        )}

                        {/* Special Notes */}
                        <div className="space-y-2">
                            <label htmlFor="notes" className="block text-sm font-bold uppercase text-amber-600 dark:text-amber-400 mb-2 tracking-wider">Special Instructions / Notes (Optional)</label>
                            <div className="relative">
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="3"
                                    value={customerDetails.notes}
                                    onChange={handleChange}
                                    placeholder="e.g., allergies, gate code, leave at door"
                                    // Using pl-12 to clear the space for the icon
                                    className="w-full p-4 pl-12 border rounded-xl transition duration-300 shadow-sm dark:bg-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-200/50 focus:border-amber-500 text-lg resize-none"
                                ></textarea>
                                {/* FIX: Using 'MessageSquare' from lucide-react instead of the undefined component */}
                                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-amber-500 dark:text-amber-400" />
                            </div>
                        </div>

                        {/* Submit Button (Triggers Validation and moves to VIEW_PAYMENT) */}
                        <motion.button
                            type="submit"
                            disabled={totalItems === 0}
                            className={`w-full py-4 text-xl font-bold rounded-xl flex items-center justify-center transition duration-300 shadow-xl mt-6
                                ${totalItems === 0
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                    : 'bg-red-800 text-white hover:bg-red-900 focus:ring-4 focus:ring-red-500/50'
                                }`}
                            whileHover={totalItems > 0 ? { scale: 1.01 } : {}}
                            whileTap={totalItems > 0 ? { scale: 0.98 } : {}}
                        >
                            <Banknote className="w-6 h-6 mr-3" />
                            {`Continue to Pay: €${finalTotal.toFixed(2)}`}
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};


// --- MAIN APP COMPONENT ---

const App = () => {
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [dbInstance, setDbInstance] = useState(null);
    const [currentView, setCurrentView] = useState(VIEW_CHECKOUT); 
    const [lastOrderTotal, setLastOrderTotal] = useState(0);

    // Initial State: Start with an empty cart.
    const [mockCart, setMockCart] = useState([]); 
    const [isLoadingCart, setIsLoadingCart] = useState(true);

    // FIX: Load Cart on Client Mount using useEffect to avoid 'window is not defined' error
    useEffect(() => {
        let loadedCart = [];
        let storedCart = null;

        if (typeof window !== 'undefined') {
            try {
                // 1. Safely read localStorage
                storedCart = localStorage.getItem('checkoutCart');

                if (storedCart) {
                    const parsedCart = JSON.parse(storedCart);
                    if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                        loadedCart = parsedCart;
                    }
                } else if (window.location.search.includes('mock=true')) {
                     // 2. Safely check for mock=true query parameter (for testing)
                     loadedCart = [
                         { id: 'item1', name: 'Deluxe Burger', price: 12.50, quantity: 2 },
                         { id: 'item2', name: 'Large Fries', price: 4.00, quantity: 1 }
                     ];
                }
            } catch (e) {
                console.error("Error loading cart:", e);
            }
        }

        setMockCart(loadedCart);
        setIsLoadingCart(false);
    }, []); 

    // 2. Firebase Initialization and Authentication
    useEffect(() => {
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'mock-key') {
            console.warn("Using mock Firebase configuration. Firestore submissions will fail but the flow will work.");
            setUserId(crypto.randomUUID());
            setDbInstance({ mock: true });
            setIsAuthReady(true);
            return;
        }

        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const authService = getAuth(app);
            
            setDbInstance(firestore);
            
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
        if (typeof window !== 'undefined') localStorage.removeItem('checkoutCart'); 
    }
    
    // Handler to reset the app flow after success
    const resetApp = () => {
        setMockCart([]); 
        if (typeof window !== 'undefined') localStorage.removeItem('checkoutCart');
        setCurrentView(VIEW_CHECKOUT);
    }

    const renderMainContent = () => {
        if (currentView === VIEW_SUCCESS) {
            return <OrderSuccessPage totalAmount={lastOrderTotal} resetApp={resetApp} />;
        }
        
        // Wait until both Auth and Cart data are ready
        if (!isAuthReady || isLoadingCart) {
             return (
                <div className="min-h-screen flex items-center justify-center dark:bg-slate-950" style={{ backgroundColor: LIGHT_BG_COLOR }}>
                    <Loader2 className="w-10 h-10 text-red-700 animate-spin mr-4" />
                    <p className="text-xl font-serif text-slate-800 dark:text-orange-200">Loading Checkout...</p>
                </div>
            );
        }

        // Render Checkout
        return (
            <StandaloneCheckout 
                initialCart={mockCart}
                dbInstance={dbInstance}
                userId={userId}
                onOrderSuccess={handleOrderSuccess}
                setCurrentView={setCurrentView}
            />
        );
    };

    
    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-gray-100 p-4 sm:p-8">
            <style jsx global>{`
                /* Ensure body covers min height for consistent background and scrolling */
                body {
                    background-color: ${LIGHT_BG_COLOR}; 
                    color: #1e293b;
                    min-height: 100vh;
                    transition: background-color 0.3s;
                }
                .dark body {
                    background-color: #0f172a; 
                    color: #f1f5f9;
                }
            `}</style>
            
            {/* The main content wrapper ensures the content is centered and responsive */}
            <main className="py-10 md:py-16">
                <AnimatePresence mode="wait">
                    {renderMainContent()}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default App;
