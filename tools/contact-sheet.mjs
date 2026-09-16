#!/usr/bin/env node
/**
 * Builds one PDF holding every captured page at every width, labelled, so a design can
 * be reviewed in one scroll instead of across a hundred separate images.
 *
 *   node tools/contact-sheet.mjs screenshots/demo "Adarsha School & College"
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const dir = process.argv[2] ?? 'screenshots/demo'
const title = process.argv[3] ?? 'Site review'
const out = process.argv[4] ?? join(dir, 'contact-sheet.pdf')

const viewports = ['desktop', 'tablet', 'phone', 'dark']
const viewportLabel = {
  desktop: 'Desktop · 1440px',
  tablet: 'Tablet · 834px',
  phone: 'Phone · 390px',
  dark: 'Dark theme · 1440px',
}

// Group the captures by the page they show, keeping the order the pages were taken in.
const files = readdirSync(dir).filter(name => name.endsWith('.png'))
const pages = new Map()
for (const file of files) {
  const match = /^(.+)-(desktop|tablet|phone|dark)\.png$/.exec(file)
  if (!match) continue
  const [, page, viewport] = match
  if (!pages.has(page)) pages.set(page, {})
  pages.get(page)[viewport] = file
}

// Full-resolution PNGs would make an unusably large document; these are for reading,
// not for pixel inspection.
const work = join(dir, '_sheet')
if (existsSync(work)) rmSync(work, { recursive: true })
mkdirSync(work, { recursive: true })

const prepared = new Map()
for (const [page, shots] of pages) {
  prepared.set(page, {})
  for (const viewport of viewports) {
    const file = shots[viewport]
    if (!file) continue
    const target = `${page}-${viewport}.jpg`
    await sharp(join(dir, file))
      .resize({ width: 1100, withoutEnlargement: true })
      .jpeg({ quality: 70, mozjpeg: true })
      .toFile(join(work, target))
    prepared.get(page)[viewport] = target
  }
}

const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const pretty = name => name.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())

const sections = [...prepared.entries()].map(([page, shots]) => {
  const shotHtml = viewports
    .filter(viewport => shots[viewport])
    .map(viewport => `
      <figure>
        <figcaption>${escape(viewportLabel[viewport])}</figcaption>
        <img src="_sheet/${shots[viewport]}" />
      </figure>`)
    .join('')

  return `<section><h2>${escape(pretty(page))}</h2>${shotHtml}</section>`
}).join('')

const html = `<!doctype html>
<meta charset="utf-8">
<title>${escape(title)}</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  body { font: 11pt/1.4 system-ui, sans-serif; color: #16202b; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 4pt; }
  .lede { color: #5b6b7c; margin: 0 0 18pt; font-size: 10pt; }
  section { break-before: page; }
  section:first-of-type { break-before: avoid; }
  h2 { font-size: 14pt; margin: 0 0 10pt; padding-bottom: 5pt; border-bottom: 2px solid #0b6e4f; }
  figure { margin: 0 0 14pt; break-inside: avoid; }
  figcaption { font-size: 8.5pt; color: #5b6b7c; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 4pt; }
  img { display: block; width: 100%; border: 1px solid #dfe3e8; }
</style>
<h1>${escape(title)}</h1>
<p class="lede">${prepared.size} pages, each at desktop, tablet, phone and dark theme. Generated ${new Date().toISOString().slice(0, 10)}.</p>
${sections}
`

const htmlPath = join(dir, '_sheet.html')
writeFileSync(htmlPath, html)

const browser = await chromium.launch({
  executablePath: existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
    : undefined,
})
const page = await browser.newPage()
await page.goto(`file://${resolve(htmlPath)}`, { waitUntil: 'networkidle' })
await page.pdf({ path: out, format: 'A4', printBackground: true })
await browser.close()

console.log(`✓ ${out} — ${prepared.size} pages`)
