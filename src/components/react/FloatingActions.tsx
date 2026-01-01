import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system';

export const FloatingActions: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('system');
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
        setTheme(savedTheme);

        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const applyTheme = useCallback((newTheme: Theme) => {
        const root = document.documentElement;
        const isDark = newTheme === 'dark' ||
            (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    }, []);

    const toggleTheme = () => {
        const modes: Theme[] = ['system', 'light', 'dark'];
        const nextMode = modes[(modes.indexOf(theme) + 1) % modes.length];
        applyTheme(nextMode);
    };

    return (
        <div className="fixed bottom-6 right-12 z-40 flex flex-col gap-3 pointer-events-none">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={theme}
                        initial={{ opacity: 0, rotate: -20 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 20 }}
                    >
                        {theme === 'light' && <i className="fa-solid fa-sun text-amber-500"></i>}
                        {theme === 'dark' && <i className="fa-solid fa-moon text-blue-400"></i>}
                        {theme === 'system' && <i className="fa-solid fa-desktop text-zinc-500"></i>}
                    </motion.div>
                </AnimatePresence>
            </button>

            {/* Back to Top */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    >
                        <i className="fa-solid fa-arrow-up text-zinc-700 dark:text-zinc-200"></i>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};
