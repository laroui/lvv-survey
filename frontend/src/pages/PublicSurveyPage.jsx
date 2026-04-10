import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SurveyForm from '../SurveyForm.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/* ── Nationality → primary language code ── */
const NATIONALITY_LANG_MAP = {
  // Mandarin Chinese
  'China': 'zh', 'Taiwan': 'zh', 'Hong Kong': 'zh', 'Singapore': 'zh', 'Macau': 'zh',
  // Hindi
  'India': 'hi',
  // Spanish
  'Spain': 'es', 'Mexico': 'es', 'Argentina': 'es', 'Colombia': 'es',
  'Chile': 'es', 'Peru': 'es', 'Venezuela': 'es', 'Ecuador': 'es',
  'Bolivia': 'es', 'Paraguay': 'es', 'Uruguay': 'es', 'Cuba': 'es',
  'Dominican Republic': 'es', 'Guatemala': 'es', 'Honduras': 'es',
  'El Salvador': 'es', 'Nicaragua': 'es', 'Costa Rica': 'es', 'Panama': 'es',
  // French
  'France': 'fr', 'Monaco': 'fr',
  // Arabic
  'Saudi Arabia': 'ar', 'UAE': 'ar', 'Qatar': 'ar', 'Kuwait': 'ar',
  'Bahrain': 'ar', 'Jordan': 'ar', 'Lebanon': 'ar', 'Egypt': 'ar',
  'Iraq': 'ar', 'Syria': 'ar', 'Libya': 'ar', 'Oman': 'ar',
  'Yemen': 'ar', 'Morocco': 'ar', 'Algeria': 'ar', 'Tunisia': 'ar',
  'Sudan': 'ar', 'Palestine': 'ar', 'Mauritania': 'ar',
  // Bengali
  'Bangladesh': 'bn',
  // Portuguese
  'Brazil': 'pt', 'Portugal': 'pt', 'Angola': 'pt', 'Mozambique': 'pt',
  // Russian
  'Russia': 'ru', 'Belarus': 'ru', 'Kazakhstan': 'ru', 'Kyrgyzstan': 'ru',
  // Japanese
  'Japan': 'ja',
  // German
  'Germany': 'de', 'Austria': 'de', 'Switzerland': 'de', 'Liechtenstein': 'de',
  // Korean
  'South Korea': 'ko',
  // Italian
  'Italy': 'it',
};

