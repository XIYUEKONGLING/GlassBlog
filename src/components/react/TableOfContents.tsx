import React, { useEffect, useState, useCallback } from 'react';
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

    const cleanText = (text: string) => text.replace(/#$/, '').trim();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-100px 0px -80% 0px'
            }
        );

        const elements = document.querySelectorAll('h2, h3');
        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
        e.preventDefault();
        const element = document.getElementById(slug);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            history.pushState(null, '', `#${slug}`);
        }
    }, []);

    if (filteredHeadings.length === 0) return null;

    return (
        <nav className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-2 text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-widest text-xs opacity-60">
                <i className="fa-solid fa-list-ul text-[10px]"></i>
                On this page
            </div>

            <ul className="relative space-y-0.5 border-l border-zinc-200 dark:border-white/10 ml-2">
                {filteredHeadings.map((heading) => {
                    const isActive = activeId === heading.slug;
                    return (
                        <li key={heading.slug}>
                            <a
                                href={`#${heading.slug}`}
                                onClick={(e) => handleClick(e, heading.slug)}
                                className={twMerge(
                                    "block py-2 pr-3 -ml-px border-l-2 transition-all duration-300 text-sm",
                                    heading.depth === 3 ? "pl-6" : "pl-4",
                                    isActive
                                        ? "border-blue-500 text-blue-600 dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-900/10"
                                        : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-white/5"
                                )}
                            >
                <span className={twMerge(
                    "transition-transform duration-300 inline-block",
                    isActive ? "translate-x-1" : "translate-x-0"
                )}>
                    {cleanText(heading.text)}
                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
