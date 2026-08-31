<script setup lang="ts">
// The bar itself, rendered twice by `NavbarDemo`. A component and not MDX
// markup: hydrated from MDX the slots would hold markup rather than components,
// and neither the fold nor the surface would work.
import Button from '@ui/Button.vue';
import Navbar from '@ui/Navbar.vue';
import NavbarAction from '@ui/NavbarAction.vue';
import NavbarActionItem from '@ui/NavbarActionItem.vue';
import VoxieMark from './VoxieMark.vue';

withDefaults(
	defineProps<{
		surface?: 'glass' | 'dark';
		/* Opens the current section on load, so the panel shows without a click. */
		openCurrent?: boolean;
		/* Drops the account menu, for the examples about what the bar holds. */
		hideRight?: boolean;
		// Drops Message Hub and Quick Blast. They outrank the sections for room, so
		// in a bar this wide they leave none.
		hideActions?: boolean;
	}>(),
	{
		surface: 'dark',
		openCurrent: false,
		hideRight: false,
		hideActions: false,
	},
);

// The product's own order, which is what the fold wants: it keeps sections from
// the left, so the ones that can live in a menu go last.
const sections = [
	{
		name: 'Contacts',
		icon: 'fa-solid fa-address-book',
		current: true,
		items: ['All Contacts', 'Segments', 'Tags', 'Imports'],
	},
	{
		name: 'Messaging',
		icon: 'fa-solid fa-comments',
		items: ['Message Hub', 'Quick Blast', 'Campaigns', 'Snippets'],
	},
	{
		name: 'Analytics',
		icon: 'fa-solid fa-chart-simple',
		items: ['Dashboard', 'Contacts', 'Entry Points', 'Outbound Messages'],
	},
	{
		name: 'Automation',
		icon: 'fa-solid fa-robot',
		items: ['Automations', 'Flows', 'Workflow Builder'],
	},
	{ name: 'Support', icon: 'fa-solid fa-circle-info', href: '#' },
];
</script>

