// What Tabs hands the parts inside it, so a Tab or a TabPanel is written with
// only its value. Vue's tree, so the same island rule as `surface.ts` applies.
import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { Surface } from './surface.ts';

export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabsContext {
	current: Ref<string | undefined>;
	size: ComputedRef<TabsSize>;
	disabled: ComputedRef<boolean>;
	surface: ComputedRef<Surface>;
	select: (value: string) => void;
	// One id scheme for both ends of the tab/panel link.
	tabId: (value: string) => string;
	panelId: (value: string) => string;
}

export interface TabListContext {
	// Until the sliding indicator has measured the selected tab, that tab paints
	// its own white. This is what server-rendered HTML shows.
	indicatorReady: Ref<boolean>;
}

export const TabsKey: InjectionKey<TabsContext> = Symbol('tabs');
export const TabListKey: InjectionKey<TabListContext> = Symbol('tablist');
