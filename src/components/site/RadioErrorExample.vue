<script setup lang="ts">
// One tree, so the two radios really are a group and picking one unpicks the
// other. The message sits on the last one, where it reads as the group's.
import { ref } from 'vue';
import Radio from '@ui/Radio.vue';
import Card from '@ui/Card.vue';

const when = ref<string>();
</script>

<template>
	<Card surface="glass">
		<div class="not-prose flex flex-col gap-2">
			<Radio v-model="when" name="error-group" value="now" label="Send now" />
			<Radio
				v-model="when"
				name="error-group"
				value="later"
				label="Schedule for later"
				:error="when ? undefined : 'Pick when this campaign should go out'"
			/>
		</div>
	</Card>
</template>
