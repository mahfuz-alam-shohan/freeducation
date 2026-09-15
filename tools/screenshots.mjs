#!/usr/bin/env node
/**
 * Captures every page of a running site, desktop and phone, so designs can be reviewed
 * as images rather than as code. Not part of `npm run verify` — it needs a live server.
 *
 *   ADAPTER=node PUBLIC_SCHOOL=demo npx astro build
 *   node ./dist/server/entry.mjs &
 *   node tools/screenshots.mjs http://127.0.0.1:4350 demo
 */
import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

// Use a Chromium that is already on the machine when its build differs from the one
// this Playwright version expects, rather than downloading another copy.
const knownChromium = [
  process.env.CHROMIUM_PATH,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
].filter(Boolean)
const executablePath = knownChromium.find(candidate => existsSync(candidate))

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:4350'
const label = process.argv[3] ?? 'demo'
const outDir = process.argv[4] ?? join('screenshots', label)

const pages = [
  ['home', '/'],
  ['notice-list', '/notice'],
  ['notice-detail', '/notice/admission-2026'],
  ['administration', '/administration'],
  ['teachers', '/administration/teachers'],
  ['about', '/about'],
  ['facilities', '/about/facilities'],
  ['routine', '/academics/routine'],
  ['results-form', '/results'],
  ['results-found', '/results?exam=half-yearly-2026&roll=101'],
  ['events', '/events'],
  ['gallery', '/gallery'],
  ['gallery-album', '/gallery/annual-sports-2026'],
  ['search', '/search?q=admission'],
  ['contact', '/contact'],
  ['not-found', '/no-such-page'],
]

const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'phone', width: 390, height: 844 },
]

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch(executablePath ? { executablePath } : {})
const failures = []

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
    // The ticker scrolls forever; a still frame should not depend on when it was taken.
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()

  for (const [name, path] of pages) {
    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' })
    const status = response?.status() ?? 0
    if (status >= 500) failures.push(`${path} returned ${status}`)

    await page.screenshot({
      path: join(outDir, `${name}-${viewport.name}.png`),
      fullPage: true,
    })
    process.stdout.write(`${status} ${viewport.name.padEnd(7)} ${path}\n`)
  }

  await context.close()
}

await browser.close()

if (failures.length > 0) {
  console.error(`\n✖ ${failures.length} page(s) failed:\n${failures.map(f => `  - ${f}`).join('\n')}`)
  process.exit(1)
}
console.log(`\n✓ captured ${pages.length * viewports.length} screenshots in ${outDir}`)
