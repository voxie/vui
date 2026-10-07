<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { SearchRecord } from '@lib/search';

const props = defineProps<{ indexUrl: string }>();

const open = ref(false);
const query = ref('');
const records = ref<SearchRecord[] | null>(null);
const active = ref(0);
const input = ref<HTMLInputElement | null>(null);
const list = ref<HTMLElement | null>(null);

// Fetched once, the first time the palette opens.
let loading: Promise<void> | null = null;
const load = () => {
	loading ??= fetch(props.indexUrl)
		.then((response) => response.json())
		.then((data: SearchRecord[]) => {
			records.value = data;
		});
	return loading;
};

type Hit = SearchRecord & { score: number };
type Group = { page: string; section: string; hits: Hit[] };

const terms = computed(() => query.value.toLowerCase().split(/\s+/).filter(Boolean));

// Every term has to appear somewhere in the record. Where it appears sets the
// score: the page title outranks a heading, which outranks the body.
const groups = computed<Group[]>(() => {
	if (!records.value) return [];

	let hits: Hit[];
	if (terms.value.length === 0) {
		hits = records.value.filter((r) => !r.heading).map((r) => ({ ...r, score: 0 }));
	} else {
		hits = [];
		for (const record of records.value) {
			const page = record.page.toLowerCase();
			const heading = (record.heading ?? '').toLowerCase();
			const text = record.text.toLowerCase();
			let score = 0;
			for (const term of terms.value) {
				if (page.includes(term)) score += 10;
				else if (heading.includes(term)) score += 5;
				else if (text.includes(term)) score += 1;
				else {
					score = -1;
					break;
				}
			}
			if (score >= 0) hits.push({ ...record, score });
		}
		hits.sort((a, b) => b.score - a.score);
		hits = hits.slice(0, 30);
	}

	const byPage = new Map<string, Group>();
	for (const hit of hits) {
		const key = `${hit.section}/${hit.page}`;
		let group = byPage.get(key);
		if (!group) {
			group = { page: hit.page, section: hit.section, hits: [] };
			byPage.set(key, group);
		}
		group.hits.push(hit);
	}
	return [...byPage.values()];
});

const flat = computed(() => groups.value.flatMap((g) => g.hits));

watch(flat, () => {
	active.value = 0;
});

const indexOf = (hit: Hit) => flat.value.indexOf(hit);

// A short window of the body around the first term, so the match is visible.
const snippet = (text: string) => {
	if (!text) return '';
	const lower = text.toLowerCase();
	const at = terms.value.map((t) => lower.indexOf(t)).find((i) => i !== -1) ?? 0;
	const start = Math.max(0, at - 40);
	const end = Math.min(text.length, start + 120);
	return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
};

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const highlight = (text: string) => {
	let html = escapeHtml(text);
	for (const term of terms.value) {
		const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
		html = html.replace(pattern, '<mark class="bg-transparent text-sky-700 font-semibold">$&</mark>');
	}
	return html;
};

const show = async () => {
	open.value = true;
	load();
	await nextTick();
	input.value?.focus();
	input.value?.select();
};

const hide = () => {
	open.value = false;
};

const go = (hit: Hit) => {
	hide();
	window.location.href = hit.href;
};

const scrollActiveIntoView = () => {
	const item = list.value?.querySelector<HTMLElement>(`[data-index="${active.value}"]`);
	item?.scrollIntoView({ block: 'nearest' });
};

const onInputKeydown = (event: KeyboardEvent) => {
	if (event.key === 'ArrowDown') {
		event.preventDefault();
		active.value = Math.min(flat.value.length - 1, active.value + 1);
		scrollActiveIntoView();
	} else if (event.key === 'ArrowUp') {
		event.preventDefault();
		active.value = Math.max(0, active.value - 1);
		scrollActiveIntoView();
	} else if (event.key === 'Enter') {
		const hit = flat.value[active.value];
		if (hit) go(hit);
	}
};

const onKeydown = (event: KeyboardEvent) => {
	if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
		event.preventDefault();
		open.value ? hide() : show();
	} else if (event.key === 'Escape' && open.value) {
		event.preventDefault();
		hide();
	}
};

// Any element on the page marked `data-search-open` opens the palette, so the
// sidebar's trigger stays plain markup in its Astro file.
const onClick = (event: MouseEvent) => {
	if (event.target instanceof Element && event.target.closest('[data-search-open]')) {
		event.preventDefault();
		show();
	}
};

onMounted(() => {
	document.addEventListener('keydown', onKeydown);
	document.addEventListener('click', onClick);
});

