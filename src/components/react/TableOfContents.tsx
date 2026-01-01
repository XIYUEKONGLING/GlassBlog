import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Heading {
    depth: number;
    slug: string;
    text: string;
}

interface Props {
    headings: Heading[];
}

export const TableOfContents: React.FC<Props> = ({ headings }) => {
    const [activeId, setActiveId] = useState<string>('');

    const filteredHeadings = headings.filter((h) => h.depth >= 2 && h.depth <= 3);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        const elements = document.querySelectorAll('h2, h3');
        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
        e.preventDefault();
        setActiveId(slug);

        const element = document.getElementById(slug);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (filteredHeadings.length === 0) return null;

    return (
        <nav className="toc-container">
            <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100 flex items-center gap-2 px-2">
                <i className="fa-solid fa-list-ul text-sm opacity-70"></i>
                On this page
            </h2>

            <ul className="flex flex-col text-sm relative pl-2">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-200 dark:bg-white/10 z-0"></div>

                {filteredHeadings.map((heading) => {
                    const isActive = activeId === heading.slug;
                    return (
                        <li key={heading.slug} className="relative z-10">
                            <a
                                href={`#${heading.slug}`}
                                onClick={(e) => handleClick(e, heading.slug)}
                                className={twMerge(
                                    "block py-1.5 pr-2 transition-all duration-200 border-l-2 rounded-r-md cursor-pointer",
                                    heading.depth === 3 ? "pl-6 text-xs" : "pl-4 font-medium",
                                    isActive
                                        ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                                        : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                                )}
                            >
                                {heading.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
