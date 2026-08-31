<template>
	<!-- Eight spokes stepped round one position at a time, so the fade around
	     the ring reads as the thing that's moving. Reduced motion pulses instead. -->
	<svg
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		class="spin inline-flex h-auto w-4 fill-current motion-reduce:animate-pulse"
	>
		<!-- Paths run clockwise from twelve o'clock. The rotation is clockwise
		     too, so the fade has to run the other way for the tail to trail. -->
		<path
			class="opacity-0 motion-reduce:opacity-100"
			d="M18 2C18 0.9375 17.0625 0 16 0C14.875 0 14 0.9375 14 2V6C14 7.125 14.875 8 16 8C17.0625 8 18 7.125 18 6V2Z"
		/>
		<path
			class="opacity-0 motion-reduce:opacity-100"
			d="M21.625 10.375C20.875 9.5625 20.875 8.3125 21.625 7.5625L24.4375 4.6875C25.25 3.9375 26.5 3.9375 27.3125 4.6875C28.0625 5.5 28.0625 6.75 27.3125 7.5625L24.4375 10.375C23.6875 11.125 22.4375 11.125 21.625 10.375Z"
		/>
		<path
			class="opacity-5 motion-reduce:opacity-100"
			d="M24 16C24 14.9375 24.875 14 26 14H30C31.0625 14 32 14.9375 32 16C32 17.125 31.0625 18 30 18H26C24.875 18 24 17.125 24 16Z"
		/>
		<path
			class="opacity-10 motion-reduce:opacity-100"
			d="M21.625 21.6875C22.4375 20.875 23.6875 20.875 24.4375 21.6875L27.3125 24.5C28.0625 25.3125 28.0625 26.5625 27.3125 27.3125C26.5 28.125 25.25 28.125 24.4375 27.3125L21.625 24.5C20.875 23.75 20.875 22.4375 21.625 21.6875Z"
		/>
		<path
			class="opacity-15 motion-reduce:opacity-100"
			d="M16 24C17.0625 24 18 24.9375 18 26V30C18 31.125 17.0625 32 16 32C14.875 32 14 31.125 14 30V26C14 24.9375 14.875 24 16 24Z"
		/>
		<path
			class="opacity-30 motion-reduce:opacity-100"
			d="M4.6875 27.3125C5.4375 28.125 6.6875 28.125 7.5 27.3125L10.3125 24.5C11.125 23.75 11.125 22.4375 10.3125 21.6875C9.5625 20.875 8.25 20.875 7.5 21.6875L4.6875 24.5C3.875 25.3125 3.875 26.5625 4.6875 27.375V27.3125Z"
		/>
		<path
			class="opacity-70 motion-reduce:opacity-100"
			d="M0 16C0 17.125 0.875 18 2 18H6C7.0625 18 8 17.125 8 16C8 14.9375 7.0625 14 6 14H2C0.875 14 0 14.9375 0 16Z"
		/>
		<path
			class=""
			d="M4.6875 4.6875C3.875 5.5 3.875 6.75 4.6875 7.5625L7.5 10.375C8.25 11.1875 9.5625 11.1875 10.3125 10.375C11.125 9.625 11.125 8.3125 10.3125 7.5625L7.5 4.6875C6.6875 3.9375 5.4375 3.9375 4.6875 4.6875Z"
		/>
	</svg>
</template>

<style scoped>
/* step-start holds each frame, so the ring jumps spoke to spoke rather than
   sweeping. Eight steps, one per spoke. */
@media (prefers-reduced-motion: no-preference) {
	.spin {
		animation: loading-spin 1s step-start infinite;
	}
}

@keyframes loading-spin {
	0% { transform: rotate(0deg); }
	12.5% { transform: rotate(45deg); }
	25% { transform: rotate(90deg); }
	37.5% { transform: rotate(135deg); }
	50% { transform: rotate(180deg); }
	62.5% { transform: rotate(225deg); }
	75% { transform: rotate(270deg); }
	87.5% { transform: rotate(315deg); }
}
</style>
