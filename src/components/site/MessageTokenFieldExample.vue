<script setup lang="ts">
// The Send drawer's message box. The text edits in place, and a press on a token opens a placeholder panel below.
import { ref } from 'vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';
import MessageTokenText, { type Pressed } from './MessageTokenText.vue';
import { message as shared } from './messageToken';

// A nested custom attribute, then a plain line to compare line spacing with and without tokens.
const message = `${shared} Tours run {{group=>custom_attributes=>campus_tours=>schedule}} and take about thirty minutes. Bring any questions you have about schedules, tuition or enrollment, and we will walk you through everything in person.`;

const count = ref(message.replace(/\s*\?\?[^}]*/g, '').length);
const field = ref<HTMLElement>();
// A token counts as its variable, not as the text the chip draws.
function recount() {
	const tokens = [...(field.value?.querySelectorAll<HTMLElement>('[data-token]') ?? [])];
	count.value = tokens.reduce((sum, token) => sum + token.dataset.token!.length - token.textContent!.length, field.value?.textContent?.length ?? 0);
	if (active.value && !tokens.some((token) => token.dataset.token!.startsWith(`{{${active.value!.path}}}`))) active.value = undefined;
}


const active = ref<Pressed>();
// A second press on the same token closes its panel.
const press = (token: Pressed) => (active.value = active.value?.index === token.index ? undefined : token);
</script>

<template>
	<Card>
		<div class="not-prose mx-auto max-w-sm">
			<div class="px-1 py-2 text-sm text-slate-500">Message content</div>
			<div class="rounded-lg border border-slate-200 bg-slate-50">
				<div class="flex flex-col gap-2 p-4">
					<div ref="field" contenteditable="plaintext-only" role="textbox" aria-multiline="true" aria-label="Message content" spellcheck="false" class="min-h-28 w-full rounded-lg border border-slate-200 bg-white p-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-slate-800 outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2" @input="recount"><MessageTokenText :text="message" press :selected="active?.index" @press="press" /></div>
					<div v-if="active" class="flex items-center justify-between gap-2 rounded-lg border border-dashed border-slate-300 bg-white py-1.5 pr-1.5 pl-3 text-sm text-slate-500">
						<span>Placeholder. The editor's own panel opens here.</span>
						<Button size="xs" color="transparent" class="size-7! shrink-0 px-0! text-slate-500 hover:text-slate-900" aria-label="Close" @click="active = undefined"><i class="fa-solid fa-xmark" aria-hidden="true"></i></Button>
					</div>
					<div class="flex items-center justify-between">
						<p class="m-0 text-xs text-slate-500">{{ count }} characters</p>
						<div class="flex items-center gap-0.5">
							<Button size="xs" color="transparent" class="size-7! px-0! text-slate-500 hover:text-slate-900" aria-label="Insert snippet"><i class="fa-regular fa-file-lines" aria-hidden="true"></i></Button>
							<Button size="xs" color="transparent" class="size-7! px-0! text-slate-500 hover:text-slate-900" aria-label="Insert variable"><i class="fa-solid fa-brackets-curly" aria-hidden="true"></i></Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
</template>
