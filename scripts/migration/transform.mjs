import fs from 'node:fs'

const IN = process.argv[2]
const OUT = process.argv[3]
const docs = fs.readFileSync(IN, 'utf8').trim().split('\n').map((l) => JSON.parse(l))
const pub = docs.filter((d) => !d._id.startsWith('drafts.'))
const byType = (t) => pub.filter((d) => d._type === t)
const one = (t) => byType(t)[0]

let kc = 0
const key = () => 'm' + (kc++).toString(36) + Math.random().toString(36).slice(2, 8)
const plain = (arr) =>
  (arr || [])
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((c) => c.text).join(''))
    .join(' ')
    .trim()

// --- Portable Text normalization to our blockContent ---
function normPT(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map((node) => {
    if (node._type === 'block') {
      const b = {...node, _key: node._key || key()}
      if (b.style === 'h4mock') b.style = 'h4'
      if (!['h1', 'h2', 'h3', 'h4', 'normal', 'blockquote'].includes(b.style)) b.style = 'normal'
      b.markDefs = (b.markDefs || []).map((md) => {
        if (md._type !== 'link') return md
        const nl = {_key: md._key || key(), _type: 'link', openInNewTab: !!md.openInNewTab}
        if (md.linkType === 'page' || md.page) {
          nl.linkType = 'page'
          if (md.page) nl.page = md.page
        } else {
          nl.linkType = 'href'
          const href = md.href || md.url
          if (href) nl.href = href
        }
        return nl
      })
      return b
    }
    if (node._type === 'figure') {
      const f = {_type: 'figure', _key: node._key || key(), alt: node.alt || ''}
      if (node._sanityAsset) f._sanityAsset = node._sanityAsset
      else if (node.asset) f.asset = node.asset
      return f
    }
    return {...node, _key: node._key || key()}
  })
}

const hasText = (arr) =>
  (arr || []).some(
    (n) => n._type !== 'block' || (n.children || []).some((c) => (c.text || '').trim()),
  )

function figureField(fig, typeName = 'figure') {
  if (!fig) return undefined
  if (!fig._sanityAsset && !fig.asset) return undefined
  const out = {_type: typeName, alt: fig.alt || ''}
  if (fig._sanityAsset) out._sanityAsset = fig._sanityAsset
  else out.asset = fig.asset
  return out
}

function toLink(ref) {
  if (!ref || !ref._ref) return undefined
  return {_type: 'link', linkType: 'page', page: {_type: 'reference', _ref: ref._ref}, openInNewTab: false}
}

// hero content -> {heading, body[]}
function heroParts(content) {
  const arr = normPT(content)
  let hi = arr.findIndex((n) => n._type === 'block' && ['h1', 'h2', 'h3'].includes(n.style))
  if (hi < 0) hi = arr.findIndex((n) => n._type === 'block')
  const heading = hi >= 0 ? plain([arr[hi]]) : 'Untitled'
  const body = arr.filter((_, i) => i !== hi)
  return {heading, body}
}

function heroBlock(m) {
  const {heading, body} = heroParts(m.content)
  const img = figureField(m.photos && (m.photos.desktopPhoto || m.photos.mobilePhoto))
  const blk = {_key: m._key || key(), _type: 'heroSection', heading, backgroundType: 'image', alignment: 'left'}
  if (body.length) blk.body = body
  if (img) blk.image = img
  return blk
}

// Flatten a grid column's freeform content (blocks + inline figures) in order
function colContent(col) {
  const out = []
  for (const b of col.blocks || []) if (b._type === 'freeform') out.push(...(b.content || []))
  return out
}

function classify(nodes) {
  const images = nodes.filter((n) => n._type === 'figure')
  const textful = nodes.some((n) => n._type === 'block' && (n.children || []).some((c) => (c.text || '').trim()))
  return {images, hasText: textful, hasImage: images.length > 0}
}

function mediaTextBlock(fig, textNodes, position) {
  const norm = normPT(textNodes).filter((n) => n._type !== 'figure')
  const blk = {_key: key(), _type: 'mediaText', imagePosition: position}
  const img = figureField(fig)
  if (img) blk.image = img
  // Promote a leading heading block to the heading field
  if (norm[0] && norm[0]._type === 'block' && ['h1', 'h2', 'h3', 'h4'].includes(norm[0].style)) {
    blk.heading = plain([norm[0]])
    norm.shift()
  }
  if (hasText(norm)) blk.content = norm
  return blk
}

// Map a grid to blocks: [text|image] pairs become mediaText, everything else
// falls back to per-column richTextSection (preserving inline images).
function gridToBlocks(m) {
  const cols = m.columns || []
  if (cols.length === 2) {
    const a = classify(colContent(cols[0]))
    const b = classify(colContent(cols[1]))
    if (a.hasText && !a.hasImage && b.hasImage && !b.hasText)
      return [mediaTextBlock(b.images[0], colContent(cols[0]), 'right')]
    if (a.hasImage && !a.hasText && b.hasText && !b.hasImage)
      return [mediaTextBlock(a.images[0], colContent(cols[1]), 'left')]
  }
  const out = []
  for (const col of cols) {
    const content = normPT(colContent(col))
    if (hasText(content)) out.push({_key: key(), _type: 'richTextSection', content})
  }
  return out
}

