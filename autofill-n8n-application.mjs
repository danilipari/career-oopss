import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = 'https://jobs.ashbyhq.com/n8n/896c58a8-0388-4037-b265-82b15633a568';

console.log('🤖 n8n Application Auto-Fill Starting...\n');

const browser = await chromium.launch({
  headless: false,
  args: ['--start-maximized']
});

const context = await browser.newContext({
  viewport: null
});

const page = await context.newPage();

console.log('⏳ Loading application form...');
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

console.log('✅ Form loaded. Starting auto-fill...\n');

// Helper function to fill field by label or placeholder
async function fillByLabel(labelText, value) {
  try {
    const field = page.locator(`input, textarea`).filter({ hasText: labelText }).or(
      page.locator(`label:has-text("${labelText}") + input, label:has-text("${labelText}") + textarea`)
    ).or(
      page.locator(`input[placeholder*="${labelText}"], textarea[placeholder*="${labelText}"]`)
    ).first();

    await field.fill(value);
    console.log(`✓ Filled: ${labelText}`);
    return true;
  } catch (e) {
    console.log(`✗ Could not find: ${labelText}`);
    return false;
  }
}

// Fill standard fields
console.log('📝 Filling standard fields...');

await fillByLabel('First Name', 'Dani');
await fillByLabel('Last Name', 'Lipari');
await fillByLabel('Full Name', 'Dani Lipari');
await fillByLabel('Email', 'lipari.assistenza@gmail.com');
await fillByLabel('Location', 'Stabio, Switzerland');
await fillByLabel('LinkedIn', 'https://linkedin.com/in/dani-lipari-developer');
await fillByLabel('GitHub', 'https://github.com/danilipari');

// Try to find and fill custom questions
console.log('\n❓ Looking for custom questions...');

const questions = await page.locator('textarea, input[type="text"]').all();
console.log(`Found ${questions.length} text fields total\n`);

// Common question patterns and answers
const answers = {
  'why n8n': 'Three reasons: (1) Vue + TypeScript + Node.js is my core stack—I\'ve shipped 20+ releases of WhatsCRM (Vue 3 + Pinia, 16k+ LOC) and led the DonTouch migration from React to Vue. (2) Product ownership (discovery → architecture → delivery) excites me more than executing tickets. (3) n8n\'s open source DNA (145k+ stars) aligns with my career: I\'ve contributed to WAHA (6k+ stars) and published SDKs on npm/PyPI. I build for developers because I am one of your users.',

  'experience': 'I\'ve built production systems at scale with this exact stack. WhatsCRM: Vue 3 + Pinia, 16k+ LOC, 20+ releases. DonTouch: Led React/Next.js → Vue/Nuxt migration for a 4-person team. Amilon SDK: Published on npm, TypeScript, OAuth2, dual ESM/CJS. Backend: Node/Express at Studio Speri and DUNED. This is where I\'ve done my best work.',

  'product area': 'At DonTouch, I owned the migration from React/Next.js to Angular/Vue for our core product. Discovery: analyzed legacy codebase with stakeholders. Architecture: designed NX monorepo + NGRX state. Delivery: implemented across Vue 3, Angular 21, Node/Express (AWS/GCS). Iteration: monitored user feedback post-launch and refined the state layer. Balanced speed, quality, security across the team.',

  'salary': 'EUR 90-95K for fully remote Europe roles',

  'start': 'Within 4-6 weeks'
};

// Upload PDFs
console.log('\n📎 Looking for file upload fields...');

const cvPath = path.join(__dirname, 'output', 'Dani_Lipari_CV_n8n_Senior_Product_Engineer.pdf');
const coverPath = path.join(__dirname, 'output', 'Dani_Lipari_Cover_Letter_n8n.pdf');

try {
  const fileInputs = await page.locator('input[type="file"]').all();
  console.log(`Found ${fileInputs.length} file upload fields`);

  if (fileInputs.length > 0) {
    console.log('📤 Uploading CV...');
    await fileInputs[0].setInputFiles(cvPath);
    console.log('✓ CV uploaded');

    if (fileInputs.length > 1) {
      console.log('📤 Uploading Cover Letter...');
      await fileInputs[1].setInputFiles(coverPath);
      console.log('✓ Cover Letter uploaded');
    }
  }
} catch (e) {
  console.log('⚠️  Could not auto-upload files. You may need to upload manually.');
}

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎯 AUTO-FILL COMPLETE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('⚠️  IMPORTANT - REVIEW BEFORE SUBMIT:');
console.log('   1. Check all fields are filled correctly');
console.log('   2. Verify PDFs uploaded (CV + Cover Letter)');
console.log('   3. Review custom question answers');
console.log('   4. Confirm salary: EUR 90-95K');
console.log('   5. ONLY THEN click Submit\n');

console.log('📌 Browser will stay open for your review.');
console.log('🛑 DO NOT SUBMIT until you\'ve verified everything!\n');

// Keep browser open for manual review
await page.pause();

await browser.close();