/* ── Thank-you copy in the top 10 world languages ── */
const THANKS_I18N = {
  en: {
    greeting: n => `Thank you,\n${n}.`,
    message: 'Your Personal Shopper will be in touch before your arrival. We look forward to welcoming you to La Vallée Village.',
  },
  zh: {
    greeting: n => `谢谢您，\n${n}。`,
    message: '您的个人购物顾问将在您到达前与您联系。期待在拉瓦莱村与您相遇。',
  },
  hi: {
    greeting: n => `धन्यवाद,\n${n}।`,
    message: 'आपके आगमन से पहले आपका पर्सनल शॉपर आपसे संपर्क करेगा। हम La Vallée Village में आपका स्वागत करने के लिए उत्सुक हैं।',
  },
  es: {
    greeting: n => `Gracias,\n${n}.`,
    message: 'Su Personal Shopper se pondrá en contacto antes de su llegada. Estamos encantados de darle la bienvenida a La Vallée Village.',
  },
  fr: {
    greeting: n => `Merci,\n${n}.`,
    message: 'Votre Personal Shopper vous contactera avant votre arrivée. Nous nous réjouissons de vous accueillir à La Vallée Village.',
  },
  ar: {
    greeting: n => `شكراً لك،\n${n}.`,
    message: 'سيتواصل معك المتسوق الشخصي قبل وصولك. نتطلع إلى الترحيب بك في لا فاليه فيلاج.',
    rtl: true,
    font: "'Munadi', serif",
  },
  bn: {
    greeting: n => `ধন্যবাদ,\n${n}।`,
    message: 'আপনার আগমনের আগে আপনার পার্সোনাল শপার যোগাযোগ করবেন। আমরা La Vallée Village-এ আপনাকে স্বাগত জানাতে অপেক্ষায় আছি।',
  },
  pt: {
    greeting: n => `Obrigado,\n${n}.`,
    message: 'O seu Personal Shopper entrará em contacto antes da sua chegada. Aguardamos com entusiasmo recebê-lo em La Vallée Village.',
  },
  ru: {
    greeting: n => `Спасибо,\n${n}.`,
    message: 'Ваш персональный шоппер свяжется с вами до приезда. Мы с нетерпением ждём встречи с вами в La Vallée Village.',
  },
  ja: {
    greeting: n => `ありがとうございます、\n${n}。`,
    message: 'ご到着前にパーソナルショッパーよりご連絡いたします。La Vallée Villageにてお会いできることを楽しみにしております。',
  },
  de: {
    greeting: n => `Danke,\n${n}.`,
    message: 'Ihr Personal Shopper wird sich vor Ihrer Ankunft bei Ihnen melden. Wir freuen uns darauf, Sie in La Vallée Village willkommen zu heißen.',
  },
  ko: {
    greeting: n => `감사합니다,\n${n}.`,
    message: '도착 전에 퍼스널 쇼퍼가 연락드릴 예정입니다. La Vallée Village에서 여러분을 맞이하게 되어 기쁩니다.',
  },
  it: {
    greeting: n => `Grazie,\n${n}.`,
    message: "Il suo Personal Shopper la contatterà prima del suo arrivo. Non vediamo l'ora di darle il benvenuto a La Vallée Village.",
  },
};

const SPARKLE_OFFSETS = [
  { tx: 40, ty: 0 }, { tx: 28, ty: 28 }, { tx: 0, ty: 40 }, { tx: -28, ty: 28 },
  { tx: -40, ty: 0 }, { tx: -28, ty: -28 }, { tx: 0, ty: -40 }, { tx: 28, ty: -28 },
];

