// One record per page and one per h2/h3, each with the prose under it. Built
// by src/pages/search-index.json.ts and read by the search palette.
export interface SearchRecord {
	href: string;
	page: string;
	section: string;
	heading?: string;
	text: string;
}
