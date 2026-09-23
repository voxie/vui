<script setup lang="ts">
import { withBase } from '@lib/base';
// Source: resources/js/components/message-hub/MessageHub.vue, with
// message-hub-threads/MessageHubThreadsSidebar.vue,
// message-hub-threads/MessageHubThreadSidebarRow.vue, MessageHubConversationNav.vue and
// the browser-extension ConversationMessages.vue / MessageCloud.vue /
// ConversationInput.vue flattened in.

const inboxes = [
	{ label: 'All', count: 128, active: true },
	{ label: 'Assigned to me', count: 12, active: false },
	{ label: 'Unassigned', count: 44, active: false },
	{ label: 'Scheduled', count: 6, active: false },
];

const threads = [
	{
		id: 1,
		name: 'Marisol Trevino',
		date: '6:41 AM',
		preview:
			'Yes that works — can you put me down for Thursday morning? Earlier the better, I have to be at the airport by noon.',
		unread: true,
		assignee: null,
		group: 'Austin',
		active: true,
	},
	{
		id: 2,
		name: 'Dev Ramachandran',
		date: '6:12 AM',
		preview: 'Thanks, got it.',
		unread: true,
		assignee: null,
		group: 'Chicago',
		active: false,
	},
	{
		id: 3,
		name: 'Kelechi Obi',
		date: 'Yesterday',
		preview:
			'I already told the last person I am not interested in the extended warranty. Please stop texting me about it.',
		unread: false,
		assignee: 'Jordan Pike',
		group: 'Brooklyn',
		active: false,
	},
	{
		id: 4,
		name: '(415) 555-0163',
		date: 'Yesterday',
		preview: 'STOP',
		unread: false,
		assignee: null,
		group: 'Oakland',
		active: false,
	},
	{
		id: 5,
		name: 'Hallie Brandt-Nguyen',
		date: 'Aug 19',
		preview:
			'Is the 2024 model still on the lot? My partner and I want to come look at it this weekend if it is.',
		unread: false,
		assignee: 'Sam Okonkwo',
		group: 'Seattle',
		active: false,
	},
	{
		id: 6,
		name: 'Tobias Fenwick',
		date: 'Aug 18',
		preview: 'Perfect, see you then.',
		unread: false,
		assignee: null,
		group: 'Austin',
		active: false,
	},
];

const messages = [
	{
		day: 'Thursday, August 21',
		items: [
			{
				direction: 'outbound',
				body: 'Hi Marisol — this is Northside Auto. Your Bronco Sport is due for its 30k service. Want me to find you a slot this week?',
				meta: 'Sent 4:02 PM · Jordan Pike',
			},
			{
				direction: 'inbound',
				body: 'Oh good, I keep forgetting. What do you have open?',
				meta: 'Received 4:20 PM',
			},
			{
				direction: 'outbound',
				body: 'We have Thursday 8:00 AM, Thursday 11:30 AM, or Friday 2:00 PM. Any of those work?',
				meta: 'Sent 4:22 PM · Jordan Pike',
			},
		],
	},
	{
		day: 'Today',
		items: [
			{
				direction: 'inbound',
				body: 'Yes that works — can you put me down for Thursday morning? Earlier the better, I have to be at the airport by noon.',
				meta: 'Received 6:41 AM',
				unread: true,
			},
		],
	},
];

const composerActions = [
	{ label: 'Snooze', icon: 'fa-clock' },
	{ label: 'Assign', icon: 'fa-user-plus' },
	{ label: 'Schedule', icon: 'fa-calendar-clock' },
	{ label: 'Snippet', icon: 'fa-bolt' },
	{ label: 'Close', icon: 'fa-check' },
];
</script>