export default function PublicSurveyPage() {
  const { token } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [surveyState, setSurveyState] = useState('start');
  const [thanksData, setThanksData] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/forms/public/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setFormData(d.data);
          // Apply theme CSS variables
          const theme = d.data.theme || {};
          const root = document.documentElement;
          if (theme.primaryColor)   root.style.setProperty('--plum', theme.primaryColor);
          if (theme.accentColor)    root.style.setProperty('--gold', theme.accentColor);
          if (theme.backgroundColor) root.style.setProperty('--beige', theme.backgroundColor);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  const handleComplete = async (entry, firstName, lang, sessionId, deviceInfo) => {
    try {
      await fetch(`${API}/api/responses/session`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          formToken: token,
          data: entry,
          deviceInfo,
          completionStep: 13,
          isComplete: true,
        }),
      });
    } catch (e) {
      console.error('Failed to save response:', e);
    }
    setThanksData({ firstName, lang, nationality: entry.nationality });
    setSurveyState('thanks');
  };

  const t = (lang, en, fr, es, ar) => {
    if (lang === 'fr' && fr) return fr;
    if (lang === 'es' && es) return es;
    if (lang === 'ar' && ar) return ar;
    return en;
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: 'var(--beige)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#aaa', fontWeight: 300, fontFamily: 'var(--font-sans)',
    }}>
      Loading...
    </div>
  );

  if (notFound) return (
    <div style={{
      minHeight: '100vh', background: 'var(--beige)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--plum-dark)' }}>
        This survey is no longer available.
      </div>
      <div style={{ fontSize: 13, color: '#aaa', fontWeight: 300 }}>
        Please contact the partnerships team for a new link.
      </div>
    </div>
  );

  if (surveyState === 'thanks' && thanksData) {
    const partnerName = formData?.partner_name;
    const partnerLogoUrl = formData?.partner_logo_url;
    const natLang = NATIONALITY_LANG_MAP[thanksData.nationality] || 'en';
    const i18n = THANKS_I18N[natLang] || THANKS_I18N.en;
    const isRTL = i18n.rtl || false;
    const natFont = i18n.font;

    const bodyMessage = formData?.config?.thankYouMessage
      ? t(thanksData.lang,
          formData.config.thankYouMessage,
          formData.config.thankYouMessageFR || formData.config.thankYouMessage,
          formData.config.thankYouMessageES || formData.config.thankYouMessage,
          formData.config.thankYouMessageAR || formData.config.thankYouMessage
        )
      : i18n.message;

    return (
      <div style={{
        position: 'relative', minHeight: '100vh', width: '100%', maxWidth: '100vw',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem', boxSizing: 'border-box',
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute', inset: '-20%',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(35,59,43,0.6) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
            linear-gradient(160deg, #080f09 0%, #111e16 40%, #1a2e1e 70%, #233B2B 100%)
          `,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 60%, #000 100%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Content card */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 480, padding: '0 clamp(0px, 4vw, 2rem)', boxSizing: 'border-box' }}>
          <div
            className="thankyou-enter card-shimmer"
            style={{
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
              direction: isRTL ? 'rtl' : 'ltr',
            }}
          >
            {/* Star icon — circle stays 64×64, star text is 3× bigger */}
            <div
              className="star-icon"
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.75rem', color: 'rgba(201,168,76,0.92)',
                opacity: 0, overflow: 'visible', position: 'relative',
              }}
            >
              <span style={{ fontSize: 78, lineHeight: 1, display: 'block' }}>✦</span>
              {SPARKLE_OFFSETS.map(({ tx, ty }, i) => (
                <span
                  key={i}
                  className="sparkle"
                  style={{ '--tx': `${tx}px`, '--ty': `${ty}px`, animationDelay: `${0.65 + i * 0.06}s` }}
                />
              ))}
            </div>

            {/* Greeting in nationality language */}
            <div
              className="thanks-name"
              style={{
                fontFamily: natFont || 'var(--font-display)',
                fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 400,
                color: 'var(--beige)', marginBottom: 16, letterSpacing: '0.01em', lineHeight: 1.2,
                whiteSpace: 'pre-line',
              }}
            >
              {i18n.greeting(thanksData.firstName)}
            </div>

            {/* Body in nationality language */}
            <div
              className="thanks-msg"
              style={{
                fontFamily: natFont || 'var(--font-sans)',
                fontSize: 17, color: 'rgba(245,240,230,0.7)', lineHeight: 1.8,
                fontWeight: 300, maxWidth: 320, margin: '0 auto',
              }}
            >
              {bodyMessage}
            </div>
          </div>
        </div>

        {/* Dual logo footer */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '2.5rem', width: '100%', boxSizing: 'border-box', gap: 0 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
            <img
              src="/images/Logo lvv New.PNG"
              alt="La Vallée Village"
              style={{ height: 64, width: 'auto', maxWidth: '100%', objectFit: 'contain', opacity: 0.9 }}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <span style={{ display: 'none', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(245,240,230,0.9)', fontWeight: 400, textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
              La Vallée Village
            </span>
          </div>
          <img src="/images/xSeperator.PNG" alt="×" style={{ height: 64, width: 'auto', flexShrink: 0, opacity: 0.6 }} />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 8 }}>
            {partnerLogoUrl ? (
              <img
                src={partnerLogoUrl} alt={partnerName}
                style={{ height: 64, width: 'auto', maxWidth: '100%', objectFit: 'contain', opacity: 0.9 }}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
              />
            ) : null}
            <span style={{ display: partnerLogoUrl ? 'none' : 'block', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(245,240,230,0.9)', fontWeight: 400, textTransform: 'uppercase', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
              {partnerName}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SurveyForm
      onComplete={handleComplete}
      config={formData?.config}
      partnerName={formData?.partner_name}
      partnerLogoUrl={formData?.partner_logo_url}
      formToken={token}
    />
  );
}
