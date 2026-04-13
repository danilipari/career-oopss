import { chromium } from 'playwright';

const url = 'https://jobs.ashbyhq.com/n8n/896c58a8-0388-4037-b265-82b15633a568';

console.log('🌐 Opening n8n application form...');

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

console.log('✅ Page loaded. Taking snapshot...');

await page.waitForSelector('form, input, button', { timeout: 10000 });

const pageText = await page.textContent('body');
const formHTML = await page.innerHTML('body');

console.log('\n📋 Form Analysis:');
console.log('---');
console.log('Form is now visible in the browser window.');
console.log('Review the fields manually or provide screenshots.');
console.log('\n⏸️  Browser will stay open for 5 minutes.');
console.log('Press CTRL+C when done.\n');

await page.waitForTimeout(300000);

await browser.close();
