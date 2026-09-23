<script setup lang="ts">
// The application navigation bar, mirroring `navbar/AppNavbar.vue` in the voxie
// repo, flattened to plain markup. A Vue file rather than Astro markup so the
// design-system components compose in one tree once they're swapped in.
import { withBase } from '@lib/base';

const navItems = [
	{
		name: 'Analytics',
		href: withBase('/test-pages/analytics-dashboard'),
		items: ['Dashboard', 'Contacts', 'Entry Points', 'Outbound Messages'],
	},
	{
		name: 'Automation',
		href: '#',
		items: ['Automations', 'Flows', 'Workflow Builder'],
	},
	{
		name: 'Contacts',
		href: withBase('/test-pages/contacts-list'),
		items: ['All Contacts', 'Segments', 'External Lists', 'Tags', 'Custom Attributes', 'Imports'],
	},
	{
		name: 'Messaging',
		href: withBase('/test-pages/campaigns-list'),
		items: ['Message Hub', 'Quick Blast', 'Campaigns', 'Reserved Dates', 'Snippets'],
	},
	{ name: 'Support', href: '#', items: [] },
];
</script>

<template>
	<nav data-test="app-navbar" aria-label="Main">
		<a :href="withBase('/test-pages')" data-test="navbar-logo">
			<span>Voxie</span>
		</a>

		<a :href="withBase('/test-pages/message-hub')" data-test="navbar-message-hub">
			<i class="fa-solid fa-messages"></i>
			Message Hub
		</a>

		<a :href="withBase('/test-pages/quick-blast')" data-test="navbar-quick-blast">
			<i class="fa-solid fa-rocket-launch"></i>
			Quick Blast
		</a>

		<ul>
			<li v-for="item in navItems" :key="item.name">
				<a :href="item.href">{{ item.name }}</a>
				<ul v-if="item.items.length > 0">
					<li v-for="child in item.items" :key="child">
						<a href="#">{{ child }}</a>
					</li>
				</ul>
			</li>
		</ul>

		<div data-test="navbar-context-switch">
			<button type="button">
				Northside Auto Group
				<i class="fa-solid fa-chevron-down"></i>
			</button>
		</div>

		<div data-test="navbar-settings">
			<button type="button" aria-label="Settings">
				<i class="fa-solid fa-gear"></i>
			</button>
			<ul>
				<li><a :href="withBase('/test-pages/settings-security')">Security</a></li>
				<li><a href="#">Profile</a></li>
				<li><a href="#">Team</a></li>
				<li><a href="#">Billing</a></li>
				<li><a href="#">Integrations</a></li>
				<li><a href="#">Sign Out</a></li>
			</ul>
		</div>
	</nav>
</template>
