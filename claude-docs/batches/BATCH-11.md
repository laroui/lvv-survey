# BATCH-11 — Integrate Gemini Style Images into Survey Cards

## Commit
`feat(BATCH-11): style cards — integrate Gemini images f1-f4 + m1-m4`

## Goal
Wire the 8 generated images into the style selection cards (Q12a / Q12b).
Images are already placed in `frontend/public/images/styles/`.
This batch updates `data.js` and `StyleCard` component to display them.

## Depends On
- BATCH-05 complete (StyleCard component exists with photoUrl support)
- Images manually placed in `frontend/public/images/styles/` before running this batch

## Image Files Expected
```
frontend/public/images/styles/
├── f1.jpg   ← Casual Luxury (female)
├── f2.jpg   ← Parisian Elegance (female)
├── f3.jpg   ← Bold & Colorful (female)
├── f4.jpg   ← Boho Romantic (female)
├── m1.jpg   ← Casual (male)
├── m2.jpg   ← Classic (male)
├── m3.jpg   ← Bold (male)
└── m4.jpg   ← Street (male)
```

---

## Task 1 — Update frontend/src/data.js

Add `photoUrl` to every style object in `STYLES_FEMALE` and `STYLES_MALE`.

```js
export const STYLES_FEMALE = [
  {
    id: 'casual-luxury',
    nameEN: 'Casual Luxury',
    nameFR: 'Casual Luxe',
    nameES: 'Lujo Casual',
    nameAR: 'الفخامة العفوية',
    brands: ['Loro Piana', 'Brunello Cucinelli', 'Zegna', 'Burberry', 'Max Mara', 'JM Weston'],
    photoUrl: '/images/styles/f1.jpg',
  },
  {
    id: 'parisian-elegance',
    nameEN: 'Parisian Elegance',
    nameFR: 'Élégance Parisienne',
    nameES: 'Elegancia Parisina',
    nameAR: 'الأناقة الباريسية',
    brands: ['Saint Laurent', 'Chloé', 'Isabel Marant', 'Valentino', 'Burberry', 'Ami'],
    photoUrl: '/images/styles/f2.jpg',
  },
  {
    id: 'bold-colorful',
    nameEN: 'Bold & Colorful',
    nameFR: 'Mode & Audacieux',
    nameES: 'Atrevido y Colorido',
    nameAR: 'جريء وملوّن',
    brands: ['Gucci', 'Loewe', 'Marni', 'Balenciaga', 'Dolce & Gabbana', 'Versace'],
    photoUrl: '/images/styles/f3.jpg',
  },
  {
    id: 'boho-romantic',
    nameEN: 'Boho Romantic',
    nameFR: 'Romantique Bohème',
    nameES: 'Romántico Boho',
    nameAR: 'رومانسي بوهيمي',
    brands: ['Chloé', 'Zimmermann', 'Isabel Marant', 'Valentino', 'Gucci', 'Prada / Miu Miu'],
    photoUrl: '/images/styles/f4.jpg',
  },
]

export const STYLES_MALE = [
  {
    id: 'casual',
    nameEN: 'Casual',
    nameFR: 'Casual',
    nameES: 'Casual',
    nameAR: 'كاجوال',
    brands: ['Loro Piana', 'Brunello Cucinelli', 'Ralph Lauren', "Tod's", 'Barbour'],
    photoUrl: '/images/styles/m1.jpg',
  },
  {
    id: 'classic',
    nameEN: 'Classic',
    nameFR: 'Classique',
    nameES: 'Clásico',
    nameAR: 'كلاسيكي',
    brands: ['Zegna', 'Brioni', 'Kiton', 'Canali', 'JM Weston'],
    photoUrl: '/images/styles/m2.jpg',
  },
  {
    id: 'bold',
    nameEN: 'Bold',
    nameFR: 'Audacieux',
    nameES: 'Atrevido',
    nameAR: 'جريء',
    brands: ['Gucci', 'Balenciaga', 'Versace', 'Dsquared2', 'Dolce & Gabbana'],
    photoUrl: '/images/styles/m3.jpg',
  },
  {
    id: 'street',
    nameEN: 'Street',
    nameFR: 'Street',
    nameES: 'Urbano',
    nameAR: 'ستريت',
    brands: ['Off-White', 'Palm Angels', 'Stone Island', 'CP Company', 'Ami'],
    photoUrl: '/images/styles/m4.jpg',
  },
]
```

---

## Task 2 — Update StyleCard in frontend/src/components.jsx

Full replacement of the `StyleCard` component.
Handles: photo background, dark gradient overlay, Aimé italic name,
brand list, gold border on select, checkmark, graceful fallback.

