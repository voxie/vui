---
title: Skills Intro
order: -1
---

A skill is a set of instructions written for an AI agent. It covers one job, like creating a component or reviewing a page for accessibility, and tells the agent how to do that job the Voxie way. The docs under `/docs` explain the system to a person. Skills say the same things as rules an agent can follow.

## Why skills exist

An agent working in a Voxie codebase has no way to know the conventions on its own. Left alone, it will pick its own colors, its own spacing, and its own component shapes. A skill closes that gap. It hands the agent the rules up front, so the output lands inside the system instead of needing to be pulled back into it.

## How to use one

Each skill is a page under `/skills/`. To use it, point your agent at it before the work starts.

1. Open the skill for the job at hand, such as [Create Component](/skills/create-component).
2. Give your agent the URL, or paste the page's contents into the prompt, and tell it to follow the instructions before making changes.
3. Review the result against the docs the skill is based on. A skill is a summary. The docs page for a component is the source of truth.

Skills are written for tools like Claude Code, Cursor, and Copilot, and they are plain Markdown, so they work anywhere an agent can read a URL or a pasted block of text.

## What's here

- [Create Component](/skills/create-component). How to add a new component to the system and its docs page.
- [Accessibility Review](/skills/accessibility-review). How to check a screen or component against the system's accessibility rules.
