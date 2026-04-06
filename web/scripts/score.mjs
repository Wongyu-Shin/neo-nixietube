/**
 * Document completeness scorer for autoresearch verify.
 * Checks required sections, word counts, and quality indicators.
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const PAGES_DIR = join(import.meta.dirname, '..', 'app')

const REQUIRED_PAGES = [
  { path: 'page.mdx', name: 'Overview', minWords: 300 },
  { path: 'glossary/page.mdx', name: 'Glossary', minWords: 500 },
  { path: 'bridges/page.mdx', name: 'Bridges', minWords: 500 },
  { path: 'path-frit/page.mdx', name: 'Path 1: Frit', minWords: 500 },
  { path: 'path-roomtemp/page.mdx', name: 'Path 2: Room-Temp', minWords: 500 },
  { path: 'simulation/page.mdx', name: 'Simulation', minWords: 300 },
  { path: 'action-plan/page.mdx', name: 'Action Plan', minWords: 300 },
  { path: 'bom/page.mdx', name: 'BOM', minWords: 300 },
]

const QUALITY_CHECKS = [
  { name: 'README exists', check: () => existsSync(join(PAGES_DIR, '..', '..', 'README.md')) },
  { name: 'Layout has nav', check: () => {
    const layout = readFileSync(join(PAGES_DIR, 'layout.tsx'), 'utf-8')
    const navFile = join(PAGES_DIR, 'components', 'Nav.tsx')
    return (layout.includes('Nav') || layout.includes('nav')) && (layout.includes('NAV_ITEMS') || existsSync(navFile))
  }},
  { name: 'MDX components styled', check: () => existsSync(join(PAGES_DIR, '..', 'mdx-components.tsx')) },
  { name: 'No TODO/TBD/placeholder', check: () => {
    let clean = true
    for (const page of REQUIRED_PAGES) {
      const fp = join(PAGES_DIR, page.path)
      if (existsSync(fp)) {
        const content = readFileSync(fp, 'utf-8')
        if (/TODO|TBD|FIXME|placeholder|Lorem/i.test(content)) {
          clean = false
        }
      }
    }
    return clean
  }},
]

// Visual quality checks (ccunpacked.dev style)
const VISUAL_CHECKS = [
  { name: 'Custom font (Space Grotesk)', check: () => {
    const layout = readFileSync(join(PAGES_DIR, 'layout.tsx'), 'utf-8')
    return layout.includes('Space_Grotesk') || layout.includes('space-grotesk') || layout.includes('Space Grotesk')
  }},
  { name: 'Dark background (#0D0D0D)', check: () => {
    const css = readFileSync(join(PAGES_DIR, 'globals.css'), 'utf-8')
    const layout = readFileSync(join(PAGES_DIR, 'layout.tsx'), 'utf-8')
    return css.includes('0D0D0D') || css.includes('#0d0d0d') || layout.includes('bg-[#0D0D0D]') || layout.includes('#0D0D0D')
  }},
  { name: 'Category color coding', check: () => {
    const mdxc = readFileSync(join(PAGES_DIR, '..', 'mdx-components.tsx'), 'utf-8')
    const layout = readFileSync(join(PAGES_DIR, 'layout.tsx'), 'utf-8')
    const navFile = join(PAGES_DIR, 'components', 'Nav.tsx')
    const navContent = existsSync(navFile) ? readFileSync(navFile, 'utf-8') : ''
    const all = mdxc + layout + navContent
    return all.includes('D4A853') || all.includes('category') || all.includes('#D4A853')
  }},
  { name: 'Card components exist', check: () => {
    let found = false
    for (const page of REQUIRED_PAGES) {
      const fp = join(PAGES_DIR, page.path)
      if (existsSync(fp)) {
        const content = readFileSync(fp, 'utf-8')
        if (content.includes('Card') || content.includes('card') || content.includes('rounded-xl') || content.includes('border-')) {
          found = true; break
        }
      }
    }
    return found
  }},
  { name: 'Hero section on homepage', check: () => {
    const fp = join(PAGES_DIR, 'page.mdx')
    if (!existsSync(fp)) return false
    const content = readFileSync(fp, 'utf-8')
    return content.includes('Hero') || content.includes('hero') || content.includes('gradient')
  }},
  { name: 'Animated/transition elements', check: () => {
    const files = [join(PAGES_DIR, 'layout.tsx'), join(PAGES_DIR, '..', 'mdx-components.tsx')]
    return files.some(f => {
      if (!existsSync(f)) return false
      const c = readFileSync(f, 'utf-8')
      return c.includes('transition') || c.includes('animate') || c.includes('hover:')
    })
  }},
  { name: 'Nav active state styling', check: () => {
    const layout = readFileSync(join(PAGES_DIR, 'layout.tsx'), 'utf-8')
    const navFile = join(PAGES_DIR, 'components', 'Nav.tsx')
    const navContent = existsSync(navFile) ? readFileSync(navFile, 'utf-8') : ''
    const all = layout + navContent
    return all.includes('pathname') || all.includes('usePathname') || all.includes('active')
  }},
  { name: 'Badge/pill components', check: () => {
    let found = false
    const allFiles = [...REQUIRED_PAGES.map(p => join(PAGES_DIR, p.path)),
                      join(PAGES_DIR, 'layout.tsx'),
                      join(PAGES_DIR, '..', 'mdx-components.tsx')]
    for (const fp of allFiles) {
      if (existsSync(fp)) {
        const c = readFileSync(fp, 'utf-8')
        if (c.includes('Badge') || c.includes('badge') || c.includes('pill') || c.includes('rounded-full')) {
          found = true; break
        }
      }
    }
    return found
  }},
]

let totalScore = 0
let maxScore = 0
const results = []

// Check required pages
for (const page of REQUIRED_PAGES) {
  const fp = join(PAGES_DIR, page.path)
  maxScore += 10 // existence: 10 points each

  if (existsSync(fp)) {
    const content = readFileSync(fp, 'utf-8')
    const words = content.split(/\s+/).filter(w => w.length > 0).length
    const tables = (content.match(/\|.*\|/g) || []).length
    const headings = (content.match(/^#{1,3}\s/gm) || []).length

    let pageScore = 5 // exists = 5 points
    if (words >= page.minWords) pageScore += 3 // word count = 3 points
    if (tables >= 1) pageScore += 1 // has tables = 1 point
    if (headings >= 3) pageScore += 1 // has structure = 1 point

    totalScore += pageScore
    results.push({ page: page.name, score: pageScore, words, tables, headings, status: pageScore >= 8 ? 'GOOD' : pageScore >= 5 ? 'OK' : 'WEAK' })
  } else {
    results.push({ page: page.name, score: 0, words: 0, tables: 0, headings: 0, status: 'MISSING' })
  }
}

// Quality checks (5 points each)
for (const qc of QUALITY_CHECKS) {
  maxScore += 5
  const pass = qc.check()
  if (pass) totalScore += 5
  results.push({ page: `[QC] ${qc.name}`, score: pass ? 5 : 0, status: pass ? 'PASS' : 'FAIL' })
}

// Visual quality checks (5 points each)
for (const vc of VISUAL_CHECKS) {
  maxScore += 5
  try {
    const pass = vc.check()
    if (pass) totalScore += 5
    results.push({ page: `[VIS] ${vc.name}`, score: pass ? 5 : 0, status: pass ? 'PASS' : 'FAIL' })
  } catch {
    results.push({ page: `[VIS] ${vc.name}`, score: 0, status: 'ERR' })
  }
}

const pct = Math.round(totalScore / maxScore * 100)

// Output
console.log('=== Document Completeness Score ===')
console.log('')
for (const r of results) {
  const bar = '█'.repeat(r.score) + '░'.repeat(10 - r.score)
  const extra = r.words ? ` (${r.words}w, ${r.tables}t, ${r.headings}h)` : ''
  console.log(`  ${r.status.padEnd(7)} ${bar} ${r.page}${extra}`)
}
console.log('')
console.log(`SCORE: ${pct}`)
