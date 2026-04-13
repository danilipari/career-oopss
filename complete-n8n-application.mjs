import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = 'https://jobs.ashbyhq.com/n8n/896c58a8-0388-4037-b265-82b15633a568/application';

console.log('🤖 n8n Application Complete Auto-Fill\n');

const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

console.log('✅ Form loaded. Starting complete auto-fill...\n');

// Upload CV and Cover Letter
const cvPath = path.join(__dirname, 'output', 'Dani_Lipari_CV_n8n_Senior_Product_Engineer.pdf');
const coverPath = path.join(__dirname, 'output', 'Dani_Lipari_Cover_Letter_n8n.pdf');

const fileInputs = await page.locator('input[type="file"]').all();
if (fileInputs[0]) await fileInputs[0].setInputFiles(cvPath);
if (fileInputs[1]) await fileInputs[1].setInputFiles(coverPath);
console.log('✓ PDFs uploaded\n');

await page.waitForTimeout(3000); // Wait for autofill

// Fill text fields
await page.fill('input#_systemfield_name', 'Dani Lipari');
await page.fill('input#_systemfield_email', 'lipari.assistenza@gmail.com');
console.log('✓ Name and email filled');

// GitHub link
await page.fill('input[id="2eb47733-ed2a-45c5-a718-a5b9d86faba3"]', 'https://github.com/danilipari');
console.log('✓ GitHub link filled');

// Location checkbox - European country, no visa
await page.check('input#a1f30cab-9668-417c-baa6-9fa22309aace_04a9b797-dbc0-439f-b52f-56d2e5c04b7a-labeled-checkbox-4');
console.log('✓ Location checkbox selected');

// Preferred location
const locationField = page.locator('textarea, input').filter({ hasText: /Start typing|preferred.*location/i }).first();
await locationField.fill('Switzerland (Ticino)');
console.log('✓ Preferred location filled');

// Salary
await page.fill('input[id="99fd0bd5-028a-460d-a120-d305bf6487ac"]', 'EUR 90,000-95,000 gross yearly base for full-time permanent contract');
console.log('✓ Salary filled');

// Motivation
const motivationText = 'Three reasons: (1) The tech stack is an exact match—Vue + TypeScript + Node.js is my core stack. I\'ve shipped 20+ releases of WhatsCRM (Vue 3 + Pinia, 16k LOC, Chrome Manifest V3) and led the migration from React/Next.js to Vue/Nuxt at DonTouch. (2) Product ownership—running discovery, architecture, delivery, and iteration—excites me more than executing predefined tickets. At DonTouch, I owned full product cycles end-to-end. (3) n8n\'s open source DNA (145k+ stars) aligns with how I\'ve built my career: I\'ve contributed to WAHA (6k+ stars), published SDKs on npm (Amilon B2B Client) and PyPI (DumpConfluence), and logged 3,000+ GitHub contributions this year. I build for developers because I am one of your users.';
await page.fill('textarea[id="27e5c404-f982-458a-8350-22ca2dd3b72d"]', motivationText);
console.log('✓ Motivation filled');

// n8n experience checkboxes
await page.check('input#a1f30cab-9668-417c-baa6-9fa22309aace_661bdf70-d4c5-4384-b35d-ed844cd2c024-labeled-checkbox-1'); // other automation tools
await page.check('input#a1f30cab-9668-417c-baa6-9fa22309aace_661bdf70-d4c5-4384-b35d-ed844cd2c024-labeled-checkbox-2'); // new n8n user
console.log('✓ n8n experience selected');

// Startup experience - Yes
await page.check('input[id="a1f30cab-9668-417c-baa6-9fa22309aace_81a04f07-c150-4e8f-a22d-8000a3562e79-labeled-radio-0"]');
console.log('✓ Startup experience: Yes');

// Startup company details
await page.fill('textarea[id="9870d97d-4d79-4c96-9b5a-ac4737c1c71b"]', 'DonTouch SA (Lugano, Switzerland) - B2B SaaS platform for digital signage and content management. Small team (4 engineers), fast iteration cycles, wore multiple hats (frontend, backend, architecture), direct stakeholder collaboration. Led full migration from React/Next.js to Angular/Vue, owned product areas end-to-end.');
console.log('✓ Startup details filled');

