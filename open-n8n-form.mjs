import { chromium } from 'playwright';

const url = 'https://jobs.ashbyhq.com/n8n/896c58a8-0388-4037-b265-82b15633a568';

console.log('🌐 Opening n8n Senior Product Engineer application form...');
console.log('📄 URL:', url);
console.log('\n✅ Browser will open in a new window.');
console.log('📋 Fill out the form using the pre-written answers provided.');
console.log('🛑 STOP before clicking "Submit" - review everything first!\n');

const browser = await chromium.launch({
  headless: false,
  args: ['--start-maximized']
});

const context = await browser.newContext({
  viewport: null
});

const page = await context.newPage();

console.log('⏳ Loading application page...\n');

await page.goto(url, { waitUntil: 'networkidle' });

console.log('✅ Form loaded! You can now fill it out.');
console.log('\n📌 Key reminders:');
console.log('   - Upload CV: output/004-n8n-senior-product-engineer.pdf');
console.log('   - Upload Cover Letter: output/004-n8n-cover-letter.pdf');
console.log('   - Salary: EUR 90-95K');
console.log('   - Location: Stabio, Switzerland');
console.log('\n⏸️  Browser will stay open. Close it manually when done.\n');

// Keep browser open indefinitely
await page.waitForEvent('close');

console.log('Browser closed by user.');
await browser.close();
