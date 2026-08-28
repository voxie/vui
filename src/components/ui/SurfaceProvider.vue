<script setup lang="ts">
/*
  A surface that isn't a Card.

  Most surfaces in the application are components, and a component can say what
  it is: a Card and a Navbar both announce themselves, so the buttons inside
  them need no telling. Anything else that paints a background of its own — a
  dropdown panel, a hand-rolled div with a background class on it — is a
  surface as far as the eye is concerned, and silent as far as the code is
  concerned. Wrap it in this and it speaks up.

  It renders one element and nothing else, so it can be the box that carries
  the background rather than another layer around it. Classes and attributes
  land on that element the way they would on a plain div.
*/
import { provideSurface, type Surface } from './surface.ts';

const props = withDefaults(
	defineProps<{
		/* What anything inside is sitting on, once this element is painted. */
		surface: Surface;
		/*
		  The tag to render. Left as a plain string rather than a union so a
		  caller isn't blocked on this list growing.
		*/
		as?: string;
	}>(),
	{ as: 'div' },
);

provideSurface(() => props.surface);
</script>

<template>
	<component :is="props.as">
		<slot />
	</component>
</template>
