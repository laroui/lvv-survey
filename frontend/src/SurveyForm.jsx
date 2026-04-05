import { useState } from 'react';
import {
  Btn, Card, Field, TextInput, OptionItem, MultiTag,
  StyleCard, BrandTag, StepLabel, StepQuestion, NavBtns,
  ProgressBar, ReviewRow, Divider,
} from './components';
import PhoneInput from './components/PhoneInput.jsx';
import NationalityInput from './components/NationalityInput.jsx';
import {
  STYLES_FEMALE, STYLES_MALE, CATEGORIES, PURPOSES,
  PS_MODES, LIFESTYLE, TRAVEL_OPTIONS, EVENT_OPTIONS,
  SIZING_MAP, SIZING_VALUES, NATIONALITY_LANGUAGES,
} from './data';

const TOTAL_STEPS = 13;

// 4-language helper: en / fr / es / ar — falls back to English
function t(lang, en, fr, es, ar) {
  if (lang === 'fr' && fr !== undefined) return fr;
  if (lang === 'es' && es !== undefined) return es;
  if (lang === 'ar' && ar !== undefined) return ar;
  return en;
}

// Get the label field key for the current language
function labelKey(lang) {
  if (lang === 'fr') return 'labelFR';
  if (lang === 'es') return 'labelES';
  if (lang === 'ar') return 'labelAR';
  return 'labelEN';
}

/* ── SHARED LAYOUT — defined outside SurveyForm so they are stable
   component references across re-renders (prevents keyboard dismiss) ── */
function Header({ hotelName }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 1.5rem 0' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 300 }}>
        La Vallée Village × {hotelName}
      </div>
    </div>
  );
}

