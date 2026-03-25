import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { KERALA_DISTRICTS, PAGE_TRANSITION } from '../constants';
import AnimatedHero from '../components/AnimatedHero';

const Home = () => {
    const navigate = useNavigate();
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const handleSearch = () => {
        if (selectedDistrict) {
            navigate(`/turfs?district=${selectedDistrict}`);
        } else {
            alert("Please select a district to search.");
        }
    };

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setSelectedDistrict('Ernakulam');
                    navigate(`/turfs?district=Ernakulam&lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
                },
                () => alert("Location access denied or unavailable. Please select manually.")
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <motion.div
            initial={PAGE_TRANSITION.initial}
            animate={PAGE_TRANSITION.animate}
            exit={PAGE_TRANSITION.exit}
            transition={PAGE_TRANSITION.transition}
            className="flex flex-col w-full bg-[#0f172a]"
        >
            {/* Scroll Based Animated Hero Section */}
            <AnimatedHero />

            {/* Turf Search Section (Appears after scrolling past the Hero) */}
            <div className="relative z-20 bg-[#0f172a] py-24 min-h-[50vh] flex flex-col items-center justify-center -mt-20 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/5">

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Ready to <span className="text-turf-green">Play?</span>
                    </h2>
                    <p className="text-gray-400 max-w-lg mx-auto text-lg">
                        Find the perfect pitch in your district and book it instantly.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
                    className="liquid-glass-dark p-6 rounded-3xl w-full max-w-3xl flex flex-col md:flex-row gap-4 items-center px-4 mx-4 hover:shadow-[0_8px_40px_rgba(0,0,0,0.8)] transition-all duration-500"
                >
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="text-turf-green" size={20} />
                        </div>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full spotlight-input py-4 pl-12 pr-4 appearance-none"
                        >
                            <option value="" disabled className="bg-slate-900">Select Your District</option>
                            {KERALA_DISTRICTS.map(district => (
                                <option key={district} value={district} className="bg-slate-900">{district}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleGeolocation}
                        className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-white"
                        title="Use Current Location"
                    >
                        <Navigation size={20} />
                    </button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSearch}
                        className="w-full md:w-auto premium-btn-green py-4 text-lg"
                    >
                        Find Turfs
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Home;
