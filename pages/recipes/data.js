// data.js

import { 
    Utensils, Zap, Cake, Soup, Coffee, XCircle, 
    TrendingUp, TrendingDown, Clock, Lightbulb, ChefHat, Star, Timer
} from 'lucide-react'

// --- Utility Icons Map ---
export const ICON_MAP = {
    Search: Zap, // Using Zap for quick/dynamic
    Utensils,
    Cake,
    Soup,
    Coffee,
    XCircle,
    TrendingUp,
    TrendingDown,
    Clock,
    Lightbulb,
    ChefHat,
    Star,
    Timer,
}

// --- Filter Data Definitions ---
export const categories = [
    { name: "All Recipes", filter: null, icon: Utensils },
    { name: "Main Dishes", filter: "Main Dish", icon: ChefHat },
    { name: "Bakes & Pastries", filter: "Baking", icon: Cake },
    { name: "Snacks & Appetizers", filter: "Snacks", icon: Coffee },
    { name: "Sides & Staples", filter: "Side Dish", icon: Zap },
]

export const difficulties = [
    { name: "All Levels", filter: null, icon: Clock },
    { name: "Easy", filter: "Easy", icon: TrendingDown },
    { name: "Medium", filter: "Medium", icon: TrendingUp },
    { name: "Advanced", filter: "Hard", icon: Lightbulb },
]

