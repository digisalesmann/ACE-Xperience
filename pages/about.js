'use client'

import React from 'react'
import Link from 'next/link'
import {
    Utensils,
    ChefHat,
    Feather,
    Sparkles,
    Users,
    ChevronRight,
    Heart,
    BookOpen,
    PlayCircle,
    Handshake, 
} from 'lucide-react'


// =================================================================
// --- Data Definitions (Unchanged) ---
// =================================================================

const brandPillars = [
    { icon: Sparkles, title: 'Flavor as Art', text: 'We prioritize deep, complex flavor profiles, turning simple meals into gourmet experiences.' },
    { icon: Users, title: 'Community & Sharing', text: 'Food connects us. We champion shared meals and encourage home chefs to share their unique kitchen stories.' },
    { icon: ChefHat, title: 'Sophisticated Simplicity', text: 'Our recipes maintain elegance but are broken down into easy, accessible steps for every skill level.' },
    { icon: Feather, title: 'Creative Mastery', text: 'We encourage experimentation. The kitchen is your laboratory, learn the rules, then break them beautifully.' },
];

const mediaWallItems = [
    // --- VIDEOS (3) ---
    { type: 'video', src: 'videos/burger.mp4', alt: 'A quick cooking montage.', span: 'lg:col-span-2 lg:row-span-2', ratio: 'h-96' },
    { type: 'video', src: 'videos/food.mp4', alt: 'Close-up of chef dicing.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/kitchen.mp4', alt: 'Bread rising time-lapse.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/fufu.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vid1.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vid2.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vid3.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vid4.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vid5.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vid6.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vid7.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vid8.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vid9.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vo1.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-2 lg:row-span-2', ratio: 'h-96' },
    { type: 'video', src: 'videos/vo2.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vo3.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vo4.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vo5.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vo6.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vo7.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vo8.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vo9.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vo10.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vo11.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vo12.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vo13.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'video', src: 'videos/vo14.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-96' },
    { type: 'video', src: 'videos/vo15.mp4', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    // --- IMAGES (10) ---
    { type: 'image', src: 'https://i.pinimg.com/1200x/21/72/f0/2172f0a44176e49820617bebfd4f9f00.jpg', alt: 'Perfectly proofed artisan bread dough.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/60/2d/7f/602d7f10c52ac1ed9dd7563a526fe719.jpg', alt: 'Colorful array of kitchen spices in jars.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: 'https://i.pinimg.com/736x/23/66/72/23667274f808e96201af6c92a610a055.jpg', alt: 'Two pairs of hands preparing dough together.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: 'https://i.pinimg.com/736x/fd/5e/bc/fd5ebcdcb2b9ec8b079700ca4e7ed191.jpg', alt: 'Close-up of whisking eggs for pastry.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/cc/82/42/cc82428b40b0511291045ead9d7c84eb.jpg', alt: 'A rich sauce simmering on the stove.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: 'https://i.pinimg.com/736x/39/59/e9/3959e9506009a83f579bc7c113f6acc0.jpg', alt: 'Hand pouring olive oil into a pan.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/01/38/37/01383771e21d5c68932f410ee98608e2.jpg', alt: 'Measuring precise amounts of flour.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: 'https://i.pinimg.com/1200x/48/c4/48/48c44829c407cb6880aaa22c7acf1e8b.jpg', alt: 'Fresh cookies cooling on a wire rack.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/pic1.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po1.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po2.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po3.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po4.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po5.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po6.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po7.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po8.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po9.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po10.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po11.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po12.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po13.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po14.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po15.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po16.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po17.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po18.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po19.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po20.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po21.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po22.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
    { type: 'image', src: '/images/po23.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-94' },
    { type: 'image', src: '/images/po24.jpg', alt: 'Cook with Wendy.', span: 'lg:col-span-1 lg:row-span-1', ratio: 'h-64' },
].sort(() => Math.random() - 0.5); 

// --- MEDIA WALL COMPONENT (Updated to use <video> for local files) ---
const MediaItem = ({ item }) => (
    <div className={`group relative w-full ${item.ratio} ${item.span} rounded-xl overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-4xl transform hover:scale-[1.03]`}>
        {item.type === 'video' ? (
            // **REVISION START: Using <video> tag for proper full-cover behavior**
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <video
                    src={item.src}
                    title={item.alt}
                    // These classes ensure the video fills the container, maintaining aspect ratio.
                    className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-100 opacity-90"
                    autoPlay
                    loop // Videos on a media wall often loop
                    muted // autoplay requires muted
                    playsInline
                    controls // Added controls so users can pause/play if needed
                />
                
                {/* The play button overlay is now redundant with the native controls, 
                    but we'll keep it hidden via the `controls` attribute above. 
                    If you prefer a custom play button, remove `controls` from <video> 
                    and keep the PlayCircle below. */}
                {/* <PlayCircle className="absolute w-16 h-16 text-white/80 transition-opacity duration-500 group-hover:opacity-0" /> */}
            </div>
            // **REVISION END**
        ) : (
            <img 
                src={item.src} 
                alt={item.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
            />
        )}
    </div>
);


// ===============================
// --- Main About Page Component ---
// ===============================

const AboutPage = () => {
    // REMOVED: useState(isClient) and useEffect for Hydration Fix
    
    // Text for the Typewriter Effect (Now used for a smooth reveal)
    const typewriterText = "Ace Xperience was born from my kitchen, archiving soulful family recipes and turning them into accessible lessons. This is my invitation to share the journey of transforming simple ingredients into memorable moments.";
    
    return (
        <div className="min-h-screen bg-amber-50/50 dark:bg-gray-950 py-16 sm:py-24">
            <style jsx global>{`
                /* ---------------------------------- */
                /* Hydration-Safe Staggered Reveal Animation */
                /* ---------------------------------- */
                @keyframes fadeInSlide {
                    0% { transform: translateY(10px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                .animate-stagger-reveal {
                    animation: fadeInSlide 0.8s ease-out forwards;
                    opacity: 0; /* Hidden initially on both server/client */
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 sm:space-y-40">

                {/* 1. PERSONAL HERO INTRODUCTION (Staggered Reveal) */}
                <header className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                    
                    {/* Founder Picture (2/5 width) */}
                    <div className="lg:col-span-2 w-full h-96 sm:h-[500px] rounded-2xl overflow-hidden shadow-4xl border-4 border-red-600/50 animate-stagger-reveal" style={{ animationDelay: '0.1s' }}>
                        <img 
                            src="/images/cool.jpg" 
                            alt="The Founder and Chef of Ace Xperience, Wendy C." 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    {/* Animated Intro Text (3/5 width) */}
                    <div className="lg:col-span-3 space-y-6">
                        <p className="text-xl font-semibold uppercase text-red-600 dark:text-red-400 tracking-[0.3em] mb-2 animate-stagger-reveal" style={{ animationDelay: '00.3s' }}>
                            
                            <span className="flex items-start">
                                <Handshake className="w-6 h-6 mr-3 flex-shrink-0" /> 
                                <span className="block">A WARM WELCOME FROM ME</span>
                            </span>
                        </p>
                        <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white font-serif leading-tight animate-stagger-reveal" style={{ animationDelay: '0.5s' }}>
                            Hi, I'm Wendy. <br className='hidden sm:inline'/> Let's Cook Together.
                        </h1>
                        
                        {/* Typewriter content uses the smooth fade-in reveal */}
                        <p 
                            className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed pt-4 animate-stagger-reveal"
                            style={{ animationDelay: '0.7s' }}
                        >
                            {/* Content is rendered directly, ensuring hydration match */}
                            {typewriterText}
                        </p>

                        <p className="text-lg text-red-600 dark:text-red-400 font-bold pt-4 animate-stagger-reveal" style={{ animationDelay: '00.9s' }}>
                            — Your Chef, Your Guide.
                        </p>
                    </div>
                </header>
                
                {/* 2. OUR STORY & THE ACE PROMISE (Split Section) */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    
                    {/* Storytelling Column (2/3 width) */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        <div className="space-y-6">
                            <h2 className="text-4xl font-extrabold font-serif text-gray-900 dark:text-white border-l-4 border-red-600 pl-4">
                                Our Origin: From Slow-Simmered Memories
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                Ace Xperience began with a passionate pursuit: to preserve and share the world's most soulful, authentic recipes. Our founder, Wendy C., recognized that the best food embodies heritage, from the comforting aroma of Nigerian jollof rice to the delicate texture of a French macaron. We blend that soulful heritage with modern, precise techniques.
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-amber-200 dark:border-gray-700 pl-4">
                                "The kitchen isn't just a room; it's a classroom, a playground, and a place where memories rise, just like the perfect loaf of bread."
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                             <h2 className="text-4xl font-extrabold font-serif text-gray-900 dark:text-white border-l-4 border-red-600 pl-4">
                                The Ace Promise: Mastery Made Memorable
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                We promise consistent excellence. We provide the most detailed, science-backed guides, ensuring you don't just follow steps, but understand why they work. Say goodbye to guesswork and hello to mastering complex techniques with ease. Every recipe here is a perfect balance of deep comfort and sophisticated execution.
                            </p>
                        </div>
                    </div>
                    
                    {/* Founder/Image Column (1/3 width) - Secondary Image */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="h-96 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02] border-4 border-amber-500/50">
                            <img src="https://i.pinimg.com/736x/33/c6/2a/33c62abc89266c6ffeccce879bf1e128.jpg" alt="Founder working in a professional kitchen." className="w-full h-full object-cover" />
                        </div>
                    </div>
                </section>

                {/* 3. CORE PHILOSOPHY PILLARS */}
                <section className="text-center">
                    <h2 className="text-4xl font-extrabold font-serif text-gray-900 dark:text-white mb-16">
                        Our Values: The Foundation of Good Food
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {brandPillars.map((pillar, index) => {
                            const IconComponent = pillar.icon;
                            return (
                                <div 
                                    key={index} 
                                    className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-b-4 hover:border-red-600 border-b-4 border-amber-500 transform hover:-translate-y-1 dark:border-gray-700"
                                >
                                    <div className="mb-4 flex justify-center">
                                        <IconComponent className="w-12 h-12 text-red-600 dark:text-red-400 transition-colors group-hover:text-amber-600" />
                                    </div>
                                    <h3 className="text-xl font-bold font-serif text-gray-900 dark:text-white mb-3">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                        {pillar.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 4. MEDIA WALL (10 Images + 3 Videos) */}
                <section className="space-y-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-extrabold font-serif text-gray-900 dark:text-white mb-6">
                            A Peek Inside Our Kitchen Moments
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
                            Where passion meets the plate: explore the colors, textures, and precise moments that define the Ace Xperience.
                        </p>
                    </div>
                    
                    {/* Elegant, Staggered Grid for 13 items (Fully Responsive) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mediaWallItems.map((item, index) => (
                            <MediaItem item={item} key={index} />
                        ))}
                    </div>
                </section>


                {/* 5. JOIN THE JOURNEY / FINAL CTA (Responsive Fix) */}
                <section className="bg-amber-600 dark:bg-amber-900 p-8 sm:p-14 rounded-3xl shadow-4xl text-center">
                  <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white mb-3 sm:mb-4">
                    Ready to Start Whisking Up Joy?
                  </h2>
                  <p className="text-base sm:text-xl text-amber-100 dark:text-amber-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Join our growing community of flavor explorers. Try a new recipe, share your kitchen story, or subscribe for weekly inspiration delivered straight to your inbox.
                  </p>
                  <Link
                    href="/subscribe"
                    className="inline-flex items-center justify-center px-6 sm:px-10 py-2.5 sm:py-4 text-sm sm:text-xl font-extrabold bg-red-600 text-white rounded-full shadow-lg transition duration-300 hover:bg-red-700 transform active:scale-[0.98] ring-4 ring-white/40"
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" /> Get Weekly Inspiration
                  </Link>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;