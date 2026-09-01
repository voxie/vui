<script setup lang="ts">
// A trigger and one modal, parameterized so the docs page can show a prop by
// opening the real thing. The content is canned, apart from the parts a given
// example is about.
import { ref } from 'vue';
import Modal from '@ui/Modal.vue';
import Button from '@ui/Button.vue';
import Input from '@ui/Input.vue';

const props = withDefaults(
	defineProps<{
		label?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		backdrop?: boolean;
		dismissible?: boolean;
		header?: boolean;
		// Enough content to make the body scroll.
		long?: boolean;
	}>(),
	{
		label: 'Open',
		size: 'md',
		backdrop: true,
		dismissible: true,
		header: true,
		long: false,
	},
);

const open = ref(false);
const name = ref('');
</script>

<template>
	<div class="not-prose">
		<Button @click="open = true">{{ props.label }}</Button>

		<Modal
			v-model="open"
			:size="props.size"
			:backdrop="props.backdrop"
			:dismissible="props.dismissible"
			:aria-label="props.header ? undefined : 'Create an API token'"
		>
			<template v-if="props.header" #header>Create an API token</template>
			<template v-if="props.header" #subheader>
				A token reads and writes on behalf of your team. Store it somewhere safe.
			</template>

			<div class="space-y-4">
				<Input v-model="name" block placeholder="Token name" />
				<p v-for="index in props.long ? 12 : 1" :key="index" class="text-sm">
					Tokens don't expire. Revoke one from the list when it stops being used.
				</p>
			</div>

			<template #footer>
				<Button @click="open = false">Cancel</Button>
				<Button color="sky" block @click="open = false">Create token</Button>
			</template>
		</Modal>
	</div>
</template>
