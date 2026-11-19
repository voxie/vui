<script setup lang="ts">
// Demo only. Draws a message's `{{level=>path}}` variables as tokens, with a
// fallback chain written `{{a ?? b ?? "text"}}` or `{{a ?? exit}}`.
import { computed } from 'vue';
import MessageToken from '@ui/MessageToken.vue';

const props = defineProps<{ text: string; press?: boolean; selected?: number }>();

const NAMES: Record<string, string> = {
	'contact=>first_name': 'First name',
	'contact=>last_name': 'Last name',
	'team=>name': 'Team name',
	'group=>name': 'Group name',
	'group=>custom_attributes=>booking_link': 'Booking link',
	'group=>custom_attributes=>campus_tours=>schedule': 'Tour schedule',
	'contact=>local=>custom_attributes=>program_interest': 'Program interest',
};
const SOURCES: Record<string, string> = {
	contact: 'a contact field shared across contexts',
	team: 'a team field',
	group: "a group field from the enrollment's group",
	local: 'a local attribute read from this context',
	'contact custom': 'a contact custom attribute shared across contexts',
	'team custom': 'a team custom attribute',
	'group custom': "a group custom attribute from the enrollment's group",
	'local custom': 'a local custom attribute read from this context',
};

export type Pressed = { index: number; path: string };
defineEmits<{ press: [token: Pressed] }>();

type Part = { text: string } | { path: string; fallback?: 'next' | 'exit'; description: string; before: string; after: string };

function token(inner: string) {
	const steps = inner.split('??').map((step) => step.trim());
	const [path, ...rest] = steps;
	const exits = rest.at(-1) === 'exit';
	const fallback = !rest.length ? undefined : exits && rest.length === 1 ? ('exit' as const) : ('next' as const);
	const words = rest.map((step) => (step === 'exit' ? 'the flow exits' : (NAMES[step] ?? step)));
	const level = path.startsWith('contact=>local=>') ? 'local' : path.split('=>')[0];
	const source = SOURCES[path.includes('=>custom_attributes=>') ? `${level} custom` : level] ?? 'a field';
	const description = `${NAMES[path] ?? path}, ${source}.${words.length ? ` If empty: ${words.join(', then ')}.` : ''}`;
	return { path, fallback, description };
}

const parts = computed(() => {
	const out: Part[] = [];
	let last = 0;
	for (const match of props.text.matchAll(/\{\{([^}]+)\}\}/g)) {
		let lead = props.text.slice(last, match.index);
		// Punctuation touching a token goes to the token.
		const before = lead.match(/[("“‘]+$/)?.[0] ?? '';
		lead = lead.slice(0, lead.length - before.length);
		if (lead) out.push({ text: lead });
		const end = match.index + match[0].length;
		const after = props.text.slice(end).match(/^[!?.,:;)"”’]+/)?.[0] ?? '';
		out.push({ ...token(match[1]), before, after });
		last = end + after.length;
	}
	if (last < props.text.length) out.push({ text: props.text.slice(last) });
	return out;
});
</script>

<template>
	<template v-for="(part, i) in parts" :key="i"><MessageToken v-if="'path' in part" :path="part.path" :fallback="part.fallback" :description="part.description" :press="press" :selected="selected === i" :contenteditable="press ? 'false' : undefined" :data-token="`{{${part.path}}}${part.before}${part.after}`" :before="part.before" :after="part.after" @press="$emit('press', { index: i, path: part.path })" /><template v-else>{{ part.text }}</template></template>
</template>
