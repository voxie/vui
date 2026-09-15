// The one list of page layouts the docs preview. `as const` gives both
// components the union without repeating it.
export const layouts = ['base', 'create', 'edit', 'settings'] as const;
export type Layout = (typeof layouts)[number];
