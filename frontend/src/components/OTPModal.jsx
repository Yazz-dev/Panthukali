import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const OTPModal = ({ isOpen, onClose, onVerify, mobile }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < 6) {
            setError("Please enter all 6 digits.");
            return;
        }
        setError('');
        setVerifying(true);

        try {
            await onVerify(otpValue);
        } catch (err) {
            setError(err.message || "Invalid OTP. Try '123456'");
        } finally {
            setVerifying(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                ></motion.div>

                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="relative glass-dark p-8 rounded-3xl w-full max-w-md border border-turf-green/30 shadow-[0_0_50px_rgba(22,163,74,0.3)]"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>

                    <div className="text-center mb-6">
                        <div className="text-4xl mb-4">🔐</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verify Mobile</h2>
                        <p className="text-gray-400 text-sm">Enter the 6-digit OTP sent to <br /><span className="text-turf-green tracking-wider font-semibold">{mobile}</span></p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center gap-2 mb-6">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleBackspace(e, index)}
                                    onFocus={e => e.target.select()}
                                    className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-turf-green focus:shadow-[0_0_15px_rgba(22,163,74,0.5)] transition"
                                />
                            ))}
                        </div>

                        {error && <p className="text-red-400 text-center text-sm mb-4 animate-pulse">{error}</p>}

                        <button
                            type="submit"
                            disabled={verifying}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-[0_4px_20px_rgba(22,163,74,0.5)] ${verifying ? 'bg-green-800 text-gray-300' : 'bg-turf-green hover:bg-green-500 text-white active:scale-95'}`}
                        >
                            {verifying ? 'Verifying...' : 'Verify & Confirm Booking'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Didn't receive the OTP? <button className="text-turf-green hover:underline">Resend</button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OTPModal;
