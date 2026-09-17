// The Font Awesome icons the Voxie frontend uses, from an audit of its usage
// sites. `represents` is what the application does with the icon today. `avoid`
// is the rule, and only the reviewed icons carry one.

export type Variant = 'solid' | 'regular' | 'light' | 'brands';

export type Icon = {
	name: string;
	variant: Variant;
	represents: string;
	avoid?: string;
};

export const icons: Icon[] = [
	{
		name: "address-book",
		variant: "solid",
		represents: "Contacts nav; segment audience.",
	},
	{
		name: "address-card",
		variant: "solid",
		represents: "vCard attachment preview.",
		avoid: "Contacts.",
	},
	{
		name: "angle-down",
		variant: "solid",
		represents: "The open caret on a select or a multiselect, and the collapse indicator on a disclosure.",
		avoid: "Not chevron-down.",
	},
	{
		name: "angle-up",
		variant: "solid",
		represents: "The expanded state of a filter or a disclosure.",
		avoid: "Not chevron-up.",
	},
	{
		name: "angles-up-down",
		variant: "solid",
		represents: "Column sortable but unsorted.",
	},
	{
		name: "archive",
		variant: "solid",
		represents: "Campaign Archived.",
		avoid: "Deprecated alias of fa-box-archive.",
	},
	{
		name: "arrow-down",
		variant: "solid",
		represents: "Sort newest first. Move a node down.",
	},
	{
		name: "arrow-down-arrow-up",
		variant: "solid",
		represents: "Thread sort control.",
	},
	{
		name: "arrow-down-long",
		variant: "solid",
		represents: "Column sorted descending (exportable table).",
	},
	{
		name: "arrow-down-to-line",
		variant: "solid",
		represents: "Worst performer.",
	},
	{
		name: "arrow-down-wide-short",
		variant: "solid",
		represents: "Sort descending.",
	},
	{
		name: "arrow-left",
		variant: "solid",
		represents: "Back to the previous list or screen.",
	},
	{
		name: "arrow-right",
		variant: "solid",
		represents: "Forward: Continue, Log In.",
	},
	{
		name: "arrow-right-arrow-left",
		variant: "solid",
		represents: "Swap workflow branches; migration attribute mappings.",
	},
	{
		name: "arrow-right-from-bracket",
		variant: "solid",
		represents: "Opt-out and unsubscribe. Workflow exit criteria.",
		avoid: "Logging out.",
	},
	{
		name: "arrow-right-from-line",
		variant: "solid",
		represents: "Workflow trigger summary entry point.",
	},
	{
		name: "arrow-right-long-to-line",
		variant: "solid",
		represents: "Campaign send window end.",
	},
	{
		name: "arrow-right-to-bracket",
		variant: "solid",
		represents: "Opt-in (marketing/transactional).",
		avoid: "Logging in.",
	},
	{
		name: "arrow-rotate-left",
		variant: "solid",
		represents: "Reset a form or filter set. Undo.",
	},
	{
		name: "arrow-turn-down",
		variant: "solid",
		represents: "Continue to the next Quick Blast step.",
	},
	{
		name: "arrow-up",
		variant: "solid",
		represents: "Sort oldest first. Move a node up.",
		avoid: "Publishing.",
	},
	{
		name: "arrow-up-right",
		variant: "solid",
		represents: "Jump to the linked resource.",
	},
	{
		name: "arrow-up-right-from-square",
		variant: "solid",
		represents: "Open an external link.",
		avoid: "Sharing.",
	},
	{
		name: "arrow-up-to-line",
		variant: "solid",
		represents: "Best performer.",
	},
	{
		name: "arrow-up-wide-short",
		variant: "solid",
		represents: "Sort ascending.",
	},
	{
		name: "arrows-down-to-people",
		variant: "solid",
		represents: "Bulk import of contacts, groups or users.",
	},
	{
		name: "arrows-left-right",
		variant: "solid",
		represents: "Campaign send window (start–stop time range).",
	},
	{
		name: "arrows-rotate",
		variant: "solid",
		represents: "Refresh.",
	},
	{
		name: "asterisk",
		variant: "solid",
		represents: "Required field marker.",
	},
	{
		name: "badge-percent",
		variant: "solid",
		represents: "Promotion.",
	},
	{
		name: "ballot-check",
		variant: "solid",
		represents: "Survey.",
	},
	{
		name: "ban",
		variant: "solid",
		represents: "Close a thread.",
		avoid: "Cancelling, deleting, or removing.",
	},
	{
		name: "bars",
		variant: "solid",
		represents: "The mobile navigation toggle.",
	},
	{
		name: "bars-filter",
		variant: "solid",
		represents: "Filters.",
	},
	{
		name: "bell",
		variant: "solid",
		represents: "Notification.",
	},
	{
		name: "bell-slash",
		variant: "solid",
		represents: "Mute notifications.",
	},
	{
		name: "birthday-cake",
		variant: "solid",
		represents: "Category: Birthday.",
		avoid: "Deprecated alias of fa-cake-candles.",
	},
	{
		name: "bolt",
		variant: "solid",
		represents: "Workflow trigger.",
	},
	{
		name: "book",
		variant: "solid",
		represents: "Documentation.",
	},
	{
		name: "book-atlas",
		variant: "solid",
		represents: "API Destinations.",
	},
	{
		name: "book-user",
		variant: "solid",
		represents: "External contact list audience.",
	},
	{
		name: "bookmark",
		variant: "solid",
		represents: "Flow section header.",
	},
	{
		name: "box-archive",
		variant: "solid",
		represents: "Archive a workflow; archived thread filter.",
	},
	{
		name: "building-flag",
		variant: "solid",
		represents: "Organizational Unit (OU) Context.",
	},
	{
		name: "calendar",
		variant: "solid",
		represents: "Schedule for later / reschedule.",
	},
	{
		name: "calendar-circle-minus",
		variant: "solid",
		represents: "Unreserve a day.",
	},
	{
		name: "calendar-circle-plus",
		variant: "solid",
		represents: "Calendly integration.",
	},
	{
		name: "calendar-star",
		variant: "solid",
		represents: "Reserved date.",
	},
	{
		name: "caret-down",
		variant: "solid",
		represents: "Expand a details panel.",
	},
	{
		name: "caret-left",
		variant: "solid",
		represents: "Collapse or hide a details panel.",
	},
	{
		name: "cart-arrow-down",
		variant: "solid",
		represents: "Category: Cross Sell/Upsell.",
	},
	{
		name: "cash-register",
		variant: "solid",
		represents: "POS integration.",
	},
	{
		name: "chart-simple",
		variant: "solid",
		represents: "Analytics.",
	},
	{
		name: "check",
		variant: "solid",
		represents: "Confirm, Success, Active.",
	},
	{
		name: "check-circle",
		variant: "solid",
		represents: "Form submit.",
		avoid: "Deprecated alias of fa-circle-check.",
	},
	{
		name: "check-double",
		variant: "solid",
		represents: "Toggle multi-select mode in the thread list.",
	},
	{
		name: "circle-info",
		variant: "solid",
		represents: "Details, informational hint text.",
	},
	{
		name: "circle-minus",
		variant: "solid",
		represents: "Remove a connection, without deleting the resource.",
		avoid: "Deleting. Not trash.",
	},
	{
		name: "circle-pause",
		variant: "solid",
		represents: "Pause.",
	},
	{
		name: "circle-phone",
		variant: "solid",
		represents: "Phone number entry.",
	},
	{
		name: "circle-play",
		variant: "solid",
		represents: "Play.",
	},
	{
		name: "circle-question",
		variant: "solid",
		represents: "Help.",
	},
	{
		name: "circle-user",
		variant: "solid",
		represents: "Profile.",
		avoid: "A user, a team, or a contact.",
	},
	{
		name: "clock",
		variant: "solid",
		represents: "Scheduled.",
	},
	{
		name: "clock-rotate-left",
		variant: "solid",
		represents: "Version history.",
	},
	{
		name: "code-branch",
		variant: "solid",
		represents: "Workflow Condition node.",
	},
	{
		name: "code-simple",
		variant: "solid",
		represents: "Template/variable expression field.",
	},
	{
		name: "cog",
		variant: "solid",
		represents: "Settings.",
		avoid: "Deprecated alias of fa-gear.",
	},
	{
		name: "contact-book",
		variant: "solid",
		represents: "Contacts.",
		avoid: "Deprecated alias of fa-address-book.",
	},
	{
		name: "copy",
		variant: "solid",
		represents: "Copy to clipboard; duplicate a record.",
	},
	{
		name: "credit-card",
		variant: "solid",
		represents: "Billing Details.",
	},
	{
		name: "crosshairs",
		variant: "solid",
		represents: "Center the Workflow Builder canvas.",
	},
	{
		name: "crown",
		variant: "solid",
		represents: "Corporate context / corporate-owned resource.",
	},
	{
		name: "cube",
		variant: "regular",
		represents: "Message variables.",
	},
	{
		name: "download",
		variant: "solid",
		represents: "Download a file or invoice.",
	},
	{
		name: "ellipsis",
		variant: "solid",
		represents: "Row overflow menu.",
	},
	{
		name: "envelope",
		variant: "solid",
		represents: "Mark unread.",
	},
	{
		name: "envelope-open",
		variant: "solid",
		represents: "Mark read.",
	},
	{
		name: "exclamation-triangle",
		variant: "solid",
		represents: "Warning.",
		avoid: "Deprecated alias of fa-triangle-exclamation.",
	},
	{
		name: "expand",
		variant: "solid",
		represents: "Expand.",
	},
	{
		name: "eye",
		variant: "solid",
		represents: "View.",
	},
	{
		name: "eye-slash",
		variant: "solid",
		represents: "Hide.",
	},
	{
		name: "file",
		variant: "solid",
		represents: "Generic file attachment.",
	},
	{
		name: "file-arrow-down",
		variant: "solid",
		represents: "Export data as CSV.",
	},
	{
		name: "file-arrow-up",
		variant: "solid",
		represents: "Import data from CSV.",
	},
	{
		name: "file-pen",
		variant: "solid",
		represents: "Edit.",
	},
	{
		name: "fingerprint",
		variant: "solid",
		represents: "API Auth configurations.",
	},
	{
		name: "flag-checkered",
		variant: "solid",
		represents: "Analytics Goals; Franchise Hub.",
	},
	{
		name: "flag-swallowtail",
		variant: "solid",
		represents: "Campaign.",
	},
	{
		name: "flask",
		variant: "solid",
		represents: "Beta feature.",
	},
	{
		name: "flask-vial",
		variant: "solid",
		represents: "Send a test message.",
	},
	{
		name: "ghost",
		variant: "solid",
		represents: "Referenced record is missing or deleted.",
	},
	{
		name: "grid-2-plus",
		variant: "solid",
		represents: "Group context.",
	},
	{
		name: "grip-vertical",
		variant: "solid",
		represents: "Drag handle.",
	},
	{
		name: "hands-holding-child",
		variant: "solid",
		represents: "Category: Charity.",
	},
	{
		name: "hashtag",
		variant: "solid",
		represents: "ID, External ID, DB ID.",
	},
	{
		name: "hexagon-exclamation",
		variant: "solid",
		represents: "AI vetting result: blocked.",
	},
	{
		name: "id-card-clip",
		variant: "solid",
		represents: "Category: Membership.",
	},
	{
		name: "image",
		variant: "solid",
		represents: "Attach media.",
	},
	{
		name: "inbox",
		variant: "solid",
		represents: "Intelligent Inbox.",
	},
	{
		name: "link",
		variant: "solid",
		represents: "URL.",
	},
	{
		name: "loader",
		variant: "solid",
		represents: "Dynamic (auto-updating) segment.",
		avoid: "Loading. Use the animated components for that.",
	},
	{
		name: "lock",
		variant: "solid",
		represents: "Locked, Locked Snippet.",
	},
	{
		name: "magnifying-glass",
		variant: "solid",
		represents: "Search.",
	},
	{
		name: "map-pin",
		variant: "solid",
		represents: "Static segment.",
	},
	{
		name: "masks-theater",
		variant: "solid",
		represents: "Impersonate a team or user (Kiosk).",
	},
	{
		name: "message",
		variant: "solid",
		represents: "Message.",
	},
	{
		name: "messages",
		variant: "solid",
		represents: "Message Hub.",
	},
	{
		name: "notebook",
		variant: "regular",
		represents: "Snippets.",
	},
	{
		name: "paper-plane",
		variant: "solid",
		represents: "Send.",
	},
	{
		name: "paperclip",
		variant: "regular",
		represents: "Message attachment.",
	},
	{
		name: "paste",
		variant: "solid",
		represents: "Paste copied workflow nodes.",
	},
	{
		name: "person-walking-arrow-loop-left",
		variant: "solid",
		represents: "Category: Winback.",
	},
	{
		name: "phone-office",
		variant: "solid",
		represents: "Phone Pools.",
	},
	{
		name: "plug",
		variant: "solid",
		represents: "Workflow API node.",
	},
	{
		name: "plus",
		variant: "solid",
		represents: "New, Add, Create.",
	},
	{
		name: "puzzle-piece",
		variant: "solid",
		represents: "Custom Attributes.",
	},
	{
		name: "rectangle-history-circle-plus",
		variant: "solid",
		represents: "Group Collections.",
	},
	{
		name: "rectangle-history-circle-user",
		variant: "solid",
		represents: "Contact Collector integration.",
	},
	{
		name: "reply",
		variant: "solid",
		represents: "Reply to a thread.",
	},
	{
		name: "reply-clock",
		variant: "solid",
		represents: "Progress bar: awaiting response.",
	},
	{
		name: "robot",
		variant: "solid",
		represents: "Automations.",
	},
	{
		name: "rocket-launch",
		variant: "solid",
		represents: "Quick Blast.",
	},
	{
		name: "save",
		variant: "solid",
		represents: "Save, Update.",
		avoid: "Deprecated alias of fa-floppy-disk.",
	},
	{
		name: "scissors",
		variant: "solid",
		represents: "Cut Workflow Builder nodes.",
	},
	{
		name: "screen-users",
		variant: "solid",
		represents: "Teams.",
		avoid: "Segments.",
	},
	{
		name: "screwdriver-wrench",
		variant: "solid",
		represents: "Category: Operational; Kiosk operations.",
	},
	{
		name: "share-nodes",
		variant: "solid",
		represents: "Filter, Condition, Logic.",
	},
	{
		name: "shield-halved",
		variant: "solid",
		represents: "Workflow Compliance node.",
	},
	{
		name: "sitemap",
		variant: "solid",
		represents: "Copy a workflow branch with children.",
	},
	{
		name: "skull-crossbones",
		variant: "solid",
		represents: "Internal-only feature flag.",
	},
	{
		name: "sliders-simple",
		variant: "solid",
		represents: "Flow.",
	},
	{
		name: "sparkles",
		variant: "solid",
		represents: "Every AI, agent, and intelligence feature.",
		avoid: "Not sparkle or wand-magic-sparkles.",
	},
	{
		name: "square-arrow-up-left",
		variant: "solid",
		represents: "Back to <parent list>.",
	},
	{
		name: "square-arrow-up-right",
		variant: "solid",
		represents: "Go to <resource>.",
	},
	{
		name: "square-dashed",
		variant: "solid",
		represents: "Uncategorized category; subscription reset; empty placeholder.",
	},
	{
		name: "star",
		variant: "solid",
		represents: "\"Preferred\" group marker.",
	},
	{
		name: "star",
		variant: "regular",
		represents: "The not-preferred group marker.",
	},
	{
		name: "stars",
		variant: "solid",
		represents: "Category: Offer.",
	},
	{
		name: "tag",
		variant: "solid",
		represents: "Tag.",
	},
	{
		name: "tags",
		variant: "solid",
		represents: "Bulk-tags.",
	},
	{
		name: "tower-cell",
		variant: "solid",
		represents: "10DLC / carrier registration (Kiosk).",
	},
	{
		name: "trash",
		variant: "solid",
		represents: "Permanently deleting a record.",
		avoid: "Archiving, deactivating, removing an item from a list, or clearing a field. Not trash-can.",
	},
	{
		name: "triangle-exclamation",
		variant: "solid",
		represents: "Warning.",
	},
	{
		name: "user",
		variant: "solid",
		represents: "Contact.",
	},
	{
		name: "user-group",
		variant: "solid",
		represents: "Users.",
	},
	{
		name: "user-minus",
		variant: "solid",
		represents: "Remove contact from the current Group; unclaim a thread.",
	},
	{
		name: "user-pen",
		variant: "solid",
		represents: "Assign a thread to a user; contact attribute/status updated (automation).",
	},
	{
		name: "user-plus",
		variant: "solid",
		represents: "Claim a thread; Invites settings; contact created / custom attribute created.",
	},
	{
		name: "user-slash",
		variant: "solid",
		represents: "Unassigned threads filter.",
	},
	{
		name: "vial-virus",
		variant: "solid",
		represents: "Alpha feature.",
	},
	{
		name: "watch-smart",
		variant: "solid",
		represents: "Time-zone, Time-zone aware.",
	},
	{
		name: "windsock",
		variant: "solid",
		represents: "Blast Forecast.",
	},
	{
		name: "xmark",
		variant: "solid",
		represents: "Close / clear search / reject.",
	},
];
