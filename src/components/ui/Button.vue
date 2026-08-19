<script setup lang="ts">
import { computed, ref } from 'vue';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonColor =
	| 'primary'
	| 'secondary'
	| 'muted-dark'
	| 'muted'
	| 'muted-light'
	| 'white'
	| 'transparent'
	| 'info'
	| 'danger'
	| 'success'
	| 'violet';

const props = withDefaults(
	defineProps<{
		href?: string;
		size?: ButtonSize;
		color?: ButtonColor;
		outline?: boolean;
		shadow?: boolean;
		disabled?: boolean;
		block?: boolean;
		loading?: boolean;
	}>(),
	{
		size: 'md',
		color: 'primary',
		outline: false,
		shadow: false,
		disabled: false,
		block: false,
		loading: false,
	},
);

const element = computed(() => (props.href ? 'a' : 'button'));

const outlineClasses = computed(() => {
	return props.outline
		? {
				background: ['opacity-0', 'group-hover/btn:opacity-10'],
				border: ['opacity-100'],
			}
		: {
				background: ['opacity-100'],
				border: ['opacity-100'],
			};
});

const shadowClasses = computed(() => ({
	'shadow hover:shadow-md': props.shadow,
}));

const sizeClasses = computed(() => {
	const md = {
		element: ['rounded-lg', 'px-4', 'text-xs', 'h-10'],
		content: ['gap-2'],
	};
	if (props.size === 'xs') {
		return {
			element: ['rounded', 'px-2', 'text-xs', 'h-6'],
			content: ['gap-1'],
		};
	}
	if (props.size === 'sm') {
		return {
			element: ['rounded-md', 'px-3', 'text-xs', 'h-8'],
			content: ['gap-1.5'],
		};
	}
	if (props.size === 'lg') {
		return {
			element: ['rounded-xl', 'px-5', 'text-sm', 'h-12'],
			content: ['gap-2'],
		};
	}
	if (props.size === 'xl') {
		return {
			element: ['rounded-2xl', 'px-8', 'text-sm', 'h-16'],
			content: ['gap-2'],
		};
	}
	return md;
});

const colorClasses = computed(() => {
	const primary = {
		element: ['text-black', 'hover:text-black'],
		background: ['bg-sky-300', 'group-hover/btn:bg-sky-400'],
		border: ['border-sky-300'],
	};

	if (props.color === 'secondary') {
		return {
			element: [props.outline ? 'text-black hover:text-black' : 'text-white hover:text-white'],
			background: ['bg-slate-600', 'group-hover/btn:bg-slate-700'],
			border: ['border-slate-600'],
		};
	}

	if (props.color === 'muted-dark') {
		return {
			element: ['text-black', 'hover:text-black'],
			background: ['bg-slate-300', 'group-hover/btn:bg-slate-400'],
			border: ['border-slate-300'],
		};
	}

	if (props.color === 'muted') {
		return {
			element: ['text-black', 'hover:text-black'],
			background: ['bg-slate-200', 'group-hover/btn:bg-slate-300'],
			border: ['border-slate-200'],
		};
	}

	if (props.color === 'muted-light') {
		return {
			element: ['text-black', 'hover:text-black'],
			background: ['bg-slate-100', 'group-hover/btn:bg-slate-200'],
			border: ['border-slate-100'],
		};
	}

	if (props.color === 'white') {
		return {
			element: ['text-black', 'hover:text-black'],
			background: ['bg-white', 'group-hover/btn:bg-slate-50'],
			border: ['border-white'],
		};
	}

	if (props.color === 'transparent') {
		return {
			element: ['text-black', 'hover:text-black'],
			background: ['bg-transparent', 'group-hover/btn:bg-slate-200'],
			border: ['border-transparent'],
		};
	}

	if (props.color === 'info') {
		return {
			element: ['text-slate-800', 'hover:text-slate-800'],
			background: ['bg-amber-300', 'group-hover/btn:bg-amber-400'],
			border: ['border-amber-300'],
		};
	}

	if (props.color === 'success') {
		return {
			element: ['text-black', 'hover:text-black'],
			background: ['bg-teal-300', 'group-hover/btn:bg-teal-400'],
			border: ['border-teal-300'],
		};
	}

	if (props.color === 'violet') {
		return {
			element: ['text-black', 'hover:text-black'],
			background: ['bg-violet-300', 'group-hover/btn:bg-violet-400'],
			border: ['border-violet-300'],
		};
	}

	if (props.color === 'danger') {
		return {
			element: ['text-black', 'hover:text-black'],
			background: ['bg-rose-300', 'group-hover/btn:bg-rose-400'],
			border: ['border-rose-300'],
		};
	}

	return primary;
});

const blockClasses = computed(() => (props.block ? ['w-full', 'flex'] : ['inline-flex']));

const buttonRef = ref();

defineExpose({
	focus: () => buttonRef.value?.focus?.(),
});
</script>

<template>
	<component
		ref="buttonRef"
		:is="element"
		:href="props.href"
		:type="props.href ? undefined : 'button'"
		:disabled="props.href ? undefined : props.disabled"
		class="cursor-pointer group/btn font-sans relative z-0 font-semibold outline-blue-600 transition focus-visible:outline-2 focus-visible:outline-offset-4 active:outline-hidden items-center disabled:opacity-50 disabled:pointer-events-none justify-center hover:no-underline bg-transparent text-center will-change-transform"
		:class="[
			colorClasses.element,
			sizeClasses.element,
			shadowClasses,
			blockClasses,
			{
				'opacity-50 pointer-events-none': props.disabled && props.href,
			},
		]"
	>
		<div
			aria-hidden="true"
			class="absolute inset-0 -z-40 rounded-[inherit] duration-200 group-active/btn:scale-90 group-active/btn:opacity-30!"
			:class="[colorClasses.background, outlineClasses.background]"
		></div>
		<div
			aria-hidden="true"
			class="absolute inset-0 -z-30 rounded-[inherit] border border-solid duration-200 group-active/btn:scale-90"
			:class="[colorClasses.border, outlineClasses.border]"
		></div>

		<div>
			<div
				class="flex items-center justify-center whitespace-nowrap transition"
				:class="[
					sizeClasses.content,
					{
						'opacity-0 ease-in motion-safe:scale-0': props.loading,
						'duration-700 ease-[cubic-bezier(0,1.3,.3,1)]': !props.loading,
					},
				]"
			>
				<slot />
			</div>
		</div>

		<div
			class="absolute left-1/2 inline-flex -translate-x-1/2 gap-1.5 text-sm transition"
			:class="
				!props.loading
					? 'opacity-0 motion-safe:scale-0'
					: 'delay-150 duration-500 ease-[cubic-bezier(0,2,.3,1)]'
			"
		>
			<i class="fa-solid fa-spinner-third fa-spin [--fa-animation-duration:0.7s]" aria-hidden="true"></i>
		</div>
	</component>
</template>
