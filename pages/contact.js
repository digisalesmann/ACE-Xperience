import React, { useState, useCallback } from 'react';
// FIX: Using standard HTML <a> tag fallback for Link component due to environment compilation error
const Link = ({ href, children, className, onClick, ...props }) => (
    <a href={href} className={className} onClick={onClick} {...props}>{children}</a>
);

import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Send,
    User,
    AlertTriangle,
    CheckCircle,
    Clock,
    ChevronDown, 
    Youtube,
    Instagram,
    ChevronRight,
    Send as TikTok, 
    CircleDot, 
    Zap,
} from 'lucide-react';

// --- Contact Information Data (EXPANDED) ---
const contactInfo = [
    { icon: Mail, title: 'General Inquiries', detail: 'hello@aceXperience.com', link: 'mailto:hello@aceXperperience.com' },
    { icon: Phone, title: 'Customer Support', detail: '+1 (555) ACE-COOK', link: 'tel:+15552232665' },
    { icon: Clock, title: 'Support Hours', detail: 'Mon - Fri, 9:00 AM - 5:00 PM (WAT)', isInfo: true },
    { icon: MapPin, title: 'Press/Media', detail: 'media@aceXperience.com', link: 'mailto:media@aceXperience.com' },
];

// --- Social Media Links (NEW) ---
const socialLinks = [
    { icon: Instagram, name: 'Instagram', link: '#', color: 'text-pink-600' },
    { icon: Youtube, name: 'YouTube', link: '#', color: 'text-red-600' },
    { icon: CircleDot, name: 'Pinterest', link: '#', color: 'text-red-700' }, 
    { icon: TikTok, name: 'TikTok', link: '#', color: 'text-gray-800 dark:text-white' }, 
];

// --- Mock Form State and Validation ---
const initialFormState = {
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
};

const validateForm = (data) => {
    let errors = {};
    if (!data.name.trim()) errors.name = 'Name is required.';
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Valid email is required.';
    if (!data.message.trim() || data.message.length < 20) errors.message = 'Message must be at least 20 characters.';
    return errors;
};

