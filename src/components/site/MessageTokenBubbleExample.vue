<script setup lang="ts">
// The workflow builder's Send card, with the message preview drawing its tokens.
import Card from '@ui/Card.vue';
import MessageTokenText from './MessageTokenText.vue';
import { message } from './messageToken';
</script>

<template>
	<Card surface="sunken">
		<div class="not-prose flex justify-center py-4">
			<div class="flex w-60 flex-col rounded-lg border border-white bg-white/80 p-0.5 shadow-sm">
				<div class="flex h-11 shrink-0 items-center gap-2 rounded-t-[9px] rounded-b-[4px] border-b border-b-sky-400/50 bg-sky-300 pr-2 pl-2.5">
					<i class="fa-solid fa-paper-plane shrink-0 text-sm text-sky-800" aria-hidden="true"></i>
					<span class="flex-1 text-sm leading-none font-semibold text-sky-800">Send</span>
				</div>
				<div class="flex flex-col gap-2 px-3 py-3">
					<!-- Relaxed leading, so a snug token sits inside the line with air. -->
					<div class="rounded-l-lg rounded-tr-lg rounded-br border border-sky-200 bg-sky-100 px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap text-slate-800"><MessageTokenText :text="message" /></div>
					<div class="flex flex-col gap-0.5 text-xs leading-tight text-slate-400">
						<span>Marketing</span>
						<span>Safe hours</span>
						<span>From entry context</span>
					</div>
				</div>
			</div>
		</div>
	</Card>
</template>
