// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export interface Project {
    title: string;
    description?: string | string[];
    url: string;
    logo: {
        type: 'icon' | 'image' | 'text';
        value: string;
    };
    // 'normal' = 1x1, 'tall' = 1x2, 'wide' = 2x1, 'full' = 3x1 (on 2xl)
    span?: 'normal' | 'tall' | 'wide' | 'full';
}


// Website Settings
export const SITE_TITLE = "Glass Blog";
export const SITE_DESCRIPTION = "Welcome to my website!";
export const SITE_AUTHOR = "XIYUEKONGLING";

export const SITE_PAGESIZE = 6;

export const SITE_LANGUAGE = "en";

// License Settings
export const SITE_LICENSE = "CC BY-NC-SA 4.0";
export const SITE_LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/";


// Another Profile Settings
export const ANOTHER_NAME = "XiYueNYA";
export const ANOTHER_AVATAR = "/avatar.png";
export const ANOTHER_AVATAR_QUALITY = 80;

export const ANOTHER_DESCRIPTION : string | null = "Full-Stack Developer & Blogger";

export const ANOTHER_IDENTITY : string | null = "@XIYUEKONGLING";
export const ANOTHER_PRONOUNS : string | null = "She/Her";

export const ANOTHER_LOCATION: string | null = "ZheJiang, China";
export const ANOTHER_TIMEZONE: string = "Asia/Shanghai";

// Social Media Links
// icon: FontAwesome class (e.g., "fa-brands fa-github", "fa-solid fa-envelope")
export const SOCIAL_LINKS: { icon: string; url: string; label: string }[] = [
    { icon: "fa-brands fa-github", url: "https://github.com/XIYUEKONGLING/", label: "GitHub" },
    { icon: "fa-brands fa-twitter", url: "https://x.com/XiYueKongLing/", label: "Twitter" },
    { icon: "fa-solid fa-rss", url: "/rss.xml", label: "RSS" },
];


export const PROJECTS: Project[] = [
    {
        title: "Glass Blog",
        description: [
            "A modern, minimalist blog theme.",
            "Built with Astro 5 and Tailwind CSS 4.",
            "Featuring sleek glassmorphism design."
        ],
        url: "#",
        logo: { type: 'icon', value: 'fa-solid fa-ice-cream' },
        span: 'tall'
    },
    {
        title: "Quick Link",
        description: "Small card next to tall one.",
        url: "#",
        logo: { type: 'text', value: 'QL' }
    },
    {
        title: "Documentation",
        description: "Standard card.",
        url: "#",
        logo: { type: 'icon', value: 'fa-solid fa-book' }
    },
    {
        title: "Featured Resource",
        description: ["This is a wide project spanning two columns", "Perfect for highlights"],
        url: "#",
        logo: { type: 'icon', value: 'fa-solid fa-star' },
        span: 'wide'
    }
];