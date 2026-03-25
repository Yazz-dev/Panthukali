import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, IndianRupee } from 'lucide-react';

const MOCK_HISTORY = [
    { _id: '1', turfName: 'Green Arena', district: 'Ernakulam', date: '12 Mar 2026', time: '06:00 PM - 07:00 PM', amount: 1200, status: 'CONFIRMED' },
    { _id: '2', turfName: 'Playmakers Turf', district: 'Ernakulam', date: '05 Mar 2026', time: '08:00 AM - 09:00 AM', amount: 1500, status: 'PLAYED' },
];

const UserProfile = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center gap-6 mb-10 glass border border-white/10 p-6 rounded-3xl">
                <div className="w-20 h-20 bg-turf-green rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]">
                    YU
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Yasir Usman</h1>
                    <p className="text-gray-400">+91 8089869460</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Booking History</h2>

            <div className="space-y-4">
                {MOCK_HISTORY.map((booking, index) => (
                    <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-dark border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-turf-green/50 transition-colors"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                {booking.turfName}
                                <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    }`}>
                                    {booking.status}
                                </span>
                            </h3>
                            <p className="text-gray-400 text-sm flex items-center gap-1 mb-2">
                                <MapPin size={14} className="text-turf-green" /> {booking.district}
                            </p>
                            <div className="flex gap-4 text-sm text-gray-300">
                                <span className="flex items-center gap-1"><Calendar size={14} className="text-blue-400" /> {booking.date}</span>
                                <span className="flex items-center gap-1"><Clock size={14} className="text-orange-400" /> {booking.time}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="block text-xl font-bold text-white flex items-center justify-end gap-1">
                                <IndianRupee size={18} className="text-neo-green" /> {booking.amount}
                            </span>
                            <button className="text-turf-green hover:text-green-400 text-sm font-medium mt-2">View Slip</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserProfile;
