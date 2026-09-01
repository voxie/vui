<script setup lang="ts">
// Two modals, the first marked `stacked` while the second is open. One
// component so both live in the same Vue tree.
import { ref } from 'vue';
import Modal from '@ui/Modal.vue';
import Button from '@ui/Button.vue';

const first = ref(false);
const second = ref(false);
</script>

<template>
	<div class="not-prose">
		<Button @click="first = true">Open</Button>

		<Modal v-model="first" size="md" :stacked="second">
			<template #header>Delete this campaign</template>
			<template #subheader>Everything scheduled under it stops going out.</template>

			<p class="text-sm">Spring promo has 2,410 contacts enrolled and 6 messages left to send.</p>

			<template #footer>
				<Button color="rose" block @click="second = true">Delete campaign</Button>
			</template>
		</Modal>

		<Modal v-model="second" size="sm" :backdrop="false">
			<template #header>Are you sure?</template>

			<p class="text-sm">This can't be undone.</p>

			<template #footer>
				<Button @click="second = false">Go back</Button>
				<Button
					color="rose"
					block
					@click="
						second = false;
						first = false;
					"
				>
					Delete
				</Button>
			</template>
		</Modal>
	</div>
</template>
