import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SurveyForm from '../SurveyForm.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    setThanksData({ firstName, lang });
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
    return (
      <div style={{
        position: 'relative', minHeight: '100vh', width: '100%', maxWidth: '100vw',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem', boxSizing: 'border-box',
      }}>
        {/* Background — same as start screen */}
        <div style={{
          position: 'absolute', inset: '-20%',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(35,59,43,0.6) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
            linear-gradient(160deg, #080f09 0%, #111e16 40%, #1a2e1e 70%, #233B2B 100%)
          `,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '30%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 60%, #000 100%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Content card */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 480, padding: '0 clamp(0px, 4vw, 2rem)', boxSizing: 'border-box' }}>
          <div className="thankyou-enter" style={{
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
            <div className="star-icon" style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.75rem', fontSize: 26, color: 'rgba(201,168,76,0.9)',
              opacity: 0,
            }}>✦</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 400,
              color: 'var(--beige)', marginBottom: 16, letterSpacing: '0.01em', lineHeight: 1.2,
            }}>
              {t(thanksData.lang,
                `Thank you,\n${thanksData.firstName}.`,
                `Merci,\n${thanksData.firstName}.`,
                `Gracias,\n${thanksData.firstName}.`,
                `شكراً لك،\n${thanksData.firstName}.`
              )}
            </div>
            <div style={{ fontSize: 15, color: 'rgba(245,240,230,0.7)', lineHeight: 1.8, marginBottom: 0, fontWeight: 300, maxWidth: 320, margin: '0 auto' }}>
              {formData?.config?.thankYouMessage
                ? t(thanksData.lang,
                    formData.config.thankYouMessage,
                    formData.config.thankYouMessageFR || formData.config.thankYouMessage,
                    formData.config.thankYouMessageES || formData.config.thankYouMessage,
                    formData.config.thankYouMessageAR || formData.config.thankYouMessage
                  )
                : t(thanksData.lang,
                    'Your Personal Shopper will be in touch before your arrival. We look forward to welcoming you to La Vallée Village.',
                    'Votre Personal Shopper vous contactera avant votre arrivée. Nous nous réjouissons de vous accueillir à La Vallée Village.',
                    'Su Personal Shopper se pondrá en contacto antes de su llegada. Estamos deseando darle la bienvenida a La Vallée Village.',
                    'سيتواصل معك المتسوق الشخصي قبل وصولك. نتطلع إلى الترحيب بك في لا فاليه فيلاج.'
                  )
              }
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