// JS/TS frequency - Daily
await page.check('input[id="a1f30cab-9668-417c-baa6-9fa22309aace_b21fc537-caa1-4be2-b476-7974d16c297b-labeled-radio-0"]');
console.log('✓ JS/TS frequency: Daily');

// Node.js frequency - Daily as primary
await page.check('input[id="a1f30cab-9668-417c-baa6-9fa22309aace_5e32652b-647b-4660-a80c-daeed620e2ce-labeled-radio-0"]');
console.log('✓ Node.js frequency: Daily');

// Vue expertise - Daily in main role
await page.check('input[id="a1f30cab-9668-417c-baa6-9fa22309aace_363aa291-b480-47be-96e4-fb6d5ed20b33-labeled-radio-3"]');
console.log('✓ Vue expertise: Daily');

// Backend involvement - Architecture for features + broader discussions
await page.check('input[id="a1f30cab-9668-417c-baa6-9fa22309aace_a0703cb0-62de-48c0-b6f5-4d5e21236e77-labeled-radio-1"]');
console.log('✓ Backend involvement selected');

// Work type checkboxes (select 4)
await page.check('input#a1f30cab-9668-417c-baa6-9fa22309aace_24780c10-788d-49e4-acf2-d5d14a763788-labeled-checkbox-2'); // user-facing features
await page.check('input#a1f30cab-9668-417c-baa6-9fa22309aace_24780c10-788d-49e4-acf2-d5d14a763788-labeled-checkbox-6'); // large-scale refactors
await page.check('input#a1f30cab-9668-417c-baa6-9fa22309aace_24780c10-788d-49e4-acf2-d5d14a763788-labeled-checkbox-15'); // integrations/open-source
await page.check('input#a1f30cab-9668-417c-baa6-9fa22309aace_24780c10-788d-49e4-acf2-d5d14a763788-labeled-checkbox-8'); // product experiments
console.log('✓ Work type checkboxes selected');

// Largest scale project
const scaleText = 'DonTouch SA: B2B SaaS platform serving 200+ enterprise clients with real-time content synchronization across distributed digital signage networks. Challenges: (1) State management complexity across Vue/Angular apps with 10k+ concurrent WebSocket connections. (2) Migration strategy from React/Next.js to Vue/Nuxt without downtime—used feature flags, incremental rollout, parallel deployment. (3) Cross-framework state sync (NGRX + Pinia) required custom middleware and careful cache invalidation. Scaled backend (Node/Express + Firebase) to handle 50k+ daily active displays with <100ms latency for content updates.';
await page.fill('textarea[id="593641a4-1429-49c6-9b46-f07f1985f893"]', scaleText);
console.log('✓ Scale project filled');

// What you need from n8n
const needsText = '(1) Autonomy to own product areas end-to-end—from discovery through architecture to delivery and iteration. I thrive when I can make technical decisions and see them through. (2) Direct collaboration with product and stakeholders—I work best when I understand the "why" behind features, not just the "what." (3) A culture that values open source contributions and SDK/library authorship—I\'ve published on npm and PyPI, and I want to keep building developer tools. (4) Room to wear multiple hats—frontend, backend, architecture—without being pigeonholed into one area.';
await page.fill('textarea[id="83ba8c4a-e24a-4ed2-842f-9275628baddb"]', needsText);
console.log('✓ Needs from n8n filled');

// Final consent checkbox
await page.check('input#a26e3cfb-fbd2-4081-a618-f4243b69be6c__systemfield_data_consent_ack-labeled-checkbox-0');
console.log('✓ Consent checkbox checked');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ FORM COMPLETE - READY FOR REVIEW');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🛑 CRITICAL: DO NOT CLICK SUBMIT YET!\n');
console.log('📋 Review checklist:');
console.log('   ✓ Name: Dani Lipari');
console.log('   ✓ Email: lipari.assistenza@gmail.com');
console.log('   ✓ CV & Cover Letter uploaded');
console.log('   ✓ GitHub: https://github.com/danilipari');
console.log('   ✓ Location: Europe, no visa');
console.log('   ✓ Salary: EUR 90-95K');
console.log('   ✓ All questions answered');
console.log('\n📌 Scroll through the form and verify everything');
console.log('📌 When ready, click Submit manually\n');

// Keep browser open
await page.pause();

await browser.close();
