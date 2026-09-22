// Run against the docs dev server: node scripts/popover.test.mjs http://localhost:4322
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
	const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
	const errors = [];
	page.on('pageerror', error => errors.push(error.message));
	await page.goto(`${process.argv[2] ?? 'http://localhost:4322'}/vui/docs/components/popover/`);
	await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
	const triggers = page.getByRole('button', { name: /^(Open popover|Hover or click to open|Open to the right|Open beyond the container|Popover disabled)$/ });
	const panel = page.getByRole('dialog', { name: 'Delivery details' });
	const waitClosed = () => panel.waitFor({ state: 'detached' });
	const waitFocused = locator => locator.evaluate(element => new Promise((resolve, reject) => {
		const start = Date.now();
		const check = () => {
			if (element === document.activeElement) return resolve(true);
			if (Date.now() - start > 3000) return reject(new Error(`Focus did not reach ${element.textContent}`));
			requestAnimationFrame(check);
		};
		check();
	}));

	await triggers.first().focus();
	await page.keyboard.press('Enter');
	await waitFocused(panel.getByRole('button', { name: 'Got it' }));
	assert.equal(await triggers.first().getAttribute('aria-expanded'), 'true');
	assert.equal(await triggers.first().getAttribute('aria-controls'), await panel.getAttribute('id'));
	await page.keyboard.press('Escape');
	await waitClosed();
	await waitFocused(triggers.first());
	await page.keyboard.press('Space');
	await waitFocused(panel.getByRole('button', { name: 'Got it' }));
	await page.keyboard.press('Shift+Tab');
	await waitClosed();
	await waitFocused(triggers.first());
	await triggers.first().click();
	await waitFocused(panel.getByRole('button', { name: 'Got it' }));
	await page.keyboard.press('Tab');
	await waitClosed();
	await waitFocused(triggers.nth(1));
	await triggers.first().click();
	await panel.getByRole('button', { name: 'Got it' }).click();
	await waitClosed();
	await waitFocused(triggers.first());
	await triggers.first().click();
	await page.getByRole('heading', { name: 'Content', exact: true }).click();
	await waitClosed();

	const hover = triggers.nth(1);
	await hover.hover();
	await page.waitForTimeout(100);
	assert.equal(await panel.count(), 0, 'Hover honors the opening delay');
	await panel.waitFor({ state: 'visible' });
	await panel.hover();
	await page.waitForTimeout(200);
	assert.equal(await panel.count(), 1, 'The pointer can cross onto the panel');
	await page.mouse.move(0, 0);
	await waitClosed();
	await hover.hover();
	await page.keyboard.press('Escape');
	await page.waitForTimeout(400);
	assert.equal(await panel.count(), 0, 'Escape cancels a pending hover open');
	await page.mouse.move(0, 0);
	await hover.hover();
	await panel.waitFor({ state: 'visible' });
	await hover.click();
	await page.mouse.move(0, 0);
	await page.waitForTimeout(200);
	assert.equal(await panel.count(), 1, 'Click pins a hovered panel');
	await hover.click();
	await waitClosed();

	await triggers.nth(3).click();
	await panel.waitFor({ state: 'visible' });
	assert.equal(await panel.evaluate(element => element.parentElement === document.body), true);
	const beforeScroll = await panel.boundingBox();
	await triggers.nth(3).evaluate(element => element.closest('.overflow-y-auto').scrollBy(0, 40));
	await page.waitForFunction(previousY => {
		const panel = document.querySelector('[role="dialog"]');
		return panel && Math.abs(panel.getBoundingClientRect().y - previousY + 40) < 2;
	}, beforeScroll.y);
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Open from outside' }).click();
	await panel.waitFor({ state: 'visible' });
	await waitFocused(page.getByRole('button', { name: 'Open from outside' }));
	await page.keyboard.press('Escape');
	await waitClosed();
	assert.equal(await triggers.last().isDisabled(), true);

	await page.setViewportSize({ width: 390, height: 700 });
	await triggers.nth(2).click();
	await panel.waitFor({ state: 'visible' });
	const bounds = await panel.boundingBox();
	assert.ok(bounds.x >= 7 && bounds.x + bounds.width <= 383, 'Panel stays within narrow viewport');
	const side = await panel.getAttribute('data-side');
	const arrow = panel.locator(':scope > [aria-hidden="true"]');
	const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side];
	assert.equal(await arrow.evaluate((element, edge) => element.style[edge], opposite), '-4px', 'Arrow follows the resolved side');
	await page.screenshot({ path: '/tmp/vui-popover-mobile.png' });
	await page.keyboard.press('Escape');
	await waitClosed();
	assert.deepEqual(errors, []);

	const touch = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 700 } });
	const touchPage = await touch.newPage();
	await touchPage.goto(page.url());
	await touchPage.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
	await touchPage.getByRole('button', { name: 'Hover or click to open', exact: true }).tap();
	await touchPage.getByRole('dialog').waitFor({ state: 'visible' });
	await touchPage.getByRole('button', { name: 'Got it' }).tap();
	await touchPage.getByRole('dialog').waitFor({ state: 'detached' });
	await touch.close();
	console.log('Popover checks passed: keyboard, focus, dismissal, hover, controlled state, clipping, narrow viewport, and touch.');
} finally {
	await browser.close();
}