function mapModules(modules) {
  const blocks = []
  const mods = modules || []
  for (let i = 0; i < mods.length; i++) {
    const m = mods[i]
    if (m._type === 'hero') {
      const hb = heroBlock(m)
      const nxt = mods[i + 1]
      // Merge a directly-following single-column intro grid into the hero body
      if (
        nxt &&
        nxt._type === 'grid' &&
        (nxt.columns || []).length === 1 &&
        (nxt.columns[0].blocks || []).length === 1 &&
        nxt.columns[0].blocks[0]._type === 'freeform'
      ) {
        const intro = normPT(nxt.columns[0].blocks[0].content)
        if (hasText(intro)) {
          hb.body = [...(hb.body || []), ...intro]
          i++
        }
      }
      blocks.push(hb)
    } else if (m._type === 'grid') {
      blocks.push(...gridToBlocks(m))
    }
    // collectionGrid / productHero / marquee / dividerPhoto -> skipped (out of scope / absent)
  }
  return blocks
}

function mapSeo(seo) {
  if (!seo) return undefined
  const out = {_type: 'seo'}
  if (seo.metaTitle) out.metaTitle = seo.metaTitle
  if (seo.metaDesc) out.metaDescription = seo.metaDesc
  const img = figureField(seo.shareGraphic, 'image')
  if (img) out.shareImage = img
  return Object.keys(out).length > 1 ? out : undefined
}

// ------- build output -------
const out = []

const hp = one('homePage')
if (hp) {
  const d = {_id: 'homePage', _type: 'homePage', hasTransparentHeader: hp.hasTransparentHeader ?? true, pageBuilder: mapModules(hp.modules)}
  const seo = mapSeo(hp.seo)
  if (seo) d.seo = seo
  out.push(d)
}

for (const p of byType('page')) {
  const d = {
    _id: p._id,
    _type: 'page',
    name: p.title || 'Untitled',
    slug: p.slug && p.slug.current ? p.slug : {_type: 'slug', current: (p.title || 'page').toLowerCase().replace(/\s+/g, '-')},
    hasTransparentHeader: p.hasTransparentHeader ?? false,
    pageBuilder: mapModules(p.modules),
  }
  const seo = mapSeo(p.seo)
  if (seo) d.seo = seo
  out.push(d)
}

const gs = one('generalSettings'),
  ss = one('seoSettings'),
  ps = one('promoSettings'),
  cs = one('cookieSettings')
const settings = {_id: 'siteSettings', _type: 'settings', title: (ss && (ss.siteTitle || ss.metaTitle)) || 'Kickaxe Guitars'}
if (gs && gs.siteURL) settings.siteUrl = gs.siteURL
if (ss) {
  if (ss.metaTitle) settings.metaTitle = ss.metaTitle
  if (ss.metaDesc) settings.metaDescription = ss.metaDesc
  const og = figureField(ss.shareGraphic, 'image')
  if (og) settings.ogImage = og
}
if (ps) {
  settings.promoBar = {enabled: !!(ps.display && ps.display !== 'never')}
  if (ps.text) settings.promoBar.text = ps.text
  const l = toLink(ps.link)
  if (l) settings.promoBar.link = l
}
if (cs) {
  settings.cookieConsent = {}
  if (cs.message) settings.cookieConsent.message = cs.message
  const l = toLink(cs.link)
  if (l) settings.cookieConsent.link = l
}
out.push(settings)

// navigation from headerSettings.menuDesktopLeft
const hs = one('headerSettings')
const menus = byType('menu')
const findMenu = (ref) => menus.find((m) => m._id === ref)
const navItems = []
const srcMenu = hs && hs.menuDesktopLeft && hs.menuDesktopLeft._ref ? findMenu(hs.menuDesktopLeft._ref) : menus[0]
for (const it of (srcMenu && srcMenu.items) || []) {
  if (it._type === 'navPage' && it.page && it.page._ref) {
    navItems.push({_key: key(), _type: 'navItem', label: it.title || '', link: {_type: 'link', linkType: 'page', page: {_type: 'reference', _ref: it.page._ref}, openInNewTab: false}})
  } else if (it._type === 'navLink') {
    navItems.push({_key: key(), _type: 'navItem', label: it.title || '', link: {_type: 'link', linkType: 'href', href: it.url || '', openInNewTab: false}})
  } else if (it._type === 'navDropdown') {
    const children = (it.dropdownItems || []).map((di) => ({
      _key: key(),
      _type: 'navChild',
      label: di.title || '',
      link: di.page && di.page._ref ? {_type: 'link', linkType: 'page', page: {_type: 'reference', _ref: di.page._ref}} : {_type: 'link', linkType: 'href', href: di.url || ''},
    }))
    navItems.push({_key: key(), _type: 'navItem', label: it.title || '', children})
  }
}
out.push({_id: 'navigation', _type: 'navigation', items: navItems})

// footer from footerSettings
const fs2 = one('footerSettings')
const iconMap = {Facebook: 'facebook', Instagram: 'instagram', YouTube: 'youtube', Youtube: 'youtube', Twitter: 'twitter', Soundcloud: 'soundcloud', Spotify: 'spotify', Reverb: 'reverb', TikTok: 'tiktok'}
const social = ((fs2 && fs2.social) || [])
  .map((s) => ({_key: s._key || key(), _type: 'socialLink', platform: iconMap[s.icon] || (s.icon || '').toLowerCase(), url: s.url}))
  .filter((s) => s.platform && s.url)
out.push({_id: 'footer', _type: 'footer', social, copyright: '© Kickaxe Guitars'})

fs.writeFileSync(OUT, out.map((d) => JSON.stringify(d)).join('\n') + '\n')

// ------- summary -------
const counts = {}
for (const d of out) counts[d._type] = (counts[d._type] || 0) + 1
console.log('transformed docs by type:', JSON.stringify(counts))
console.log('total:', out.length)
const blockCounts = {}
for (const d of out) for (const b of d.pageBuilder || []) blockCounts[b._type] = (blockCounts[b._type] || 0) + 1
console.log('page-builder blocks:', JSON.stringify(blockCounts))
console.log('nav items:', navItems.length, '| footer social:', social.length)
