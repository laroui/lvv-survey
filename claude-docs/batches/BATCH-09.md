# BATCH-09 — Multilingual Survey: Spanish + Arabic

## Commit
`feat(BATCH-09): multilingual — Spanish + Arabic in guest survey, auto-detected from nationality`

## Goal
Add Spanish (ES) and Arabic (AR) to the guest-facing survey.
Languages are **not** shown to all guests — they appear conditionally:
- If guest selects a Spanish-speaking nationality → ES option appears in the language toggle
- If guest selects an Arabic-speaking nationality → AR option appears
English and French are always available.
Arabic requires RTL layout support.

## Depends On
BATCH-07 complete. CONTEXT.md reflects current live state.

---

## Data Layer

### 1. frontend/src/data.js — add nationality → language mapping

```js
// Add to existing SIZING_MAP section
export const NATIONALITY_LANGUAGES = {
  // Always available
  default: ['en', 'fr'],

  // Spanish-speaking nationalities
  'Spain': ['en', 'fr', 'es'],
  'Mexico': ['en', 'fr', 'es'],
  'Argentina': ['en', 'fr', 'es'],
  'Colombia': ['en', 'fr', 'es'],
  'Chile': ['en', 'fr', 'es'],
  'Peru': ['en', 'fr', 'es'],
  'Venezuela': ['en', 'fr', 'es'],
  'Ecuador': ['en', 'fr', 'es'],
  'Guatemala': ['en', 'fr', 'es'],
  'Cuba': ['en', 'fr', 'es'],
  'Bolivia': ['en', 'fr', 'es'],
  'Dominican Republic': ['en', 'fr', 'es'],
  'Honduras': ['en', 'fr', 'es'],
  'Paraguay': ['en', 'fr', 'es'],
  'El Salvador': ['en', 'fr', 'es'],
  'Nicaragua': ['en', 'fr', 'es'],
  'Costa Rica': ['en', 'fr', 'es'],
  'Panama': ['en', 'fr', 'es'],
  'Uruguay': ['en', 'fr', 'es'],

  // Arabic-speaking nationalities
  'Saudi Arabia': ['en', 'fr', 'ar'],
  'UAE': ['en', 'fr', 'ar'],
  'Qatar': ['en', 'fr', 'ar'],
  'Kuwait': ['en', 'fr', 'ar'],
  'Bahrain': ['en', 'fr', 'ar'],
  'Oman': ['en', 'fr', 'ar'],
  'Egypt': ['en', 'fr', 'ar'],
  'Jordan': ['en', 'fr', 'ar'],
  'Lebanon': ['en', 'fr', 'ar'],
  'Morocco': ['en', 'fr', 'ar'],
  'Algeria': ['en', 'fr', 'ar'],
  'Tunisia': ['en', 'fr', 'ar'],
  'Libya': ['en', 'fr', 'ar'],
  'Iraq': ['en', 'fr', 'ar'],
  'Syria': ['en', 'fr', 'ar'],
  'Yemen': ['en', 'fr', 'ar'],
  'Sudan': ['en', 'fr', 'ar'],
}
```

### 2. frontend/src/translations.js (NEW FILE)
Create a full translations object for all 4 languages.
Structure: `{ [key]: { en, fr, es, ar } }`

