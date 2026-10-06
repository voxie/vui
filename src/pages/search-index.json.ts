import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { withBase } from '@lib/base';
import type { SearchRecord } from '@lib/search';
import { rawContent as skillsIntro, getHeadings as skillsIntroHeadings } from './skills/_intro.md';

const sectionLabel = (id: string) => {
	const dir = id.split('/')[0];
	return dir.charAt(0).toUpperCase() + dir.slice(1);
};

// Strips Markdown and MDX down to the words a reader sees. Imports, JSX blocks,
// code fences and frontmatter go. Inline code, links and emphasis keep their text.
function prose(line: string): string {
	return line
		.replace(/`([^`]*)`/g, '$1')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/[*_~]+/g, '')
		.replace(/^[-*+]\s+|^\d+\.\s+|^>\s*/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function split(body: string, page: string, section: string, href: string, headings: { slug: string; text: string }[]): SearchRecord[] {
	const slugFor = new Map(headings.map((h) => [h.text, h.slug]));
	const records: SearchRecord[] = [{ href, page, section, text: '' }];
	let current = records[0];
	let fence = false;
	let frontmatter = 0;
	let depth = 0;

	for (const raw of body.split('\n')) {
		const line = raw.trim();
		if (line === '---' && frontmatter < 2) {
			frontmatter++;
			continue;
		}
		if (frontmatter === 1) continue;
		if (line.startsWith('```')) {
			fence = !fence;
			continue;
		}
		if (fence || line.startsWith('import ')) continue;

		const heading = /^(#{2,3})\s+(.+)$/.exec(line);
		if (heading) {
			const text = prose(heading[2]);
			const slug = slugFor.get(text);
			current = { href: slug ? `${href}#${slug}` : href, page, section, heading: text, text: '' };
			records.push(current);
			depth = 0;
			continue;
		}
		if (line.startsWith('#')) continue;

		// A JSX block spans lines, so count tags until it closes and skip the lot.
		const opens = (line.match(/<[A-Za-z][^>/]*>/g) ?? []).length;
		const closes = (line.match(/<\/[A-Za-z][^>]*>/g) ?? []).length;
		if (depth > 0 || (line.startsWith('<') && opens > closes)) {
			depth += opens - closes;
			continue;
		}

		const text = prose(line);
		if (text) current.text += (current.text ? ' ' : '') + text;
	}
	return records;
}

export const GET: APIRoute = async () => {
	// Same order as the sidebar, since the empty palette is a page list.
	const sectionOrder = ['foundations', 'components', 'patterns'];
	const rank = (id: string) => {
		const i = sectionOrder.indexOf(id.split('/')[0]);
		return i === -1 ? sectionOrder.length : i;
	};
	const docs = (await getCollection('docs')).sort(
		(a, b) => rank(a.id) - rank(b.id) || a.data.order - b.data.order || a.id.localeCompare(b.id),
	);
	const skills = (await getCollection('skills')).sort((a, b) => a.id.localeCompare(b.id));

	const records: SearchRecord[] = [];

	for (const entry of docs) {
		const { headings } = await render(entry);
		records.push(...split(entry.body ?? '', entry.data.title, sectionLabel(entry.id), withBase(`/docs/${entry.id}`), headings));
	}

	records.push(...split(skillsIntro(), 'Intro', 'Skills', withBase('/skills'), skillsIntroHeadings()));

	for (const entry of skills) {
		const { headings } = await render(entry);
		records.push(...split(entry.body ?? '', entry.data.name, 'Skills', withBase(`/skills/${entry.id}`), headings));
	}

	records.push({ href: withBase('/test-pages'), page: 'Overview', section: 'Test Pages', text: 'Real Voxie screens stripped of every class, for testing guidance and rules.' });

	return new Response(JSON.stringify(records), {
		headers: { 'Content-Type': 'application/json' },
	});
};
