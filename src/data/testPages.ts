/*
  The unstyled fixtures under /test-pages.

  Shared by the sidebar, which needs the titles, and the index page, which
  needs the rest. Order is the reading order on the index — roughly densest
  layout first, with the states catalogue last.
*/

export interface TestPage {
	href: string;
	title: string;
	/* Path under resources/js/components/ in the voxie repo. */
	source: string;
	exercises: string;
}

export const testPages: TestPage[] = [
	{
		href: '/test-pages/dashboard',
		title: 'Dashboard',
		source: 'home/HomeCorporate.vue',
		exercises:
			'Unequal 12-column grid, promo panel, icon list, categorical chart, stat tiles.',
	},
	{
		href: '/test-pages/contacts-list',
		title: 'Contacts List',
		source: 'contacts/contact/ContactList.vue',
		exercises:
			'Filter bar with an open filter form, data table that reflows to cards, badges, row overflow menus, cursor pagination.',
	},
	{
		href: '/test-pages/contact-detail',
		title: 'Contact Detail',
		source: 'contacts/contact/form/ContactForm.vue',
		exercises:
			'Nested page sidebar, info alert, stacked expandable cards, dense form, field error, tag chips, sticky footer.',
	},
	{
		href: '/test-pages/campaigns-list',
		title: 'Campaigns List',
		source: 'campaigns/list/CampaignList.vue',
		exercises:
			'Header with an overview strip, dismissible callout, and a status column running every badge color at once.',
	},
	{
		href: '/test-pages/message-hub',
		title: 'Message Hub',
		source: 'message-hub/MessageHub.vue',
		exercises:
			'Full-height two-pane split, dense uniform-height list, inbound and outbound clouds, composer with a segmented action bar.',
	},
	{
		href: '/test-pages/quick-blast',
		title: 'Quick Blast',
		source: 'quick-blast/QuickBlast.vue',
		exercises:
			'Low-density focused flow — centered narrow column, step nav, complete and active and upcoming steps, option tiles, SMS preview.',
	},
	{
		href: '/test-pages/analytics-dashboard',
		title: 'Analytics Dashboard',
		source: 'analytics/AnalyticsDashboard.vue',
		exercises:
			'Stat tiles with deltas and an empty value, chart frames with legends, date-range controls, wide exportable table.',
	},
	{
		href: '/test-pages/settings-security',
		title: 'Settings — Security',
		source: 'settings/security/SecuritySettings.vue',
		exercises:
			'Narrow single-column settings, expandable cards, success and warning alerts, password fields, a destructive section.',
	},
	{
		href: '/test-pages/states',
		title: 'States',
		source: 'Composite',
		exercises:
			'Banners, four alert colors, empty states, loading and skeletons, errors and 404, the badge set, toasts, a modal.',
	},
];
