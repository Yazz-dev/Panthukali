import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ChevronDown } from 'lucide-react';

// The TWO frames per mode used as scroll-linked "film frames"
const ASSETS = {
    day: [
        '/images/head_section/day/1.png',
        '/images/head_section/day/2.png',
    ],
    night: [
        '/images/head_section/night/1.png',
        '/images/head_section/night/2.png',
    ],
};

// --- Floating Night Particle ---
const Particle = ({ x, y, size, color, duration, delay }) => (
    <div
        className="absolute rounded-full pointer-events-none"
        style={{
            width: size, height: size,
            left: `${x}%`, top: `${y}%`,
            background: color,
            boxShadow: `0 0 ${size * 4}px ${size * 2}px ${color}`,
            animation: `hero-float ${duration}s ease-in-out ${delay}s infinite alternate`,
        }}
    />
);

const AnimatedHero = () => {
    // ── Time Detection ──────────────────────────────────────────────────────
    const getDefaultMode = useCallback(() => {
        const h = new Date().getHours();
        return h >= 6 && h < 18 ? 'day' : 'night';
    }, []);

    const [mode, setMode] = useState(getDefaultMode);
    const [isManual, setIsManual] = useState(false);
    const isDay = mode === 'day';
    const frames = ASSETS[mode];

    // ── Scroll Setup ────────────────────────────────────────────────────────
    // Tall container (300vh) so scroll progress maps to the two frames.
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Physics spring – feels like a camera on a gimbal
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 45,
        damping: 28,
        restDelta: 0.0005,
    });

    // ── Per-frame opacities + zoom (parallax) ──────────────────────────────
    // Frame 0: fully visible at scroll=0, fades out by 0.5
    const frame0Opacity = useTransform(smoothProgress, [0, 0.45, 0.55], [1, 1, 0]);
    const frame0Scale = useTransform(smoothProgress, [0, 0.55], [1, 1.08]);

    // Frame 1: invisible at scroll=0, fades in at 0.45 → full at 0.55 → subtle zoom continues
    const frame1Opacity = useTransform(smoothProgress, [0.45, 0.55, 1], [0, 1, 1]);
    const frame1Scale = useTransform(smoothProgress, [0.45, 1], [1.06, 1]);

    // Overlay intensity driven by scroll
    const overlayOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.35, 0.55, 0.65]);

    // Text-section parallax
    const textY = useTransform(smoothProgress, [0, 1], ['0%', '-15%']);

    // ── Scroll-driven progress tracker (for text stages) ───────────────────
    const [progress, setProgress] = useState(0);
    useMotionValueEvent(smoothProgress, 'change', (v) => setProgress(v));

    // Stage-based text content
    const textStages = isDay
        ? [
            { title: 'Book Your Game', sub: `Kerala\'s finest turfs, one tap away.`, accent: 'from-yellow-400 to-orange-500' },
            { title: 'Play Under the Sun', sub: 'Prime daytime sessions across all districts.', accent: 'from-orange-400 to-yellow-300' },
        ]
        : [
            { title: 'Own the Night', sub: 'Stadium-lit night sessions. Real football energy.', accent: 'from-indigo-400 to-purple-500' },
            { title: 'Lights. Turf. Action.', sub: `Top-tier pitches open till midnight.`, accent: 'from-purple-400 to-blue-400' },
        ];

    const stageIndex = progress < 0.5 ? 0 : 1;
    const stage = textStages[stageIndex];

    // ── Night Particles ─────────────────────────────────────────────────────
    const [particles] = useState(() =>
        Array.from({ length: 22 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            color: ['rgba(147,197,253,0.7)', 'rgba(196,181,253,0.7)', 'rgba(52,211,153,0.5)'][i % 3],
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 4,
        }))
    );

    // ── Preload images for both modes ───────────────────────────────────────
    useEffect(() => {
        [...ASSETS.day, ...ASSETS.night].forEach(src => {
            const img = new Image(); img.src = src;
        });
    }, []);

    // ── Auto re-sync if not manually overridden ─────────────────────────────
    useEffect(() => {
        if (isManual) return;
        const id = setInterval(() => setMode(getDefaultMode()), 60000);
        return () => clearInterval(id);
    }, [isManual, getDefaultMode]);

    const handleToggle = () => {
        setIsManual(true);
        setMode(m => m === 'day' ? 'night' : 'day');
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-black">
            <style>{`
                @keyframes hero-float {
                    0%   { transform: translateY(0px) scale(1); opacity: 0.5; }
                    100% { transform: translateY(-28px) scale(1.3); opacity: 1; }
                }
                @keyframes stadium-pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50%       { opacity: 0.9; transform: scale(1.12); }
                }
            `}</style>

            {/* ══ STICKY VIEWPORT ══════════════════════════════════════════ */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* ── Frame 0 ─────────────────────────────────────────────── */}
                <motion.div
                    style={{ opacity: frame0Opacity, scale: frame0Scale }}
                    className="absolute inset-0 w-full h-full origin-center will-change-transform"
                >
                    <img
                        src={frames[0]}
                        alt="hero frame 1"
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                </motion.div>

                {/* ── Frame 1 ─────────────────────────────────────────────── */}
                <motion.div
                    style={{ opacity: frame1Opacity, scale: frame1Scale }}
                    className="absolute inset-0 w-full h-full origin-center will-change-transform"
                >
                    <img
                        src={frames[1]}
                        alt="hero frame 2"
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                </motion.div>

                {/* ── DAY Overlay ─────────────────────────────────────────── */}
                <AnimatePresence>
                    {isDay && (
                        <motion.div
                            key="day-ov"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 1.2 }}
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(251,191,36,0.28) 0%, rgba(249,115,22,0.22) 60%, rgba(0,0,0,0.58) 100%)',
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* ── NIGHT Overlay + Glows ───────────────────────────────── */}
                <AnimatePresence>
                    {!isDay && (
                        <motion.div
                            key="night-ov"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 1.2 }}
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(30,27,75,0.68) 0%, rgba(88,28,135,0.48) 55%, rgba(0,0,0,0.78) 100%)',
                            }}
                        >
                            {/* Stadium floodlights */}
                            {[{ l: '22%', d: '0s' }, { l: '75%', d: '2s' }].map((g, i) => (
                                <div key={i} className="absolute top-0 w-72 h-72 rounded-full -translate-y-1/2 blur-3xl"
                                    style={{
                                        left: g.l,
                                        background: 'radial-gradient(circle, rgba(191,219,254,0.85), transparent 68%)',
                                        animation: `stadium-pulse 4s ease-in-out ${g.d} infinite`,
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Night Particles ─────────────────────────────────────── */}
                <AnimatePresence>
                    {!isDay && (
                        <motion.div
                            key="pts"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 2 }}
                            className="absolute inset-0 pointer-events-none overflow-hidden"
                        >
                            {particles.map(p => <Particle key={p.id} {...p} />)}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Base gradient: darken bottom for legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />

                {/* ── Hero Text (scroll-parallax) ─────────────────────────── */}
                <motion.div
                    style={{ y: textY }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center select-none pointer-events-none"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${mode}-${stageIndex}`}
                            initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -35, filter: 'blur(6px)' }}
                            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                        >
                            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold mb-4"
                                style={{ color: isDay ? 'rgba(251,191,36,0.9)' : 'rgba(196,181,253,0.9)' }}>
                                {isDay ? '☀️ Daytime Session' : '🌙 Night Session'}
                            </p>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none tracking-tighter drop-shadow-2xl mb-6">
                                {stage.title.split(' ').map((word, i) => (
                                    <span key={i}>
                                        {i === Math.floor(stage.title.split(' ').length / 2)
                                            ? <><br /><span className={`bg-clip-text text-transparent bg-gradient-to-r ${stage.accent}`}>{word}</span></>
                                            : ` ${word}`}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-base sm:text-xl text-gray-200 max-w-xl mx-auto leading-relaxed mb-10 drop-shadow-md">
                                {stage.sub}
                            </p>

                            {/* CTA Buttons – only visible, pointer-events re-enabled */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto">
                                <motion.a
                                    href="/turfs"
                                    whileTap={{ scale: 0.94 }}
                                    whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(16,185,129,0.6)' }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                    className="premium-btn-green px-8 py-4 text-lg"
                                >
                                    Book Your Slot
                                </motion.a>
                                <motion.a
                                    href="/turfs"
                                    whileTap={{ scale: 0.94 }}
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                    className="liquid-glass px-8 py-4 rounded-full text-white font-semibold text-lg pointer-events-auto"
                                >
                                    Explore Turfs →
                                </motion.a>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* ── Scroll Progress Bar ─────────────────────────────────── */}
                <motion.div
                    className="absolute bottom-0 left-0 h-[3px] z-20 pointer-events-none"
                    style={{
                        width: '100%',
                        scaleX: smoothProgress,
                        transformOrigin: 'left',
                        background: isDay
                            ? 'linear-gradient(90deg,#f59e0b,#f97316)'
                            : 'linear-gradient(90deg,#818cf8,#34d399)',
                    }}
                />

                {/* ── Day/Night Toggle Button ─────────────────────────────── */}
                <motion.button
                    whileTap={{ scale: 0.88, rotate: 15 }}
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    onClick={handleToggle}
                    title={`Switch to ${isDay ? 'night' : 'day'} mode`}
                    className="absolute top-[76px] right-4 z-20 liquid-glass w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ boxShadow: isDay ? '0 0 18px rgba(251,191,36,0.6)' : '0 0 18px rgba(139,92,246,0.7)' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
                            transition={{ duration: 0.28 }}
                        >
                            {isDay
                                ? <Sun size={20} className="text-yellow-300" />
                                : <Moon size={20} className="text-purple-300" />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>

                {/* ── Scroll Indicator ────────────────────────────────────── */}
                <AnimatePresence>
                    {progress < 0.05 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 pointer-events-none"
                        >
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                                className="flex flex-col items-center gap-1"
                            >
                                <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                                <ChevronDown size={18} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>{/* end sticky */}
        </div>
    );
};

export default AnimatedHero;