<template>
	<Navbar :surface="surface" aria-label="Example">
		<template #left="{ narrow }">
			<NavbarAction as="div">
				<!-- An action holding a link doesn't take the focus, so the link
				     carries the bar's ring itself. -->
				<a
					href="#"
					class="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 group"
					aria-label="Voxie"
				>
					<VoxieMark class=" group-hover:text-sky-600"/>
				</a>
			</NavbarAction>

			<!-- Actions and not sections, so they sit beside the logo and outrank the
			     sections for space: every section folds before either of these does. -->
			<template v-if="!narrow && !hideActions">
				<NavbarAction as="div">
					<Button href="#" size="sm" color="sky">
						<i class="fa-solid fa-comments" aria-hidden="true"></i>
						Message Hub
					</Button>
				</NavbarAction>

				<NavbarAction as="div">
					<Button href="#" size="sm" color="amber">
						<i class="fa-solid fa-rocket-launch" aria-hidden="true"></i>
						Quick Blast
					</Button>
				</NavbarAction>
			</template>
		</template>

		<!-- The same two at the top of the menu once they've left the bar, above the
		     sections. -->
		<template #nested-before="{ narrow }">
			<template v-if="narrow && !hideActions">
				<li class="w-full">
					<Button href="#" size="sm" block color="sky">
						<i class="fa-solid fa-comments" aria-hidden="true"></i>
						Message Hub
					</Button>
				</li>

				<li class="w-full">
					<Button href="#" size="sm" block color="amber">
						<i class="fa-solid fa-rocket-launch" aria-hidden="true"></i>
						Quick Blast
					</Button>
				</li>
			</template>
		</template>

		<NavbarAction
			v-for="section in sections"
			:key="section.name"
			:icon="section.icon"
			:href="section.href"
			:active="section.current"
			:open="Boolean(openCurrent && section.current)"
		>
			{{ section.name }}
			<template v-if="section.items" #items>
				<NavbarActionItem
					v-for="(item, index) in section.items"
					:key="item"
					:active="Boolean(section.current && index === 0)"
				>
					{{ item }}
				</NavbarActionItem>
			</template>
		</NavbarAction>

		<!-- The account, once the bar is too narrow to carry it. Written out twice
		     rather than shared: the only way to hand markup to two slots. -->
		<template v-if="!hideRight" #nested-after="{ narrow }">
			<template v-if="narrow">
				<NavbarAction icon="fa-solid fa-gear">
					Settings
					<template #items>
						<NavbarActionItem>Your Settings</NavbarActionItem>
						<NavbarActionItem>Team Settings</NavbarActionItem>
					</template>
				</NavbarAction>

				<NavbarAction icon="fa-solid fa-users">
					Teams
					<template #items>
						<NavbarActionItem>Northside Auto Group</NavbarActionItem>
						<NavbarActionItem>Westline Motors</NavbarActionItem>
						<NavbarActionItem>See all teams</NavbarActionItem>
					</template>
				</NavbarAction>

				<li class="mt-2 w-full">
					<Button block color="slate" size="sm">
						Log out
						<i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
					</Button>
				</li>
			</template>
		</template>

		<template v-if="!hideRight" #right="{ narrow }">
			<NavbarAction v-if="!narrow" as="div" placement="right">
				<!-- The action drops to a div around a control of its own, so the angle
				     and the two aria attributes read the slot's `open` instead. -->
				<template #default="{ open }">
					<Button
						size="sm"
						color="slate"
						aria-haspopup="true"
						:aria-expanded="open"
					>
						<i class="fa-solid fa-gear" aria-hidden="true"></i>
						<i
							class="fa-width-auto fa-solid text-2xs"
							:class="open ? 'fa-angle-up' : 'fa-angle-down'"
							aria-hidden="true"
						></i>
						<span class="sr-only">Account</span>
					</Button>
				</template>

				<template #items>
					<NavbarAction icon="fa-solid fa-gear">
						Settings
						<template #items>
							<NavbarActionItem>Your Settings</NavbarActionItem>
							<NavbarActionItem>Team Settings</NavbarActionItem>
						</template>
					</NavbarAction>

					<NavbarAction icon="fa-solid fa-users">
						Teams
						<template #items>
							<NavbarActionItem>Northside Auto Group</NavbarActionItem>
							<NavbarActionItem>Westline Motors</NavbarActionItem>
							<NavbarActionItem>See all teams</NavbarActionItem>
						</template>
					</NavbarAction>

					<li class="mt-2 w-full">
						<Button block color="slate" size="sm">
							Log out
							<i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
						</Button>
					</li>
				</template>
			</NavbarAction>

			<!-- The team you're in. The one thing that never leaves the bar, at any
			     width. -->
			<NavbarAction as="div" placement="right">
				<template #default="{ open }">
					<Button
						size="sm"
						color="slate"
						aria-haspopup="true"
						:aria-expanded="open"
					>
						<i
							class="fa-solid fa-crown"
							:class="surface === 'glass' ? 'text-amber-400' : 'text-amber-300'"
							aria-hidden="true"
						></i>
						Corporate
						<!-- Hidden from screen readers: they'd read the glyphs, not the keys. -->
						<kbd
							class="font-sans font-normal"
							:class="surface === 'glass' ? 'text-slate-500' : 'text-slate-400'"
							aria-hidden="true"
						>⌘G</kbd>
						<i
							class="fa-width-auto fa-solid text-2xs"
							:class="open ? 'fa-angle-up' : 'fa-angle-down'"
							aria-hidden="true"
						></i>
					</Button>
				</template>

				<!-- A stand-in, so the chevron is telling the truth. The real one is a
				     search over every team on the account, which is its own component. -->
				<template #dropdown>
					<div class="flex h-32 w-64 items-center justify-center text-sm text-slate-400">
						Team switcher
					</div>
				</template>
			</NavbarAction>
		</template>
	</Navbar>
</template>
