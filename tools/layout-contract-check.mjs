import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT_CHECKS = [
  { file: 'src/presentation/pages/dashboard/style.js', selector: '.dash-grid' },
  { file: 'src/presentation/pages/users/style.js', selector: '.users-card' },
  { file: 'src/presentation/pages/file-manager/style.js', selector: '.fm-wrap' },
  { file: 'src/presentation/pages/social/style.js', selector: '.social-page' },
  { file: 'src/presentation/pages/login/style.js', selector: '.login-page' },
  { file: 'src/presentation/pages/profile/style/layout.js', selector: '.profile-page' },
  { file: 'src/presentation/pages/shared/dashboardRenderer.js', selector: '.role-dashboard' },
];

const DISALLOWED = [
  /max-width\s*:/i,
  /margin\s*:\s*0\s+auto/i,
  /width\s*:\s*min\s*\(/i,
  /inline-size\s*:\s*min\s*\(/i,
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractRootBlock(source, selector) {
  const regex = new RegExp(`${escapeRegex(selector)}\\{([^}]*)\\}`, 'g');
  const blocks = [];
  let match = regex.exec(source);
  while (match) {
    blocks.push(match[1] || '');
    match = regex.exec(source);
  }
  return blocks;
}

async function main() {
  const violations = [];

  for (const check of ROOT_CHECKS) {
    const filePath = path.resolve(check.file);
    const source = await readFile(filePath, 'utf8');
    const blocks = extractRootBlock(source, check.selector);

    if (!blocks.length) {
      violations.push(`${check.file}: missing selector ${check.selector}`);
      continue;
    }

    for (const block of blocks) {
      for (const rule of DISALLOWED) {
        if (rule.test(block)) {
          violations.push(`${check.file}: ${check.selector} contains forbidden layout rule (${rule})`);
        }
      }
    }
  }

  if (violations.length) {
    console.error('Layout contract violations found:');
    for (const line of violations) console.error(`- ${line}`);
    process.exit(1);
  }

  console.log(`LAYOUT_CONTRACT_OK (${ROOT_CHECKS.length} root selectors checked)`);
}

main().catch((error) => {
  console.error('Layout contract check failed:', error);
  process.exit(1);
});