<template>
	<div data-test="message-hub">
		<nav data-test="message-hub-navbar" aria-label="Inboxes">
			<ul>
				<li v-for="inbox in inboxes" :key="inbox.label">
					<a href="#" :aria-current="inbox.active ? 'page' : undefined">
						{{ inbox.label }}
						<span data-test="badge">{{ inbox.count }}</span>
					</a>
				</li>
			</ul>
		</nav>

		<div data-test="message-hub-panes">
			<aside data-test="threads-sidebar" aria-label="Conversations">
				<header>
					<div data-test="filters">
						<button type="button" aria-expanded="false">
							<span>Find</span>
							<span data-test="filters-count">
								1 filter
								<i class="fa-solid fa-circle-xmark"></i>
							</span>
							<kbd>⌘K</kbd>
						</button>
					</div>

					<div data-test="sort-items">
						<button type="button" data-test="newest-first" aria-pressed="true">
							<i class="fa-solid fa-arrow-down"></i>
							Newest First
						</button>
						<button type="button" data-test="oldest-first" aria-pressed="false">
							<i class="fa-solid fa-arrow-up"></i>
							Oldest First
						</button>
					</div>

					<div data-test="action-buttons">
						<button type="button" data-test="select-all">
							Select All
							<span data-test="badge">100 Max</span>
						</button>
						<button type="button" data-test="bulk-select">
							<i class="fa-solid fa-list-check"></i>
							Bulk
						</button>
					</div>
				</header>

				<ol data-test="thread-list">
					<li
						v-for="thread in threads"
						:key="thread.id"
						data-test="sidebar-row"
						:data-unread="thread.unread ? 'true' : undefined"
						:aria-current="thread.active ? 'true' : undefined"
					>
						<a href="#">
							<span data-test="title">{{ thread.name }}</span>
							<span data-test="date">{{ thread.date }}</span>
							<!-- Clamps to two lines in production so every row is one height. -->
							<span data-test="content">{{ thread.preview }}</span>
							<span data-test="badges">
								<span v-if="thread.unread" data-test="badge">Unread</span>
								<span v-if="thread.assignee" data-test="badge">
									{{ thread.assignee }}
									<i class="fa-solid fa-comment"></i>
								</span>
								<span data-test="badge">
									{{ thread.group }}
									<i class="fa-solid fa-grid-2-plus"></i>
								</span>
							</span>
						</a>
					</li>
				</ol>

				<footer>
					<button type="button">Load more</button>
				</footer>
			</aside>

			<div data-test="resize-handle" role="separator" aria-orientation="vertical"></div>

			<section data-test="conversation" aria-label="Conversation with Marisol Trevino">
				<header data-test="conversation-nav">
					<a href="#" data-test="back">
						<i class="fa-solid fa-arrow-left"></i>
						<span>Back</span>
					</a>

					<div data-test="conversation-title">
						<h1>Marisol Trevino</h1>
						<p>(512) 555-0184 · Austin</p>
					</div>

					<div data-test="conversation-actions">
						<button type="button" data-test="badge">
							Unassigned
							<i class="fa-solid fa-chevron-down"></i>
						</button>
						<a :href="withBase('/test-pages/contact-detail')">
							View Contact
							<i class="fa-solid fa-square-arrow-up-right"></i>
						</a>
						<button type="button" aria-label="More actions">
							<i class="fa-solid fa-ellipsis"></i>
						</button>
					</div>
				</header>

				<div data-test="conversation-messages">
					<section v-for="group in messages" :key="group.day">
						<h2 data-test="date-separator">
							<span data-test="badge">{{ group.day }}</span>
						</h2>

						<article
							v-for="message in group.items"
							:key="message.body"
							data-test="message-cloud"
							:data-direction="message.direction"
						>
							<p v-if="message.unread" data-test="unread-separator">
								<span data-test="badge">New</span>
							</p>
							<p data-test="message-cloud-body">{{ message.body }}</p>
							<p data-test="message-meta">{{ message.meta }}</p>
						</article>
					</section>
				</div>

				<footer data-test="conversation-input">
					<div data-test="suggested-reply">
						<p>
							<i class="fa-solid fa-sparkles"></i>
							Suggested reply
						</p>
						<button type="button">
							You're all set for Thursday at 8:00 AM. We'll text a reminder the night
							before.
						</button>
					</div>

					<label for="composer">Message</label>
					<textarea id="composer" name="body" rows="3" placeholder="Type a message"
					></textarea>

					<div data-test="composer-meta">
						<p>0 / 160 characters · 1 segment</p>
						<button type="button" aria-label="Add media">
							<i class="fa-solid fa-paperclip"></i>
						</button>
						<button type="submit" data-test="send">
							Send
							<i class="fa-solid fa-paper-plane"></i>
						</button>
					</div>

					<div data-test="composer-actions">
						<button
							v-for="action in composerActions"
							:key="action.label"
							type="button"
							:data-test="action.label.toLowerCase()"
						>
							<i :class="`fa-solid ${action.icon}`"></i>
							<span>{{ action.label }}</span>
						</button>
					</div>
				</footer>
			</section>
		</div>
	</div>
</template>
