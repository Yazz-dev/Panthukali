import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Clock, Calendar as CalendarIcon, Phone, User, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addDays, format } from 'date-fns';
import axios from 'axios';
import OTPModal from '../components/OTPModal';
import { PAGE_TRANSITION } from '../constants';

// Mock Slots (Until integrated with an actual unavailable slot check API)
const MOCK_SLOTS = [
    { time: "06:00 AM - 07:00 AM", status: "AVAILABLE" },
    { time: "07:00 AM - 08:00 AM", status: "BOOKED" },
    { time: "08:00 AM - 09:00 AM", status: "AVAILABLE" },
    { time: "04:00 PM - 05:00 PM", status: "AVAILABLE" },
    { time: "05:00 PM - 06:00 PM", status: "AVAILABLE" },
    { time: "06:00 PM - 07:00 PM", status: "AVAILABLE" },
    { time: "07:00 PM - 08:00 PM", status: "AVAILABLE" },
    { time: "08:00 PM - 09:00 PM", status: "AVAILABLE" },
];

const TurfDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [turf, setTurf] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    // Forms & Modals
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [heldTime, setHeldTime] = useState(0);
    const [verifying, setVerifying] = useState(false);

    const dates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));
    const availableCount = MOCK_SLOTS.filter(s => s.status === "AVAILABLE").length;

    useEffect(() => {
        const fetchTurf = async () => {
            try {
                const res = await axios.get(`/api/turfs/${id}`);
                setTurf(res.data);
            } catch (err) {
                console.error("Error fetching turf details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTurf();
    }, [id]);

    useEffect(() => {
        let timer;
        if (selectedSlot && !showOTP) {
            setHeldTime(300); // 5 minutes in seconds
            timer = setInterval(() => {
                setHeldTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setSelectedSlot(null);
                        alert("Reservation time expired. Please select the slot again.");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [selectedSlot, showOTP]);

    const handleBookingClick = async () => {
        if (!selectedSlot) return alert("Please select a time slot.");
        if (!name.trim()) return alert("Please enter your name.");
        if (!mobile.trim() || mobile.length !== 10) return alert("Please enter a valid 10-digit mobile number.");

        // Request OTP from backend
        try {
            setVerifying(true);
            await axios.post('/api/auth/send-otp', { mobile });
            setShowOTP(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error sending OTP');
        } finally {
            setVerifying(false);
        }
    };

    const handleOTPVerify = async (code) => {
        try {
            // Verify OTP Request
            await axios.post('/api/auth/verify-otp', { mobile, code });

            // If successful, create booking
            const bookingData = {
                turfId: turf._id,
                userName: name,
                mobile,
                date: format(selectedDate, 'yyyy-MM-dd'),
                timeSlot: selectedSlot,
                amountPaid: turf.pricePerHour
            };

            const res = await axios.post('/api/bookings', bookingData);
            const booking = res.data;

            setShowOTP(false);
            navigate('/confirmation', {
                state: {
                    bookingId: booking.bookingId,
                    turfName: turf.name,
                    district: turf.district,
                    date: format(selectedDate, 'dd MMM yyyy'),
                    timeSelected: selectedSlot,
                    amount: turf.pricePerHour
                }
            });
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Verification Failed');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="text-5xl animate-spin drop-shadow-[0_0_15px_rgba(57,255,20,0.8)]">⚽</div>
        </div>
    );

    if (!turf) return <div className="p-20 text-center text-white">Turf not found.</div>;

    return (
        <motion.div
            initial={PAGE_TRANSITION.initial}
            animate={PAGE_TRANSITION.animate}
            exit={PAGE_TRANSITION.exit}
            transition={PAGE_TRANSITION.transition}
            className="container mx-auto px-4 py-8"
        >
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Col: Turf Details & Images */}
                <div className="lg:w-1/2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl overflow-hidden liquid-glass-dark"
                    >
                        <img src={turf.images[0] || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000'} alt={turf.name} className="w-full h-[400px] object-cover" />
                        <div className="p-6">
                            <h1 className="text-4xl font-extrabold text-white mb-2">{turf.name}</h1>
                            <div className="flex items-center gap-2 text-gray-300 mb-4">
                                <MapPin className="text-turf-green" size={20} />
                                <p className="text-lg">{turf.address}, {turf.district}</p>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl">
                                    <IndianRupee className="text-neo-green" size={20} />
                                    <span className="font-bold text-xl text-white">₹{turf.pricePerHour}</span>
                                    <span className="text-sm text-gray-400">/hr</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl">
                                    <Phone className="text-blue-400" size={20} />
                                    <span className="text-gray-300">{turf.phone}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="text-turf-green" size={18} />
                                    Amenities
                                </h3>
                                <div className="flex gap-2 flex-wrap text-sm text-gray-400">
                                    <span className="bg-black/40 px-3 py-1 rounded-full border border-white/5">Parking</span>
                                    <span className="bg-black/40 px-3 py-1 rounded-full border border-white/5">Washroom</span>
                                    <span className="bg-black/40 px-3 py-1 rounded-full border border-white/5">Drinking Water</span>
                                    <span className="bg-black/40 px-3 py-1 rounded-full border border-white/5">Floodlights</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Col: Booking Flow */}
                <div className="lg:w-1/2">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="liquid-glass-dark p-6 lg:p-8 rounded-3xl sticky top-24"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                            Book Your Slot
                        </h2>

                        {/* Date Picker */}
                        <div className="mb-6">
                            <label className="text-sm text-gray-400 font-medium mb-3 flex items-center gap-2">
                                <CalendarIcon size={16} className="text-turf-green" /> Select Date
                            </label>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {dates.map((d, i) => {
                                    const isSelected = d.toDateString() === selectedDate.toDateString();
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(d)}
                                            className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${isSelected
                                                ? 'bg-turf-green text-white shadow-[0_4px_15px_rgba(22,163,74,0.4)]'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                                                }`}
                                        >
                                            <span className="text-xs uppercase font-medium">{format(d, 'EEE')}</span>
                                            <span className="text-2xl font-bold mt-1">{format(d, 'dd')}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-3">
                                <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                                    <Clock size={16} className="text-blue-400" /> Select Time
                                </label>
                                {availableCount <= 5 && (
                                    <span className="text-xs font-bold text-red-400 animate-pulse bg-red-400/10 px-2 py-1 rounded-md border border-red-400/20">
                                        Only {availableCount} slots left!
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {MOCK_SLOTS.map((slot, i) => {
                                    const isAvailable = slot.status === "AVAILABLE";
                                    const isSelected = selectedSlot === slot.time;
                                    return (
                                        <button
                                            key={i}
                                            disabled={!isAvailable}
                                            onClick={() => setSelectedSlot(slot.time)}
                                            className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${!isAvailable
                                                ? 'bg-red-500/10 text-red-500/50 border border-red-500/20 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-turf-green text-white shadow-[0_0_15px_rgba(22,163,74,0.5)] border border-turf-green'
                                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30'
                                                }`}
                                        >
                                            {slot.time}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* User Details Form */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-sm text-gray-400 font-medium mb-1 pl-1 block">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full spotlight-input py-3 pl-10 pr-4 text-white"
                                        placeholder="Yasir Usman"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 font-medium mb-1 pl-1 block">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-gray-500" />
                                    </div>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                        className="w-full spotlight-input py-3 pl-10 pr-4 text-white"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hold Timer Alert */}
                        <AnimatePresence>
                            {selectedSlot && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-3 rounded-xl text-sm flex justify-between items-center">
                                        <span>Slot reserved for checkout</span>
                                        <span className="font-mono font-bold bg-orange-500/20 px-2 py-1 rounded-md">
                                            {Math.floor(heldTime / 60)}:{(heldTime % 60).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileTap={!verifying ? { scale: 0.95 } : {}}
                            onClick={handleBookingClick}
                            disabled={verifying}
                            className={`w-full py-4 flex items-center justify-center gap-2 ${verifying ? 'bg-white/10 text-gray-400 rounded-full' : 'premium-btn-green text-lg'}`}
                        >
                            {verifying ? 'Sending OTP...' : (
                                <>
                                    Confirm Booking <span className="text-sm bg-black/40 px-3 py-1 rounded-full ml-2 backdrop-blur-md">₹{turf.pricePerHour}</span>
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {showOTP && (
                <OTPModal
                    isOpen={showOTP}
                    onClose={() => setShowOTP(false)}
                    onVerify={handleOTPVerify}
                    mobile={mobile}
                />
            )}
        </motion.div>
    );
};

export default TurfDetails;
