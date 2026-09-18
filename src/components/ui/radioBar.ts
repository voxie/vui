// What a RadioBar hands to the radios inside it, so each one knows to draw
// itself as a pill in the bar rather than a circle beside a label.
import type { ComputedRef, InjectionKey, Ref } from 'vue';

export type RadioBarSize = 'sm' | 'md' | 'lg';

export interface RadioBarContext {
	size: ComputedRef<RadioBarSize>;
	disabled: ComputedRef<boolean>;
	invalid: ComputedRef<boolean>;
	// The id of the bar's error message, for each input's `aria-describedby`.
	describedBy: ComputedRef<string | undefined>;
	// True once the bar's sliding pill has measured the picked option, which
	// then stops painting its own fill.
	indicatorReady: Ref<boolean>;
}

export const RadioBarKey: InjectionKey<RadioBarContext> = Symbol('radioBar');
