// Copies the raw fixtures into an ignored folder for a styling trial, so the
// styled pages can never be committed and the fixtures stay editable.
// See src/pages/test-pages/_README.md.
import { cp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const SOURCE = 'src/pages/test-pages';
const TARGET = 'src/pages/trial';

// About the fixtures rather than one of them, so they stay behind.
const SKIP = new Set(['index.astro', '_README.md']);

const fresh = process.argv.includes('--fresh');

const exists = await stat(TARGET).then(() => true, () => false);
if (exists && !fresh) {
	console.log(`${TARGET} already exists. Run with --fresh to start over, or rm -rf it.`);
	process.exit(0);
}
if (exists) await rm(TARGET, { recursive: true });

await cp(SOURCE, TARGET, {
	recursive: true,
	filter: (path) => !SKIP.has(basename(path)),
});

// Links between pages point into the trial, so the styled shell and the
// styled pages stay together. The bare index link is left alone: the trial has
// no index of its own.
for (const name of await readdir(TARGET)) {
	const file = join(TARGET, name);
	const text = await readFile(file, 'utf8');
	await writeFile(file, text.replaceAll('/test-pages/', '/trial/'));
}

console.log(`Copied ${SOURCE} to ${TARGET}. Styled pages serve at /trial/<page>.`);
