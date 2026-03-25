import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';

const TOTAL_FRAMES = 240;

const ScrollHero = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const [currentFrame, setCurrentFrame] = useState(1);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Spring physics smoother
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 25,
        restDelta: 0.001
    });

    const frameIndex = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES]);

    useMotionValueEvent(frameIndex, "change", (latest) => {
        const frame = Math.round(latest);
        setCurrentFrame(frame);

        // Draw the image onto the canvas immediately when frame changes
        const canvas = canvasRef.current;
        if (canvas && imagesRef.current[frame]) {
            const ctx = canvas.getContext('2d');
            const img = imagesRef.current[frame];
            // Keep aspect ratio covering the canvas similar to object-fit: cover
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }
    });

    // Preload images
    useEffect(() => {
        const preloadImages = async () => {
            let loaded = 0;
            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                const img = new Image();
                const paddedIndex = String(i).padStart(3, '0');
                img.src = `/images/head_section/ezgif-frame-${paddedIndex}.png`;

                img.onload = () => {
                    loaded++;
                    setImagesLoaded(loaded);
                    // Draw the absolute first frame right away
                    if (i === 1 && canvasRef.current) {
                        const canvas = canvasRef.current;
                        // Set initial canvas resolution to match window inner width/height (high DPI if possible)
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;

                        const ctx = canvas.getContext('2d');
                        const hRatio = canvas.width / img.width;
                        const vRatio = canvas.height / img.height;
                        const ratio = Math.max(hRatio, vRatio);
                        const centerShift_x = (canvas.width - img.width * ratio) / 2;
                        const centerShift_y = (canvas.height - img.height * ratio) / 2;
                        ctx.drawImage(img, 0, 0, img.width, img.height,
                            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
                    }
                };
                imagesRef.current[i] = img;
            }
        };
        preloadImages();

        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Redraw current frame
                const frame = currentFrame || 1;
                const img = imagesRef.current[frame];
                if (img && img.complete) {
                    const ctx = canvasRef.current.getContext('2d');
                    const hRatio = canvasRef.current.width / img.width;
                    const vRatio = canvasRef.current.height / img.height;
                    const ratio = Math.max(hRatio, vRatio);
                    const centerShift_x = (canvasRef.current.width - img.width * ratio) / 2;
                    const centerShift_y = (canvasRef.current.height - img.height * ratio) / 2;
                    ctx.drawImage(img, 0, 0, img.width, img.height,
                        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
                }
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Run once on mount

    // Text Animations based on smooth progress
    const text1Opacity = useTransform(smoothProgress, [0.05, 0.15, 0.25], [0, 1, 0]);
    const text1Y = useTransform(smoothProgress, [0.05, 0.25], [50, -50]);

    const text2Opacity = useTransform(smoothProgress, [0.35, 0.45, 0.55], [0, 1, 0]);
    const text2Y = useTransform(smoothProgress, [0.35, 0.55], [50, -50]);

    const text3Opacity = useTransform(smoothProgress, [0.65, 0.75, 0.90], [0, 1, 0]);
    const text3Y = useTransform(smoothProgress, [0.65, 0.90], [50, -50]);

    return (
        <div ref={containerRef} className="relative w-full h-[400vh] bg-black">
            {/* Sticky Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Loading Progress (Optional, purely visual for slow connections) */}
                {imagesLoaded < TOTAL_FRAMES && (
                    <div className="absolute top-4 right-4 z-50 text-xs text-turf-green font-mono opacity-50">
                        Loading frames: {Math.round((imagesLoaded / TOTAL_FRAMES) * 100)}%
                    </div>
                )}

                {/* Dynamic Canvas for Image Sequence */}
                <div className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen opacity-60">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black"></div>
                    <div className="absolute inset-0 stadium-glow mix-blend-overlay"></div>
                </div>

                {/* Scroll-based Texts */}
                <div className="relative z-10 w-full max-w-5xl px-4 text-center pointer-events-none">
                    {/* Feature 1 */}
                    <motion.div style={{ opacity: text1Opacity, y: text1Y }} className="absolute inset-0 flex flex-col items-center justify-center -mt-20">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(22,163,74,0.8)] mb-4 tracking-tighter">
                            A New Era of <span className="text-turf-green">Sports</span>
                        </h2>
                        <p className="text-lg sm:text-xl md:text-3xl text-gray-300 font-light max-w-2xl px-4">
                            Experience world-class turfs engineered for champions.
                        </p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div style={{ opacity: text2Opacity, y: text2Y }} className="absolute inset-0 flex flex-col items-center justify-center -mt-20">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(57,255,20,0.8)] mb-4 tracking-tighter">
                            Instant <span className="text-neo-green">Bookings</span>
                        </h2>
                        <p className="text-lg sm:text-xl md:text-3xl text-gray-300 font-light max-w-2xl px-4">
                            Real-time availability, secure OTP, zero delays. Just show up and play.
                        </p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div style={{ opacity: text3Opacity, y: text3Y }} className="absolute inset-0 flex flex-col items-center justify-center -mt-20">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] mb-4 tracking-tighter">
                            Kerala's Largest <span className="text-white">Network</span>
                        </h2>
                        <p className="text-lg sm:text-xl md:text-3xl text-gray-300 font-light max-w-2xl px-4">
                            From Kasaragod to Trivandrum, your game awaits.
                        </p>
                    </motion.div>
                </div>

                {/* Scroll indicator text */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center animate-bounce pointer-events-none"
                >
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-widest mb-2">Scroll To Explore</span>
                    <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-turf-green to-transparent rounded-full"></div>
                </motion.div>

            </div>
        </div>
    );
};

export default ScrollHero;
