// Astro serves everything under `base` (see astro.config.mjs). Templates are
// written against the site root, so root-relative paths pass through here
// where they land in an href or src. Pure, so the rehype plugin below can
// share it from the config.
export function applyBase(base: string, path: string): string {
	if (!path.startsWith('/') || path.startsWith('//')) return path;
	const prefix = base.replace(/\/+$/, '');
	const end = path.search(/[?#]/);
	const pathname = end === -1 ? path : path.slice(0, end);
	const suffix = end === -1 ? '' : path.slice(end);
	// Files keep their name; pages get the slash the server redirects to anyway.
	const slashed = pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname) ? pathname : pathname + '/';
	return prefix + slashed + suffix;
}

export function withBase(path: string): string {
	return applyBase(import.meta.env.BASE_URL, path);
}

// Rewrites root-relative hrefs in Markdown and MDX output, so prose can keep
// linking to `/docs/...`. Covers plain `<a>` and the href attribute on JSX
// components like `<Button href="/docs/...">`.
export function rehypeBaseLinks({ base = '/' } = {}) {
	const visit = (node: any) => {
		if (node.type === 'element' && typeof node.properties?.href === 'string') {
			node.properties.href = applyBase(base, node.properties.href);
		}
		if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
			for (const attr of node.attributes ?? []) {
				if (attr.type === 'mdxJsxAttribute' && attr.name === 'href' && typeof attr.value === 'string') {
					attr.value = applyBase(base, attr.value);
				}
			}
		}
		node.children?.forEach(visit);
	};
	return (tree: any) => visit(tree);
}
