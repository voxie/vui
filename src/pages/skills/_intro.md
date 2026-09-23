A skill is a set of instructions written for an AI agent. It covers one job, like laying out a page or building a form, and tells the agent how to do that job the Voxie way. The docs under `/docs` explain the system to a person. Skills say the same things as rules an agent can follow.

## Why skills exist

An agent working in a Voxie codebase has no way to know the conventions on its own. Left alone, it will pick its own colors, its own spacing, and its own component shapes. A skill closes that gap. It hands the agent the rules up front, so the output lands inside the system instead of needing to be pulled back into it.

## How skills are used

Each skill is a folder in this repo's `skills/` directory holding a `SKILL.md`, the format Claude Code reads natively. Once a skill is installed in a project, Claude Code loads its description on every turn and pulls in the full instructions on its own when a task matches. Nobody has to remember the skill exists or paste anything in.

In `product-prototypes` this is already set up. Clone the repo, run `pnpm install`, and start Claude Code in that directory. The vui skills are there.

To set up another repo, add vui as a git submodule and run the link script from your `package.json`, so every install refreshes the links:

```json
{
  "scripts": {
    "prepare": "git submodule update --init && node vui/scripts/link-skills.mjs"
  }
}
```

The script symlinks each skill into the repo's `.claude/skills/`, adds new ones, and removes links for skills that no longer exist. Commit the symlinks, so a fresh checkout has them before anyone runs install. To update, bump the submodule and run `pnpm install` again.

For a tool that reads a URL instead, like Cursor or Copilot, each skill is also a page under `/skills/`. Give the agent the URL, or paste the page's contents into the prompt, and tell it to follow the instructions before making changes. This is one-shot, so repeat it in each new conversation.

## Reviewing the result

A skill is a summary. The docs page it is based on is the source of truth. Check the output against those pages, and fix the skill when the two disagree.
