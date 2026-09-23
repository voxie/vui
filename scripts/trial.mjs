// Copies the raw fixtures into an ignored folder for a styling trial, so the
// styled pages can never be committed and the fixtures stay editable.
// See src/pages/test-pages/_README.md.
import { cp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { basename, join } from 'node:path';

const SOURCE = 'src/pages/test-pages';
const TARGET = 'src/pages/trial';

// About the fixtures rather than one of them, so they stay behind.
const SKIP = new Set(['index.astro', '_README.md']);

const fresh = process.argv.includes('--fresh');
const remove = process.argv.includes('--remove');
// A trial styles from the docs or from the skills, never both, so the two can
// be compared. Only a skills trial links the skills in.
const mode = ['--docs', '--skills'].find((flag) => process.argv.includes(flag))?.slice(2);
if (!remove && !mode) {
	console.log('Pick a reference: npm run trial -- --docs or npm run trial -- --skills.');
	process.exit(1);
}

// The consumer skills are active here only during a skills trial, the same way
// a consuming repo sees them. Otherwise this repo runs on the docs alone.
const linkSkills = (...flags) => execFileSync('node', ['scripts/link-skills.mjs', '.claude/skills', ...flags], { stdio: 'inherit' });

const exists = await stat(TARGET).then(() => true, () => false);
if (remove) {
	if (exists) await rm(TARGET, { recursive: true });
	linkSkills('--unlink');
	console.log(`Removed ${TARGET}.`);
	process.exit(0);
}
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

linkSkills(...(mode === 'skills' ? [] : ['--unlink']));
console.log(`Copied ${SOURCE} to ${TARGET} for a ${mode} trial. Styled pages serve at /trial/<page>.`);
