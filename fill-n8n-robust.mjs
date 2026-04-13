import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = 'https://jobs.ashbyhq.com/n8n/896c58a8-0388-4037-b265-82b15633a568/application';

console.log('🚀 n8n Application - Robust Auto-Fill\n');

const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

console.log('✅ Page loaded\n');

try {
  // Upload PDFs first
  const cvPath = path.join(__dirname, 'output', 'Dani_Lipari_CV_n8n_Senior_Product_Engineer.pdf');
  const coverPath = path.join(__dirname, 'output', 'Dani_Lipari_Cover_Letter_n8n.pdf');

  const fileInputs = await page.locator('input[type="file"]').all();
  if (fileInputs[0]) {
    await fileInputs[0].setInputFiles(cvPath);
    console.log('✓ CV uploaded');
  }
  if (fileInputs[1]) {
    await fileInputs[1].setInputFiles(coverPath);
    console.log('✓ Cover Letter uploaded');
  }

  await page.waitForTimeout(5000); // Wait for autofill to complete
  console.log('⏳ Waiting for autofill...\n');

  // Fill basic fields
  await page.fill('input#_systemfield_name', 'Dani Lipari');
  await page.fill('input#_systemfield_email', 'lipari.assistenza@gmail.com');
  console.log('✓ Name and email');

  // GitHub
  const githubField = page.locator('input').filter({ hasText: /github/i }).or(page.locator('input[id="2eb47733-ed2a-45c5-a718-a5b9d86faba3"]')).first();
  await githubField.fill('https://github.com/danilipari');
  console.log('✓ GitHub link');

  // Location checkbox - scroll and check
  const locationCheckbox = page.locator('text=I can be based in a European country other than Germany or the UK where I do not need visa support');
  await locationCheckbox.scrollIntoViewIfNeeded();
  await locationCheckbox.click();
  console.log('✓ Location selected');

  // Preferred location - find textarea after "preferred" text
  await page.locator('textarea').filter({ hasText: /type here|start typing/i }).first().fill('Switzerland (Ticino)');
  console.log('✓ Preferred location');

  // Salary
  const salaryFields = await page.locator('input[type="text"], textarea').all();
  for (const field of salaryFields) {
    const placeholder = await field.getAttribute('placeholder');
    if (placeholder?.includes('Type here')) {
      try {
        await field.fill('EUR 90,000-95,000 gross yearly base for full-time permanent contract', { timeout: 2000 });
        console.log('✓ Salary filled');
        break;
      } catch {}
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ KEY FIELDS FILLED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📋 Remaining fields to fill manually:');
  console.log('   - Motivation (long text)');
  console.log('   - n8n experience checkboxes');
  console.log('   - Background questions');
  console.log('   - Work preferences');
  console.log('   - Scale project');
  console.log('   - What you need from n8n');
  console.log('   - Final consent checkbox\n');

  console.log('📌 Browser staying open - complete remaining fields');
  console.log('📌 Use the answers from chat for remaining questions');
  console.log('📌 Review everything, then Submit\n');

} catch (error) {
  console.log('\n⚠️  Error occurred:', error.message);
  console.log('📌 Browser staying open - fill remaining fields manually\n');
}

// Keep browser open with Inspector
await page.pause();

await browser.close();
