import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = 'https://jobs.ashbyhq.com/n8n/896c58a8-0388-4037-b265-82b15633a568/application';

console.log('🤖 Opening n8n Application Form...\n');

const browser = await chromium.launch({
  headless: false,
  args: ['--start-maximized']
});

const page = await browser.newPage();

console.log('⏳ Loading form...');
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

console.log('✅ Form loaded!\n');

// Get all form fields
console.log('📋 Analyzing form structure...\n');

const inputs = await page.locator('input, textarea, select').all();
console.log(`Found ${inputs.length} form fields\n`);

// Log each field for debugging
for (let i = 0; i < inputs.length; i++) {
  const input = inputs[i];
  const type = await input.getAttribute('type');
  const name = await input.getAttribute('name');
  const id = await input.getAttribute('id');
  const placeholder = await input.getAttribute('placeholder');

  console.log(`Field ${i + 1}:`);
  console.log(`  Type: ${type || 'textarea/select'}`);
  console.log(`  Name: ${name || 'N/A'}`);
  console.log(`  ID: ${id || 'N/A'}`);
  console.log(`  Placeholder: ${placeholder || 'N/A'}`);
  console.log('');
}

// Try to fill common fields by name attribute
console.log('\n📝 Attempting to auto-fill...\n');

const fieldMappings = {
  'name': 'Dani Lipari',
  'firstName': 'Dani',
  'first_name': 'Dani',
  'lastName': 'Lipari',
  'last_name': 'Lipari',
  'email': 'lipari.assistenza@gmail.com',
  'location': 'Stabio, Switzerland',
  'city': 'Stabio',
  'country': 'Switzerland',
  'linkedin': 'https://linkedin.com/in/dani-lipari-developer',
  'github': 'https://github.com/danilipari',
  'portfolio': 'https://github.com/danilipari',
  'website': 'https://github.com/danilipari'
};

for (const [fieldName, value] of Object.entries(fieldMappings)) {
  try {
    const field = page.locator(`input[name*="${fieldName}" i], input[id*="${fieldName}" i], input[placeholder*="${fieldName}" i]`).first();
    await field.fill(value, { timeout: 2000 });
    console.log(`✓ Filled: ${fieldName} = ${value}`);
  } catch (e) {
    // Field not found, skip
  }
}

// Handle file uploads
console.log('\n📎 Looking for file upload fields...\n');

const cvPath = path.join(__dirname, 'output', 'Dani_Lipari_CV_n8n_Senior_Product_Engineer.pdf');
const coverPath = path.join(__dirname, 'output', 'Dani_Lipari_Cover_Letter_n8n.pdf');

const fileInputs = await page.locator('input[type="file"]').all();
console.log(`Found ${fileInputs.length} file upload field(s)`);

if (fileInputs.length > 0) {
  try {
    console.log('📤 Uploading CV...');
    await fileInputs[0].setInputFiles(cvPath);
    console.log('✓ CV uploaded: Dani_Lipari_CV_n8n_Senior_Product_Engineer.pdf');
  } catch (e) {
    console.log('⚠️  Could not upload CV automatically');
  }

  if (fileInputs.length > 1) {
    try {
      console.log('📤 Uploading Cover Letter...');
      await fileInputs[1].setInputFiles(coverPath);
      console.log('✓ Cover Letter uploaded: Dani_Lipari_Cover_Letter_n8n.pdf');
    } catch (e) {
      console.log('⚠️  Could not upload Cover Letter automatically');
    }
  }
}

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ AUTO-FILL COMPLETE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📋 NEXT STEPS:');
console.log('   1. Review all auto-filled fields');
console.log('   2. Fill any remaining custom questions manually');
console.log('   3. Verify PDFs uploaded correctly');
console.log('   4. Check salary field: EUR 90-95K');
console.log('   5. Review everything one final time');
console.log('   6. Click Submit when ready\n');

console.log('⏸️  Browser will stay open. Fill remaining fields and submit when ready.\n');
console.log('🛑 REMEMBER: Do NOT submit without final review!\n');

// Keep browser open indefinitely
await page.waitForTimeout(600000); // 10 minutes

await browser.close();
