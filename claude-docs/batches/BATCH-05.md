# BATCH-05 — Style Photo Cards (Louise's Visual Design)

## Commit
`feat(BATCH-05): style photo cards — visual image grid for Q12a/Q12b like Louise's mockup`

## Goal
Replace the current text-only style cards with Louise's visual design:
photo cards with the style name overlaid on a fashion image.
Applies to Q12a (female: Casual Luxury, Parisian Elegance, Bold & Colorful, Boho Romantic)
and Q12b (male: Casual, Classic, Bold, Street).

## Reference
Louise's mockup shows a 2×2 grid of square photo cards.
Each card has:
- A fashion/lifestyle photo as background
- Style name overlaid in Aimé italic (bottom-left)
- Gold border when selected
- Subtle dark gradient overlay at bottom for text legibility

## Assets Strategy
Two options — implement Option A, keep Option B as fallback:

**Option A — Unsplash API (free, no key needed for basic)**
Use curated Unsplash photo IDs per style archetype.
Load via `https://images.unsplash.com/photo-{ID}?w=400&q=80`

Curated photo IDs per style:
```js
export const STYLE_PHOTOS = {
  // Female
  'casual-luxury':      'photo-1441984904996-e0b6ba687e04', // minimal chic outfit
  'parisian-elegance':  'photo-1509631179647-0177331693ae', // parisian street style
  'bold-colorful':      'photo-1558618666-fcd25c85cd64', // colorful editorial
  'boho-romantic':      'photo-1515886657613-9f3515b0c78f', // flowy romantic dress
  // Male
  'casual':             'photo-1552374196-1ab2a1c593e8', // smart casual menswear
  'classic':            'photo-1507679799987-c73779587ccf', // classic suit
  'bold':               'photo-1509631179647-0177331693ae', // bold menswear editorial
  'street':             'photo-1556821840-3a63f15732ce', // streetwear look
}
```

**Option B — Placeholder gradient cards**
If photos fail to load → fallback to gradient cards using plum/gold palette.

## Tasks

### 1. Update frontend/src/components.jsx — StyleCard component
```jsx
export function StyleCard({ id, name, brands, selected, onClick, photoUrl }) {
  return (
    <div onClick={onClick} style={{
      position: 'relative',
      aspectRatio: '1 / 1',         // square card
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: `2.5px solid ${selected ? 'var(--gold)' : 'transparent'}`,
      cursor: 'pointer',
      transition: 'all 0.25s',
    }}>
      {/* Background photo */}
      <img
        src={photoUrl}
        alt={name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={e => { e.target.style.display = 'none' }}
      />
      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(42,26,34,0.85) 0%, rgba(42,26,34,0.1) 60%, transparent 100%)'
      }} />
      {/* Selected overlay */}
      {selected && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(201,168,76,0.18)',
          border: '2.5px solid var(--gold)',
          borderRadius: 'var(--radius-md)',
        }} />
      )}
      {/* Checkmark */}
      {selected && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 22, height: 22, borderRadius: '50%',
          background: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 11, fontWeight: 700,
        }}>✓</div>
      )}
      {/* Style name — Aimé italic */}
      <div style={{
        position: 'absolute', bottom: 14, left: 14, right: 14,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 18,
          fontWeight: 400,
          color: '#fff',
          lineHeight: 1.2,
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 300,
          marginTop: 3,
          lineHeight: 1.4,
        }}>
          {brands.slice(0, 3).join(' · ')}
        </div>
      </div>
    </div>
  )
}
```

### 2. Update frontend/src/data.js — add photoUrl to each style
```js
export const STYLES_FEMALE = [
  {
    id: 'casual-luxury',
    nameEN: 'Casual Luxury',
    nameFR: 'Casual Luxe',
    brands: [...],
    photoUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
  },
  // ... same for others
]
```

### 3. Update SurveyForm.jsx step 7 (style selection)
- Pass `photoUrl` to `<StyleCard>`
- Keep 2×2 grid layout
- On mobile → 2 columns still (cards are square, compact well)

### 4. Fallback gradient (when no photo / no network)
In StyleCard, if img fails to load (onError), show:
```jsx
<div style={{
  position: 'absolute', inset: 0,
  background: 'linear-gradient(135deg, var(--plum-dark), var(--plum-mid))'
}} />
```

### 5. Admin: photo URL per style in FormBuilder
In `FormBuilderPage.jsx` style editor, add a URL input per archetype
so the team can override photos per form/partner if needed.

## Acceptance Criteria
- [ ] Q12a shows 4 photo cards in 2×2 grid
- [ ] Q12b shows 4 photo cards in 2×2 grid
- [ ] Style name in Aimé italic overlaid on photo
- [ ] Selected card has gold border + checkmark
- [ ] Graceful fallback if photo fails to load
- [ ] Works on mobile (2 columns, square aspect)
- [ ] Git commit: `feat(BATCH-05): style photo cards — visual image grid for Q12a/Q12b`
