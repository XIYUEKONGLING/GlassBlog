import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).optional(),
			categories: z.array(z.string()).optional(),
		}),
});

// Special pages collection (Home, About, etc.)
const spec = defineCollection({
	loader: glob({ base: './src/content/spec', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			heroImage: image().optional(),
			pubDate: z.coerce.date().optional(),
		}),
});

export const collections = { blog, spec };
