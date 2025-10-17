import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cake, Package, Utensils, ShoppingCart, X, Plus, Minus, Send, Loader2, Euro, Zap, Filter, User, Coffee, Star, Croissant, Clock, ClipboardList, Check, ChefHat, Soup, Drumstick
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp } from 'firebase/firestore';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? initialAuthToken : null;

const LIGHT_BG_COLOR = '#FBF5E5';
const ACCENT_COLOR = '#D97706';

const HERO_IMAGE_URL = 'images/health.png';

const MENU_ITEMS = [
    { id: 'jollof-rice', name: 'Smoky Jollof Rice', price: 15.00, desc: 'Classic party rice dish cooked in a spicy tomato and pepper base. Served plain.', size: 'Bowl', icon: 'Drumstick', image: 'images/smoky.jpg', category: 'Nigerian Staples' },
    { id: 'fried-rice', name: 'Premium Fried Rice', price: 16.50, desc: 'Wok-fried rice mixed with finely chopped liver, shrimp, and diced vegetables.', size: 'Bowl', icon: 'Drumstick', image: 'images/fri.jpg', category: 'Nigerian Staples' },
    { id: 'white-rice-stew', name: 'White Rice & Rich Stew', price: 14.00, desc: 'Fluffy white rice served with a robust, slow-simmered tomato and pepper beef stew.', size: 'Plate', icon: 'Drumstick', image: 'images/stew.jpg', category: 'Nigerian Staples' },
    { id: 'beans-plantain', name: 'Ewa Agoyin & Dodo', price: 13.50, desc: 'Mashed, spicy soft beans (Ewa Agoyin) served with fried ripe plantain (Dodo).', size: 'Plate', icon: 'Utensils', image: 'images/ewa.jpg', category: 'Nigerian Staples' },
    { id: 'coconut-rice', name: 'Coconut Jollof Rice', price: 17.00, desc: 'Fragrant basmati rice cooked in creamy coconut milk and subtle spices.', size: 'Bowl', icon: 'Utensils', image: 'images/coco.jpg', category: 'Nigerian Staples' },
    { id: 'asun-jollof', name: 'Asun Fried Combo', price: 22.00, desc: 'Smoky Jollof rice served with spicy roasted goat meat (Asun).', size: 'Plate', icon: 'Star', image: 'images/asunn.jpg', category: 'Nigerian Staples' },
    
    { id: 'egusi-pounded', name: 'Egusi Soup & Pounded Yam', price: 24.00, desc: 'Melon seed soup (Egusi) with spinach, meat, and smoked fish, served with pounded yam.', size: 'Set', icon: 'Soup', image: 'images/pound.jpg', category: 'Soups & Swallows' },
    { id: 'afang-soup', name: 'Afang Soup & Garri', price: 26.00, desc: 'A rich Efik/Ibibio soup made with Afang leaves and waterleaf, served with Garri.', size: 'Set', icon: 'Soup', image: 'images/afang.jpg', category: 'Soups & Swallows' },
    { id: 'ogbono-soup', name: 'Ogbono Soup & Amala', price: 24.50, desc: 'Slender, drawing soup made from ogbono seeds, served with Amala (Yam Flour).', size: 'Set', icon: 'Soup', image: 'images/ogbo.jpg', category: 'Soups & Swallows' },
    { id: 'seafood-okro', name: 'Seafood Okro Soup', price: 27.00, desc: 'Fresh okro soup loaded with prawns, calamari, and smoked catfish.', size: 'Bowl', icon: 'Soup', image: 'images/okro.jpg', category: 'Soups & Swallows' },
    { id: 'edikang-ikong', name: 'Edikang Ikong & Fufu', price: 25.50, desc: 'Vegetable soup (Waterleaf & Ugu) richly prepared, served with Cassava Fufu.', size: 'Set', icon: 'Soup', image: 'https://i.pinimg.com/736x/e2/6f/92/e26f921977e1636c4f3cda56b276c789.jpg', category: 'Soups & Swallows' },
    { id: 'ewedu-gbegiri', name: 'Ewedu & Gbegiri', price: 23.00, desc: 'Classic Yoruba combo of Jute leaf soup (Ewedu) and blended beans soup (Gbegiri).', size: 'Set', icon: 'Soup', image: 'https://i.pinimg.com/736x/2e/b7/09/2eb709b27d19bd840aa61b5c0ea6d583.jpg', category: 'Soups & Swallows' },

    { id: 'meat-pie-ng', name: 'Gourmet Meat Pie', price: 6.00, desc: 'Flaky pastry filled with seasoned minced beef, carrots, and potatoes.', size: 'Single', icon: 'Package', image: 'https://i.pinimg.com/1200x/d1/66/00/d16600f2a328617ae97953cc22905529.jpg', category: 'Short Eats' },
    { id: 'chicken-pie-ng', name: 'Savory Chicken Pie', price: 6.50, desc: 'Rich chicken, vegetables, and creamy sauce filling in a buttery crust.', size: 'Single', icon: 'Package', image: 'https://i.pinimg.com/1200x/a4/08/23/a40823f1ea7e1ad3e2fa0a139477dbcb.jpg', category: 'Short Eats' },
    { id: 'sausage-roll-ng', name: 'Puff Sausage Roll', price: 4.50, desc: 'Seasoned sausage wrapped in light, layered puff puff pastry.', size: 'Single', icon: 'Package', image: 'https://i.pinimg.com/1200x/7f/13/b0/7f13b0698aaef23f6d57d3b37190e7ef.jpg', category: 'Short Eats' },
    { id: 'egg-roll-ng', name: 'Nigerian Egg Roll', price: 4.00, desc: 'Hard-boiled egg wrapped in slightly sweet, thick dough and deep-fried.', size: 'Single', icon: 'Utensils', image: 'https://i.pinimg.com/736x/d7/c1/b1/d7c1b148ce1f86342266d48f3fc53a49.jpg', category: 'Short Eats' },
    { id: 'puff-puff-ng', name: 'Puff Puff (Sweet Dough Balls)', price: 3.50, desc: '6 pieces of soft, spongy, deep-fried sweet dough.', size: '6 Pcs', icon: 'Utensils', image: 'https://i.pinimg.com/736x/5a/68/45/5a68454beba5ac245c8beecfdf393611.jpg', category: 'Short Eats' },
    { id: 'moi-moi-ng', name: 'Moi-Moi (Steamed Bean Pudding)', price: 7.00, desc: 'Steamed bean pudding blended with pepper and onion, with optional fish.', size: 'Single', icon: 'Package', image: 'https://i.pinimg.com/736x/b9/b7/84/b9b784ff09eda811125cd4f874a74b1c.jpg', category: 'Short Eats' },
    { id: 'spring-rolls-ng', name: 'Meat & Veggie Spring Rolls', price: 5.50, desc: 'Crispy rolls filled with shredded beef, cabbage, and carrots.', size: '3 Pcs', icon: 'Utensils', image: 'https://i.pinimg.com/736x/dc/11/9a/dc119afe0fac2f1ca8ec9982159bf931.jpg', category: 'Short Eats' },
    { id: 'samosa-ng', name: 'Spicy Beef Samosa', price: 5.00, desc: 'Triangular pastry pocket filled with seasoned minced beef and peas.', size: '3 Pcs', icon: 'Utensils', image: 'https://i.pinimg.com/1200x/50/df/f3/50dff3e034ff1351e91bedfd502dde4d.jpg', category: 'Short Eats' },
    { id: 'akara-ng', name: 'Akara (Bean Fritters)', price: 4.00, desc: 'Deep-fried bean paste fritters, best served with Akamu or fresh bread.', size: '5 Pcs', icon: 'Utensils', image: 'https://i.pinimg.com/1200x/40/11/a4/4011a420bc865a5881dd7146a8c4e20d.jpg', category: 'Short Eats' },
    { id: 'fried-yam', name: 'Fried Yam & Sauce', price: 8.50, desc: 'Crispy fried yam slices served with a light pepper and onion sauce.', size: 'Plate', icon: 'Utensils', image: 'https://i.pinimg.com/736x/09/9b/36/099b36a49d219c7dfe33d93cb21785d0.jpg', category: 'Short Eats' },
    { id: 'asun', name: 'Asun (Spicy Goat Meat)', price: 15.00, desc: 'Diced goat meat, roasted and sautéed in a fiery mix of peppers.', size: 'Small Bowl', icon: 'Star', image: 'https://i.pinimg.com/1200x/6c/91/08/6c9108c533853d39fb76656f25e33289.jpg', category: 'Short Eats' },
    { id: 'bbq-chicken', name: 'BBQ Chicken Wings', price: 12.00, desc: '3 juicy chicken wings grilled and coated in a smoky BBQ sauce.', size: '3 Pcs', icon: 'Utensils', image: 'https://i.pinimg.com/736x/2b/1d/04/2b1d04afb108761e42798d5037472345.jpg', category: 'Short Eats' },
    { id: 'kosai-ng', name: 'Kosai (African Doughnut)', price: 3.00, desc: 'A slightly savory, deep-fried puff similar to Ghanaian Bofrot.', size: '3 Pcs', icon: 'Utensils', image: 'https://i.pinimg.com/1200x/34/ac/2b/34ac2bf022114f8d22d7ddbd17cf0359.jpg', category: 'Short Eats' },
];

