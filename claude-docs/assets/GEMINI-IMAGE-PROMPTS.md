# Gemini Image Generation Prompts — LVV Style Cards
## 8 images total: 4 Female styles × 4 Male styles
## Target: 1:1 square format, 1200×1200px minimum
## Style: luxury fashion editorial photography

---

## FEMALE STYLES (Q12a)

---

### F1 — Casual Luxury (Woman)

```
A woman in her early 40s standing in soft natural light near a large window,
wearing impeccably tailored wide-leg ivory trousers and a cashmere crewneck
in warm camel, carrying a structured tote in smooth cognac leather.
Relaxed but refined posture. Minimal gold jewelry — a thin chain, small stud
earrings. Hair loosely swept back.
Background: minimal Parisian apartment, herringbone parquet floor, slightly blurred.
Mood: understated, effortless, old-money quiet luxury.
Color palette: ivory, camel, cognac, warm white.
Style: editorial fashion photography, medium format film aesthetic,
soft natural window light, no harsh flash, 1:1 square crop.
```

---

### F2 — Parisian Elegance (Woman)

```
A Parisian woman in her late 30s on a quiet Haussmann boulevard at golden hour.
She wears a perfectly fitted midi blazer in deep midnight navy over a white silk
blouse, tapered cigarette trousers, pointed-toe kitten heels in black suede.
Structured leather shoulder bag. Gaze: direct, confident, slightly amused.
Background: blurred limestone Haussmann facades, warm amber evening light.
Mood: chic, confident, quintessentially French, effortlessly stylish.
Color palette: navy, white, black, warm gold light.
Style: street fashion editorial, 35mm film aesthetic, slight grain, warm tones,
1:1 square crop.
```

---

### F3 — Bold & Colorful (Woman)

```
A striking woman in her late 20s in a bold editorial pose wearing an oversized
structured blazer in electric cobalt blue over a printed silk blouse with
abstract pattern in tangerine and fuchsia. Wide-leg trousers in deep burgundy.
Sculptural gold earrings. Chunky platform shoes. Fierce, playful energy.
Background: clean off-white studio backdrop, single dramatic shadow.
Mood: fashion-forward, fearless, maximalist, joy-inducing.
Color palette: cobalt, fuchsia, tangerine, burgundy, gold.
Style: high-fashion studio editorial, strong directional lighting,
saturated Vogue Italia aesthetic, 1:1 square crop.
```

---

### F4 — Boho Romantic (Woman)

```
A woman with flowing dark hair in a sun-drenched Mediterranean garden,
wearing a long flowy cream dress with delicate floral embroidery at the hem,
slightly sheer in warm light. Layered fine gold necklaces, stacked rings.
Woven flat sandals. Holding a wide-brimmed natural straw hat loosely,
gazing dreamily into the distance.
Background: lush greenery, terracotta walls, dappled sunlight through olive trees.
Mood: romantic, free-spirited, effortlessly sensual.
Color palette: cream, ivory, terracotta, sage green, warm gold.
Style: editorial lifestyle, warm golden hour light, soft film grain,
slightly hazy, 1:1 square crop.
```

---

## MALE STYLES (Q12b)

---

### M1 — Casual (Man)

```
A man in his early 40s in a relaxed confident stance, wearing a heavyweight
cream linen shirt tucked loosely into tailored stone-colored chinos,
clean white leather sneakers. Simple stainless steel watch. Naturally styled
hair, slight stubble. Leaning against a whitewashed wall, half-smiling.
Background: quiet sun-lit Mediterranean terrace or courtyard, warm afternoon light.
Mood: elevated casual, quietly confident, weekend luxury without effort.
Color palette: cream, stone, white, warm skin tones.
Style: lifestyle editorial, warm golden afternoon light, 50mm lens,
natural unposed feel, 1:1 square crop.
```

---

### M2 — Classic (Man)

```
A distinguished man in his late 40s wearing an immaculate double-breasted
charcoal grey suit with chalk stripe, white poplin dress shirt, silk tie in
deep burgundy. Pocket square neatly folded. Black Oxford shoes, mirror shine.
Vintage slim round dress watch, crème dial. Standing in the lobby of a grand
Parisian palace hotel — marble columns, warm chandelier light.
Posture: upright, authoritative, elegant.
Mood: timeless sophistication, old European elegance, restrained power.
Color palette: charcoal, white, burgundy, gold, warm marble.
Style: classic portrait, soft directional studio light, slightly desaturated,
timeless aesthetic, 1:1 square crop.
```

---

### M3 — Bold (Man)

```
A stylish man in his late 20s in a stark industrial space wearing an oversized
graphic shirt in vivid red under a structured black leather jacket with silver
hardware, wide-fit black trousers, chunky white-soled boots. Large sculptural
silver rings. Wide stance, arms slightly open, intense cool expression.
Background: raw concrete wall, dramatic single overhead spotlight.
Mood: fearless, streetwear-meets-luxury, unapologetic maximalism.
Color palette: red, black, silver, white.
Style: high-contrast fashion editorial, strong dramatic lighting,
deep shadows, urban industrial, 1:1 square crop.
```

---

### M4 — Street (Man)

```
A young man in his mid-20s on a Paris street corner at blue hour wearing a
premium heavyweight hoodie in washed graphite grey under an oversized matte
black technical jacket, wide-cut olive cargo trousers, minimalist white and
grey trainers. Black nylon crossbody bag. AirPods visible. Hands in pockets,
relaxed posture, looking slightly off-camera with quiet confidence.
Background: blurred Paris street at dusk, warm shop lights glowing behind.
Mood: understated streetwear, luxury sportswear, effortless urban cool.
Color palette: graphite, black, olive, white, blue hour.
Style: candid street fashion editorial, blue hour ambient light,
35mm digital, authentic unposed urban mood, 1:1 square crop.
```

---

## USAGE NOTES

**Generation settings:**
- Format: **1:1 square**, minimum **1200×1200px**
- Mode: **photorealistic** — NOT illustration, NOT painting
- Models should look like real editorial fashion photography
- No visible brand logos anywhere in frame
- No AI-obvious artifacts (perfect skin, etc.) — keep natural editorial quality

**Save filenames exactly as:**
```
style-f1-casual-luxury.jpg
style-f2-parisian-elegance.jpg
style-f3-bold-colorful.jpg
style-f4-boho-romantic.jpg
style-m1-casual.jpg
style-m2-classic.jpg
style-m3-bold.jpg
style-m4-street.jpg
```

**Drop all 8 images into:** `frontend/public/images/styles/`

**Then update `frontend/src/data.js`** — each style object gets a `photoUrl`:
```js
// Female example
{ id: 'casual-luxury', photoUrl: '/images/styles/style-f1-casual-luxury.jpg', ... }
{ id: 'parisian-elegance', photoUrl: '/images/styles/style-f2-parisian-elegance.jpg', ... }
{ id: 'bold-colorful', photoUrl: '/images/styles/style-f3-bold-colorful.jpg', ... }
{ id: 'boho-romantic', photoUrl: '/images/styles/style-f4-boho-romantic.jpg', ... }

// Male example
{ id: 'casual',  photoUrl: '/images/styles/style-m1-casual.jpg', ... }
{ id: 'classic', photoUrl: '/images/styles/style-m2-classic.jpg', ... }
{ id: 'bold',    photoUrl: '/images/styles/style-m3-bold.jpg', ... }
{ id: 'street',  photoUrl: '/images/styles/style-m4-street.jpg', ... }
```

**BATCH-05 StyleCard component** reads `photoUrl` — images will appear automatically
once files are in place. No code changes needed.
