import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cake, Package, Utensils, ShoppingCart, X, Plus, Minus, Send, Loader2, Euro, Zap, Filter, User, Coffee, Star, Croissant, Clock, ClipboardList, Check
} from 'lucide-react';

// --- FIREBASE IMPORTS AND CONFIG ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Global variables injected by the environment (MANDATORY USE)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- CUSTOM THEME COLOR & ASSETS ---
const LIGHT_BG_COLOR = '#FBF5E5'; // Soft, bakery-like cream color for light mode
// Hero Image URL for the background
const HERO_IMAGE_URL = 'images/cute.png'; 

// --- DATA DEFINITION (CONSOLIDATED) ---
const MENU_ITEMS = [
    // Pastries (7 items)
    { id: 'croissant-almond', name: 'Classic Almond Croissant', price: 5.50, desc: 'Flaky, buttery pastry filled with almond cream and topped with toasted slices.', size: 'Single', icon: 'Croissant', image: 'images/almond.jpg', category: 'Pastries' },
    { id: 'pain-au-choc', name: 'Pain au Chocolat', price: 4.80, desc: 'A rich, dark chocolate bar wrapped in layered, golden dough.', size: 'Single', icon: 'Croissant', image: 'images/choc.jpg', category: 'Pastries' },
    { id: 'cinnamon-roll', name: 'Artisan Cinnamon Roll', price: 6.20, desc: 'Giant, gooey roll glazed with vanilla bean cream cheese frosting.', size: 'Large', icon: 'Utensils', image: 'images/cin.jpg', category: 'Pastries' },
    { id: 'scone-blueberry', name: 'Wild Blueberry Scone', price: 3.50, desc: 'Tender scone packed with wild blueberries, perfect with coffee.', size: 'Single', icon: 'Utensils', image: 'images/blue.jpg', category: 'Pastries' },
    { id: 'kouign-amann', name: 'Kouign-Amann', price: 7.00, desc: 'The "Butter Cake" of Brittany. Caramelized, crisp, and incredibly rich.', size: 'Single', icon: 'Star', image: 'images/cog.jpg', category: 'Pastries' },
    { id: 'danish-fruit', name: 'Seasonal Fruit Danish', price: 5.00, desc: 'Light pastry topped with sweetened cream cheese and fresh seasonal fruit.', size: 'Single', icon: 'Utensils', image: 'images/danish.jpg', category: 'Pastries' },
    { id: 'savory-muffin', name: 'Sundried Tomato & Feta Muffin', price: 4.00, desc: 'A savory muffin with a hint of basil, excellent for breakfast.', size: 'Single', icon: 'Utensils', image: 'images/feta.jpg', category: 'Pastries' },
    
    // Breads (4 items)
    { id: 'sourdough-loaf', name: 'Artisan Sourdough Loaf', price: 12.00, desc: 'Naturally leavened bread with a crisp crust and open, airy crumb.', size: '900g Loaf', icon: 'Package', image: 'images/sourr.jpg', category: 'Breads' },
    { id: 'baguette-classic', name: 'Classic French Baguette', price: 4.50, desc: 'Crisp, golden crust with a soft, chewy interior. The essential bread.', size: '300g Loaf', icon: 'Package', image: 'images/french.jpg', category: 'Breads' },
    { id: 'brioche-roll', name: 'Hand-Rolled Brioche Buns', price: 9.00, desc: 'Six pillowy-soft, rich buns perfect for gourmet sandwiches or snacking.', size: 'Pack of 6', icon: 'Package', image: 'images/hand.jpg', category: 'Breads' },
    { id: 'multigrain-loaf', name: '9-Grain Multigrain Loaf', price: 10.50, desc: 'A hearty, dense loaf packed with seeds and healthy grains.', size: '750g Loaf', icon: 'Package', image: 'images/multi.jpg', category: 'Breads' },

    // Cakes & Tarts (5 items)
    { id: 'entremet-chocolate', name: 'Signature Dark Chocolate Entremet', price: 65.00, desc: 'A rich dessert with dark chocolate mousse, sponge, and a mirror glaze.', size: '6-inch', icon: 'Cake', image: 'images/dark.jpg', category: 'Cakes & Tarts' },
    { id: 'tart-lemon', name: 'Classic Lemon Meringue Tart', price: 38.00, desc: 'Tangy lemon filling set in a sweet shortcrust pastry, topped with toasted meringue.', size: '9-inch', icon: 'Cake', image: 'images/lemon.jpg', category: 'Cakes & Tarts' },
    { id: 'red-velvet-cake', name: 'Velvet Dream Cake', price: 55.00, desc: 'Moist red velvet sponge layered with fluffy cream cheese frosting.', size: '8-inch', icon: 'Cake', image: 'images/vel.jpg', category: 'Cakes & Tarts' },
    { id: 'apple-crumble', name: 'Rustic Apple Crumble Pie', price: 32.00, desc: 'Spiced apples under a rich, buttery oat crumble topping.', size: '9-inch', icon: 'Cake', image: 'images/apple.jpg', category: 'Cakes & Tarts' },
    { id: 'opera-cake', name: 'Grand Opera Cake Slice', price: 8.50, desc: 'Layers of almond sponge, coffee buttercream, and chocolate ganache.', size: 'Slice', icon: 'Utensils', image: 'images/slice.jpg', category: 'Cakes & Tarts' },

    // Cookies (5 items)
    { id: 'cookies-oatmeal', name: 'Brown Butter Oatmeal Raisin', price: 3.00, desc: 'Chewy oatmeal cookie with a hint of cinnamon and plump raisins.', size: 'Single', icon: 'Utensils', image: 'images/raisen.jpg', category: 'Cookies' },
    { id: 'choc-chip-sea-salt', name: 'Choc Chip & Sea Salt', price: 3.50, desc: 'Classic chocolate chip cookie sprinkled with flaky sea salt.', size: 'Single', icon: 'Utensils', image: 'images/chip.jpg', category: 'Cookies' },
    { id: 'macaron-box', name: 'Assorted Macaron Box', price: 25.00, desc: 'A selection of 12 delicate French macarons in seasonal flavors.', size: 'Box of 12', icon: 'Package', image: 'images/box.jpg', category: 'Cookies' },
    { id: 'gingerbread-snap', name: 'Spicy Gingerbread Snaps', price: 2.50, desc: 'Crisp, spicy cookies perfect for dipping in coffee or tea.', size: 'Single', icon: 'Utensils', image: 'images/ginger.jpg', category: 'Cookies' },
    { id: 'peanut-butter-cup', name: 'Peanut Butter Cup Cookie', price: 3.75, desc: 'Soft peanut butter dough filled with a mini dark chocolate cup.', size: 'Single', icon: 'Utensils', image: 'images/pea.jpg', category: 'Cookies' },

    // Beverages/Retail (4 items)
    { id: 'espresso-blend', name: 'House Espresso Blend', price: 20.00, desc: 'Our signature blend of Ethiopian and Colombian beans, medium roast.', size: '250g Bag', icon: 'Coffee', image: 'images/esp.jpg', category: 'Coffee & Tea' },
    { id: 'tea-earlgrey', name: 'Artisan Earl Grey Tea', price: 15.00, desc: 'A fragrant blend of black tea and bergamot oil. Excellent hot or iced.', size: '50g Tin', icon: 'Coffee', image: 'images/earl.jpg', category: 'Coffee & Tea' },
    { id: 'cold-brew-concentrate', name: 'Cold Brew Concentrate', price: 18.00, desc: 'Smooth, low-acidity coffee concentrate for easy at-home cold brew.', size: '500ml Bottle', icon: 'Coffee', image: 'images/cold.jpg', category: 'Coffee & Tea' },
    { id: 'hot-choc-mix', name: 'Gourmet Hot Chocolate Mix', price: 16.50, desc: 'Shavings of 70% dark Belgian chocolate for a decadent drink.', size: '300g Tin', icon: 'Zap', image: 'images/hot.jpg', category: 'Coffee & Tea' },
];

