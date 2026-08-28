/*
  What a component is sitting on, and how it finds out.

  Two different things get called a surface, and keeping them apart is what
  this file is for. `Card` and `Navbar` take a `surface` prop that says what
  they *are*. `Button` and `NavbarAction` need to know what they are *on*,
  because slate and transparent step one level away from whatever is behind
  them. That second one is a fact about an ancestor, not about the button, so
  it comes down the tree rather than being passed by hand at every call site.

  The tree is Vue's, which is the one limit worth knowing. It reaches through
  slots — content written for `#left` is mounted inside the bar, so it reads
  the bar — but it does not reach across an Astro island. A `<Card>` written in
  MDX renders its children to HTML before Vue ever sees them, so a `<Button>`
  written inside it is a separate app and inherits nothing. Documentation
  examples that depend on this have to be composed inside a single `.vue` file.
*/
import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue';

/*
  The five things a component can be sitting on. Four are card surfaces; the
  fifth is the page itself, which is the one no component can announce.
*/
export type Surface = 'default' | 'glass' | 'sunken' | 'dark' | 'background';

// A symbol rather than a string, so the key can't be collided with by accident
// and the type travels with it.
const SurfaceKey: InjectionKey<ComputedRef<Surface>> = Symbol('surface');

/*
  Called by anything that is a surface. A getter rather than a value, so a card
  that changes surface re-colors the buttons inside it.
*/
export function provideSurface(surface: () => Surface): void {
	provide(SurfaceKey, computed(surface));
}

/*
  Called by anything that sits on one. An explicit prop wins, for the two cases
  no ancestor can answer: a button on the page background, and one inside a
  plain element with a background class on it. With neither, `default` is
  white, which is what most of the application is.
*/
export function useSurface(override: () => Surface | undefined): ComputedRef<Surface> {
	const inherited = inject(SurfaceKey, null);
	return computed(() => override() ?? inherited?.value ?? 'default');
}