function Wrapper({ pct, hotelName, children, rtl, stepKey }) {
  return (
    <div dir={rtl ? 'rtl' : 'ltr'} style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Header hotelName={hotelName} />
      <div style={{ width: '100%', maxWidth: 640, margin: '0 auto', padding: '1.5rem 1.5rem 4rem', boxSizing: 'border-box' }}>
        <ProgressBar pct={pct} />
        <div key={stepKey} className="step-enter">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SurveyForm({ onComplete, config = {}, partnerName, partnerLogoUrl }) {
  const hotelName       = config?.hotelName  || partnerName || 'The Peninsula Paris';
  const stylesFemale    = config?.styles?.female || STYLES_FEMALE;
  const stylesMale      = config?.styles?.male   || STYLES_MALE;
  const configCats      = config?.categories     || CATEGORIES;
  const configPurposes  = config?.purposes       || PURPOSES;
  const configPsModes   = config?.psModes        || PS_MODES;
  const configLife      = config?.lifestyle      || LIFESTYLE;
  const configTravel    = config?.travel         || TRAVEL_OPTIONS;
  const configEvents    = config?.events         || EVENT_OPTIONS;

  const [step, setStep] = useState(-1); // -1 = start screen
  const [lang, setLang] = useState('en');
  const [showLangUpgrade, setShowLangUpgrade] = useState(null);
  const [form, setForm] = useState({
    firstName: '', surname: '', email: '', phone: '',
    gender: '', nationality: '',
    sizingSystem: 'EU', sizingValue: '',
    purpose: '', psMode: '',
    styles: [], categories: [], brands: [], lifestyle: [],
    travel: [], travelCustom: '',
    events: [], eventCustom: '',
    consent: false,
  });

  const isRTL = lang === 'ar';
  const wp = { rtl: isRTL, stepKey: step }; // shared Wrapper extra props

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleArr = (key, val) => {
    setForm(prev => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };
  const toggleArrMax = (key, val, max) => {
    setForm(prev => {
      const arr = prev[key];
      if (arr.includes(val)) return { ...prev, [key]: arr.filter(x => x !== val) };
      if (arr.length >= max) return prev;
      return { ...prev, [key]: [...arr, val] };
    });
  };

  const next = () => { setStep(s => s + 1); window.scrollTo(0, 0); };
  const back = () => { setStep(s => s - 1); window.scrollTo(0, 0); };
  const pct = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  const stylePool = form.gender === 'Mr' ? stylesMale : stylesFemale;

  const getBrands = () => {
    const pool = form.gender === 'Mr' ? stylesMale : stylesFemale;
    const rel = pool.filter(s => form.styles.includes(s.id));
    return [...new Set(rel.flatMap(s => s.brands))];
  };

  const getSizingSystem = () => SIZING_MAP[form.nationality] || 'EU';

  const getStyleName = (id) => {
    const pool = form.gender === 'Mr' ? stylesMale : stylesFemale;
    const s = pool.find(x => x.id === id);
    if (!s) return id;
    if (lang === 'fr') return s.nameFR;
    if (lang === 'es') return s.nameES || s.nameEN;
    if (lang === 'ar') return s.nameAR || s.nameEN;
    return s.nameEN;
  };

  const handleNationalityChange = (v) => {
    set('nationality', v);
    set('sizingSystem', SIZING_MAP[v] || 'EU');
    const avail = NATIONALITY_LANGUAGES[v];
    if (avail && avail.length > 2) {
      setShowLangUpgrade(avail.filter(l => !['en', 'fr'].includes(l)));
    } else {
      setShowLangUpgrade(null);
    }
  };

  const handleSubmit = () => {
    if (!form.consent) {
      alert(t(lang,
        'Please accept the Terms & Conditions.',
        'Veuillez accepter les CGU.',
        'Por favor acepte los Términos y Condiciones.',
        'يرجى قبول الشروط والأحكام.'
      ));
      return;
    }
    const initials = ((form.firstName[0] || '') + (form.surname[0] || '')).toUpperCase();
    const sizingSystem = getSizingSystem();
    const styleNames = form.styles.map(id => getStyleName(id));
    const entry = {
      ...form,
      initials,
      sizingSystem,
      lang,
      styles: styleNames,
      travel: [...form.travel, form.travelCustom].filter(Boolean),
      events: [...form.events, form.eventCustom].filter(Boolean),
      submittedAt: new Date().toISOString(),
      id: Date.now(),
    };
    onComplete(entry, form.firstName, lang);
  };

  /* ── LANGUAGE UPGRADE BANNER ── */
  const LangUpgradeBanner = () => {
    if (!showLangUpgrade || showLangUpgrade.length === 0) return null;
    return (
      <div style={{
        background: 'rgba(201,168,76,0.1)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: 8, padding: '12px 16px', marginBottom: 20,
        fontSize: 13, color: 'var(--plum-dark)',
      }}>
        <div style={{ marginBottom: 8, fontWeight: 400 }}>
          {t(lang, 'Also available in:', 'Aussi disponible en :', 'También disponible en:', 'متوفر أيضاً بـ:')}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {showLangUpgrade.map(l => (
            <div
              key={l}
              onClick={() => { setLang(l); setShowLangUpgrade(null); }}
              style={{
                padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
                border: '1px solid var(--gold)',
                background: 'var(--gold-light)', color: 'var(--plum-dark)',
                fontSize: 12, fontWeight: 400,
                touchAction: 'manipulation',
              }}
            >
              {l === 'es' ? 'Español' : 'العربية'}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── START SCREEN ── */
  if (step === -1) {
    const displayPartner = partnerName || hotelName;
    return (
      <div style={{
        position: 'relative', minHeight: '100vh', width: '100%', maxWidth: '100vw',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem', boxSizing: 'border-box',
      }}>
        {/* Background layers */}
        <div style={{
          position: 'absolute', inset: '-20%',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(82,56,73,0.6) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
            linear-gradient(160deg, #1a0a12 0%, #2a1a22 40%, #3d2030 70%, #523849 100%)
          `,
        }} />
        {/* Animated orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Main content — glassmorphism card */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 440 }}>
          <div style={{
            background: 'rgba(245, 240, 230, 0.07)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(245, 240, 230, 0.13)',
            borderRadius: 28,
            padding: 'clamp(2rem, 8vw, 3.5rem) clamp(1.5rem, 6vw, 2.5rem)',
            color: '#F5F0E6',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
            textAlign: 'center',
            width: '100%',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 10vw, 54px)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--beige)',
              marginBottom: 24, letterSpacing: '0.01em',
            }}>
              Pre-Arrival<br />Survey
            </div>
            <div style={{ fontSize: 15, fontWeight: 300, color: 'rgba(245,240,230,0.75)', lineHeight: 1.75, marginBottom: 6, maxWidth: 300, margin: '0 auto 6px' }}>
              We would love to tailor your shopping and styling experience to you!
            </div>
            <div style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(245,240,230,0.4)', marginBottom: 44 }}>
              It will only take up to 3min.
            </div>
            <button
              onClick={() => setStep(0)}
              style={{
                padding: '15px 60px', borderRadius: 50,
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(245,240,230,0.95)', fontSize: 15, letterSpacing: '0.06em',
                fontFamily: 'var(--font-sans)', cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s, transform 0.2s',
                touchAction: 'manipulation',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Start
            </button>
          </div>
        </div>

        {/* Logo footer */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 20, paddingTop: '2.5rem' }}>
          <img
            src="/images/LVV Logo Black transparent.png"
            alt="La Vallée Village"
            style={{ height: 32, filter: 'brightness(0) invert(1)', opacity: 0.85, display: 'block' }}
          />
          <div style={{ fontSize: 18, color: 'rgba(245,240,230,0.4)', fontWeight: 300, lineHeight: 1 }}>×</div>
          {partnerLogoUrl ? (
            <img
              src={partnerLogoUrl} alt={displayPartner}
              style={{ height: 28, filter: 'brightness(0) invert(1)', opacity: 0.85, display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{ fontSize: 13, letterSpacing: '0.1em', color: 'rgba(245,240,230,0.9)', fontWeight: 400, textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
              {displayPartner}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── STEP 0: LANGUAGE ── */
  if (step === 0) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>Language / Langue</StepLabel>
      <StepQuestion>Please choose your preferred language</StepQuestion>
      <div style={{ display: 'flex', gap: 0, border: '1px solid var(--beige-dark)', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: 'fit-content', marginBottom: 32 }}>
        {['en', 'fr'].map(l => (
          <div key={l} onClick={() => setLang(l)} style={{
            padding: '12px 32px', fontSize: 13, fontWeight: 400,
            cursor: 'pointer', transition: 'all 0.2s',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            background: lang === l ? 'var(--plum)' : 'var(--beige)',
            color: lang === l ? 'var(--beige)' : 'var(--text-muted)',
            touchAction: 'manipulation',
          }}>
            {l === 'en' ? 'English' : 'Français'}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 24, borderTop: '1px solid var(--beige-mid)' }}>
        <Btn variant="primary" onClick={next}>
          {t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
        </Btn>
      </div>
    </Wrapper>
  );

  /* ── STEP 1: IDENTITY ── */
  if (step === 1) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>{t(lang, 'Step 1 of 13', 'Étape 1 sur 13', 'Paso 1 de 13', 'الخطوة 1 من 13')}</StepLabel>
      <StepQuestion>{t(lang, 'How should we call you?', 'Comment vous appeler ?', '¿Cómo debemos llamarle?', 'كيف يجب أن نناديك؟')}</StepQuestion>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Field label={t(lang, 'First Name', 'Prénom', 'Nombre', 'الاسم الأول')}>
          <TextInput value={form.firstName} onChange={v => set('firstName', v)} placeholder="Isabelle" />
        </Field>
        <Field label={t(lang, 'Surname', 'Nom', 'Apellido', 'اسم العائلة')}>
          <TextInput value={form.surname} onChange={v => set('surname', v)} placeholder="Fontaine" />
        </Field>
      </div>
      <Field label="Email" hint={t(lang, 'Used for membership & confirmation', "Pour l'adhésion et la confirmation", 'Para membresía y confirmación', 'للعضوية والتأكيد')}>
        <TextInput type="email" value={form.email} onChange={v => set('email', v)} placeholder="isabelle@example.com" />
      </Field>
      {form.firstName && form.surname && (
        <div style={{ marginTop: 16, padding: '10px 16px', background: 'var(--beige-mid)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-muted)' }}>
          {t(lang, 'Initials (auto-generated):', 'Initiales (générées automatiquement) :', 'Iniciales (generadas automáticamente):', 'الأحرف الأولى (تُنشأ تلقائياً):')} <strong style={{ color: 'var(--plum)', letterSpacing: '0.1em' }}>{(form.firstName[0] + form.surname[0]).toUpperCase()}</strong>
        </div>
      )}
      <NavBtns
        onBack={back}
        onNext={() => { if (!form.firstName || !form.surname) return alert(t(lang, 'Please enter your name.', 'Veuillez entrer votre nom.', 'Por favor ingrese su nombre.', 'يرجى إدخال اسمك.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 2: GENDER + NATIONALITY ── */
  if (step === 2) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>{t(lang, 'Step 2 of 13', 'Étape 2 sur 13', 'Paso 2 de 13', 'الخطوة 2 من 13')}</StepLabel>
      <StepQuestion>{t(lang, 'How should we address you?', 'Comment vous adresser ?', '¿Cómo debemos dirigirnos a usted?', 'كيف يجب أن نخاطبك؟')}</StepQuestion>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {['Ms', 'Mr'].map(g => (
          <OptionItem key={g} label={g} selected={form.gender === g} onClick={() => set('gender', g)} />
        ))}
      </div>
      <div style={{ fontSize: 18, fontWeight: 300, color: 'var(--plum-dark)', marginBottom: 16 }}>
        {t(lang, 'Where are you from?', "D'où venez-vous ?", '¿De dónde eres?', 'من أين أنت؟')}
      </div>
      <Field label={t(lang, 'Nationality', 'Nationalité', 'Nacionalidad', 'الجنسية')}>
        <NationalityInput
          value={form.nationality}
          onChange={handleNationalityChange}
          placeholder={t(lang, 'Select country', 'Sélectionner', 'Seleccionar país', 'اختر الدولة')}
        />
      </Field>
      <NavBtns
        onBack={back}
        onNext={() => { if (!form.gender) return alert(t(lang, 'Please select.', 'Veuillez sélectionner.', 'Por favor seleccione.', 'يرجى الاختيار.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 3: PHONE ── */
  if (step === 3) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <LangUpgradeBanner />
      <StepLabel>{t(lang, 'Step 3 of 13', 'Étape 3 sur 13', 'Paso 3 de 13', 'الخطوة 3 من 13')}</StepLabel>
      <StepQuestion>{t(lang, 'Your contact number', 'Votre numéro de contact', 'Tu número de contacto', 'رقم التواصل الخاص بك')}</StepQuestion>
      <Field
        label={t(lang, 'Phone Number', 'Téléphone', 'Número de teléfono', 'رقم الهاتف')}
        hint={t(lang, 'Optional — for membership & PS coordination', 'Optionnel — adhésion et coordination PS', 'Opcional — para membresía y coordinación PS', 'اختياري — للعضوية وتنسيق المتسوق الشخصي')}
      >
        <PhoneInput value={form.phone} onChange={v => set('phone', v)} nationality={form.nationality} />
      </Field>
      <NavBtns
        onBack={back} onNext={next}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 4: SIZING ── */
  if (step === 4) {
    const sys = getSizingSystem();
    const sizes = SIZING_VALUES[sys] || SIZING_VALUES.EU;
    return (
      <Wrapper pct={pct} hotelName={hotelName} {...wp}>
        <StepLabel>{t(lang, 'Step 4 of 13', 'Étape 4 sur 13', 'Paso 4 de 13', 'الخطوة 4 من 13')}</StepLabel>
        <StepQuestion>{t(lang, 'What is your sizing?', 'Quelle est votre taille ?', '¿Cuál es su talla?', 'ما هو مقاسك؟')}</StepQuestion>
        <div style={{ marginBottom: 16, padding: '8px 14px', background: 'var(--beige-mid)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-muted)' }}>
          {t(lang, 'System auto-detected from nationality:', 'Système détecté selon la nationalité :', 'Sistema detectado según la nacionalidad:', 'النظام المكتشف تلقائياً حسب الجنسية:')} <strong style={{ color: 'var(--plum)' }}>{sys}</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: 8, marginBottom: 20 }}>
          {sizes.map(s => (
            <div key={s} onClick={() => { set('sizingValue', s); set('sizingSystem', sys); }}
              style={{
                padding: '14px 8px', border: `1.5px solid ${form.sizingValue === s ? 'var(--gold)' : 'var(--beige-dark)'}`,
                borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer',
                background: form.sizingValue === s ? 'var(--gold-light)' : 'var(--beige)',
                transition: 'all 0.2s',
                transform: form.sizingValue === s ? 'scale(1.04)' : 'scale(1)',
                touchAction: 'manipulation',
              }}>
              <div style={{ fontSize: 15, fontWeight: 400, color: 'var(--plum-dark)' }}>{s}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{sys}</div>
            </div>
          ))}
        </div>
        <Field label={t(lang, 'Or type your exact size', 'Ou entrez votre taille exacte', 'O escribe tu talla exacta', 'أو اكتب مقاسك الدقيق')}>
          <TextInput value={form.sizingValue} onChange={v => { set('sizingValue', v); set('sizingSystem', sys); }} placeholder="38, M, 10..." />
        </Field>
        <NavBtns
          onBack={back} onNext={next}
          backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
          nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
        />
      </Wrapper>
    );
  }

  /* ── STEP 5: PURPOSE ── */
  if (step === 5) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>{t(lang, 'Step 5 of 13', 'Étape 5 sur 13', 'Paso 5 de 13', 'الخطوة 5 من 13')}</StepLabel>
      <StepQuestion>{t(lang, 'What brings you to this experience?', "Qu'est-ce qui vous amène ?", '¿Qué le trae a esta experiencia?', 'ما الذي يجلبك إلى هذه التجربة؟')}</StepQuestion>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {configPurposes.map(p => (
          <OptionItem
            key={p.id}
            label={p[labelKey(lang)] || p.labelEN}
            selected={form.purpose === p.id}
            onClick={() => set('purpose', p.id)}
          />
        ))}
      </div>
      <NavBtns
        onBack={back}
        onNext={() => { if (!form.purpose) return alert(t(lang, 'Please select an option.', 'Veuillez sélectionner.', 'Por favor seleccione una opción.', 'يرجى اختيار خيار.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 6: PS MODE ── */
  if (step === 6) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>{t(lang, 'Step 6 of 13', 'Étape 6 sur 13', 'Paso 6 de 13', 'الخطوة 6 من 13')}</StepLabel>
      <StepQuestion>{t(lang, 'How would you like your Personal Shopper experience?', 'Comment souhaitez-vous être accompagné(e) ?', '¿Cómo le gustaría su experiencia con el Personal Shopper?', 'كيف تريد تجربة المتسوق الشخصي الخاصة بك؟')}</StepQuestion>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {configPsModes.map(p => (
          <OptionItem
            key={p.id}
            label={p[labelKey(lang)] || p.labelEN}
            selected={form.psMode === p.id}
            onClick={() => set('psMode', p.id)}
          />
        ))}
      </div>
      <NavBtns
        onBack={back}
        onNext={() => { if (!form.psMode) return alert(t(lang, 'Please select an option.', 'Veuillez sélectionner.', 'Por favor seleccione una opción.', 'يرجى اختيار خيار.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 7: STYLE ── */
  if (step === 7) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>
        {form.gender === 'Mr'
          ? t(lang, 'Step 7 of 13 — Q12b Male Style Profile', 'Étape 7 sur 13 — Q12b Profil masculin', 'Paso 7 de 13 — Q12b Perfil masculino', 'الخطوة 7 من 13 — Q12b ملف الأسلوب الذكوري')
          : t(lang, 'Step 7 of 13 — Q12a Female Style Profile', 'Étape 7 sur 13 — Q12a Profil féminin', 'Paso 7 de 13 — Q12a Perfil femenino', 'الخطوة 7 من 13 — Q12a ملف الأسلوب الأنثوي')}
      </StepLabel>
      <StepQuestion>{t(lang, 'What best describes your style? (Choose up to 2)', 'Quel style vous ressemble ? (2 max)', '¿Qué describe mejor tu estilo? (Elige hasta 2)', 'ما الذي يصف أسلوبك بشكل أفضل؟ (اختر حتى 2)')}</StepQuestion>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        {form.styles.length}/2 {t(lang, 'selected', 'sélectionnés', 'seleccionados', 'محدد')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {stylePool.map(s => (
          <StyleCard
            key={s.id}
            name={
              lang === 'fr' ? s.nameFR :
              lang === 'es' ? (s.nameES || s.nameEN) :
              lang === 'ar' ? (s.nameAR || s.nameEN) :
              s.nameEN
            }
            brands={s.brands}
            selected={form.styles.includes(s.id)}
            onClick={() => toggleArrMax('styles', s.id, 2)}
            photoUrl={s.photoUrl}
          />
        ))}
      </div>
      <NavBtns
        onBack={back}
        onNext={() => { if (form.styles.length === 0) return alert(t(lang, 'Please select at least one style.', 'Veuillez sélectionner au moins un style.', 'Por favor seleccione al menos un estilo.', 'يرجى اختيار أسلوب واحد على الأقل.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 8: CATEGORIES ── */
  if (step === 8) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>{t(lang, 'Step 8 of 13', 'Étape 8 sur 13', 'Paso 8 de 13', 'الخطوة 8 من 13')}</StepLabel>
      <StepQuestion>{t(lang, "Are there any categories you'd love us to prepare?", 'Y a-t-il des catégories que vous souhaitez ?', '¿Hay categorías que le gustaría que preparáramos?', 'هل هناك فئات تريد منا إعدادها؟')}</StepQuestion>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        {t(lang, 'Choose as many as you like', 'Choisissez autant que vous souhaitez', 'Elige todas las que quieras', 'اختر بقدر ما تريد')}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {configCats.map(c => (
          <MultiTag
            key={c.id}
            label={c[labelKey(lang)] || c.labelEN}
            selected={form.categories.includes(c.id)}
            onClick={() => toggleArr('categories', c.id)}
          />
        ))}
      </div>
      <NavBtns
        onBack={back} onNext={next}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 9: BRANDS ── */
  if (step === 9) {
    const brands = getBrands();
    return (
      <Wrapper pct={pct} hotelName={hotelName} {...wp}>
        <StepLabel>{t(lang, 'Step 9 of 13', 'Étape 9 sur 13', 'Paso 9 de 13', 'الخطوة 9 من 13')}</StepLabel>
        <StepQuestion>{t(lang, 'Any favorite brands you gravitate toward? (up to 2)', 'Des marques préférées ? (2 max)', '¿Alguna marca favorita? (hasta 2)', 'هل هناك ماركات مفضلة لديك؟ (حتى 2)')}</StepQuestion>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          {t(lang, 'Based on your style selection', 'Basé sur votre sélection de style', 'Según tu selección de estilo', 'بناءً على اختيار أسلوبك')} · {form.brands.filter(b => b !== 'none').length}/2
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
          {brands.map(b => (
            <BrandTag
              key={b} label={b}
              selected={form.brands.includes(b)}
              onClick={() => {
                if (form.brands.includes('none')) { set('brands', [b]); return; }
                if (form.brands.includes(b)) { set('brands', form.brands.filter(x => x !== b)); }
                else if (form.brands.length < 2) { set('brands', [...form.brands, b]); }
              }}
            />
          ))}
        </div>
        <BrandTag
          label={t(lang, 'None of the above', 'Aucune de ces marques', 'Ninguna de las anteriores', 'لا شيء مما سبق')}
          selected={form.brands.includes('none')}
          onClick={() => set('brands', form.brands.includes('none') ? [] : ['none'])}
        />
        <NavBtns
          onBack={back} onNext={next}
          backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
          nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
        />
      </Wrapper>
    );
  }

  /* ── STEP 10: LIFESTYLE ── */
  if (step === 10) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>{t(lang, 'Step 10 of 13', 'Étape 10 sur 13', 'Paso 10 de 13', 'الخطوة 10 من 13')}</StepLabel>
      <StepQuestion>{t(lang, 'Which categories fit your lifestyle?', 'Quelles catégories correspondent à votre style de vie ?', '¿Qué categorías encajan con tu estilo de vida?', 'ما الفئات التي تناسب أسلوب حياتك؟')}</StepQuestion>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {configLife.map(l => (
          <MultiTag
            key={l.id}
            label={l[labelKey(lang)] || l.labelEN}
            selected={form.lifestyle.includes(l.id)}
            onClick={() => toggleArr('lifestyle', l.id)}
          />
        ))}
      </div>
      <NavBtns
        onBack={back} onNext={next}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 11: TRAVEL ── */
  if (step === 11) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>{t(lang, 'Step 11 of 13', 'Étape 11 sur 13', 'Paso 11 de 13', 'الخطوة 11 من 13')}</StepLabel>
      <StepQuestion>{t(lang, 'Any upcoming vacation?', 'Un voyage prévu ?', '¿Algún próximo viaje de vacaciones?', 'هل هناك إجازة قادمة؟')}</StepQuestion>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {configTravel.map(o => (
          <MultiTag
            key={o.id}
            label={o[labelKey(lang)] || o.labelEN}
            selected={form.travel.includes(o.id)}
            onClick={() => toggleArr('travel', o.id)}
          />
        ))}
      </div>
      <Field label={t(lang, 'Or describe your destination', 'Ou décrivez votre destination', 'O describe tu destino', 'أو صف وجهتك')}>
        <TextInput value={form.travelCustom} onChange={v => set('travelCustom', v)} placeholder={t(lang, 'e.g. Maldives, ski trip, Paris...', 'ex : Maldives, ski, Paris...', 'ej. Maldivas, esquí, París...', 'مثلاً: المالديف، رحلة تزلج، باريس...')} />
      </Field>
      <NavBtns
        onBack={back} onNext={next}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 12: EVENTS ── */
  if (step === 12) return (
    <Wrapper pct={pct} hotelName={hotelName} {...wp}>
      <StepLabel>{t(lang, 'Step 12 of 13', 'Étape 12 sur 13', 'Paso 12 de 13', 'الخطوة 12 من 13')}</StepLabel>
      <StepQuestion>{t(lang, 'Any upcoming events?', 'Un événement à venir ?', '¿Algún evento próximo?', 'هل هناك فعاليات قادمة؟')}</StepQuestion>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {configEvents.map(o => (
          <MultiTag
            key={o.id}
            label={o[labelKey(lang)] || o.labelEN}
            selected={form.events.includes(o.id)}
            onClick={() => toggleArr('events', o.id)}
          />
        ))}
      </div>
      <Field label={t(lang, 'Or describe the occasion', "Ou décrivez l'occasion", 'O describe la ocasión', 'أو صف المناسبة')}>
        <TextInput value={form.eventCustom} onChange={v => set('eventCustom', v)} placeholder={t(lang, 'e.g. Launch party, charity gala...', 'ex : Soirée de lancement, gala de charité...', 'ej. Fiesta de lanzamiento, gala benéfica...', 'مثلاً: حفلة إطلاق، حفل خيري...')} />
      </Field>
      <NavBtns
        onBack={back} onNext={next}
        backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
        nextLabel={t(lang, 'Continue →', 'Continuer →', 'Continuar →', '→ متابعة')}
      />
    </Wrapper>
  );

  /* ── STEP 13: REVIEW + CONSENT ── */
  if (step === 13) {
    const sys = getSizingSystem();
    const lk = labelKey(lang);
    const styleNames = form.styles.map(id => getStyleName(id)).join(', ');
    const catLabels = form.categories.map(id => { const c = configCats.find(x => x.id === id); return c ? (c[lk] || c.labelEN) : id; }).join(', ');
    const lifeLabels = form.lifestyle.map(id => { const l = configLife.find(x => x.id === id); return l ? (l[lk] || l.labelEN) : id; }).join(', ');
    const purposeItem = configPurposes.find(p => p.id === form.purpose);
    const purposeLabel = purposeItem ? (purposeItem[lk] || purposeItem.labelEN) : '—';
    const psModeItem = configPsModes.find(p => p.id === form.psMode);
    const psModeLabel = psModeItem ? (psModeItem[lk] || psModeItem.labelEN) : '—';
    const travelLabels = [...form.travel.map(id => { const o = configTravel.find(x => x.id === id); return o ? (o[lk] || o.labelEN) : id; }), form.travelCustom].filter(Boolean).join(', ');
    const eventLabels = [...form.events.map(id => { const o = configEvents.find(x => x.id === id); return o ? (o[lk] || o.labelEN) : id; }), form.eventCustom].filter(Boolean).join(', ');

    return (
      <Wrapper pct={pct} hotelName={hotelName} {...wp}>
        <StepLabel>{t(lang, 'Step 13 of 13 — Review', 'Étape 13 sur 13 — Récapitulatif', 'Paso 13 de 13 — Revisión', 'الخطوة 13 من 13 — مراجعة')}</StepLabel>
        <StepQuestion>{t(lang, 'Review your profile', 'Vérifiez votre profil', 'Revisa tu perfil', 'راجع ملفك الشخصي')}</StepQuestion>
        <Card style={{ marginBottom: 20 }}>
          <ReviewRow k={t(lang, 'Full Name', 'Nom complet', 'Nombre completo', 'الاسم الكامل')} v={`${form.firstName} ${form.surname}`} />
          <ReviewRow k={t(lang, 'Initials', 'Initiales', 'Iniciales', 'الأحرف الأولى')} v={(form.firstName[0] + form.surname[0]).toUpperCase()} />
          <ReviewRow k="Email" v={form.email} />
          <ReviewRow k={t(lang, 'Phone', 'Téléphone', 'Teléfono', 'الهاتف')} v={form.phone?.full || form.phone || '—'} />
          <ReviewRow k={t(lang, 'Address as', 'Civilité', 'Tratamiento', 'المخاطبة')} v={form.gender} />
          <ReviewRow k={t(lang, 'Nationality', 'Nationalité', 'Nacionalidad', 'الجنسية')} v={form.nationality} />
          <ReviewRow k={t(lang, 'Sizing', 'Taille', 'Talla', 'المقاس')} v={form.sizingValue ? `${form.sizingValue} (${sys})` : '—'} />
          <Divider style={{ margin: '4px 0' }} />
          <ReviewRow k={t(lang, 'Purpose', 'Intention', 'Propósito', 'الغرض')} v={purposeLabel} />
          <ReviewRow k={t(lang, 'PS Mode', 'Mode PS', 'Modo PS', 'نمط PS')} v={psModeLabel} />
          <ReviewRow k={t(lang, 'Styles', 'Styles', 'Estilos', 'الأساليب')} v={styleNames} />
          <ReviewRow k={t(lang, 'Categories', 'Catégories', 'Categorías', 'الفئات')} v={catLabels} />
          <ReviewRow k={t(lang, 'Brands', 'Marques', 'Marcas', 'الماركات')} v={form.brands.filter(b => b !== 'none').join(', ')} />
          <ReviewRow k={t(lang, 'Lifestyle', 'Style de vie', 'Estilo de vida', 'نمط الحياة')} v={lifeLabels} />
          <ReviewRow k={t(lang, 'Travel', 'Voyage', 'Viaje', 'السفر')} v={travelLabels} />
          <ReviewRow k={t(lang, 'Events', 'Événements', 'Eventos', 'الفعاليات')} v={eventLabels} />
        </Card>

        {/* CONSENT */}
        <div
          onClick={() => set('consent', !form.consent)}
          style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: '16px', border: `1.5px solid ${form.consent ? 'var(--plum-mid)' : 'var(--beige-dark)'}`,
            borderRadius: 'var(--radius-md)', cursor: 'pointer', background: form.consent ? 'rgba(82,56,73,0.04)' : 'var(--beige)',
            transition: 'all 0.2s', marginBottom: 8,
            touchAction: 'manipulation',
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
            border: `2px solid ${form.consent ? 'var(--plum)' : 'var(--beige-dark)'}`,
            background: form.consent ? 'var(--plum)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {form.consent && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-dark)', lineHeight: 1.6, fontWeight: 300 }}>
            {t(lang,
              'I agree to the processing of my personal data in accordance with the Privacy Policy and Terms & Conditions.',
              "J'accepte le traitement de mes données personnelles conformément à la Politique de confidentialité et aux CGU.",
              'Acepto el tratamiento de mis datos personales de acuerdo con la Política de Privacidad y los Términos y Condiciones.',
              'أوافق على معالجة بياناتي الشخصية وفقاً لسياسة الخصوصية والشروط والأحكام.'
            )}
          </div>
        </div>

        <NavBtns
          onBack={back}
          onNext={handleSubmit}
          backLabel={t(lang, '← Back', '← Retour', '← Atrás', 'رجوع ←')}
          nextLabel={t(lang, 'Submit', 'Envoyer', 'Enviar', 'إرسال')}
          nextVariant="gold"
        />
      </Wrapper>
    );
  }

  return null;
}
