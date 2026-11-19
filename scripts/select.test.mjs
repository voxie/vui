// Run against the docs dev server: node scripts/select.test.mjs http://localhost:4322
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
	const origin = process.argv[2] ?? 'http://localhost:4322';
	const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
	const errors = [];
	page.on('pageerror', error => errors.push(error.message));
	const visit = async path => {
		await page.goto(`${origin}/vui/${path}/`);
		await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
	};
	// What a panel and one of its rows are drawn with, so the select's list can be held to the menu's.
	const look = (row, panel) => row.evaluate((element, selector) => {
		const read = (target, keys) => Object.fromEntries(keys.map(key => [key, getComputedStyle(target)[key]]));
		return {
			panel: read(element.closest(selector), ['backgroundColor', 'borderTopColor', 'borderTopWidth', 'boxShadow']),
			row: read(element, ['backgroundColor', 'color', 'fontSize', 'fontWeight', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']),
		};
	}, panel);
	const list = page.getByRole('listbox');
	const option = name => list.getByRole('option', { name, exact: true });
	const waitClosed = () => list.waitFor({ state: 'detached' });
	// The control holding an option with this label, for the examples that have no label of their own.
	const selectWith = text => page.locator('div:has(> select)').filter({ hasText: text }).getByRole('combobox');
	const active = control => control.evaluate(element => document.getElementById(element.getAttribute('aria-activedescendant'))?.textContent.trim());
	// Scrolled to in one step, since the page scrolls smoothly and a list opened mid-scroll is still moving.
	const bring = (control, block = 'center') => control.evaluate((element, block) => element.scrollIntoView({ block, behavior: 'instant' }), block);
	const submitted = control => control.evaluate(element => element.parentElement.querySelector('select').value);

	await visit('docs/components/menu');
	await page.getByRole('button', { name: 'Actions' }).first().click();
	const menu = await look(page.getByRole('button', { name: 'Duplicate' }), 'ul');
	await page.keyboard.press('Escape');

	await visit('docs/components/select');
	const zone = page.getByRole('combobox', { name: 'Time zone' }).first();
	await assert.doesNotReject(zone.click().then(() => list.waitFor({ state: 'visible', timeout: 3000 })), 'A press opens the select\'s own list, not the platform picker');
	assert.equal(await zone.getAttribute('aria-expanded'), 'true');
	assert.equal(await zone.getAttribute('aria-controls'), await list.getAttribute('id'));
	assert.equal(await list.getByRole('option').count(), 2);
	assert.equal(await option('Eastern Time').getAttribute('aria-selected'), 'true', 'With nothing chosen the first option is the value');
	assert.deepEqual(await look(option('Central Time'), '[role="listbox"]'), menu, 'The list is drawn like a menu panel');
	const [controlBox, listBox] = [await zone.boundingBox(), await list.boundingBox()];
	assert.equal(Math.round(listBox.y - controlBox.y - controlBox.height), 8, 'The list sits 8px under the control');
	assert.equal(Math.round(listBox.x), Math.round(controlBox.x), 'The list lines up with the control');
	assert.ok(listBox.width >= controlBox.width, 'The list is at least as wide as the control');

	await option('Central Time').click();
	await waitClosed();
	assert.equal((await zone.textContent()).trim().startsWith('Central Time'), true);
	assert.equal(await zone.evaluate(element => element === document.activeElement), true, 'Focus stays on the control after a pick');
	assert.equal(await submitted(zone), 'america/chicago', 'The native select carries the value for a form');

	await zone.click();
	await page.getByRole('heading', { name: 'Required', exact: true }).click();
	await waitClosed();

	await zone.focus();
	await page.keyboard.press('ArrowDown');
	await list.waitFor({ state: 'visible' });
	assert.equal(await active(zone), 'Central Time', 'The list opens on the chosen option');
	await page.keyboard.press('ArrowUp');
	assert.equal(await active(zone), 'Eastern Time');
	await page.keyboard.press('Escape');
	await waitClosed();
	assert.equal((await zone.textContent()).trim().startsWith('Central Time'), true, 'Escape closes without choosing');
	await page.keyboard.press('Space');
	await list.waitFor({ state: 'visible' });
	await page.keyboard.press('ArrowUp');
	await page.keyboard.press('Enter');
	await waitClosed();
	assert.equal((await zone.textContent()).trim().startsWith('Eastern Time'), true, 'Enter chooses the active option');

	const zones = selectWith('Mountain Time');
	await bring(zones);
	await zones.focus();
	await page.keyboard.press('p');
	await list.waitFor({ state: 'visible' });
	assert.equal(await active(zones), 'Pacific Time', 'Typing jumps to a matching option');
	await page.keyboard.press('ArrowDown');
	assert.equal(await active(zones), 'Pacific Time', 'Arrows skip a disabled option');
	assert.equal(await option('Alaska Time').getAttribute('aria-disabled'), 'true');
	await option('Alaska Time').click({ force: true });
	assert.equal(await list.count(), 1, 'A disabled option does not choose or close');
	await page.keyboard.press('Home');
	assert.equal(await active(zones), 'Eastern Time');
	await page.keyboard.press('End');
	await page.keyboard.press('Tab');
	await waitClosed();
	assert.equal((await zones.textContent()).trim().startsWith('Pacific Time'), true, 'Tab chooses the active option on its way out');
	assert.equal(await zones.evaluate(element => element === document.activeElement), false);

	const campaigns = selectWith('Spring promo');
	await bring(campaigns);
	await campaigns.click();
	assert.deepEqual(await list.getByRole('group', { name: 'Running' }).getByRole('option').allTextContents().then(labels => labels.map(label => label.trim())), ['Spring promo', 'Welcome series']);
	const changed = page.evaluate(() => new Promise(resolve => document.addEventListener('change', event => resolve(event.target.value), { once: true })));
	await option('Black Friday').click();
	await waitClosed();
	assert.equal(await changed, 'black-friday', 'A choice fires change on the native select');

	const segments = selectWith('Lapsed 90 days');
	assert.equal((await segments.textContent()).trim().startsWith('Select a segment'), true, 'A placeholder shows until something is chosen');
	assert.equal(await submitted(segments), '', 'A select with a placeholder starts with no value');

	assert.equal(await selectWith('Managed by your admin').isDisabled(), true);

	// At the foot of the window the list opens upward.
	await bring(zone, 'end');
	await zone.click();
	await list.waitFor({ state: 'visible' });
	const [lowControl, flipped] = [await zone.boundingBox(), await list.boundingBox()];
	assert.equal(Math.round(lowControl.y - flipped.y - flipped.height), 8, 'The list flips above a control at the foot of the window');
	await page.keyboard.press('Escape');
	await waitClosed();

	// Below `md` the sidebar is a select, and choosing a page goes to it.
	await page.setViewportSize({ width: 390, height: 700 });
	const nav = page.getByRole('combobox', { name: 'Browse documentation' });
	assert.equal((await nav.textContent()).trim().startsWith('Select'), true, 'The nav select rests on the current page');
	await nav.click();
	await list.waitFor({ state: 'visible' });
	const bounds = await list.boundingBox();
	assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.y + bounds.height <= 700, 'The list stays within a narrow viewport');
	await option('Button').click();
	await page.waitForURL('**/docs/components/button/');
	assert.deepEqual(errors, []);
	console.log('Select checks passed: menu styling, placement, pointer, keyboard, typeahead, groups, disabled, placeholder, form value, flipping, and the narrow nav.');
} finally {
	await browser.close();
}
