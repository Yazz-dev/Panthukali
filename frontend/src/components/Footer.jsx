import React from 'react';

const Footer = () => {
    return (
        <footer className="liquid-glass-dark border-t border-white/10 mt-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    {/* Brand Section */}
                    <div className="md:w-1/3">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">⚽</span>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-turf-green to-white">panthukali.com</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Your premium destination for instant turf bookings across Kerala. Experience seamless sports scheduling.
                        </p>
                    </div>

                    {/* Links & Legal */}
                    <div className="md:w-1/3 flex flex-col gap-2">
                        <h4 className="text-white font-semibold mb-2">Legal & Support</h4>
                        <a href="#" className="text-gray-400 hover:text-white transition w-fit">Terms & Conditions</a>
                        <a href="#" className="text-gray-400 hover:text-white transition w-fit">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition w-fit">Contact Support</a>
                    </div>

                    {/* About Section (Creators and Quote) */}
                    <div className="md:w-1/3">
                        <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white font-semibold mb-4 tracking-widest uppercase text-xs">Built With Precision By</h4>
                        <p className="text-xl text-white font-bold tracking-wide">YASIR USMAN <span className="text-gray-500 font-light">&</span> FADIL M K</p>

                        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                            <p className="text-gray-300 italic text-sm">
                                "The turf doesn't ask who you were yesterday. It only demands who you choose to be today."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col items-center">
                    <p className="text-gray-500 text-xs text-center">
                        © {new Date().getFullYear()} Panthukali. Book Your Game. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
