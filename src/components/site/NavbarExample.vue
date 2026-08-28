<script setup lang="ts">
/*
  A worked example of the navigation bar — the bar itself, with nothing around
  it. `NavbarDemo` is what the documentation uses; this is the part it renders
  twice, once in the page and once in the full-screen preview.

  It lives here rather than in the docs page because an Astro island renders
  its children to static HTML: a Navbar hydrated from MDX would get markup in
  its default slot, not the sections it needs to measure. Composing the whole
  bar inside one Vue file keeps it a single island.
*/
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
		/*
		  Drops Message Hub and Quick Blast. They outrank the sections for room,
		  so in a bar the width of this column they leave none — which is the
		  point everywhere except the examples that are about the sections.
		*/
		hideActions?: boolean;
	}>(),
	{
		surface: 'dark',
		openCurrent: false,
		hideRight: false,
		hideActions: false,
	},
);

/*
  In the product's own order, which is also what the fold wants: it keeps
  sections from the left, so the ones that matter most go first and the ones
  that can live in a menu go last.
*/
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
				     carries its own ring — the bar's ring, so the logo is the same
				     first stop every other one is. -->
				<a
					href="#"
					class="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 group"
					aria-label="Voxie"
				>
					<VoxieMark class=" group-hover:text-sky-600"/>
				</a>
			</NavbarAction>

			<!--
				The two things the product wants reachable from anywhere. They sit
				beside the logo rather than in the row because they are actions and
				not sections, and they outrank the sections for the space: the bar
				folds every one of them into a menu before either of these goes
				anywhere. On a phone they go too, into that same menu.
			-->
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

		<!--
			The same two, at the top of the menu, once they've left the bar. First,
			because a button is a thing you came here to press and a section is a
			thing you came here to open.
		-->
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

		<!--
			The account, once the bar is too narrow to carry it: the same rows, at
			the bottom of the one menu the bar has left. Written out twice rather
			than shared, because the two levels of a menu are markup and the only
			way to hand markup to two slots is to write it twice.
		-->
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
				<!--
					The action drops to a div around a control of its own, so the
					menu's state has nowhere to land but the control: the angle, and
					the two attributes that say the same thing to a screen reader.
					All three read the `open` the label slot is handed.
				-->
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

			<!--
				The team you're in. It ends the bar because it's the thing you check
				rather than the thing you press — and it's the one thing that never
				leaves, at any width: which account you're looking at is the last
				thing to make a guess about.
			-->
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
						<!-- The shortcut is a hint for the pointer, not information: a
						     screen reader would read the glyphs, not the keys. -->
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

				<!--
					A stand-in for the product's team switcher. It's here because the
					chevron has to be telling the truth — a bar that says a menu opens
					and then doesn't is worse than one that never offered — and it's
					empty because what's inside is a search field over every team the
					account has, which is a component of its own and not what this page
					is showing.
				-->
				<template #dropdown>
					<div class="flex h-32 w-64 items-center justify-center text-sm text-slate-400">
						Team switcher
					</div>
				</template>
			</NavbarAction>
		</template>
	</Navbar>
</template>
