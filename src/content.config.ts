import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
	schema: z.object({
		title: z.string(),
		order: z.number().default(0),
		// Other names a reader might search for. Search ranks them just under the title.
		keywords: z.array(z.string()).default([]),
	}),
});

// The same files Claude Code loads as skills, so the site and the agent never drift.
const skills = defineCollection({
	loader: glob({
		pattern: '*/SKILL.md',
		base: './skills',
		generateId: ({ entry }) => entry.split('/')[0],
	}),
	schema: z.object({
		name: z.string(),
		description: z.string(),
	}),
});

export const collections = { docs, skills };
