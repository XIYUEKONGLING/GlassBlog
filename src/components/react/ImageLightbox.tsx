import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageLightbox: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState('');

    const handleImageClick = useCallback((e: Event) => {
        const target = e.target as HTMLImageElement;
        setImgSrc(target.src);
        setIsOpen(true);
    }, []);

    useEffect(() => {
        const images = document.querySelectorAll('.prose img');

        images.forEach((img) => {
            img.classList.add('cursor-zoom-in');
            img.addEventListener('click', handleImageClick);
        });

        // Astro View Transitions
        const observer = new MutationObserver(() => {
            const currentImages = document.querySelectorAll('.prose img');
            currentImages.forEach((img) => {
                if (!img.classList.contains('cursor-zoom-in')) {
                    img.classList.add('cursor-zoom-in');
                    img.addEventListener('click', handleImageClick);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            images.forEach((img) => {
                img.removeEventListener('click', handleImageClick);
            });
            observer.disconnect();
        };
    }, [handleImageClick]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setIsOpen(false);
            };
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
                >
                    <motion.img
                        src={imgSrc}
                        alt="Enlarged"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="max-w-full max-h-[95vh] object-contain rounded-sm shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close lightbox"
                    >
                        <i className="fa-solid fa-xmark text-3xl"></i>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