```js
export const T = {
  // Language step
  chooseLanguage: {
    en: 'Please choose your preferred language',
    fr: 'Veuillez choisir votre langue',
    es: 'Por favor elige tu idioma',
    ar: 'يرجى اختيار لغتك المفضلة',
  },
  // Step labels
  stepOf: {
    en: (n, t) => `Step ${n} of ${t}`,
    fr: (n, t) => `Étape ${n} sur ${t}`,
    es: (n, t) => `Paso ${n} de ${t}`,
    ar: (n, t) => `الخطوة ${n} من ${t}`,
  },
  // Identity
  howCallYou: {
    en: 'How should we call you?',
    fr: 'Comment vous appeler ?',
    es: '¿Cómo debemos llamarle?',
    ar: 'كيف يجب أن نناديك؟',
  },
  firstName: { en: 'First Name', fr: 'Prénom', es: 'Nombre', ar: 'الاسم الأول' },
  surname: { en: 'Surname', fr: 'Nom', es: 'Apellido', ar: 'اسم العائلة' },
  email: { en: 'Email', fr: 'Email', es: 'Correo electrónico', ar: 'البريد الإلكتروني' },
  initialsAuto: {
    en: 'Initials (auto-generated):',
    fr: 'Initiales (générées automatiquement) :',
    es: 'Iniciales (generadas automáticamente):',
    ar: 'الأحرف الأولى (تُنشأ تلقائياً):',
  },
  // Gender
  howAddress: {
    en: 'How should we address you?',
    fr: 'Comment vous adresser ?',
    es: '¿Cómo debemos dirigirnos a usted?',
    ar: 'كيف يجب أن نخاطبك؟',
  },
  whereFrom: {
    en: 'Where are you from?',
    fr: "D'où venez-vous ?",
    es: '¿De dónde eres?',
    ar: 'من أين أنت؟',
  },
  nationality: { en: 'Nationality', fr: 'Nationalité', es: 'Nacionalidad', ar: 'الجنسية' },
  selectCountry: { en: 'Select country', fr: 'Sélectionner', es: 'Seleccionar país', ar: 'اختر الدولة' },
  // Phone
  contactNumber: {
    en: 'Your contact number',
    fr: 'Votre numéro de contact',
    es: 'Tu número de contacto',
    ar: 'رقم التواصل الخاص بك',
  },
  phoneHint: {
    en: 'Optional — for membership & PS coordination',
    fr: 'Optionnel — adhésion et coordination PS',
    es: 'Opcional — para membresía y coordinación PS',
    ar: 'اختياري — للعضوية وتنسيق المتسوق الشخصي',
  },
  // Sizing
  yourSizing: { en: 'What is your sizing?', fr: 'Quelle est votre taille ?', es: '¿Cuál es su talla?', ar: 'ما هو مقاسك؟' },
  sizeDetected: {
    en: 'System auto-detected from nationality:',
    fr: 'Système détecté selon la nationalité :',
    es: 'Sistema detectado según la nacionalidad:',
    ar: 'النظام المكتشف تلقائياً حسب الجنسية:',
  },
  typeExactSize: {
    en: 'Or type your exact size',
    fr: 'Ou entrez votre taille exacte',
    es: 'O escribe tu talla exacta',
    ar: 'أو اكتب مقاسك الدقيق',
  },
  // Purpose
  whatBringsYou: {
    en: 'What brings you to this experience?',
    fr: "Qu'est-ce qui vous amène ?",
    es: '¿Qué le trae a esta experiencia?',
    ar: 'ما الذي يجلبك إلى هذه التجربة؟',
  },
  // PS Mode
  psExperience: {
    en: 'How would you like your Personal Shopper experience?',
    fr: 'Comment souhaitez-vous être accompagné(e) ?',
    es: '¿Cómo le gustaría su experiencia con el Personal Shopper?',
    ar: 'كيف تريد تجربة المتسوق الشخصي الخاصة بك؟',
  },
  // Style
  bestDescribesStyle: {
    en: 'What best describes your style? (Choose up to 2)',
    fr: 'Quel style vous ressemble ? (2 max)',
    es: '¿Qué describe mejor tu estilo? (Elige hasta 2)',
    ar: 'ما الذي يصف أسلوبك بشكل أفضل؟ (اختر حتى 2)',
  },
  selectedCount: {
    en: (n) => `${n}/2 selected`,
    fr: (n) => `${n}/2 sélectionnés`,
    es: (n) => `${n}/2 seleccionados`,
    ar: (n) => `${n}/2 محدد`,
  },
  // Categories
  categoriesPrepare: {
    en: "Are there any categories you'd love us to prepare?",
    fr: 'Y a-t-il des catégories que vous souhaitez ?',
    es: '¿Hay categorías que le gustaría que preparáramos?',
    ar: 'هل هناك فئات تريد منا إعدادها؟',
  },
  chooseAsManyAsYouLike: {
    en: 'Choose as many as you like',
    fr: 'Choisissez autant que vous souhaitez',
    es: 'Elige todas las que quieras',
    ar: 'اختر بقدر ما تريد',
  },
  // Brands
  favoriteBrands: {
    en: 'Any favorite brands you gravitate toward? (up to 2)',
    fr: 'Des marques préférées ? (2 max)',
    es: '¿Alguna marca favorita? (hasta 2)',
    ar: 'هل هناك ماركات مفضلة لديك؟ (حتى 2)',
  },
  basedOnStyle: {
    en: 'Based on your style selection',
    fr: 'Basé sur votre sélection de style',
    es: 'Según tu selección de estilo',
    ar: 'بناءً على اختيار أسلوبك',
  },
  noneOfAbove: {
    en: 'None of the above',
    fr: 'Aucune de ces marques',
    es: 'Ninguna de las anteriores',
    ar: 'لا شيء مما سبق',
  },
  // Lifestyle
  lifestyleCategories: {
    en: 'Which categories fit your lifestyle?',
    fr: 'Quelles catégories correspondent à votre style de vie ?',
    es: '¿Qué categorías encajan con tu estilo de vida?',
    ar: 'ما الفئات التي تناسب أسلوب حياتك؟',
  },
  // Travel
  upcomingVacation: {
    en: 'Any upcoming vacation?',
    fr: 'Un voyage prévu ?',
    es: '¿Algún próximo viaje de vacaciones?',
    ar: 'هل هناك إجازة قادمة؟',
  },
  describeDestination: {
    en: 'Or describe your destination',
    fr: 'Ou décrivez votre destination',
    es: 'O describe tu destino',
    ar: 'أو صف وجهتك',
  },
  // Events
  upcomingEvents: {
    en: 'Any upcoming events?',
    fr: 'Un événement à venir ?',
    es: '¿Algún evento próximo?',
    ar: 'هل هناك فعاليات قادمة؟',
  },
  describeOccasion: {
    en: 'Or describe the occasion',
    fr: "Ou décrivez l'occasion",
    es: 'O describe la ocasión',
    ar: 'أو صف المناسبة',
  },
  // Review
  reviewProfile: {
    en: 'Review your profile',
    fr: 'Vérifiez votre profil',
    es: 'Revisa tu perfil',
    ar: 'راجع ملفك الشخصي',
  },
  // Consent
  consentText: {
    en: 'I agree to the processing of my personal data in accordance with the Privacy Policy and Terms & Conditions.',
    fr: "J'accepte le traitement de mes données personnelles conformément à la Politique de confidentialité et aux CGU.",
    es: 'Acepto el tratamiento de mis datos personales de acuerdo con la Política de Privacidad y los Términos y Condiciones.',
    ar: 'أوافق على معالجة بياناتي الشخصية وفقاً لسياسة الخصوصية والشروط والأحكام.',
  },
  // Navigation
  back: { en: '← Back', fr: '← Retour', es: '← Atrás', ar: 'رجوع →' },
  continue: { en: 'Continue →', fr: 'Continuer →', es: 'Continuar →', ar: '← متابعة' },
  submit: { en: 'Submit', fr: 'Envoyer', es: 'Enviar', ar: 'إرسال' },
  // Thank you
  thankYou: {
    en: (name) => `Thank you, ${name}.`,
    fr: (name) => `Merci, ${name}.`,
    es: (name) => `Gracias, ${name}.`,
    ar: (name) => `شكراً لك، ${name}.`,
  },
  thankYouSub: {
    en: 'Your Personal Shopper will be in touch before your arrival. We look forward to welcoming you to La Vallée Village.',
    fr: 'Votre Personal Shopper vous contactera avant votre arrivée. Nous nous réjouissons de vous accueillir à La Vallée Village.',
    es: 'Su Personal Shopper se pondrá en contacto antes de su llegada. Estamos deseando darle la bienvenida a La Vallée Village.',
    ar: 'سيتواصل معك المتسوق الشخصي قبل وصولك. نتطلع إلى الترحيب بك في لا فالي فيلاج.',
  },
}

// Helper: get translation
export function tr(key, lang, ...args) {
  const entry = T[key]
  if (!entry) return key
  const val = entry[lang] || entry['en']
  return typeof val === 'function' ? val(...args) : val
}
```

