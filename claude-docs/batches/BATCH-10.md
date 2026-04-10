# BATCH-10 — Visual Enhancement + PWA Full Screen Mode

## Commit
`feat(BATCH-10): visual polish — parallax, glassmorphism, animations + PWA fullscreen`

## Goal
Two things in one batch:
1. PWA setup — removes browser URL bar on iOS/Android when shared as link
2. Visual elevation — parallax hero, glassmorphism, micro-animations

---

## PART A — PWA Fullscreen (do this first, it's 20 min)

### 1. frontend/index.html — add meta tags
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

  <!-- PWA / Fullscreen -->
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="LVV Survey" />
  <meta name="theme-color" content="#2a1a22" />

  <!-- Icons for home screen -->
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
  <link rel="manifest" href="/manifest.json" />

  <title>Pre-Arrival Survey — La Vallée Village</title>
</head>
```

### 2. frontend/public/manifest.json (NEW FILE)
```json
{
  "name": "LVV Pre-Arrival Survey",
  "short_name": "LVV Survey",
  "description": "La Vallée Village × The Peninsula Paris — Pre-Arrival Experience Survey",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#2a1a22",
  "theme_color": "#2a1a22",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 3. Generate PWA icons
Create `frontend/public/icons/` with two PNGs:
- `icon-192.png` — 192×192px — LVV logo on dark plum background (#2a1a22)
- `icon-512.png` — 512×512px — same

Use a script to generate them programmatically with `sharp` or `canvas`:
```bash
cd frontend
npm install --save-dev sharp
node scripts/generate-icons.js
```

`frontend/scripts/generate-icons.js`:
```js
import sharp from 'sharp'
import { readFileSync } from 'fs'
import { mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

// Create a dark plum background square with centered text/logo
const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="80" fill="#2a1a22"/>
  <rect width="512" height="512" rx="80" fill="url(#grad)"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2a1a22"/>
      <stop offset="100%" style="stop-color:#523849"/>
    </linearGradient>
  </defs>
  <!-- LVV initials -->
  <text x="256" y="300" font-family="serif" font-size="180" font-weight="300"
    fill="#C9A84C" text-anchor="middle" letter-spacing="8">LVV</text>
  <text x="256" y="360" font-family="sans-serif" font-size="38" font-weight="300"
    fill="rgba(245,240,230,0.5)" text-anchor="middle" letter-spacing="6">SURVEY</text>
</svg>
`

await sharp(Buffer.from(svgIcon)).resize(192).png().toFile('public/icons/icon-192.png')
await sharp(Buffer.from(svgIcon)).resize(512).png().toFile('public/icons/icon-512.png')
console.log('Icons generated ✓')
```

### 4. Fix the "URL bar reappears on thank you screen" issue

**Root cause:** iOS Safari reveals URL bar when page height changes or on scroll-up.

**Fix — lock scroll on thank you screen:**
```jsx
// In App.jsx — when surveyState === 'thanks'
useEffect(() => {
  if (surveyState === 'thanks') {
    // Prevent scroll — keeps Safari from showing URL bar on scroll-up
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
  } else {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
  }
  return () => {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
  }
}, [surveyState])
```

**Fix — stable 100dvh height:**
```css
/* index.css — use dynamic viewport height */
html, body, #root {
  height: 100%;
  min-height: 100dvh; /* dvh = dynamic viewport height — accounts for browser chrome */
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}
```

**Fix — prevent Safari bounce scroll revealing URL bar:**
```css
/* Prevent overscroll on the survey container */
.survey-container {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}
```
Apply `className="survey-container"` to the root div in `PublicSurveyPage.jsx`.

### 5. Safe area insets (iPhone notch / Dynamic Island)
```css
/* index.css — handle notch/Dynamic Island */
.survey-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

And in `index.html` viewport meta:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```
`viewport-fit=cover` is what enables `env(safe-area-inset-*)` and removes the white bands on notched iPhones.

### 6. How guests use it (no install prompt needed)
The URL bar disappears automatically when:
- **iOS Safari:** Guest taps Share → "Add to Home Screen" → opens as standalone app
  - The partnership team should mention this in the welcome email/card
- **Android Chrome:** Browser auto-prompts "Add to Home Screen" after 2+ visits,
  OR guest can manually add via browser menu

For the Peninsula pilot, the QR code on the welcome card opens the URL directly in Safari.
The first time the guest opens it, they see the URL bar. If they add to home screen, it disappears.

**No URL bar even without install (Android Chrome 93+):**
Set `"display": "minimal-ui"` in manifest.json as fallback — hides URL bar in Chrome
without requiring home screen install. Change:
```json
"display": "minimal-ui"
```
This hides address bar in Chrome on Android immediately, no install needed.
iOS still requires Add to Home Screen for standalone mode.

---

## PART B — Visual Enhancements

### 7. Public Survey — Parallax Hero Background
```jsx
// In PublicSurveyPage.jsx — add parallax to start screen
import { useRef, useEffect } from 'react'

const heroRef = useRef(null)

useEffect(() => {
  const handleScroll = () => {
    if (heroRef.current) {
      heroRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

Background layers on start screen:
```jsx
<div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden' }}>
  {/* Parallax bg */}
  <div ref={heroRef} style={{
    position: 'absolute', inset: '-20%',
    background: `
      radial-gradient(ellipse at 20% 50%, rgba(82,56,73,0.6) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
      linear-gradient(160deg, #1a0a12 0%, #2a1a22 40%, #3d2030 70%, #523849 100%)
    `,
    willChange: 'transform',
  }} />
  <div className="orb orb-1" />
  <div className="orb orb-2" />
  <div style={{ position: 'relative', zIndex: 1 }}>
    {/* existing content */}
  </div>
</div>
```

### 8. Animated orbs — index.css
```css
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: floatOrb 12s ease-in-out infinite;
  pointer-events: none;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #C9A84C, transparent);
  top: -100px; right: -100px;
  animation-delay: 0s;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #523849, transparent);
  bottom: -80px; left: -80px;
  animation-delay: -6s;
}
@keyframes floatOrb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -40px) scale(1.05); }
  66%       { transform: translate(-20px, 20px) scale(0.95); }
}
@media (hover: none) {
  .orb { opacity: 0.08; animation-duration: 20s; }
}
```

### 9. Glassmorphism survey card
```jsx
// Replace solid dark card with frosted glass
<div style={{
  background: 'rgba(245, 240, 230, 0.07)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(245, 240, 230, 0.12)',
  borderRadius: 28,
  padding: '3.5rem 2.5rem 3rem',
  color: '#F5F0E6',
  boxShadow: `
    0 32px 64px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.08)
  `,
}}>
```

### 10. Style Photo Cards — 3D tilt + photo zoom
```jsx
// In StyleCard component (components.jsx)
const [hovered, setHovered] = useState(false)

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  e.currentTarget.style.transform =
    `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`
}
const handleMouseLeave = (e) => {
  e.currentTarget.style.transform =
    'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)'
  setHovered(false)
}

<div
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  onMouseEnter={() => setHovered(true)}
  style={{
    ...existingStyles,
    transition: 'transform 0.15s ease, border-color 0.2s',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
  }}
>
  {/* img with zoom */}
  <img style={{
    ...imgStyles,
    transform: hovered ? 'scale(1.08)' : 'scale(1)',
    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }} />
```

### 11. Step transitions — fade + slide
```css
/* index.css */
@keyframes stepEnter {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
```jsx
// In SurveyForm.jsx — wrap each step in:
<div key={step} style={{ animation: 'stepEnter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}>
  {/* step content */}
</div>
```

### 12. Progress bar glow + spring selections
```css
/* Progress bar fill */
.progress-fill {
  transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 0 10px rgba(201, 168, 76, 0.5);
}
/* MultiTag spring */
.multi-tag-selected {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(1.04);
}
```

### 13. Admin FormCard — lift on hover
```jsx
const [hovered, setHovered] = useState(false)
<div
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={{
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${hovered ? 'rgba(201,168,76,0.4)' : 'rgba(216,207,189,0.6)'}`,
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hovered
      ? '0 20px 40px rgba(42,26,34,0.15), 0 0 0 1px rgba(201,168,76,0.15)'
      : '0 2px 8px rgba(42,26,34,0.06)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    borderRadius: 16, padding: '1.5rem', cursor: 'pointer',
  }}
>
```

### 14. Thank you screen — entrance animation
```css
@keyframes thankYouReveal {
  0%  { opacity: 0; transform: scale(0.92) translateY(20px); }
  60% { opacity: 1; transform: scale(1.02) translateY(-4px); }
  100%{ opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes starSpin {
  0%  { transform: rotate(0deg) scale(0); opacity: 0; }
  60% { transform: rotate(200deg) scale(1.2); opacity: 1; }
  100%{ transform: rotate(180deg) scale(1); opacity: 1; }
}
```

### 15. Reduce motion accessibility
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .orb { display: none; }
}
```

---

## Acceptance Criteria

**PWA:**
- [ ] `manifest.json` created in `frontend/public/`
- [ ] All meta tags added to `index.html`
- [ ] Icons generated: `icon-192.png` + `icon-512.png`
- [ ] On Android Chrome — URL bar hidden (minimal-ui)
- [ ] On iOS Safari — works as standalone after "Add to Home Screen"
- [ ] Thank you screen: URL bar does NOT reappear on scroll
- [ ] `viewport-fit=cover` + safe area insets applied
- [ ] No white bands on notched iPhones

**Visual:**
- [ ] Start screen has parallax + animated orbs
- [ ] Survey card uses glassmorphism (frosted glass)
- [ ] Style cards have 3D tilt on hover + photo zoom
- [ ] Step transitions use fade+slide
- [ ] Progress bar has glow effect
- [ ] MultiTags have spring bounce on select
- [ ] FormCard lifts on hover
- [ ] Thank you screen has entrance animation
- [ ] `prefers-reduced-motion` respected

- [ ] `npm run build` passes 0 errors
- [ ] Git commit + push: `feat(BATCH-10): visual polish — parallax, glassmorphism, animations + PWA fullscreen`