```jsx
export function StyleCard({ id, name, brands, selected, onClick, photoUrl }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    // Disable 3D tilt on touch devices
    if (window.matchMedia('(hover: none)').matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    e.currentTarget.style.transform =
      `perspective(600px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.02)`
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform =
      'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)'
    setHovered(false)
  }

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: `2.5px solid ${selected ? 'var(--gold)' : 'rgba(216,207,189,0.4)'}`,
        cursor: 'pointer',
        transition: 'transform 0.15s ease, border-color 0.2s',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        boxShadow: selected
          ? '0 0 0 1px var(--gold), 0 8px 24px rgba(42,26,34,0.2)'
          : '0 2px 8px rgba(42,26,34,0.1)',
      }}
    >
      {/* Background — photo or fallback gradient */}
      {photoUrl && !imgFailed ? (
        <img
          src={photoUrl}
          alt={name}
          onError={() => setImgFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      ) : (
        // Fallback gradient when no photo or img fails
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, var(--plum-dark) 0%, var(--plum-mid) 100%)',
        }} />
      )}

      {/* Dark gradient overlay — always present for text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(26,10,18,0.88) 0%, rgba(26,10,18,0.3) 55%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Selected gold tint overlay */}
      {selected && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(201,168,76,0.12)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Checkmark badge */}
      {selected && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 11, fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 2,
        }}>✓</div>
      )}

      {/* Text overlay — bottom left */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 14px 16px',
        zIndex: 1,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 19,
          fontWeight: 400,
          color: '#fff',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          marginBottom: 5,
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 300,
          lineHeight: 1.4,
          letterSpacing: '0.02em',
        }}>
          {brands.slice(0, 3).join(' · ')}
        </div>
      </div>
    </div>
  )
}
```

---

## Task 3 — Update SurveyForm.jsx step 7 (style selection grid)

Pass `photoUrl` from style data into the `StyleCard` component.

Find step 7 in `SurveyForm.jsx` — the style grid render — and update:

```jsx
// BEFORE
<StyleCard
  key={s.id}
  name={lang === 'fr' ? s.nameFR : s.nameEN}
  brands={s.brands}
  selected={form.styles.includes(s.id)}
  onClick={() => toggleArrMax('styles', s.id, 2)}
/>

// AFTER — add photoUrl + dynamic name by lang
<StyleCard
  key={s.id}
  id={s.id}
  name={
    lang === 'fr' ? s.nameFR :
    lang === 'es' ? s.nameES :
    lang === 'ar' ? s.nameAR :
    s.nameEN
  }
  brands={s.brands}
  photoUrl={s.photoUrl}
  selected={form.styles.includes(s.id)}
  onClick={() => toggleArrMax('styles', s.id, 2)}
/>
```

The grid wrapper stays the same (2 columns, gap 12):
```jsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
  {stylePool.map(s => (
    <StyleCard ... />
  ))}
</div>
```

---

## Task 4 — Verify config override path (FormContentEditor)

When admin customises style archetypes in `FormContentEditor`,
the custom styles should also support a `photoUrl` field.
Check `frontend/src/components/FormContentEditor.jsx`:

- Each style archetype row should have a `photoUrl` input field
- Placeholder: `/images/styles/f1.jpg` or a full URL
- If `photoUrl` is empty in the config → falls back to the default in `data.js`

Fallback logic in `SurveyForm.jsx`:
```js
// When merging config styles with data.js defaults:
const mergedStyles = configStyles.map(cs => ({
  ...cs,
  photoUrl: cs.photoUrl || DATA_STYLES.find(d => d.id === cs.id)?.photoUrl || null,
}))
```

---

## Task 5 — Image optimisation note

Add to `vite.config.js` to avoid loading full-size images on mobile:

```js
// No code change needed — just verify images are:
// - JPG format (not PNG) for photos
// - Compressed to ~150-250KB each
// - 1200×1200px max (Vite will serve them as-is from /public)
```

If images are large (>500KB each), run this once:
```bash
# Install sharp-cli globally
npm install -g sharp-cli

# Resize + compress all style images
cd frontend/public/images/styles
for f in *.jpg; do
  sharp -i "$f" -o "$f" resize 1200 1200 --fit cover --quality 82
done
```

---

## Acceptance Criteria

- [ ] `data.js` — `STYLES_FEMALE` and `STYLES_MALE` each have `photoUrl` pointing to `/images/styles/f1-f4.jpg` and `/images/styles/m1-m4.jpg`
- [ ] `StyleCard` component shows photo background when `photoUrl` is provided
- [ ] Dark gradient overlay on all cards — text always legible
- [ ] Aimé italic style name at bottom left of card
- [ ] Brand list (first 3) shown below name in muted white
- [ ] Gold border + checkmark when selected
- [ ] 3D tilt on hover (desktop only — disabled on touch)
- [ ] Photo zooms slightly on hover
- [ ] Graceful fallback to plum gradient when image missing or fails to load
- [ ] RTL layout: text still bottom-left (not flipped) — style cards are visual, not text-heavy
- [ ] Mobile: 2-column grid, square aspect ratio maintained
- [ ] `npm run build` passes with 0 errors
- [ ] Git commit + push: `feat(BATCH-11): style cards — integrate Gemini images f1-f4 + m1-m4`

---

## Quick Sanity Check Before Committing

Run in browser dev tools console on the survey style step:
```js
// Should see 4 img elements with correct src
document.querySelectorAll('[alt]').forEach(img => console.log(img.src, img.naturalWidth))
// naturalWidth > 0 = image loaded OK
// naturalWidth = 0 = image failed (check path)
```