### 3. frontend/src/data.js — Spanish + Arabic translations for all options

Add `labelES` and `labelAR` to every option array:

**PURPOSES** — add:
```js
{ id: 'new-styles',
  labelEN: 'Discover new styles curated just for me',
  labelFR: 'Découvrir de nouveaux styles rien que pour moi',
  labelES: 'Descubrir nuevos estilos seleccionados solo para mí',
  labelAR: 'اكتشاف أساليب جديدة مختارة خصيصاً لي' },
{ id: 'shopping-escape',
  labelEN: 'A relaxing and luxury shopping escape',
  labelFR: 'Une escapade shopping luxe et relaxante',
  labelES: 'Una escapada de compras lujosa y relajante',
  labelAR: 'رحلة تسوق فاخرة ومريحة' },
{ id: 'transformational',
  labelEN: 'A transformational styling moment',
  labelFR: 'Un moment de style transformateur',
  labelES: 'Un momento de estilo transformador',
  labelAR: 'لحظة تحول في الأناقة' },
{ id: 'celebration',
  labelEN: 'A special celebration (birthday, anniversary, milestone)',
  labelFR: 'Une célébration spéciale (anniversaire, étape importante)',
  labelES: 'Una celebración especial (cumpleaños, aniversario, hito)',
  labelAR: 'احتفال خاص (عيد ميلاد، ذكرى سنوية، مناسبة مميزة)' },
```

