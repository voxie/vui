#!/usr/bin/env node
// Symlinks every skills/<name>/SKILL.md directory in this repo into a consumer's
// .claude/skills/, and removes links it created earlier for skills that no longer exist.
// Usage: node vui/scripts/link-skills.mjs [target-dir] [--unlink]   (default: ./.claude/skills)
import { existsSync, lstatSync, mkdirSync, readdirSync, readlinkSync, symlinkSync, unlinkSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillsDir = resolve(dirname(fileURLToPath(import.meta.url)), '../skills');
const args = process.argv.slice(2);
const unlink = args.includes('--unlink');
const targetDir = resolve(args.find((a) => !a.startsWith('--')) ?? join(process.cwd(), '.claude/skills'));

// With --unlink every managed link counts as stale.
const skills = existsSync(skillsDir) && !unlink
	? readdirSync(skillsDir, { withFileTypes: true })
			.filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, 'SKILL.md')))
			.map((d) => d.name)
	: [];

mkdirSync(targetDir, { recursive: true });

// Drop stale links: symlinks in the target that point into skillsDir but at a skill that is gone.
let removed = 0;
for (const entry of readdirSync(targetDir)) {
	const path = join(targetDir, entry);
	if (!lstatSync(path).isSymbolicLink()) continue;
	const dest = resolve(targetDir, readlinkSync(path));
	const insideSkills = !relative(skillsDir, dest).startsWith('..');
	if (insideSkills && !skills.includes(entry)) {
		unlinkSync(path);
		removed++;
	}
}

let added = 0;
for (const name of skills) {
	const path = join(targetDir, name);
	const wanted = relative(targetDir, join(skillsDir, name));
	if (lstatSync(path, { throwIfNoEntry: false })?.isSymbolicLink()) {
		if (readlinkSync(path) === wanted) continue;
		unlinkSync(path);
	} else if (existsSync(path)) {
		console.warn(`skip ${name}: ${path} exists and is not a symlink`);
		continue;
	}
	symlinkSync(wanted, path, 'dir');
	added++;
}

console.log(`vui skills: ${skills.length} linked into ${relative(process.cwd(), targetDir) || '.'} (${added} added, ${removed} removed)`);
