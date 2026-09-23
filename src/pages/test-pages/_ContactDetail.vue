<script setup lang="ts">
// Source: resources/js/components/contacts/contact/ContactDetails.vue plus
// form/ContactForm.vue, form/ContactFormDetails.vue, ContactFormSubscriptions.vue,
// ContactFormTags.vue and ContactFormCustomAttributes.vue.
import { withBase } from '@lib/base';

const sidebar = [
	{ label: 'Details', href: '#details', active: true },
	{
		label: 'Logs',
		links: [
			{ label: 'Messages', href: '#' },
			{ label: 'Subscriptions', href: '#' },
			{ label: 'Custom Attributes', href: '#' },
			{ label: 'Segments', href: '#' },
			{ label: 'Campaigns', href: '#' },
			{ label: 'Promotions', href: '#' },
		],
	},
];

const timeZones = [
	'America/New_York',
	'America/Chicago',
	'America/Denver',
	'America/Los_Angeles',
];

const metadata = [
	['Created', 'Mar 4, 2026 10:22 AM'],
	['Added', 'Mar 4, 2026 10:22 AM'],
	['Entry Point', 'Contact Collector — Web Form'],
	['Sticky Phone Number', '(512) 555-0100'],
];

const tags = ['vip', 'service-due', 'austin-north'];

const customAttributes = [
	['vehicle_model', 'Bronco Sport'],
	['last_service_date', '2026-05-18'],
	['loyalty_tier', 'Gold'],
];
</script>

<template>
	<header data-test="page-header">
		<p data-test="subtitle">
			<a :href="withBase('/test-pages/contacts-list')">
				<i class="fa-solid fa-arrow-left"></i>
				All Contacts
			</a>
		</p>
		<h1>Marisol Trevino</h1>
	</header>

	<div data-test="form-layout">
		<nav data-test="page-sidebar" aria-label="Contact sections">
			<ul>
				<template v-for="entry in sidebar" :key="entry.label">
					<li v-if="entry.links">
						<span>{{ entry.label }}</span>
						<ul>
							<li v-for="link in entry.links" :key="link.label">
								<a :href="link.href">{{ link.label }}</a>
							</li>
						</ul>
					</li>
					<li v-else>
						<a :href="entry.href" :aria-current="entry.active ? 'page' : undefined">
							{{ entry.label }}
						</a>
					</li>
				</template>
			</ul>
		</nav>

		<form data-test="contact-form">
			<aside data-test="alert" data-color="info">
				<i class="fa-solid fa-grid-2-plus"></i>
				<p>Contact will be in <strong>Northside Auto — Austin</strong></p>
				<a href="#">
					Back to Group
					<i class="fa-solid fa-square-arrow-up-left"></i>
				</a>
			</aside>

			<section id="details" data-test="expandable-card">
				<h2>
					<button type="button" aria-expanded="true">
						Details
						<i class="fa-solid fa-chevron-up"></i>
					</button>
				</h2>

				<div data-test="card-content">
					<div data-test="phone-wrapper">
						<span data-test="badge" data-color="rose">
							Required
							<i class="fa-solid fa-asterisk"></i>
						</span>
						<label for="phone">Phone</label>
						<input id="phone" name="phone" type="tel" value="+15125550184" readonly />
					</div>

					<div data-test="first-name-wrapper">
						<label for="first_name">First Name</label>
						<input id="first_name" name="first_name" type="text" value="Marisol" />
					</div>

					<div data-test="last-name-wrapper">
						<label for="last_name">Last Name</label>
						<input id="last_name" name="last_name" type="text" value="Trevino" />
					</div>

					<div data-test="email-wrapper">
						<label for="email">Email</label>
						<input id="email" name="email" type="email" value="not-an-email" />
						<!-- An error in the resting state, so error styling gets exercised. -->
						<p data-test="error">Please enter a valid email address.</p>
					</div>

					<div data-test="time-zone-wrapper">
						<label for="time_zone">Time-zone</label>
						<select id="time_zone" name="time_zone">
							<option
								v-for="zone in timeZones"
								:key="zone"
								:value="zone"
								:selected="zone === 'America/Chicago'"
							>
								{{ zone }}
							</option>
						</select>
					</div>

					<div data-test="entry-channel-wrapper">
						<label for="entry_channel">Entry Channel</label>
						<input id="entry_channel" name="entry_channel" type="text" value="web" />
					</div>

					<div data-test="membership-status-wrapper">
						<label for="membership_status">Membership Status</label>
						<input
							id="membership_status"
							name="membership_status"
							type="text"
							value="active"
						/>
					</div>

					<div data-test="lifecycle-status-wrapper">
						<label for="lifecycle_status">Lifecycle Status</label>
						<input
							id="lifecycle_status"
							name="lifecycle_status"
							type="text"
							value="customer"
						/>
					</div>

					<dl data-test="metadata">
						<div v-for="[key, value] in metadata" :key="key">
							<dt>{{ key }}:</dt>
							<dd>{{ value }}</dd>
						</div>
					</dl>
				</div>
			</section>

			<section id="subscriptions" data-test="expandable-card">
				<h2>
					<button type="button" aria-expanded="true">
						Subscriptions
						<i class="fa-solid fa-chevron-up"></i>
					</button>
				</h2>

				<div data-test="card-content">
					<fieldset>
						<legend>Marketing</legend>
						<label><input type="radio" name="marketing" checked /> Opted In</label>
						<label><input type="radio" name="marketing" /> Opted Out</label>
						<label><input type="radio" name="marketing" /> No Preference</label>
					</fieldset>

					<fieldset>
						<legend>Transactional</legend>
						<label><input type="radio" name="transactional" checked /> Opted In</label>
						<label><input type="radio" name="transactional" /> Opted Out</label>
						<label><input type="radio" name="transactional" /> No Preference</label>
					</fieldset>
				</div>
			</section>

			<section id="tags" data-test="expandable-card">
				<h2>
					<button type="button" aria-expanded="true">
						Tags
						<i class="fa-solid fa-chevron-up"></i>
					</button>
				</h2>

				<div data-test="card-content">
					<ul data-test="tag-list">
						<li v-for="tag in tags" :key="tag" data-test="badge">
							{{ tag }}
							<button type="button" :aria-label="`Remove ${tag}`">
								<i class="fa-solid fa-xmark"></i>
							</button>
						</li>
					</ul>
					<label for="add-tag">Add a tag</label>
					<input id="add-tag" name="add_tag" type="text" placeholder="Type to search" />
				</div>
			</section>

			<section id="custom-attributes" data-test="expandable-card">
				<h2>
					<button type="button" aria-expanded="false">
						Custom Attributes
						<i class="fa-solid fa-chevron-down"></i>
					</button>
				</h2>

				<div data-test="card-content">
					<table>
						<thead>
							<tr>
								<th scope="col">Key</th>
								<th scope="col">Value</th>
								<th scope="col"><span>Actions</span></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="[key, value] in customAttributes" :key="key">
								<th scope="row">{{ key }}</th>
								<td>{{ value }}</td>
								<td>
									<button type="button" :aria-label="`Remove ${key}`">
										<i class="fa-solid fa-trash"></i>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
					<button type="button">
						Add Attribute
						<i class="fa-solid fa-circle-plus"></i>
					</button>
				</div>
			</section>

			<footer data-test="sticky-footer">
				<a :href="withBase('/test-pages/contacts-list')">Cancel</a>
				<button type="submit" data-test="contact-save">Update Contact</button>
			</footer>
		</form>
	</div>
</template>
