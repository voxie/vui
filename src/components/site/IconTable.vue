<script setup lang="ts">
// The icon reference for the Icons foundations page. Search runs over the name,
// the variant and both guidance columns.
import { computed, ref } from 'vue';
import Input from '@ui/Input.vue';
import { icons } from './icons';

const query = ref('');

const matches = computed(() => {
	const needle = query.value.trim().toLowerCase();
	if (!needle) return icons;
	return icons.filter((icon) =>
		`${icon.name} ${icon.variant} ${icon.represents} ${icon.avoid ?? ''}`
			.toLowerCase()
			.includes(needle),
	);
});
</script>

<template>
	<div class="not-prose">
		<Input
			v-model="query"
			type="search"
			sits-on="background"
			placeholder="Search icons"
			aria-label="Search icons"
		>
			<template #left>
				<i aria-hidden="true" class="fa-solid fa-magnifying-glass"></i>
			</template>
		</Input>

		<p class="mt-3 text-2xs text-slate-500" aria-live="polite">
			{{ matches.length }} of {{ icons.length }}
		</p>

		<!-- Auto layout, so the three narrow columns size to their content and a
		     longer icon name widens its column instead of spilling into the next. -->
		<table class="mt-2 w-full border-collapse text-left text-xs">
			<thead>
				<tr class="border-b border-slate-300 text-slate-800">
					<th class="py-2 pe-6 font-extrabold">Icon</th>
					<th class="py-2 pe-6 font-extrabold">Name</th>
					<th class="py-2 pe-6 font-extrabold">Variant</th>
					<th class="py-2 pe-6 font-extrabold">Represents in Voxie</th>
					<th class="py-2 font-extrabold">Don't use for</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="icon in matches"
					:key="`${icon.variant} ${icon.name}`"
					class="border-b border-slate-200 align-top"
				>
					<td class="py-3 pe-6">
						<i
							aria-hidden="true"
							class="block w-4 text-center text-sm text-slate-700"
							:class="[`fa-${icon.variant}`, `fa-${icon.name}`]"
						></i>
					</td>
					<td class="py-3 pe-6">
						<code class="font-mono whitespace-nowrap text-slate-800">{{ icon.name }}</code>
					</td>
					<td class="py-3 pe-6 whitespace-nowrap text-slate-500">{{ icon.variant }}</td>
					<td class="py-3 pe-6">{{ icon.represents }}</td>
					<td class="py-3">{{ icon.avoid }}</td>
				</tr>

				<tr v-if="!matches.length">
					<td colspan="5" class="py-4 text-slate-500">No icon matches “{{ query }}”.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
