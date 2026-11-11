// Run against the docs dev server: node scripts/favicon.test.mjs http://localhost:4322
import assert from 'node:assert/strict';

const origin = process.argv[2] ?? 'http://localhost:4322';

// What a browser sends on its own for any response that names no icon.
const probe = await fetch(`${origin}/favicon.ico`, { headers: { accept: 'image/avif,image/webp,image/*,*/*;q=0.8' } });
assert.equal(probe.status, 200, 'The origin-root /favicon.ico probe is served');
assert.match(probe.headers.get('content-type') ?? '', /^image\//, 'The probe answers with an image');

// Anything else in public/ still needs the base, so a missed prefix keeps breaking.
// This request logs one expected router error in the dev server.
const unprefixed = await fetch(`${origin}/favicon.svg`, { headers: { accept: 'image/*' } });
assert.equal(unprefixed.status, 404, 'Other public/ assets still 404 without the base');

for (const path of ['/vui/', '/vui/test-pages/dashboard/']) {
	const response = await fetch(origin + path, { headers: { accept: 'text/html' } });
	assert.equal(response.status, 200, `${path} loads`);
	const html = await response.text();
	for (const icon of ['/vui/favicon.svg', '/vui/favicon.ico']) {
		assert.match(html, new RegExp(`<link rel="icon"[^>]* href="${icon}"`), `${path} links ${icon}`);
	}
}

console.log('Favicon checks passed: origin-root probe, base-only public assets, and icon links on docs and test pages.');
