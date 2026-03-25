import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CheckCircle2, MapPin, Calendar, Clock, Download, Share2, CornerUpLeft } from 'lucide-react';
import { SPORTS_QUOTES } from '../constants';

const Confirmation = () => {
    const location = useLocation();
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Select a random quote
        const randomQuote = SPORTS_QUOTES[Math.floor(Math.random() * SPORTS_QUOTES.length)];
        setQuote(randomQuote);
    }, []);

    // If no state exists (user navigated here directly)
    if (!location.state) {
        return <Navigate to="/" />;
    }

    const { bookingId, turfName, district, date, timeSelected, amount } = location.state;
    const ticketRef = useRef(null);

    const handleDownload = async () => {
        const element = ticketRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0f172a' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Add a solid background color first just in case
            pdf.setFillColor(15, 23, 42);
            pdf.rect(0, 0, pdfWidth, 297, 'F');

            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);

            // Adding PANTHUKALI watermark diagonally across the middle
            pdf.setTextColor(200, 200, 200);
            pdf.setFontSize(40);
            pdf.text('PANTHUKALI', pdfWidth / 2 - 45, 150, { angle: 45, opacity: 0.15 });

            pdf.save(`Panthukali_Ticket_${bookingId}.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const handleShare = () => {
        const text = `⚽ Booking Confirmed!\nTurf: ${turfName}, ${district}\nDate: ${date}\nTime: ${timeSelected}\nBooking ID: ${bookingId}\n\npanthukali.com - Book Your Game!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-2xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-24 h-24 bg-turf-green shrink-0 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(22,163,74,0.6)]"
                    >
                        <CheckCircle2 size={50} className="text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-400">Your slot has been successfully reserved.</p>
                </motion.div>

                {/* Digital Slip */}
                <motion.div
                    ref={ticketRef}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="liquid-glass border border-white/20 rounded-3xl p-8 relative overflow-hidden print-area bg-gradient-to-br from-white/10 to-transparent shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
                >
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-9xl">
                        ⚽
                    </div>

                    <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
                        <div>
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                            <p className="text-2xl font-mono font-bold text-turf-green">{bookingId}</p>
                        </div>
                        <div className="text-right">
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold border border-green-500/30">
                                PAID: ₹{amount}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Turf Details</p>
                            <div className="flex items-start gap-2 text-white font-semibold text-lg">
                                <MapPin size={20} className="text-turf-green shrink-0 mt-1" />
                                <div>
                                    <p>{turfName}</p>
                                    <p className="text-sm text-gray-400 font-normal">{district}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Date</p>
                                <p className="flex items-center gap-2 text-white font-semibold">
                                    <Calendar size={18} className="text-blue-400" /> {date}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Time Slot</p>
                                <p className="flex items-center gap-2 text-white font-semibold">
                                    <Clock size={18} className="text-orange-400" /> {timeSelected}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-white/10 no-print" data-html2canvas-ignore="true">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDownload}
                            className="flex-1 flex justify-center items-center gap-2 premium-btn bg-white/10 border border-white/20 text-white"
                        >
                            <Download size={18} /> Download Slip
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleShare}
                            className="flex-1 flex justify-center items-center gap-2 premium-btn-green"
                        >
                            <Share2 size={18} /> Share via WhatsApp
                        </motion.button>
                    </div>
                </motion.div>

                {/* Motivational Quote */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-black/40 border border-turf-green/30 rounded-2xl p-6 text-center relative no-print overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 text-6xl opacity-10">❞</div>
                    <p className="text-xl font-medium italic text-gray-300 relative z-10">
                        {quote}
                    </p>
                </motion.div>

                <div className="text-center mt-8 no-print">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <CornerUpLeft size={18} /> Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Confirmation;
