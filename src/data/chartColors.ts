// The chart color system: the hues, the count-based key sets, and the named
// sets. Documented on /docs/foundations/color, which renders it from this file.
//
// Colors resolve to Tailwind's own theme variables, so there is no value here to
// drift from the theme. Change what a chart draws by picking a different step.
// global.css keeps those steps from being tree-shaken out of the theme.

export type Hue =
	| 'sky'
	| 'blue'
	| 'violet'
	| 'fuchsia'
	| 'pink'
	| 'rose'
	| 'orange'
	| 'amber'
	| 'lime'
	| 'green'
	| 'emerald'
	| 'teal'
	| 'slate';

export type Step = 300 | 400 | 500;

// Spectral order with slate last. Every key set below is a subsequence of it.
export const hues: Hue[] = [
	'sky',
	'blue',
	'violet',
	'fuchsia',
	'pink',
	'rose',
	'orange',
	'amber',
	'lime',
	'green',
	'emerald',
	'teal',
	'slate',
];

export const steps: Step[] = [300, 400, 500];

/** A step of a hue, named as the theme variable Tailwind emits for it. */
export const shade = (hue: Hue, step: Step) => `var(--color-${hue}-${step})`;

/** The step behind a label: a legend pill, a chip, a connecting flow. */
export const LABEL_STEP: Step = 300;

// A mark is 500 unless the hue has a stated reason not to be. Any hue whose 500
// doesn't sit right beside the others gets an entry.
const MARK_STEP: Partial<Record<Hue, Step>> = { orange: 400, amber: 400, slate: 400 };

export const markStep = (hue: Hue): Step => MARK_STEP[hue] ?? 500;

export type HueColor = { hue: Hue; mark: string; labelBg: string };

// Both roles resolve through one lookup, so a mark and its label can't drift
// apart into two hues.
export const hueColor = (hue: Hue): HueColor => ({
	hue,
	mark: shade(hue, markStep(hue)),
	labelBg: shade(hue, LABEL_STEP),
});

export const MAX_KEYS = 12;

// One fixed set per key count. A row is not a prefix of the next one: hues get
// inserted mid-sequence as the count grows.
export const keySets: Record<number, Hue[]> = {
	1: ['sky'],
	2: ['blue', 'amber'],
	3: ['blue', 'amber', 'lime'],
	4: ['blue', 'fuchsia', 'amber', 'lime'],
	5: ['blue', 'fuchsia', 'amber', 'lime', 'slate'],
	6: ['blue', 'fuchsia', 'rose', 'amber', 'lime', 'slate'],
	7: ['blue', 'fuchsia', 'rose', 'amber', 'lime', 'teal', 'slate'],
	8: ['blue', 'violet', 'fuchsia', 'rose', 'amber', 'lime', 'teal', 'slate'],
	9: ['blue', 'violet', 'fuchsia', 'rose', 'amber', 'lime', 'green', 'teal', 'slate'],
	10: ['blue', 'violet', 'fuchsia', 'rose', 'orange', 'amber', 'lime', 'green', 'teal', 'slate'],
	11: ['blue', 'violet', 'fuchsia', 'pink', 'rose', 'orange', 'amber', 'lime', 'green', 'teal', 'slate'],
	12: ['sky', 'blue', 'violet', 'fuchsia', 'pink', 'rose', 'orange', 'amber', 'lime', 'green', 'teal', 'slate'],
};

/** Colors for a chart that knows how many keys it has and nothing else. */
export const keyColors = (count: number): HueColor[] => {
	const n = Math.min(MAX_KEYS, Math.max(1, Math.round(count) || 1));
	return keySets[n].map(hueColor);
};

export type SetMember = {
	key: string;
	hue: Hue;
	/** Only where sentence-casing the key gets it wrong, as in `ou` reading "Ou". */
	label?: string;
	/** The extra spellings. The key is an alias by definition. */
	aliases?: string[];
};

export type NamedSet = {
	key: string;
	label: string;
	/** The member unrecognized keys fall into. A set with one is a catch-all set. */
	catchAll?: string;
	members: SetMember[];
};

