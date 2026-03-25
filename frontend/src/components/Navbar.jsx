import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, User, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="sticky top-0 z-50 glass-dark border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-3xl">⚽</span>
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-turf-green to-neo-green leading-none">
                            Panthukali
                        </h1>
                        <p className="text-xs text-gray-400 font-light mt-1 tracking-wider uppercase">Book Your Game</p>
                    </div>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</Link>
                    <Link to="/turfs" className="text-gray-300 hover:text-white transition-colors duration-200">Turfs</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Admin">
                        <Settings size={20} className="text-gray-300" />
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 bg-turf-green hover:bg-green-500 text-white px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(22,163,74,0.5)]">
                        <User size={18} />
                        <span className="hidden sm:inline font-medium">Profile</span>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
};

export default Navbar;
