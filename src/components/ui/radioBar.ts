// What a RadioBar hands to the radios inside it, so each one knows to draw
// itself as a pill in the bar rather than a circle beside a label.
import type { ComputedRef, InjectionKey } from 'vue';

export type RadioBarSize = 'sm' | 'md' | 'lg';

export interface RadioBarContext {
	size: ComputedRef<RadioBarSize>;
	disabled: ComputedRef<boolean>;
	invalid: ComputedRef<boolean>;
	// The id of the bar's error message, for each input's `aria-describedby`.
	describedBy: ComputedRef<string | undefined>;
}

export const RadioBarKey: InjectionKey<RadioBarContext> = Symbol('radioBar');
