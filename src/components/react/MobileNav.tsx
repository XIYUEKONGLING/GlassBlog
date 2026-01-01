import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    links: { href: string; label: string }[];
}

export const MobileNav: React.FC<Props> = ({ links }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }, [isOpen]);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50 p-2 text-zinc-800 dark:text-zinc-100 focus:outline-none"
                aria-label="Toggle Menu"
            >
                <div className="w-6 h-5 flex flex-col justify-between">
                    <span className={`block h-0.5 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
                    <span className={`block h-0.5 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
                    >
                        {links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 hover:text-blue-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