// Declaration order breaks a scoring tie, so moving a block changes which set
// wins a chart that two of them could claim.
export const namedSets: NamedSet[] = [
	{
		key: 'campaign',
		label: 'Campaign',
		members: [
			{ key: 'draft', hue: 'amber', aliases: ['drafts', 'unsent', 'unscheduled'] },
			{
				key: 'scheduled',
				hue: 'orange',
				aliases: ['schedule', 'queued', 'queue', 'pending', 'upcoming'],
			},
			{
				key: 'active',
				hue: 'emerald',
				aliases: ['live', 'published', 'sending', 'running', 'in progress'],
			},
			{ key: 'inactive', hue: 'slate', aliases: ['paused', 'pause', 'stopped', 'on hold'] },
			{ key: 'complete', hue: 'blue', aliases: ['completed', 'finished', 'done', 'ended'] },
		],
	},
	{
		key: 'status',
		label: 'Status',
		members: [
			{ key: 'draft', hue: 'amber', aliases: ['drafts', 'unscheduled', 'unsent'] },
			{
				key: 'scheduled',
				hue: 'orange',
				aliases: ['schedule', 'queued', 'queue', 'pending', 'upcoming'],
			},
			{ key: 'active', hue: 'sky', aliases: ['sending', 'live', 'running', 'in progress'] },
			{
				key: 'suspended',
				hue: 'rose',
				aliases: ['suspend', 'paused', 'pause', 'stopped', 'halted', 'on hold'],
			},
			{
				key: 'closed',
				hue: 'slate',
				aliases: ['close', 'complete', 'completed', 'finished', 'done', 'ended', 'archived'],
			},
		],
	},
	{
		key: 'franchise',
		label: 'Franchise',
		members: [
			{ key: 'corporate', hue: 'amber', aliases: ['corp', 'hq', 'headquarters', 'brand', 'national'] },
			{
				key: 'ou',
				hue: 'violet',
				label: 'OU',
				aliases: [
					'org',
					'org unit',
					'orgunit',
					'organization',
					'organisation',
					'organizational unit',
					'operating unit',
					'business unit',
				],
			},
			{ key: 'group', hue: 'slate', aliases: ['grp', 'location group', 'store group'] },
		],
	},
	{
		key: 'flow',
		label: 'Flow',
		catchAll: 'other',
		members: [
			{
				key: 'converted',
				hue: 'sky',
				aliases: ['convert', 'conversion', 'won', 'win', 'success', 'succeeded'],
			},
			{
				key: 'opted-out',
				hue: 'amber',
				aliases: ['opt out', 'optout', 'opted out', 'unsubscribed', 'unsubscribe', 'churned'],
			},
			{
				key: 'other',
				hue: 'slate',
				aliases: ['others', 'remaining', 'rest', 'none', 'no response', 'unknown'],
			},
		],
	},
	{
		key: 'subscription',
		label: 'Subscription',
		members: [
			{
				key: 'opted-in',
				hue: 'sky',
				aliases: ['opt in', 'optin', 'opted in', 'subscribed', 'subscribe', 'joined', 'consented'],
			},
			{
				key: 'opted-out',
				hue: 'amber',
				aliases: ['opt out', 'optout', 'opted out', 'unsubscribed', 'unsubscribe', 'churned'],
			},
		],
	},
	{
		key: 'priority',
		label: 'Priority',
		members: [
			{
				key: 'needs-attention',
				hue: 'amber',
				aliases: ['needs attention', 'need attention', 'attention', 'at risk', 'lagging', 'behind'],
			},
			{ key: 'steady', hue: 'slate', aliases: ['stable', 'on track', 'average', 'typical', 'holding'] },
			{ key: 'leading', hue: 'sky', aliases: ['leader', 'ahead', 'top', 'best', 'outperforming'] },
		],
	},
];

/** What a matched key gets relabeled to, derived from the key unless stated. */
export const memberLabel = ({ key, label }: SetMember) =>
	label ?? key.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

/** The filler words dropped while normalizing a key name. */
export const fillerWords = ['total', 'count', 'sum', 'number', 'num', 'of', 'the', 'by', 'all'];
