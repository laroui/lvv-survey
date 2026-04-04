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
  SIZING_MAP, SIZING_VALUES,
} from './data';

const TOTAL_STEPS = 13;

function t(lang, en, fr) {
  return lang === 'fr' ? fr : en;
}

export default function SurveyForm({ onComplete }) {
  const [step, setStep] = useState(-1); // -1 = start screen
  const [lang, setLang] = useState('en');
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

  const stylePool = form.gender === 'Mr' ? STYLES_MALE : STYLES_FEMALE;

  const getBrands = () => {
    const pool = form.gender === 'Mr' ? STYLES_MALE : STYLES_FEMALE;
    const rel = pool.filter(s => form.styles.includes(s.id));
    return [...new Set(rel.flatMap(s => s.brands))];
  };

  const getSizingSystem = () => SIZING_MAP[form.nationality] || 'EU';

  const getStyleName = (id) => {
    const pool = form.gender === 'Mr' ? STYLES_MALE : STYLES_FEMALE;
    const s = pool.find(x => x.id === id);
    return s ? (lang === 'fr' ? s.nameFR : s.nameEN) : id;
  };

  const handleSubmit = () => {
    if (!form.consent) { alert(t(lang, 'Please accept the Terms & Conditions.', 'Veuillez accepter les CGU.')); return; }
    const initials = ((form.firstName[0] || '') + (form.surname[0] || '')).toUpperCase();
    const sizingSystem = getSizingSystem();
    const styleNames = form.styles.map(id => getStyleName(id));
    const entry = {
      ...form,
      initials,
      sizingSystem,
      styles: styleNames,
      travel: [...form.travel, form.travelCustom].filter(Boolean),
      events: [...form.events, form.eventCustom].filter(Boolean),
      submittedAt: new Date().toISOString(),
      id: Date.now(),
    };
    onComplete(entry, form.firstName, lang);
  };

  /* ── START SCREEN ── */
  if (step === -1) {
    return (
      <div style={{ maxWidth: 460, margin: '3rem auto', padding: '0 1.5rem' }}>
        <div style={{
          background: 'linear-gradient(160deg, var(--plum-dark) 0%, var(--plum) 100%)',
          borderRadius: 'var(--radius-xl)', padding: '3.5rem 2.5rem 3rem',
          color: 'var(--beige)', textAlign: 'center', marginBottom: 24,
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,230,0.5)', marginBottom: 12, fontWeight: 300 }}>
            La Vallée Village × The Peninsula Paris
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 400, lineHeight: 1.15, marginBottom: 20, letterSpacing: '0.01em' }}>
            Pre-Arrival<br />Survey
          </div>
          <div style={{ fontSize: 14, fontWeight: 300, color: 'rgba(245,240,230,0.75)', lineHeight: 1.7, marginBottom: 8 }}>
            We would love to tailor your<br />shopping and styling experience to you!
          </div>
          <div style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(245,240,230,0.4)', marginBottom: 36 }}>
            It will only take up to 3 min.
          </div>
          <Btn variant="gold" size="lg" style={{ width: '100%' }} onClick={() => setStep(0)}>
            Start
          </Btn>
        </div>
        <div style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-hint)', textTransform: 'uppercase' }}>
          Available in English · Français
        </div>
      </div>
    );
  }

  /* ── SHARED HEADER ── */
  const Header = () => (
    <div style={{ textAlign: 'center', padding: '2rem 1.5rem 0' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 300 }}>
        La Vallée Village × The Peninsula Paris
      </div>
    </div>
  );

  const Wrapper = ({ children }) => (
    <>
      <Header />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
        <ProgressBar pct={pct} />
        {children}
      </div>
    </>
  );

  /* ── STEP 0: LANGUAGE ── */
  if (step === 0) return (
    <Wrapper>
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
          }}>
            {l === 'en' ? 'English' : 'Français'}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 24, borderTop: '1px solid var(--beige-mid)' }}>
        <Btn variant="primary" onClick={next}>Continue →</Btn>
      </div>
    </Wrapper>
  );

  /* ── STEP 1: IDENTITY ── */
  if (step === 1) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 1 of 13', 'Étape 1 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, 'How should we call you?', 'Comment vous appeler ?')}</StepQuestion>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Field label={t(lang, 'First Name', 'Prénom')}>
          <TextInput value={form.firstName} onChange={v => set('firstName', v)} placeholder={t(lang, 'Isabelle', 'Isabelle')} />
        </Field>
        <Field label={t(lang, 'Surname', 'Nom')}>
          <TextInput value={form.surname} onChange={v => set('surname', v)} placeholder={t(lang, 'Fontaine', 'Fontaine')} />
        </Field>
      </div>
      <Field label="Email" hint={t(lang, 'Used for membership & confirmation', 'Pour l\'adhésion et la confirmation')}>
        <TextInput type="email" value={form.email} onChange={v => set('email', v)} placeholder="isabelle@example.com" />
      </Field>
      {form.firstName && form.surname && (
        <div style={{ marginTop: 16, padding: '10px 16px', background: 'var(--beige-mid)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-muted)' }}>
          {t(lang, 'Initials (auto-generated):', 'Initiales (générées automatiquement) :')} <strong style={{ color: 'var(--plum)', letterSpacing: '0.1em' }}>{(form.firstName[0] + form.surname[0]).toUpperCase()}</strong>
        </div>
      )}
      <NavBtns
        onBack={back} onNext={() => { if (!form.firstName || !form.surname) return alert(t(lang, 'Please enter your name.', 'Veuillez entrer votre nom.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')}
      />
    </Wrapper>
  );

  /* ── STEP 2: GENDER + NATIONALITY ── */
  if (step === 2) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 2 of 13', 'Étape 2 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, 'How should we address you?', 'Comment vous adresser ?')}</StepQuestion>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {['Ms', 'Mr'].map(g => (
          <OptionItem key={g} label={g} selected={form.gender === g} onClick={() => set('gender', g)} />
        ))}
      </div>
      <div style={{ fontSize: 18, fontWeight: 300, color: 'var(--plum-dark)', marginBottom: 16 }}>
        {t(lang, 'Where are you from?', "D'où venez-vous ?")}
      </div>
      <Field label={t(lang, 'Nationality', 'Nationalité')}>
        <NationalityInput
          value={form.nationality}
          onChange={v => { set('nationality', v); set('sizingSystem', SIZING_MAP[v] || 'EU'); }}
          placeholder={t(lang, 'Select country', 'Sélectionner')}
        />
      </Field>
      <NavBtns
        onBack={back} onNext={() => { if (!form.gender) return alert(t(lang, 'Please select.', 'Veuillez sélectionner.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')}
      />
    </Wrapper>
  );

  /* ── STEP 3: PHONE ── */
  if (step === 3) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 3 of 13', 'Étape 3 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, 'Your contact number', 'Votre numéro de contact')}</StepQuestion>
      <Field label={t(lang, 'Phone Number', 'Téléphone')} hint={t(lang, 'Optional — for membership & PS coordination', 'Optionnel — adhésion et coordination PS')}>
        <PhoneInput value={form.phone} onChange={v => set('phone', v)} nationality={form.nationality} />
      </Field>
      <NavBtns onBack={back} onNext={next} backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
    </Wrapper>
  );

  /* ── STEP 4: SIZING ── */
  if (step === 4) {
    const sys = getSizingSystem();
    const sizes = SIZING_VALUES[sys] || SIZING_VALUES.EU;
    return (
      <Wrapper>
        <StepLabel>{t(lang, 'Step 4 of 13', 'Étape 4 sur 13')}</StepLabel>
        <StepQuestion>{t(lang, 'What is your sizing?', 'Quelle est votre taille ?')}</StepQuestion>
        <div style={{ marginBottom: 16, padding: '8px 14px', background: 'var(--beige-mid)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-muted)' }}>
          {t(lang, 'System auto-detected from nationality:', 'Système détecté selon la nationalité :')} <strong style={{ color: 'var(--plum)' }}>{sys}</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
          {sizes.map(s => (
            <div key={s} onClick={() => { set('sizingValue', s); set('sizingSystem', sys); }}
              style={{
                padding: '14px 8px', border: `1.5px solid ${form.sizingValue === s ? 'var(--gold)' : 'var(--beige-dark)'}`,
                borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer',
                background: form.sizingValue === s ? 'var(--gold-light)' : 'var(--beige)',
                transition: 'all 0.2s',
              }}>
              <div style={{ fontSize: 15, fontWeight: 400, color: 'var(--plum-dark)' }}>{s}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{sys}</div>
            </div>
          ))}
        </div>
        <Field label={t(lang, 'Or type your exact size', 'Ou entrez votre taille exacte')}>
          <TextInput value={form.sizingValue} onChange={v => { set('sizingValue', v); set('sizingSystem', sys); }} placeholder="38, M, 10..." />
        </Field>
        <NavBtns onBack={back} onNext={next} backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
      </Wrapper>
    );
  }

  /* ── STEP 5: PURPOSE ── */
  if (step === 5) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 5 of 13', 'Étape 5 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, 'What brings you to this experience?', "Qu'est-ce qui vous amène ?")}</StepQuestion>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PURPOSES.map(p => (
          <OptionItem
            key={p.id}
            label={t(lang, p.labelEN, p.labelFR)}
            selected={form.purpose === p.id}
            onClick={() => set('purpose', p.id)}
          />
        ))}
      </div>
      <NavBtns onBack={back} onNext={() => { if (!form.purpose) return alert(t(lang, 'Please select an option.', 'Veuillez sélectionner.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
    </Wrapper>
  );

  /* ── STEP 6: PS MODE ── */
  if (step === 6) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 6 of 13', 'Étape 6 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, 'How would you like your Personal Shopper experience?', 'Comment souhaitez-vous être accompagné(e) ?')}</StepQuestion>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PS_MODES.map(p => (
          <OptionItem key={p.id} label={t(lang, p.labelEN, p.labelFR)} selected={form.psMode === p.id} onClick={() => set('psMode', p.id)} />
        ))}
      </div>
      <NavBtns onBack={back} onNext={() => { if (!form.psMode) return alert(t(lang, 'Please select an option.', 'Veuillez sélectionner.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
    </Wrapper>
  );

  /* ── STEP 7: STYLE ── */
  if (step === 7) return (
    <Wrapper>
      <StepLabel>
        {form.gender === 'Mr'
          ? t(lang, 'Step 7 of 13 — Q12b Male Style Profile', 'Étape 7 sur 13 — Q12b Profil masculin')
          : t(lang, 'Step 7 of 13 — Q12a Female Style Profile', 'Étape 7 sur 13 — Q12a Profil féminin')}
      </StepLabel>
      <StepQuestion>{t(lang, 'What best describes your style? (Choose up to 2)', 'Quel style vous ressemble ? (2 max)')}</StepQuestion>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        {form.styles.length}/2 {t(lang, 'selected', 'sélectionnés')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {stylePool.map(s => (
          <StyleCard
            key={s.id}
            name={lang === 'fr' ? s.nameFR : s.nameEN}
            brands={s.brands}
            selected={form.styles.includes(s.id)}
            onClick={() => toggleArrMax('styles', s.id, 2)}
          />
        ))}
      </div>
      <NavBtns onBack={back} onNext={() => { if (form.styles.length === 0) return alert(t(lang, 'Please select at least one style.', 'Veuillez sélectionner au moins un style.')); next(); }}
        backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
    </Wrapper>
  );

  /* ── STEP 8: CATEGORIES ── */
  if (step === 8) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 8 of 13', 'Étape 8 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, "Are there any categories you'd love us to prepare?", 'Y a-t-il des catégories que vous souhaitez ?')}</StepQuestion>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        {t(lang, 'Choose as many as you like', 'Choisissez autant que vous souhaitez')}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {CATEGORIES.map(c => (
          <MultiTag
            key={c.id} label={t(lang, c.labelEN, c.labelFR)}
            selected={form.categories.includes(c.id)}
            onClick={() => toggleArr('categories', c.id)}
          />
        ))}
      </div>
      <NavBtns onBack={back} onNext={next} backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
    </Wrapper>
  );

  /* ── STEP 9: BRANDS ── */
  if (step === 9) {
    const brands = getBrands();
    return (
      <Wrapper>
        <StepLabel>{t(lang, 'Step 9 of 13', 'Étape 9 sur 13')}</StepLabel>
        <StepQuestion>{t(lang, 'Any favorite brands you gravitate toward? (up to 2)', 'Des marques préférées ? (2 max)')}</StepQuestion>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          {t(lang, 'Based on your style selection', 'Basé sur votre sélection de style')} · {form.brands.filter(b => b !== 'none').length}/2
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
          label={t(lang, 'None of the above', 'Aucune de ces marques')}
          selected={form.brands.includes('none')}
          onClick={() => set('brands', form.brands.includes('none') ? [] : ['none'])}
        />
        <NavBtns onBack={back} onNext={next} backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
      </Wrapper>
    );
  }

  /* ── STEP 10: LIFESTYLE ── */
  if (step === 10) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 10 of 13', 'Étape 10 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, 'Which categories fit your lifestyle?', 'Quelles catégories correspondent à votre style de vie ?')}</StepQuestion>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {LIFESTYLE.map(l => (
          <MultiTag key={l.id} label={t(lang, l.labelEN, l.labelFR)} selected={form.lifestyle.includes(l.id)} onClick={() => toggleArr('lifestyle', l.id)} />
        ))}
      </div>
      <NavBtns onBack={back} onNext={next} backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
    </Wrapper>
  );

  /* ── STEP 11: TRAVEL ── */
  if (step === 11) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 11 of 13', 'Étape 11 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, 'Any upcoming vacation?', 'Un voyage prévu ?')}</StepQuestion>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {TRAVEL_OPTIONS.map(o => (
          <MultiTag key={o.id} label={t(lang, o.labelEN, o.labelFR)} selected={form.travel.includes(o.id)} onClick={() => toggleArr('travel', o.id)} />
        ))}
      </div>
      <Field label={t(lang, 'Or describe your destination', 'Ou décrivez votre destination')}>
        <TextInput value={form.travelCustom} onChange={v => set('travelCustom', v)} placeholder={t(lang, 'e.g. Maldives, ski trip, Paris...', 'ex : Maldives, ski, Paris...')} />
      </Field>
      <NavBtns onBack={back} onNext={next} backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
    </Wrapper>
  );

  /* ── STEP 12: EVENTS ── */
  if (step === 12) return (
    <Wrapper>
      <StepLabel>{t(lang, 'Step 12 of 13', 'Étape 12 sur 13')}</StepLabel>
      <StepQuestion>{t(lang, 'Any upcoming events?', 'Un événement à venir ?')}</StepQuestion>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {EVENT_OPTIONS.map(o => (
          <MultiTag key={o.id} label={t(lang, o.labelEN, o.labelFR)} selected={form.events.includes(o.id)} onClick={() => toggleArr('events', o.id)} />
        ))}
      </div>
      <Field label={t(lang, 'Or describe the occasion', "Ou décrivez l'occasion")}>
        <TextInput value={form.eventCustom} onChange={v => set('eventCustom', v)} placeholder={t(lang, 'e.g. Launch party, charity gala...', 'ex : Soirée de lancement, gala de charité...')} />
      </Field>
      <NavBtns onBack={back} onNext={next} backLabel={t(lang, '← Back', '← Retour')} nextLabel={t(lang, 'Continue →', 'Continuer →')} />
    </Wrapper>
  );

  /* ── STEP 13: REVIEW + CONSENT ── */
  if (step === 13) {
    const sys = getSizingSystem();
    const styleNames = form.styles.map(id => getStyleName(id)).join(', ');
    const catLabels = form.categories.map(id => { const c = CATEGORIES.find(x => x.id === id); return c ? t(lang, c.labelEN, c.labelFR) : id; }).join(', ');
    const lifeLabels = form.lifestyle.map(id => { const l = LIFESTYLE.find(x => x.id === id); return l ? t(lang, l.labelEN, l.labelFR) : id; }).join(', ');
    const purposeLabel = PURPOSES.find(p => p.id === form.purpose)?.[lang === 'fr' ? 'labelFR' : 'labelEN'] || '—';
    const psModeLabel = PS_MODES.find(p => p.id === form.psMode)?.[lang === 'fr' ? 'labelFR' : 'labelEN'] || '—';
    const travelLabels = [...form.travel.map(id => TRAVEL_OPTIONS.find(x => x.id === id)?.[lang === 'fr' ? 'labelFR' : 'labelEN'] || id), form.travelCustom].filter(Boolean).join(', ');
    const eventLabels = [...form.events.map(id => EVENT_OPTIONS.find(x => x.id === id)?.[lang === 'fr' ? 'labelFR' : 'labelEN'] || id), form.eventCustom].filter(Boolean).join(', ');

    return (
      <Wrapper>
        <StepLabel>{t(lang, 'Step 13 of 13 — Review', 'Étape 13 sur 13 — Récapitulatif')}</StepLabel>
        <StepQuestion>{t(lang, 'Review your profile', 'Vérifiez votre profil')}</StepQuestion>
        <Card style={{ marginBottom: 20 }}>
          <ReviewRow k={t(lang, 'Full Name', 'Nom complet')} v={`${form.firstName} ${form.surname}`} />
          <ReviewRow k={t(lang, 'Initials', 'Initiales')} v={(form.firstName[0] + form.surname[0]).toUpperCase()} />
          <ReviewRow k="Email" v={form.email} />
          <ReviewRow k={t(lang, 'Phone', 'Téléphone')} v={form.phone?.full || form.phone || '—'} />
          <ReviewRow k={t(lang, 'Address as', 'Civilité')} v={form.gender} />
          <ReviewRow k={t(lang, 'Nationality', 'Nationalité')} v={form.nationality} />
          <ReviewRow k={t(lang, 'Sizing', 'Taille')} v={form.sizingValue ? `${form.sizingValue} (${sys})` : '—'} />
          <Divider style={{ margin: '4px 0' }} />
          <ReviewRow k={t(lang, 'Purpose', 'Intention')} v={purposeLabel} />
          <ReviewRow k={t(lang, 'PS Mode', 'Mode PS')} v={psModeLabel} />
          <ReviewRow k={t(lang, 'Styles', 'Styles')} v={styleNames} />
          <ReviewRow k={t(lang, 'Categories', 'Catégories')} v={catLabels} />
          <ReviewRow k={t(lang, 'Brands', 'Marques')} v={form.brands.filter(b => b !== 'none').join(', ')} />
          <ReviewRow k={t(lang, 'Lifestyle', 'Style de vie')} v={lifeLabels} />
          <ReviewRow k={t(lang, 'Travel', 'Voyage')} v={travelLabels} />
          <ReviewRow k={t(lang, 'Events', 'Événements')} v={eventLabels} />
        </Card>

        {/* CONSENT */}
        <div
          onClick={() => set('consent', !form.consent)}
          style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: '16px', border: `1.5px solid ${form.consent ? 'var(--plum-mid)' : 'var(--beige-dark)'}`,
            borderRadius: 'var(--radius-md)', cursor: 'pointer', background: form.consent ? 'rgba(82,56,73,0.04)' : 'var(--beige)',
            transition: 'all 0.2s', marginBottom: 8,
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
              "J'accepte le traitement de mes données personnelles conformément à la Politique de confidentialité et aux CGU."
            )}
          </div>
        </div>

        <NavBtns
          onBack={back}
          onNext={handleSubmit}
          backLabel={t(lang, '← Back', '← Retour')}
          nextLabel={t(lang, 'Submit', 'Envoyer')}
          nextVariant="gold"
        />
      </Wrapper>
    );
  }

  return null;
}
