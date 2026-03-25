import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import TurfCard from '../components/TurfCard';
import { KERALA_DISTRICTS, PAGE_TRANSITION } from '../constants';

const TurfsList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialDistrict = queryParams.get('district') || '';

    const [district, setDistrict] = useState(initialDistrict);
    const [searchTerm, setSearchTerm] = useState('');
    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTurfs = async () => {
            setLoading(true);
            try {
                const res = await axios.get(district ? `/api/turfs?district=${district}` : '/api/turfs');
                let data = res.data;
                if (searchTerm) {
                    data = data.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
                }
                setTurfs(data);
            } catch (err) {
                console.error("Error fetching turfs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTurfs();
    }, [district, searchTerm]);

    return (
        <motion.div
            initial={PAGE_TRANSITION.initial}
            animate={PAGE_TRANSITION.animate}
            exit={PAGE_TRANSITION.exit}
            transition={PAGE_TRANSITION.transition}
            className="container mx-auto px-4 py-8 relative"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 liquid-glass-dark p-6 rounded-3xl border-white/10">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <MapPin className="text-turf-green" />
                        {district ? `Turfs in ${district}` : 'All Turfs'}
                    </h2>
                    <p className="text-gray-400 mt-1">Book your slots instantly.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search turf name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="spotlight-input pl-10 py-3 w-full"
                        />
                    </div>
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="spotlight-input py-3 px-4 w-full appearance-none"
                    >
                        <option value="" className="bg-slate-900">All Districts</option>
                        {KERALA_DISTRICTS.map(d => (
                            <option key={d} value={d} className="bg-slate-900">{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center flex-col items-center py-20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="text-5xl drop-shadow-[0_0_15px_rgba(57,255,20,0.8)]"
                    >
                        ⚽
                    </motion.div>
                    <p className="text-gray-400 mt-4 animate-pulse">Loading amazing turfs...</p>
                </div>
            ) : turfs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {turfs.map((turf, index) => (
                        <motion.div
                            key={turf._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <TurfCard turf={turf} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="text-gray-500 text-6xl mb-4">🏟️</div>
                    <h3 className="text-xl text-gray-300 font-medium">No turfs found in this area.</h3>
                    <p className="text-gray-500 mt-2">Try searching in another district.</p>
                </div>
            )}
        </motion.div>
    );
};

export default TurfsList;
