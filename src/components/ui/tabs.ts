// What Tabs hands each Tab inside it, so a tab is written with only its value
// and label. Vue's tree, so the same island rule as `surface.ts` applies.
import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { Surface } from './surface.ts';

export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabsContext {
	current: Ref<string | undefined>;
	size: ComputedRef<TabsSize>;
	disabled: ComputedRef<boolean>;
	surface: ComputedRef<Surface>;
	// Until the sliding indicator has measured the selected tab, that tab paints
	// its own white. This is what server-rendered HTML shows.
	indicatorReady: Ref<boolean>;
	select: (value: string) => void;
}

export const TabsKey: InjectionKey<TabsContext> = Symbol('tabs');
