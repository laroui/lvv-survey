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
        if (d.success) setFormData(d.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  const handleComplete = (entry, firstName, lang) => {
    setThanksData({ firstName, lang });
    setSurveyState('thanks');
  };

  const t = (lang, en, fr) => lang === 'fr' ? fr : en;

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

  if (surveyState === 'thanks' && thanksData) return (
    <div style={{
      minHeight: '100vh', background: 'var(--beige)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center', padding: '0 2rem' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem', fontSize: 28,
        }}>✦</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400,
          color: 'var(--plum-dark)', marginBottom: 12, letterSpacing: '0.01em',
        }}>
          {t(thanksData.lang, `Thank you, ${thanksData.firstName}.`, `Merci, ${thanksData.firstName}.`)}
        </div>
        <div style={{ fontSize: 15, color: '#888', lineHeight: 1.8, marginBottom: 12, fontWeight: 300 }}>
          {formData?.config?.thankYouMessage
            ? t(thanksData.lang, formData.config.thankYouMessage, formData.config.thankYouMessageFR || formData.config.thankYouMessage)
            : t(thanksData.lang,
                'Your Personal Shopper will be in touch before your arrival. We look forward to welcoming you to La Vallée Village.',
                'Votre Personal Shopper vous contactera avant votre arrivée. Nous nous réjouissons de vous accueillir à La Vallée Village.'
              )
          }
        </div>
        <div style={{ fontSize: 12, fontStyle: 'italic', color: '#bbb', marginBottom: 36 }}>
          {formData?.partner_name} × La Vallée Village
        </div>
      </div>
    </div>
  );

  return <SurveyForm onComplete={handleComplete} config={formData?.config} />;
}
