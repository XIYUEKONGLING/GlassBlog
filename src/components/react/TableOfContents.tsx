import React, { useEffect, useState, useCallback, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface Heading {
    depth: number;
    slug: string;
    text: string;
}

interface TableOfContentsProps {
    headings: Heading[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
    const [activeId, setActiveId] = useState<string>('');
    const observer = useRef<IntersectionObserver | null>(null);

    // Only include H2 and H3 for a focused navigation experience
    const filteredHeadings = headings.filter((h) => h.depth >= 2 && h.depth <= 3);

    const cleanText = (text: string): string => text.replace(/#$/, '').trim();

    const handleScrollSpy = useCallback((entries: IntersectionObserverEntry[]) => {
        // Track visible headings
        const visibleHeadings = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleHeadings.length > 0) {
            setActiveId(visibleHeadings[0].target.id);
        }
    }, []);

    useEffect(() => {
        // rootMargin offset ensures the heading is "active" before it hits the very top
        observer.current = new IntersectionObserver(handleScrollSpy, {
            rootMargin: '-100px 0% -70% 0%',
            threshold: 1.0,
        });

        const elements = document.querySelectorAll('h2, h3');
        elements.forEach((elem) => observer.current?.observe(elem));

        return () => observer.current?.disconnect();
    }, [handleScrollSpy, headings]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
        e.preventDefault();
        const element = document.getElementById(slug);

        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });

            window.history.pushState(null, '', `#${slug}`);
        }
    }, []);

    if (filteredHeadings.length === 0) return null;

    return (
        <nav className="flex flex-col gap-4">
            {/* Header Label matching Sidebar Panels */}
            <div className="flex items-center gap-2 px-2 text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-widest text-[10px] opacity-50">
                <i className="fa-solid fa-align-left"></i>
                On this page
            </div>

            <div className="relative">
                {/* Continuous background line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-200 dark:bg-white/10 ml-2" />

                <ul className="relative space-y-1 ml-2">
                    {filteredHeadings.map((heading) => {
                        const isActive = activeId === heading.slug;
                        const isSubHeading = heading.depth === 3;

                        return (
                            <li key={heading.slug} className="relative">
                                <a
                                    href={`#${heading.slug}`}
                                    onClick={(e) => handleClick(e, heading.slug)}
                                    className={twMerge(
                                        "group block py-1.5 pr-3 transition-all duration-300 text-sm leading-snug",
                                        "border-l-2 -ml-px",
                                        isSubHeading ? "pl-6 text-xs" : "pl-4 font-medium",
                                        isActive
                                            ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-900/10"
                                            : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                    )}
                                >
                  <span className="flex items-center gap-2">
                    {/* Visual indicator for H3 */}
                      {isSubHeading && (
                          <span className={twMerge(
                              "w-1 h-1 rounded-full transition-colors",
                              isActive ? "bg-blue-400" : "bg-zinc-300 dark:bg-zinc-600 group-hover:bg-zinc-400"
                          )} />
                      )}
                      <span className={twMerge(
                          "transition-transform duration-300 inline-block truncate",
                          isActive ? "translate-x-1" : "group-hover:translate-x-0.5"
                      )}>
                      {cleanText(heading.text)}
                    </span>
                  </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};