**PS_MODES** — add:
```js
{ id: 'full',
  labelES: 'Orientación completa de principio a fin',
  labelAR: 'إرشاد كامل من البداية إلى النهاية' },
{ id: 'mix',
  labelES: 'Una combinación de orientación + navegación independiente',
  labelAR: 'مزيج من الإرشاد والتصفح المستقل' },
{ id: 'independent',
  labelES: 'Mayormente independiente',
  labelAR: 'مستقل في معظمه' },
```

**CATEGORIES** — add:
```js
{ id: 'clothing',   labelES: 'Ropa',           labelAR: 'ملابس' },
{ id: 'accessories',labelES: 'Accesorios',     labelAR: 'إكسسوارات' },
{ id: 'leather',    labelES: 'Artículos de cuero', labelAR: 'منتجات جلدية' },
{ id: 'shoes',      labelES: 'Zapatos',        labelAR: 'أحذية' },
{ id: 'watches',    labelES: 'Relojes',        labelAR: 'ساعات' },
{ id: 'jewelry',    labelES: 'Joyería',        labelAR: 'مجوهرات' },
```

**LIFESTYLE** — add:
```js
{ id: 'evening',  labelES: 'Ropa de noche',          labelAR: 'ملابس سهرة' },
{ id: 'workwear', labelES: 'Ropa de trabajo',         labelAR: 'ملابس عمل' },
{ id: 'lounge',   labelES: 'Look lounge / aeropuerto', labelAR: 'إطلالة مريحة / مطار' },
{ id: 'sport',    labelES: 'Ropa deportiva',           labelAR: 'ملابس رياضية' },
```

**TRAVEL_OPTIONS** — add:
```js
{ id: 'beach',         labelES: 'Playa',                  labelAR: 'شاطئ' },
{ id: 'mountain',      labelES: 'Montaña',                labelAR: 'جبال' },
{ id: 'getaway',       labelES: 'Escapada corta',         labelAR: 'رحلة قصيرة' },
{ id: 'international', labelES: 'Destino internacional',  labelAR: 'وجهة دولية' },
```

**EVENT_OPTIONS** — add:
```js
{ id: 'gala',        labelES: 'Gala / Etiqueta',        labelAR: 'حفل رسمي' },
{ id: 'wedding',     labelES: 'Boda',                   labelAR: 'حفل زفاف' },
{ id: 'birthday',    labelES: 'Cumpleaños',             labelAR: 'عيد ميلاد' },
{ id: 'anniversary', labelES: 'Aniversario',            labelAR: 'ذكرى سنوية' },
{ id: 'corporate',   labelES: 'Evento corporativo',     labelAR: 'فعالية شركات' },
```

