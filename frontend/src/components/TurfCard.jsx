import React from 'react';
import { Heart, MapPin, IndianRupee, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TurfCard = ({ turf }) => {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="glass-dark rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 flex flex-col h-full group hover:shadow-[0_8px_40px_rgba(31,38,135,0.6)] hover:border-white/20 transition-all duration-300"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={turf.images[0] || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop"}
                    alt={turf.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full backdrop-blur-md cursor-pointer hover:bg-white/20 transition">
                    <Heart size={18} className="text-white" />
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{turf.name}</h3>
                </div>
            </div>

            <div className="p-5 flex-grow flex flex-col gap-3">
                <div className="flex items-start gap-2 text-gray-300">
                    <MapPin size={16} className="text-turf-green shrink-0 mt-1" />
                    <p className="text-sm line-clamp-2">{turf.address}, {turf.district}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                    <IndianRupee size={16} className="text-neo-green shrink-0" />
                    <p className="text-sm font-semibold text-white">₹{turf.pricePerHour} <span className="text-xs font-normal text-gray-400">/ hour</span></p>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                    <Clock size={16} className="text-blue-400 shrink-0" />
                    <p className="text-sm">Opens 06:00 AM - 10:00 PM</p>
                </div>

                <div className="mt-auto pt-4">
                    <Link to={`/turfs/${turf._id}`} className="block w-full text-center bg-turf-green hover:bg-green-500 text-white py-2 rounded-xl font-medium transition-all shadow-[0_0_10px_rgba(22,163,74,0.4)]">
                        Book Now
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default TurfCard;