const ContactPage = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(''); // 'success', 'error', 'submitting'

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        if (status) setStatus('');
    }, [status]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setStatus('error');
            return;
        }

        setStatus('submitting');
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        try {
            console.log('Form submitted:', formData);
            setStatus('success');
            setFormData(initialFormState);
            setErrors({});

        } catch (error) {
            console.error('Submission failed:', error);
            setStatus('error');
            setErrors({ general: 'Failed to send message. Please try again later.' });
        }
    };
    
    // Determine status message content
    const statusMessage = {
        success: { text: 'Message sent successfully! We will get back to you shortly.', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        error: { text: 'Please correct the errors in the form.', icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
        submitting: { text: 'Sending message...', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    }[status];

    return (
        <div className="min-h-screen bg-amber-50/50 dark:bg-gray-950">
            <style jsx global>{`
                /* Animated Hero Background: Lighter Brown/Amber */
                @keyframes slow-pulse {
                    0% { background-color: #A36B3B; } /* Lighter Amber Base */
                    50% { background-color: #C28253; } /* Brighter Amber */
                    100% { background-color: #A36B3B; }
                }
                .hero-animated-bg {
                    animation: slow-pulse 15s ease-in-out infinite alternate; /* Slower, gentler animation */
                }
            `}</style>
            
            {/* NEW: Hero Visual Section (Using Requested Design) */}
            <div className="relative w-full h-80 sm:h-96 overflow-hidden shadow-2xl mb-16 sm:mb-20 hero-animated-bg">
                {/* Background Image (Retained for visual texture) */}
                <img 
                    src="/images/contact_hero_kitchen.jpg" 
                    alt="A well-lit, clean kitchen counter with a notebook and phone." 
                    className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-5"
                />
                
                <div className="absolute inset-0 bg-black/50 dark:bg-black/60 flex items-center">
                    {/* CRITICAL: Applying the requested custom design for the Hero text block */}
                    <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center p-6 sm:p-10 text-left w-full">
                        
                        <p className="text-lg font-semibold uppercase text-amber-300 tracking-[0.4em] mb-3">
                            Questions? Partnership? Just Saying Hi?
                        </p>
                        <h1 className="text-4xl sm:text-6xl font-extrabold font-serif text-white drop-shadow-2xl tracking-tight">
                            Let's Connect.
                        </h1>
                        <p className="text-xl text-gray-300 mt-2 font-light italic border-l-4 border-amber-500 pl-4">
                            We&apos;d love to hear from you! Reach out with any questions or feedback.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Status Message Display */}
                {statusMessage && (
                    <div className={`max-w-3xl mx-auto p-4 rounded-lg shadow-md mb-8 ${statusMessage.color}`}>
                        <div className="flex items-center space-x-3">
                            <statusMessage.icon className="w-6 h-6 flex-shrink-0" />
                            <p className="font-medium">{statusMessage.text}</p>
                        </div>
                        {errors.general && <p className="mt-2 text-sm italic">{errors.general}</p>}
                    </div>
                )}

                {/* Main Content: Info Side-by-Side with Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16 pb-16 sm:pb-32">
                    
                    {/* Left Column: Contact Info & Socials (1/3 width) */}
                    <div className="lg:col-span-1 space-y-12">
                        
                        {/* Contact Information Cards (IMPROVED UI) */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-4 border-amber-500">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Phone className="w-6 h-6 mr-3 text-red-600" /> Contact Details
                            </h2>
                            <ul className="space-y-4">
                                {contactInfo.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <li key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-shadow duration-200 hover:shadow-md">
                                            <IconComponent className="w-5 h-5 mt-1 text-amber-600 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                                {item.link ? (
                                                    <Link href={item.link} className="text-red-600 hover:underline dark:text-amber-400 text-sm font-medium">
                                                        {item.detail}
                                                    </Link>
                                                ) : (
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.detail}</p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Social Media Links */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-4 border-red-600">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                                Connect With Us
                            </h2>
                            <div className="flex flex-wrap gap-4 justify-start">
                                {socialLinks.map((social, index) => {
                                    const SocialIcon = social.icon;
                                    return (
                                        <Link
                                            key={index}
                                            href={social.link}
                                            className={`p-3 rounded-full ${social.color} bg-gray-100 dark:bg-gray-700 hover:scale-110 transition-transform duration-300 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500`}
                                            aria-label={`Follow us on ${social.name}`}
                                        >
                                            <SocialIcon className="w-6 h-6" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column: Contact Form (2/3 width) */}
                    <div className="lg:col-span-2">
                        <form 
                            onSubmit={handleSubmit} 
                            className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl shadow-3xl space-y-6 border border-gray-100 dark:border-gray-700"
                        >
                            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Zap className="w-7 h-7 mr-3 text-amber-600" /> Quick Message
                            </h2>
                            
                            {/* Name and Email Row (Responsive Grid) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                {renderInputField('name', 'text', 'Full Name *', formData.name, handleChange, errors.name, User)}
                                
                                {/* Email */}
                                {renderInputField('email', 'email', 'Email Address *', formData.email, handleChange, errors.email, Mail)}
                            </div>

                            {/* Subject Dropdown (THEME-BLENDED STYLING APPLIED) */}
                            {renderSelectField('subject', 'Inquiry Type', formData.subject, handleChange, [
                                'General Inquiry',
                                'Recipe Support',
                                'Technical Issue',
                                'Business/Press',
                            ])}

                            {/* Message */}
                            {renderTextareaField('message', 'Your Message *', formData.message, handleChange, errors.message)}
                            
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className={`w-full py-3 px-6 text-xl font-extrabold rounded-xl shadow-lg transition duration-300 flex items-center justify-center 
                                    ${status === 'submitting' 
                                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                        : 'bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500'
                                    }`}
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Clock className="w-5 h-5 mr-3 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-3" /> Submit Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default ContactPage;

// =================================================================
// --- Reusable Form Field Components (Internalized) ---
// =================================================================

const baseInputClasses = (error) => `w-full p-3 pl-12 border rounded-xl transition duration-300 shadow-sm dark:bg-gray-700 dark:text-white placeholder:text-gray-400 focus:outline-none text-lg ${
    error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
}`;

const baseLabelClasses = "block text-sm font-bold uppercase text-red-600 dark:text-red-400 mb-2 tracking-wider";

const renderInputField = (name, type, label, value, onChange, error, Icon) => (
    <div>
        <label htmlFor={name} className={baseLabelClasses}>{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={baseInputClasses(error)}
                required={label.includes('*')}
            />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
);

const renderTextareaField = (name, label, value, onChange, error) => (
    <div>
        <label htmlFor={name} className={baseLabelClasses}>{label}</label>
        <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-amber-500" />
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows="5"
                className={`w-full p-3 pl-12 border rounded-xl transition duration-300 shadow-sm dark:bg-gray-700 dark:text-white placeholder:text-gray-400 focus:outline-none text-lg resize-none ${
                    error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                }`}
                required={label.includes('*')}
            ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
);

// STYLING IMPROVEMENT: Custom Select Dropdown (Theme-Blended)
const renderSelectField = (name, label, value, onChange, options) => (
    <div>
        <label htmlFor={name} className={baseLabelClasses}>{label}</label>
        <div className="relative">
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                // Custom classes to style the select box and remove default browser styling
                className={`w-full p-3 pl-4 border rounded-xl appearance-none transition duration-300 shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none text-lg cursor-pointer
                    border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-600 focus:border-red-600
                    
                    /* Theme-blended colors for the options visible in the dropdown menu */
                    [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-gray-900 [&>option]:dark:text-gray-100
                    /* Theme-blended color for selected/checked option */
                    [&>option:checked]:bg-amber-100 [&>option:checked]:text-red-600
                    `}
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            {/* Custom Chevron Icon for the Dropdown */}
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 pointer-events-none" />
        </div>
    </div>
);