// --- Mock Recipe Data ---
export const allRecipes = [
    // Bakes & Pastries (Total: 8)
    { id: 1, title: "Classic Meat Pie", category: "Baking", prepTime: "30 min", cookTime: "1 hr", tags: ["Savoury", "Snack", "Beef"], image: "meatpie.jpg", slug: "classic-meat-pie", excerpt: "Flaky crust enclosing perfectly seasoned savory beef filling. A comforting classic.", rating: 4.8, difficulty: "Medium" },
    { id: 2, title: "Creamy Chicken Pie", category: "Baking", prepTime: "35 min", cookTime: "1 hr 15 min", tags: ["Savoury", "Dinner", "Chicken"], image: "piee.jpg", slug: "creamy-chicken-pie", excerpt: "Tender chicken in a rich, velvety cream sauce, baked under a golden puff pastry.", rating: 4.5, difficulty: "Medium" },
    { id: 3, title: "Artisan Sourdough Bread", category: "Baking", prepTime: "20 min", cookTime: "4 hr", tags: ["Bread", "Vegan", "Fermented"], image: "sour.jpg", slug: "sourdough-bread", excerpt: "Achieve the perfect open crumb and signature tangy flavor with this method.", rating: 4.9, difficulty: "Hard" },
    { id: 4, title: "Moist Banana Bread", category: "Baking", prepTime: "15 min", cookTime: "50 min", tags: ["Bread", "Sweet", "Quick"], image: "moist.jpg", slug: "banana-bread", excerpt: "Simple, moist, and spiced. The best way to use up those ripe bananas!", rating: 4.7, difficulty: "Easy" },
    { id: 5, title: "Vanilla Cupcakes", category: "Baking", prepTime: "20 min", cookTime: "25 min", tags: ["Sweet", "Dessert", "Party"], image: "cup.jpg", slug: "vanilla-cupcakes", excerpt: "Light, airy vanilla sponge topped with fluffy buttercream. A foolproof basic.", rating: 4.4, difficulty: "Easy" },
    { id: 6, title: "Rich Chocolate Cake", category: "Baking", prepTime: "40 min", cookTime: "1 hr 10 min", tags: ["Sweet", "Celebration", "Decadent"], image: "cake.jpg", slug: "chocolate-cake", excerpt: "Intensely dark and fudgy cake with a rich ganache. Perfect for special occasions.", rating: 4.9, difficulty: "Medium" },
    { id: 7, title: "Fluffy Donuts", category: "Baking", prepTime: "45 min", cookTime: "30 min", tags: ["Sweet", "Snack", "Fried"], image: "donut.jpg", slug: "fluffy-donuts", excerpt: "Yeast-risen dough, fried to a perfect golden brown, ready for glazing or dusting.", rating: 4.3, difficulty: "Medium" },
    { id: 8, title: "Savory Sausage Rolls", category: "Baking", prepTime: "20 min", cookTime: "40 min", tags: ["Savoury", "Snack", "Pork"], image: "rolls.jpg", slug: "sausage-rolls", excerpt: "Juicy, spiced sausage meat wrapped in golden puff pastry. Excellent appetizer.", rating: 4.6, difficulty: "Easy" },
    
    // Snacks & Finger Foods (Total: 3)
    { id: 9, title: "Yogurt Parfait", category: "Snacks", prepTime: "10 min", cookTime: "0 min", tags: ["Healthy", "Breakfast", "No-Cook"], image: "parf.jpg", slug: "yogurt-parfait", excerpt: "Layers of Greek yogurt, berries, and crunchy granola. Quick and nutritious.", rating: 4.2, difficulty: "Easy" },
    { id: 10, title: "Crispy Egg Rolls", category: "Snacks", prepTime: "40 min", cookTime: "20 min", tags: ["Appetizer", "Fried", "Vegetable"], image: "egg.jpg", slug: "crispy-egg-rolls", excerpt: "Classic Asian appetizer with a perfect crunch and savory filling.", rating: 4.5, difficulty: "Medium" },
    { id: 11, title: "Spicy Puff Puff", category: "Snacks", prepTime: "1 hr", cookTime: "25 min", tags: ["Fried", "Dessert", "West African"], image: "puff.jpg", slug: "spicy-puff-puff", excerpt: "Soft, spongy, yeast-risen dough balls, lightly spiced and fried. A favorite street snack.", rating: 4.1, difficulty: "Medium" },
    
    // Main Dishes & Sides (Total: 14)
    { id: 12, title: "Steamed Moi Moi", category: "Main Dish", prepTime: "30 min", cookTime: "1 hr", tags: ["Traditional", "Healthy", "Vegan Option"], image: "moimoi.jpg", slug: "moi-moi", excerpt: "Nutritious pudding made from steamed ground beans, often paired with Jollof or rice.", rating: 4.7, difficulty: "Hard" },
    { id: 13, title: "Party Jollof Rice", category: "Main Dish", prepTime: "45 min", cookTime: "1 hr 15 min", tags: ["Rice", "Traditional", "Celebration"], image: "jollof.jpg", slug: "party-jollof-rice", excerpt: "The iconic smoky, spiced tomato-based rice. Master the perfect party recipe.", rating: 5.0, difficulty: "Medium" },
    { id: 14, title: "Asun Jollof Fusion", category: "Main Dish", prepTime: "1 hr", cookTime: "1 hr 30 min", tags: ["Spicy", "Fusion", "Goat Meat"], image: "asun.jpg", slug: "asun-jollof", excerpt: "Jollof rice combined with spicy, grilled goat meat (Asun). Bold and complex flavors.", rating: 4.8, difficulty: "Hard" },
    { id: 15, title: "Beans and Ripe Plantain", category: "Main Dish", prepTime: "10 min", cookTime: "45 min", tags: ["Traditional", "Vegan", "Comfort"], image: "beans.jpg", slug: "beans-plantain", excerpt: "Hearty beans and sweet fried plantain (Dodo) cooked in a rich, palm oil sauce.", rating: 4.3, difficulty: "Easy" },
    { id: 16, title: "Spicy Gizzdodo", category: "Side Dish", prepTime: "20 min", cookTime: "30 min", tags: ["Spicy", "Appetizer", "Chicken Gizzard"], image: "gizz.jpg", slug: "gizzdodo", excerpt: "A fantastic mix of fried gizzard and sweet plantain pieces tossed in pepper sauce.", rating: 4.6, difficulty: "Medium" },
    { id: 17, title: "Classic Tomato Stew", category: "Side Dish", prepTime: "20 min", cookTime: "1 hr", tags: ["Sauce", "Staple", "Freezable"], image: "toma.jpg", slug: "tomato-stew", excerpt: "The foundational Nigerian stew. Versatile and essential for pairing with staples.", rating: 4.7, difficulty: "Easy" },
    { id: 18, title: "Simple White Rice", category: "Side Dish", prepTime: "5 min", cookTime: "25 min", tags: ["Staple", "Quick", "Basic"], image: "rice.jpg", slug: "white-rice", excerpt: "Tips and tricks for perfectly fluffy, non-sticky white rice every time.", rating: 4.1, difficulty: "Easy" },
    { id: 19, title: "Perfect Fried Rice", category: "Main Dish", prepTime: "30 min", cookTime: "40 min", tags: ["Rice", "Quick", "Vegetarian"], image: "fried.jpg", slug: "fried-rice", excerpt: "An easy, flavorful dish with mixed vegetables, protein, and a touch of soy sauce.", rating: 4.5, difficulty: "Medium" },
    { id: 20, title: "Egusi Soup", category: "Main Dish", prepTime: "40 min", cookTime: "1 hr 20 min", tags: ["Soup", "Traditional", "Heavy"], image: "egusi.jpg", slug: "egusi-soup", excerpt: "A popular rich soup made from ground melon seeds and leafy vegetables.", rating: 4.9, difficulty: "Hard" },
    { id: 21, title: "Pancakes (Fluffy)", category: "Baking", prepTime: "10 min", cookTime: "15 min", tags: ["Breakfast", "Sweet", "Quick"], image: "pan.jpg", slug: "fluffy-pancakes", excerpt: "The ultimate recipe for thick, fluffy, American-style breakfast pancakes.", rating: 4.6, difficulty: "Easy" },
    { id: 22, title: "Fish Pepper Soup", category: "Main Dish", prepTime: "15 min", cookTime: "35 min", tags: ["Spicy", "Soup", "Light"], image: "fish.jpg", slug: "fish-pepper-soup", excerpt: "A light, intensely flavored, and spicy broth with fresh fish. Perfect for chilly evenings.", rating: 4.7, difficulty: "Medium" },
    { id: 23, title: "Garlic Parmesan Rolls", category: "Baking", prepTime: "30 min", cookTime: "20 min", tags: ["Bread", "Savoury", "Side"], image: "garlic.jpg", slug: "garlic-parmesan-rolls", excerpt: "Soft, warm rolls drenched in garlic butter and Parmesan cheese. Highly addictive.", rating: 4.5, difficulty: "Easy" },
    { id: 24, title: "Grilled Tilapia", category: "Main Dish", prepTime: "15 min", cookTime: "25 min", tags: ["Seafood", "Healthy", "Quick"], image: "tilapia.jpg", slug: "grilled-tilapia", excerpt: "Whole tilapia marinated in African spices and grilled until smoky and tender.", rating: 4.8, difficulty: "Medium" },
    { id: 25, title: "Yam Porridge (Asaro)", category: "Main Dish", prepTime: "20 min", cookTime: "40 min", tags: ["Traditional", "Comfort", "Tuber"], image: "yam.jpg", slug: "yam-porridge", excerpt: "Creamy, tomato-based Nigerian porridge made with soft pounded yams.", rating: 4.4, difficulty: "Medium" },
]