const CATEGORY_GROUPS = ['Nigerian Staples', 'Soups & Swallows', 'Short Eats'];
const ALL_CATEGORIES = ['All Quick Meals', ...CATEGORY_GROUPS];

const getItemDetails = (id) => {
    return MENU_ITEMS.find(item => item.id === id);
};
const allRecipes = MENU_ITEMS; 

const ICON_MAP = {
    Cake: Cake, Package: Package, Utensils: Utensils, ShoppingCart: ShoppingCart, 
    X: X, Plus: Plus, Minus: Minus, Send: Send, Loader2: Loader2, Euro: Euro, 
    Zap: Zap, Filter: Filter, User: User, Coffee: Coffee, Star: Star, Croissant: Croissant,
    Clock: Clock, ClipboardList: ClipboardList, Check: Check, ChefHat: ChefHat, Soup: Soup, Drumstick: Drumstick
};

const ProductCard = ({ item, addToCart }) => {
    const [isAdded, setIsAdded] = useState(false);
    const IconComponent = ICON_MAP[item.icon] || Utensils;

    const handleAddToCart = () => {
        addToCart(item);
        setIsAdded(true);
        const timer = setTimeout(() => setIsAdded(false), 800);
        return () => clearTimeout(timer);
    };

    return (
        <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col transition duration-300 hover:shadow-2xl hover:shadow-orange-900/20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="relative h-48">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/B85F18/FFFFFF?text=Quick+Meal'; }}
                />
                <div className="absolute top-3 right-3 bg-red-800 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg flex items-center">
                    <Euro className="w-4 h-4 mr-1"/>{item.price.toFixed(2)}
                </div>
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-700/80 text-red-800 dark:text-orange-300 text-sm font-semibold p-2 rounded-full shadow-lg flex items-center">
                    <IconComponent className="w-4 h-4"/>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-gray-100 mb-2">{item.name}</h3>
                <p className="text-xs font-medium text-red-800 dark:text-orange-400 mb-2 uppercase tracking-wider">{item.category} &middot; {item.size}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-2">{item.desc}</p>
                
                <motion.button
                    onClick={handleAddToCart}
                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center transition duration-300 shadow-md mt-auto
                        ${isAdded 
                            ? 'bg-red-800 text-white shadow-red-800/50'
                            : 'bg-slate-800 text-orange-200 hover:bg-slate-700 shadow-slate-800/30'
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
                                <Plus className="w-5 h-5 mr-2" /> Order Now
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- UTILITY COMPONENT: CART SIDEBAR ---

const CartSidebar = ({ isVisible, cart, setCart, handleCheckout, isCheckingOut, setIsCartOpen }) => {
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);

    const updateQuantity = (id, change) => {
        setCart(prev => {
            const newCart = { ...prev };
            const currentQuantity = newCart[id]?.quantity || 0;
            
            if (currentQuantity + change <= 0) {
                delete newCart[id];
            } else {
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

    const cartIsEmpty = totalItems === 0;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[60]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-slate-900/80" onClick={() => setIsCartOpen(false)}></div>

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
                                <ShoppingCart className="w-7 h-7 mr-3 text-red-800 dark:text-orange-400" /> 
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
                                    <ChefHat className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                                    <p className="font-semibold text-xl">Your basket is empty.</p>
                                    <p className="text-sm mt-1">Add a delicious African meal to start your order.</p>
                                </div>
                            ) : (
                                Object.entries(cart).map(([id, item]) => (
                                    <motion.div 
                                        key={id}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg shadow-sm border border-orange-100 dark:border-slate-700"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                    >
                                        <div className="flex-grow pr-3">
                                            <p className="font-semibold text-slate-800 dark:text-white text-lg">{item.name}</p>
                                            <p className="text-sm text-red-800 dark:text-orange-400"><Euro className="w-3 h-3 inline-block" />{item.price.toFixed(2)} ea.</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => updateQuantity(id, -1)} 
                                                className="p-1 bg-orange-100 dark:bg-orange-900/50 text-red-800 dark:text-orange-300 rounded-full hover:bg-orange-200 transition"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold w-5 text-center text-slate-800 dark:text-white">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(id, 1)} 
                                                className="p-1 bg-red-800 text-white rounded-full hover:bg-red-900 transition"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-900">
                            <div className="flex justify-between text-2xl font-serif font-extrabold mb-5 text-slate-800 dark:text-white">
                                <span>Order Total:</span>
                                <span className="flex items-center"><Euro className="w-6 h-6 mr-1" />{subtotal.toFixed(2)}</span>
                            </div>
                            <motion.button
                                onClick={handleCheckout}
                                disabled={cartIsEmpty || isCheckingOut}
                                className={`w-full py-4 text-xl font-bold rounded-xl flex items-center justify-center transition duration-300 shadow-xl
                                    ${cartIsEmpty || isCheckingOut 
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                                        : 'bg-red-800 text-white hover:bg-red-900 focus:ring-4 focus:ring-red-500/50'
                                    }`}
                                whileHover={!cartIsEmpty && !isCheckingOut ? { scale: 1.01 } : {}}
                                whileTap={!cartIsEmpty && !isCheckingOut ? { scale: 0.98 } : {}}
                            >
                                {isCheckingOut ? (
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                ) : (
                                    <Send className="w-6 h-6 mr-3" />
                                )}
                                {isCheckingOut ? 'Finalizing Order...' : 'Request Order'}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const MobileDrawerFilter = ({ isVisible, selectedCategory, setSelectedCategory, setIsFilterDrawerOpen }) => {
    const viewCategories = ALL_CATEGORIES;
    
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsFilterDrawerOpen(false);
    }
    
    const getDisplayCategory = (category) => {
        return category === 'All Products' ? 'All Quick Meals' : category;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[60]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-slate-900/80" onClick={() => setIsFilterDrawerOpen(false)}></div>

                    <motion.div
                        className="fixed left-0 top-0 w-full md:w-[20rem] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-[70]"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white flex items-center">
                                <Filter className="w-7 h-7 mr-3 text-red-800 dark:text-orange-400" /> 
                                Meal Filters
                            </h2>
                            <motion.button 
                                onClick={() => setIsFilterDrawerOpen(false)}
                                className="p-2 rounded-full text-gray-500 hover:text-slate-800 dark:text-gray-300 dark:hover:text-white transition bg-gray-100 dark:bg-slate-700"
                                whileHover={{ rotate: -90 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-3">
                            {ALL_CATEGORIES.map(category => (
                                <motion.button
                                    key={category}
                                    onClick={() => handleCategorySelect(category === 'All Quick Meals' ? 'All Products' : category)} 
                                    className={`w-full text-left py-3 px-4 rounded-lg font-semibold flex items-center transition duration-200 border-2
                                        ${(selectedCategory === category) || (selectedCategory === 'All Products' && category === 'All Quick Meals')
                                            ? 'bg-red-800 text-white border-red-800 shadow-md'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border-gray-300 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ClipboardList className="w-5 h-5 mr-3"/> {getDisplayCategory(category)}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const App = () => {
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [dbInstance, setDbInstance] = useState(null);
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false); 

    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

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
                        setUserId(crypto.randomUUID());
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
    
    const handleCheckout = async () => {
        if (totalItems === 0 || !userId || !dbInstance || isCheckingOut) return;

        setIsCheckingOut(true);
        setStatusMessage('');

        const orderDetails = Object.entries(cart).map(([id, item]) => ({
            itemId: id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.quantity * item.price
        }));

        const totalCost = orderDetails.reduce((sum, item) => sum + item.totalPrice, 0);

        const orderData = {
            userId: userId,
            status: 'New',
            timestamp: serverTimestamp(),
            appId: appId,
            totalItems: totalItems,
            totalCost: totalCost,
            items: orderDetails, 
        };

        try {
            const userOrdersCollectionRef = collection(dbInstance, 'artifacts', appId, 'users', userId, 'bakery_orders');
            await addDoc(userOrdersCollectionRef, orderData);
            
            setStatusMessage(`Order successfully placed! You ordered ${totalItems} items for €${totalCost.toFixed(2)}.`);
            setCart({});
            setIsCartOpen(false);

        } catch (error) {
            console.error("Error placing order:", error);
            setStatusMessage('Error: Failed to place order. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'All Products') {
            return allRecipes;
        }
        return allRecipes.filter(item => item.category === selectedCategory);
    }, [selectedCategory]);

    const groupedItems = useMemo(() => {
        if (selectedCategory !== 'All Products') {
            return {};
        }
        return filteredItems.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
        }, {});
    }, [filteredItems, selectedCategory]);


    const mainTitle = selectedCategory === 'All Products' 
        ? 'Meals Menu'
        : `${selectedCategory} Menu`;


    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-slate-950" style={{ backgroundColor: LIGHT_BG_COLOR }}>
                <Loader2 className="w-10 h-10 text-red-700 animate-spin mr-4" />
                <p className="text-xl font-serif text-slate-800 dark:text-orange-200">Preparing the Quick Meals...</p>
            </div>
        );
    }
    
    return (
        <div 
            className="min-h-screen font-sans text-slate-800 dark:text-gray-100" 
        >
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

            <motion.button
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-slate-800 text-orange-200 rounded-full shadow-2xl shadow-slate-900/40 flex items-center transition duration-200 hover:bg-slate-700 hover:scale-105"
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

            <header 
                className="relative pt-20 pb-16 md:pt-28 md:pb-24 shadow-lg overflow-hidden z-20"
                style={{ 
                    backgroundImage: `url(${HERO_IMAGE_URL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>

                <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center p-6 sm:p-10">
                    <h1 className="text-4xl sm:text-6xl font-extrabold font-serif text-white drop-shadow-2xl tracking-tight">
                        Afro-Fusion Kitchen
                    </h1>
                    <p className="text-xl text-gray-300 mt-2 font-light italic border-l-4 border-amber-500 pl-4">
                        Authentic Nigerian & African Quick Meals
                    </p>
                </div>
            </header>

            <main className="py-10 md:py-16 bg-inherit dark:bg-inherit">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
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

                    <div className="mb-10 flex justify-between items-center">
                        <h2 className="text-3xl font-serif font-extrabold text-slate-800 dark:text-white flex items-center">
                            <ChefHat className="w-6 h-6 text-red-800 mr-3 dark:text-orange-400" />
                            {mainTitle}
                        </h2>
                        
                        <motion.button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className="flex items-center space-x-2 px-5 py-2 bg-red-800 text-white rounded-full font-semibold transition duration-200 hover:bg-red-900 shadow-lg shadow-red-800/30"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Open Category Filter"
                        >
                            <Filter className="w-5 h-5"/>
                            <span className="hidden sm:inline">Change Category</span>
                            <span className="sm:hidden">Filter</span>
                        </motion.button>
                    </div>

                    {selectedCategory !== 'All Products' && (
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
                    )}
                    
                    {selectedCategory === 'All Products' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                            {Object.keys(groupedItems).map(category => (
                                <section key={category}>
                                    <h3 className="text-3xl font-serif font-extrabold text-slate-800 dark:text-white mb-6 p-3 border-l-4 border-red-800 pl-4 bg-orange-50 dark:bg-slate-700 rounded-md shadow-inner shadow-red-100 dark:shadow-none">
                                        {category}
                                        {category === 'Nigerian Staples' && <span className="ml-3 text-lg text-red-700 dark:text-orange-300 font-sans font-normal">(Rice, Beans & Swallows)</span>}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-8">
                                        <AnimatePresence>
                                            {groupedItems[category].map(item => (
                                                <ProductCard 
                                                    key={item.id} 
                                                    item={item} 
                                                    addToCart={addToCart} 
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </section>
                            ))}
                        </motion.div>
                    )}

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                            <Utensils className="w-16 h-16 mx-auto mb-4 text-red-600" />
                            <p className="text-2xl font-serif">No meals match this selection yet!</p>
                            <p className="mt-2">Please select 'All Quick Meals' or try a different category.</p>
                        </div>
                    )}

                </div>
            </main>

            <MobileDrawerFilter
                isVisible={isFilterDrawerOpen}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setIsFilterDrawerOpen={setIsFilterDrawerOpen}
            />

            <CartSidebar 
                isVisible={isCartOpen}
                cart={cart}
                setCart={setCart}
                handleCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
                setIsCartOpen={setIsCartOpen}
            />
        </div>
    );
}

export default App;