onBeforeUnmount(() => {
	document.removeEventListener('keydown', onKeydown);
	document.removeEventListener('click', onClick);
});
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition duration-150 ease-out"
			enter-from-class="opacity-0"
			leave-active-class="transition duration-100 ease-in"
			leave-to-class="opacity-0"
		>
			<div v-if="open" class="fixed inset-0 z-50 bg-slate-300/80" @click="hide"></div>
		</Transition>

		<Transition
			enter-active-class="transition duration-150 ease-out"
			enter-from-class="opacity-0 scale-95"
			leave-active-class="transition duration-100 ease-in"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-if="open"
				class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] sm:pt-[15vh] pointer-events-none"
			>
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Search documentation"
					class="pointer-events-auto flex w-full max-w-xl max-h-[70vh] flex-col overflow-hidden rounded-2xl bg-white text-sm text-slate-700 shadow-xl shadow-slate-400"
				>
					<div class="flex items-center gap-3 border-b border-slate-100 px-4">
						<i aria-hidden="true" class="fa-solid fa-magnifying-glass text-slate-400"></i>
						<input
							ref="input"
							v-model="query"
							type="text"
							placeholder="Search docs, components, and skills…"
							autocomplete="off"
							autocorrect="off"
							autocapitalize="off"
							spellcheck="false"
							role="combobox"
							aria-expanded="true"
							aria-controls="search-results"
							aria-autocomplete="list"
							class="h-14 flex-1 bg-transparent text-base text-slate-800 placeholder:text-slate-400 outline-none"
							@keydown="onInputKeydown"
						/>
						<kbd class="hidden sm:inline-block rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-2xs font-semibold text-slate-500">esc</kbd>
					</div>

					<div ref="list" id="search-results" role="listbox" class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-2">
						<template v-if="records === null">
							<p class="px-3 py-8 text-center text-slate-400">Loading…</p>
						</template>
						<template v-else-if="flat.length === 0">
							<p class="px-3 py-8 text-center text-slate-500">
								No results for <span class="font-semibold text-slate-800">“{{ query }}”</span>
							</p>
						</template>
						<template v-else>
							<div v-for="group in groups" :key="group.section + group.page" class="mb-2 last:mb-0">
								<h3 v-if="terms.length" class="px-3 py-1.5 text-xs font-extrabold text-slate-800">
									{{ group.page }}
									<span class="font-normal text-slate-400"> · {{ group.section }}</span>
								</h3>
								<ul>
									<li v-for="hit in group.hits" :key="hit.href">
										<a
											:href="hit.href"
											role="option"
											:data-index="indexOf(hit)"
											:aria-selected="indexOf(hit) === active"
											class="group/hit flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:no-underline"
											:class="indexOf(hit) === active ? 'bg-sky-50 text-sky-900' : ''"
											@mousemove="active = indexOf(hit)"
											@click.prevent="go(hit)"
										>
											<span
												class="flex size-7 shrink-0 items-center justify-center rounded-md border text-xs"
												:class="
													indexOf(hit) === active
														? 'border-sky-300 bg-sky-300 text-black'
														: 'border-slate-200 bg-slate-50 text-slate-500'
												"
											>
												<i aria-hidden="true" :class="hit.heading ? 'fa-solid fa-hashtag' : 'fa-solid fa-file-lines'"></i>
											</span>
											<span class="min-w-0 flex-1">
												<span
													class="block truncate font-semibold"
													:class="indexOf(hit) === active ? 'text-sky-950 [&_mark]:text-sky-700' : 'text-slate-800'"
													v-html="highlight(hit.heading ?? hit.page)"
												></span>
												<span
													v-if="terms.length && hit.text"
													class="block truncate text-xs"
													:class="indexOf(hit) === active ? 'text-sky-800 [&_mark]:text-sky-700' : 'text-slate-500'"
													v-html="highlight(snippet(hit.text))"
												></span>
												<span
													v-else-if="!terms.length"
													class="block truncate text-xs"
													:class="indexOf(hit) === active ? 'text-sky-800' : 'text-slate-500'"
													>{{ hit.section }}</span
												>
											</span>
											<span class="text-xs" :class="indexOf(hit) === active ? 'text-sky-700' : 'invisible'">
												<i aria-hidden="true" class="fa-solid fa-arrow-turn-down-left"></i>
											</span>
										</a>
									</li>
								</ul>
							</div>
						</template>
					</div>

					<div class="hidden sm:flex items-center gap-4 border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
						<span><kbd class="font-sans font-semibold text-slate-700">↑↓</kbd> to navigate</span>
						<span><kbd class="font-sans font-semibold text-slate-700">↵</kbd> to open</span>
						<span><kbd class="font-sans font-semibold text-slate-700">esc</kbd> to close</span>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
