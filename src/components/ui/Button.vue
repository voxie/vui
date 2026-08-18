<script setup lang="ts">
defineProps<{
	href?: string;
}>();
</script>

<template>
	<component
		:is="href ? 'a' : 'button'"
		:href="href"
		:type="href ? undefined : 'button'"
		class="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 gap-1"
	>
		<slot />
	</component>
</template>
