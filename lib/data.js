/**
 * Mock data for the Wendilicious homepage.
 * This simulates data fetched from a database (like Firestore).
 */

export const featuredRecipes = [
  {
    id: 1,
    title: "Overnight Cinnamon Scones",
    slug: "overnight-cinnamon-scones",
    image: "/images/scones.jpg",
    time: "2h 15m",
    difficulty: "Medium",
    tags: ["Baking", "Breakfast", "Sweet"],
    excerpt: "Flaky, buttery scones prepped the night before for a perfect morning treat."
  },
  {
    id: 2,
    title: "Spicy Chorizo Tacos",
    slug: "spicy-chorizo-tacos",
    image: "/images/tacos.jpg",
    time: "35m",
    difficulty: "Easy",
    tags: ["Dinner", "Spicy", "Quick"],
    excerpt: "Quick, flavourful tacos with spicy chorizo and cooling avocado cream."
  },
  {
    id: 3,
    title: "Double Chocolate Cake",
    slug: "double-chocolate-cake",
    image: "/images/cake.jpg",
    time: "1h 30m",
    difficulty: "Medium",
    tags: ["Dessert", "Chocolate", "Baking"],
    excerpt: "The richest chocolate cake you will ever make, perfect for celebrations."
  },
  {
    id: 4,
    title: "Creamy Sun-Dried Tomato Pasta",
    slug: "creamy-tomato-pasta",
    image: "/images/pasta.jpg",
    time: "40m",
    difficulty: "Easy",
    tags: ["Dinner", "Vegetarian", "Quick"],
    excerpt: "A simple, luxurious pasta dish that comes together in under an hour."
  },
];

export const inspirationSections = [
  {
    title: "Weekend Baking",
    link: "/baking",
    image: "/images/cat-baking.jpg",
    description: "Dive into sourdough, pastries, and holiday sweets."
  },
  {
    title: "Quick Weeknight Meals",
    link: "/recipes?filter=quick",
    image: "/images/cat-quick.jpg",
    description: "Dinner on the table in under 30 minutes, without compromise."
  },
  {
    title: "Healthy & Wholesome",
    link: "/recipes?filter=healthy",
    image: "/images/cat-healthy.jpg",
    description: "Nourishing, light recipes that are big on flavour."
  },
];
