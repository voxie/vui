// What a component is sitting on, provided down the tree rather than passed at
// every call site. Vue's tree, which reaches through slots but not across an
// Astro island: a `<Button>` inside a `<Card>` written in MDX is a separate app
// and inherits nothing, so examples that rely on this need one `.vue` file.
import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue';

// Four card surfaces, plus the page itself, which is the one no component can
// announce.
export type Surface = 'default' | 'glass' | 'sunken' | 'dark' | 'background';

// A symbol rather than a string, so the key can't be collided with by accident
// and the type travels with it.
const SurfaceKey: InjectionKey<ComputedRef<Surface>> = Symbol('surface');

// A getter rather than a value, so a card that changes surface re-colors the
// buttons inside it.
export function provideSurface(surface: () => Surface): void {
	provide(SurfaceKey, computed(surface));
}

// An explicit prop wins, for the cases no ancestor can answer. With neither,
// `default` is white, which is most of the application.
export function useSurface(override: () => Surface | undefined): ComputedRef<Surface> {
	const inherited = inject(SurfaceKey, null);
	return computed(() => override() ?? inherited?.value ?? 'default');
}

// What a form control draws its edge with, which is one thing at a time. The
// page background gets the shadow, since nothing else lifts a control off it,
// and its border goes transparent rather than away so an error state can
// recolor it without moving the text. A panel gets the border, one step darker
// on sunken to hold up against the darker surface.
export function useControlBoundary(
	override: () => Surface | undefined,
): ComputedRef<{ shadow: string; border: string }> {
	const surface = useSurface(override);
	return computed(() => {
		if (surface.value === 'background')
			return { shadow: 'shadow hover:shadow-md', border: 'border-transparent' };
		if (surface.value === 'sunken') return { shadow: 'shadow-none', border: 'border-slate-300' };
		return { shadow: 'shadow-none', border: 'border-slate-200' };
	});
}
