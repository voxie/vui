<script setup lang="ts">
// The Send drawer's message box. A drawing of the field, not an editor: the
// text can't be typed into, and a press on a token only reports itself.
import { ref } from 'vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';
import MessageTokenText from './MessageTokenText.vue';
import { message } from './messageToken';

const count = ref(message.replace(/\s*\?\?[^}]*/g, '').length);
</script>

<template>
	<Card>
		<div class="not-prose mx-auto max-w-sm">
			<div class="px-1 py-2 text-sm text-slate-500">Message content</div>
			<div class="rounded-lg border border-slate-200 bg-slate-50">
				<div class="flex flex-col gap-2 p-4">
					<div class="min-h-28 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap text-slate-800"><MessageTokenText :text="message" press /></div>
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