**STYLES_FEMALE + STYLES_MALE** — add `nameES` and `nameAR`:
```js
// Female
{ id: 'casual-luxury',
  nameES: 'Lujo Casual', nameAR: 'الفخامة العفوية' },
{ id: 'parisian-elegance',
  nameES: 'Elegancia Parisina', nameAR: 'الأناقة الباريسية' },
{ id: 'bold-colorful',
  nameES: 'Atrevido y Colorido', nameAR: 'جريء وملوّن' },
{ id: 'boho-romantic',
  nameES: 'Romántico Boho', nameAR: 'رومانسي بوهيمي' },
// Male
{ id: 'casual',  nameES: 'Casual',    nameAR: 'كاجوال' },
{ id: 'classic', nameES: 'Clásico',   nameAR: 'كلاسيكي' },
{ id: 'bold',    nameES: 'Atrevido',  nameAR: 'جريء' },
{ id: 'street',  nameES: 'Urbano',    nameAR: 'ستريت' },
```

---

## SurveyForm.jsx — language logic changes

### 4. Update language step (step 0)

**Available languages depend on nationality selected in step 2.**
Problem: step 0 (language) comes BEFORE step 2 (nationality).

**Solution:** Show EN + FR always. After step 2, if new languages are available,
show a subtle "Switch language?" prompt:

```jsx
// After nationality is selected in step 2:
const availableLangs = NATIONALITY_LANGUAGES[form.nationality] || ['en', 'fr']
if (!availableLangs.includes(lang) || availableLangs.length > 2) {
  // Show language upgrade prompt at top of step 3
  setShowLangUpgrade(availableLangs)
}
```

Language upgrade banner (step 3 top):
```jsx
{showLangUpgrade && showLangUpgrade.length > 2 && (
  <div style={{
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: 8, padding: '12px 16px',
    marginBottom: 20,
    fontSize: 13, color: 'var(--plum-dark)',
  }}>
    <div style={{ marginBottom: 8, fontWeight: 400 }}>
      {/* "Also available in:" */}
      {tr('alsoAvailable', lang)}
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      {showLangUpgrade.filter(l => !['en','fr'].includes(l)).map(l => (
        <div key={l} onClick={() => { setLang(l); setShowLangUpgrade(null) }}
          style={{
            padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
            border: '1px solid var(--gold)',
            background: 'var(--gold-light)', color: 'var(--plum-dark)',
            fontSize: 12, fontWeight: 400,
          }}>
          {l === 'es' ? 'Español' : 'العربية'}
        </div>
      ))}
    </div>
  </div>
)}
```

### 5. RTL support for Arabic

In `SurveyForm.jsx`, add a `dir` attribute based on language:
```jsx
const isRTL = lang === 'ar'

// Apply to the main wrapper div:
<div dir={isRTL ? 'rtl' : 'ltr'} style={{ textAlign: isRTL ? 'right' : 'left' }}>
```

Back/Continue buttons — swap direction for Arabic:
```jsx
// back button shows → in AR, continue shows ←
// Already handled in translations.js (back: ar = 'رجوع →', continue: ar = '← متابعة')
```

### 6. Replace all `t(lang, en, fr)` calls with `tr(key, lang)` from translations.js

Go through all 14 steps in SurveyForm.jsx and replace the inline `t()` helper
with the new `tr(key, lang)` from `translations.js`.
The old `t(lang, en, fr)` helper can stay as a fallback during migration.

---

## Backend Changes

### 7. Store detected language in responses
The `data` JSONB already stores `lang` — no schema change needed.
Verify the language is passed through from `SurveyForm` to the submit payload.

---

## Acceptance Criteria
- [ ] `translations.js` created with all 4 languages for all keys
- [ ] `NATIONALITY_LANGUAGES` map added to `data.js`
- [ ] All 4 languages shown in language toggle (step 0)
- [ ] After selecting Arabic nationality → "Also available in: العربية" banner appears
- [ ] Full survey renders in Spanish with correct translations
- [ ] Full survey renders in Arabic with RTL layout
- [ ] Back/Continue buttons flip direction in Arabic
- [ ] Style names translated in all 4 languages
- [ ] All option labels translated (purposes, PS modes, categories, lifestyle, travel, events)
- [ ] Language stored in response data
- [ ] No layout breakage on existing EN/FR flows
- [ ] `npm run build` passes with 0 errors
- [ ] Git commit + push: `feat(BATCH-09): multilingual — Spanish + Arabic in guest survey`