const CATEGORIES = ['All Products', ...new Set(MENU_ITEMS.map(item => item.category))];

const getItemDetails = (id) => {
    return MENU_ITEMS.find(item => item.id === id);
};
const allRecipes = MENU_ITEMS; // Alias for consistency with the requested structure
// --- END DATA DEFINITION ---


// Map string names to Lucide components
const ICON_MAP = {
    Cake: Cake, Package: Package, Utensils: Utensils, ShoppingCart: ShoppingCart, 
    X: X, Plus: Plus, Minus: Minus, Send: Send, Loader2: Loader2, Euro: Euro, 
    Zap: Zap, Filter: Filter, User: User, Coffee: Coffee, Star: Star, Croissant: Croissant,
    Clock: Clock, ClipboardList: ClipboardList, Check: Check
};

// --- UTILITY COMPONENT: PRODUCT CARD ---

const ProductCard = ({ item, addToCart }) => {
    const [isAdded, setIsAdded] = useState(false);
    // Resolve icon string to component
    const IconComponent = ICON_MAP[item.icon] || Utensils;

    const handleAddToCart = () => {
        addToCart(item);
        setIsAdded(true);
        // Reset added state after a short delay
        const timer = setTimeout(() => setIsAdded(false), 800);
        return () => clearTimeout(timer);
    };

    return (
        <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col transition duration-300 hover:shadow-2xl hover:shadow-amber-900/20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="relative h-48">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover object-center"
                    // Simple image fallback
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/8B4513/FBF5E5?text=Artisan+Bake'; }}
                />
                <div className="absolute top-3 right-3 bg-amber-700 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg flex items-center">
                    <Euro className="w-4 h-4 mr-1"/>{item.price.toFixed(2)}
                </div>
                {/* Display item category icon */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-700/80 text-amber-700 dark:text-amber-300 text-sm font-semibold p-2 rounded-full shadow-lg flex items-center">
                    <IconComponent className="w-4 h-4"/>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-gray-100 mb-2">{item.name}</h3>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wider">{item.category} &middot; {item.size}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-2">{item.desc}</p>
                
                {/* Add to Cart Button with Feedback - UPDATED COLOR */}
                <motion.button
                    onClick={handleAddToCart}
                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center transition duration-300 shadow-md mt-auto
                        ${isAdded 
                            ? 'bg-amber-800 text-white shadow-amber-800/50' // Changed from green to amber-800
                            : 'bg-slate-800 text-amber-200 hover:bg-slate-700 shadow-slate-800/30'
                        }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <AnimatePresence mode="wait">
                        {isAdded ? (
                            <motion.span 
                                key="check"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex items-center"
                            >
                                <Check className="w-5 h-5 mr-2" /> Added!
                            </motion.span>
                        ) : (
                            <motion.span 
                                key="add"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex items-center"
                            >
                                <Plus className="w-5 h-5 mr-2" /> Add to Order
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- UTILITY COMPONENT: CART SIDEBAR ---

// --- UTILITY COMPONENT: CART SIDEBAR ---

const CartSidebar = ({ isVisible, cart, setCart, setIsCartOpen }) => { 
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);

    const updateQuantity = (id, change) => {
        setCart(prev => {
            const newCart = { ...prev };
            const currentQuantity = newCart[id]?.quantity || 0;
            
            if (currentQuantity + change <= 0) {
                delete newCart[id];
            } else {
                // Get item details from the globally available data
                const itemDetails = getItemDetails(id); 
                if (itemDetails) {
                    newCart[id] = {
                        name: itemDetails.name,
                        price: itemDetails.price,
                        quantity: currentQuantity + change
                    };
                }
            }
            return newCart;
        });
    };

    // --- CORRECTION: Defining the handler locally within the component ---
    const handleLocalCheckout = () => {
        if (totalItems === 0) return;

        // 1. Convert cart object to a serializable array format
        const cartArray = Object.entries(cart).map(([id, item]) => ({
            id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));

        // 2. Save the data to local storage (the checkout page looks for this key)
        localStorage.setItem('checkoutCart', JSON.stringify(cartArray));

        // 3. Redirect the user to the standalone checkout page
        window.location.href = '/checkout';
    };
    // --- END CORRECTION ---


    const cartIsEmpty = totalItems === 0;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[60]" // Backdrop z-index
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/80" onClick={() => setIsCartOpen(false)}></div>

                    {/* Sidebar Content (Higher Z-index to prevent clash with Floating Cart Button) */}
                    <motion.div
                        className="fixed right-0 top-0 w-full md:w-[28rem] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-[70]" 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white flex items-center">
                                <ShoppingCart className="w-7 h-7 mr-3 text-amber-600 dark:text-amber-400" /> 
                                Your Order ({totalItems})
                            </h2>
                            <motion.button 
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 rounded-full text-gray-500 hover:text-slate-800 dark:text-gray-300 dark:hover:text-white transition bg-gray-100 dark:bg-slate-700"
                                whileHover={{ rotate: 90 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {cartIsEmpty ? (
                                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                    <Coffee className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                                    <p className="font-semibold text-xl">Your basket is empty.</p>
                                    <p className="text-sm mt-1">Add our artisanal goods to start your order.</p>
                                </div>
                            ) : (
                                Object.entries(cart).map(([id, item]) => (
                                    <motion.div 
                                        key={id}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg shadow-sm border border-amber-100 dark:border-slate-700"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                    >
                                        <div className="flex-grow pr-3">
                                            <p className="font-semibold text-slate-800 dark:text-white text-lg">{item.name}</p>
                                            <p className="text-sm text-amber-700 dark:text-amber-400"><Euro className="w-3 h-3 inline-block" />{item.price.toFixed(2)} ea.</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => updateQuantity(id, -1)} 
                                                className="p-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-full hover:bg-amber-200 transition"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold w-5 text-center text-slate-800 dark:text-white">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(id, 1)} 
                                                className="p-1 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer / Checkout Button to Redirect */}
                        <div className="p-6 border-t border-gray-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-900">
                            <div className="flex justify-between text-2xl font-serif font-extrabold mb-5 text-slate-800 dark:text-white">
                                <span>Subtotal:</span>
                                <span className="flex items-center"><Euro className="w-6 h-6 mr-1" />{subtotal.toFixed(2)}</span>
                            </div>
                            <motion.button
                                onClick={handleLocalCheckout}
                                disabled={cartIsEmpty}
                                className={`w-full py-4 text-xl font-bold rounded-xl flex items-center justify-center transition duration-300 shadow-xl
                                    ${cartIsEmpty 
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                                        : 'bg-slate-800 text-amber-200 hover:bg-slate-900 focus:ring-4 focus:ring-amber-500/50'
                                    }`}
                                whileHover={!cartIsEmpty ? { scale: 1.01 } : {}}
                                whileTap={!cartIsEmpty ? { scale: 0.98 } : {}}
                            >
                                <Send className="w-6 h-6 mr-3" /> Proceed to Checkout
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- UTILITY COMPONENT: MOBILE/DRAWER FILTER ---
const MobileDrawerFilter = ({ isVisible, selectedCategory, setSelectedCategory, setIsFilterDrawerOpen }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[60]" // Backdrop z-index
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/80" onClick={() => setIsFilterDrawerOpen(false)}></div>

                    {/* Filter Sidebar Content */}
                    <motion.div
                        className="fixed left-0 top-0 w-full md:w-[20rem] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-[70]"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white flex items-center">
                                <Filter className="w-7 h-7 mr-3 text-amber-600 dark:text-amber-400" /> 
                                Filter Menu
                            </h2>
                            <motion.button 
                                onClick={() => setIsFilterDrawerOpen(false)}
                                className="p-2 rounded-full text-gray-500 hover:text-slate-800 dark:text-gray-300 dark:hover:text-white transition bg-gray-100 dark:bg-slate-700"
                                whileHover={{ rotate: -90 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>

                        {/* Filter Categories List */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-3">
                            {CATEGORIES.map(category => (
                                <motion.button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsFilterDrawerOpen(false); // Close drawer after selection
                                    }}
                                    className={`w-full text-left py-3 px-4 rounded-lg font-semibold flex items-center transition duration-200 border-2
                                        ${selectedCategory === category
                                            ? 'bg-amber-700 text-white border-amber-700 shadow-md'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border-gray-300 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ClipboardList className="w-5 h-5 mr-3"/> {category}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- MAIN APP COMPONENT ---

const App = () => {
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [dbInstance, setDbInstance] = useState(null);
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false); // State for filter drawer

    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

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
            
            onAuthStateChanged(authService, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
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
                        setUserId(crypto.randomUUID()); // Fallback to a random ID if auth fails
                    } finally {
                        setIsAuthReady(true);
                    }
                }
            });
            
        } catch (e) {
            console.error("Failed to initialize or authenticate Firebase:", e);
            setUserId(crypto.randomUUID());
            setIsAuthReady(true);
        }
    }, []);

    // 2. Cart Handlers
    const addToCart = useCallback((item) => {
        setCart(prev => {
            const currentItem = prev[item.id];
            return {
                ...prev,
                [item.id]: {
                    name: item.name,
                    price: item.price,
                    quantity: currentItem ? currentItem.quantity + 1 : 1
                }
            };
        });
        setStatusMessage('');
    }, []);
    
    // 3. Checkout Handler (Save order to Firestore)
    // This function replaces the Firestore submission logic
    const handleLocalCheckout = () => {
        if (totalItems === 0) return;

        // 1. Convert cart object to a serializable array format for local storage
        const cartArray = Object.entries(cart).map(([id, item]) => ({
            id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));

        // 2. Save the data to local storage (the checkout page looks for this key)
        localStorage.setItem('checkoutCart', JSON.stringify(cartArray));

        // 3. Redirect the user to the standalone checkout page
        // NOTE: Path updated to the correct file path.
        window.location.href = '/checkout.jsx'; 
    };

    // 4. Filtering Logic
    const filteredItems = useMemo(() => {
        if (selectedCategory === 'All Products') {
            return allRecipes;
        }
        return allRecipes.filter(item => item.category === selectedCategory);
    }, [selectedCategory]);


    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-slate-950" style={{ backgroundColor: LIGHT_BG_COLOR }}>
                <Loader2 className="w-10 h-10 text-amber-700 animate-spin mr-4" />
                <p className="text-xl font-serif text-slate-800 dark:text-amber-200">Preparing the Menu...</p>
            </div>
        );
    }
    
    return (
        <div 
            className="min-h-screen font-sans text-slate-800 dark:text-gray-100" 
            // Removed inline style here to rely fully on global styles/tailwind classes
        >
            {/* GLOBAL STYLE FIXES:
                1. Ensure the root element adopts the dark background seamlessly.
                2. Removed background-color from the main <div> above.
            */}
            <style jsx global>{`
                body {
                    background-color: ${LIGHT_BG_COLOR}; 
                    color: #1e293b; /* slate-800 */
                    min-height: 100vh;
                    transition: background-color 0.3s;
                }
                .dark body {
                    background-color: #0f172a; /* slate-900 */
                    color: #f1f5f9; /* slate-100 */
                }
                .dark {
                    /* This ensures the root element reflects the dark mode background if needed */
                    background-color: #0f172a; 
                }
                /* Apply background to the root element for seamless light/dark mode transition */
                #__next, #root {
                    background-color: ${LIGHT_BG_COLOR};
                    transition: background-color 0.3s;
                }
                .dark #__next, .dark #root {
                    background-color: #0f172a;
                }
            `}</style>

            {/* Floating Cart Button (z-40 to be above the hero content but below drawers) */}
            <motion.button
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-slate-800 text-amber-200 rounded-full shadow-2xl shadow-slate-900/40 flex items-center transition duration-200 hover:bg-slate-700 hover:scale-105"
                whileTap={{ scale: 0.95 }}
                aria-label="View Shopping Cart"
            >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                    <motion.span 
                        className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-600 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                        key={totalItems}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        {totalItems}
                    </motion.span>
                )}
            </motion.button>

            {/* Header/Hero Section - Increased size, responsive padding */}
            <header 
                className="relative pt-20 pb-16 md:pt-28 md:pb-24 shadow-lg overflow-hidden z-20"
                style={{ 
                    backgroundImage: `url(${HERO_IMAGE_URL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay for readability - REDUCED OPACITY FROM /80 TO /50 */}
                <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-[1px]"></div>

                <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center p-6 sm:p-10">
                    <h1 className="text-4xl sm:text-6xl font-extrabold font-serif text-white drop-shadow-2xl tracking-tight">
                        Artisan Sweets & Provisions
                    </h1>
                    <p className="text-xl text-gray-300 mt-2 font-light italic border-l-4 border-amber-500 pl-4">
                        Hand-crafted daily with the finest, all-natural ingredients.
                    </p>
                </div>
            </header>

            {/* Main Content & Menu Grid */}
            <main className="py-10 md:py-16 bg-inherit dark:bg-inherit">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Status Message */}
                    <AnimatePresence>
                        {statusMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`text-center p-4 mb-8 rounded-lg font-medium shadow-md transition-all
                                    ${statusMessage.startsWith('Error') ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'}`}
                            >
                                {statusMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Filter Section - Using button to open the mobile drawer filter */}
                    <div className="mb-10 flex justify-between items-center">
                        <h2 className="text-3xl font-serif font-extrabold text-slate-800 dark:text-white flex items-center">
                            <Clock className="w-6 h-6 text-amber-700 mr-3 dark:text-amber-400" />
                            {selectedCategory}
                        </h2>
                        
                        <motion.button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className="flex items-center space-x-2 px-5 py-2 bg-amber-700 text-white rounded-full font-semibold transition duration-200 hover:bg-amber-800 shadow-lg shadow-amber-700/30"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Open Category Filter"
                        >
                            <Filter className="w-5 h-5"/>
                            <span className="hidden sm:inline">Change Category</span>
                            <span className="sm:hidden">Filter</span>
                        </motion.button>
                    </div>


                    {/* Product Grid - Enhanced mobile layout (3 columns on sm breakpoint) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-8">
                        <AnimatePresence mode="wait">
                            {filteredItems.map(item => (
                                <ProductCard 
                                    key={item.id} 
                                    item={item} 
                                    addToCart={addToCart} 
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                            <Utensils className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                            <p className="text-2xl font-serif">Nothing matches this category yet!</p>
                            <p className="mt-2">Try selecting "All Products" or check back later for more.</p>
                        </div>
                    )}

                </div>
            </main>

            {/* Filter Drawer Sidebar (Left side) - Uses z-index 70 for priority */}
            <MobileDrawerFilter
                isVisible={isFilterDrawerOpen}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setIsFilterDrawerOpen={setIsFilterDrawerOpen}
            />

            {/* Shopping Cart Sidebar (Right side) - Uses z-index 70 for priority */}
            <CartSidebar 
                isVisible={isCartOpen}
                cart={cart}
                setCart={setCart}
                setIsCartOpen={setIsCartOpen}
            />
        </div>
    );
}

export default App;
