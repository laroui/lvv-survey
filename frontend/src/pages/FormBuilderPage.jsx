import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN = () => localStorage.getItem('lvv_token');

const DEFAULT_CONFIG = {
  hotelName: '',
  language: 'en',
  bilingualEnabled: true,
  questions: { sizing: true, lifestyle: true, travel: true, events: true },
  thankYouMessage: 'Your Personal Shopper will be in touch before your arrival.',
};

const Toggle = ({ label, checked, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--beige-mid)' }}>
    <span style={{ fontSize: 13, color: 'var(--plum-dark)', fontWeight: 300 }}>{label}</span>
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11, cursor: 'pointer', transition: 'background 0.2s',
        background: checked ? 'var(--plum)' : '#ddd', position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
      }} />
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{
      display: 'block', fontSize: 10, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: '#999', marginBottom: 7,
    }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid var(--beige-mid)',
  borderRadius: 8, fontFamily: 'var(--font-sans)', fontSize: 13,
  background: '#fff', color: 'var(--plum-dark)', outline: 'none', boxSizing: 'border-box',
};

export default function FormBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [title, setTitle] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [partners, setPartners] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/partners`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
      .then(r => r.json()).then(d => { if (d.success) setPartners(d.data); });

    if (isEdit) {
      fetch(`${API}/api/forms/${id}`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
        .then(r => r.json()).then(d => {
          if (d.success) {
            setTitle(d.data.title);
            setPartnerId(d.data.partner_id);
            setConfig({ ...DEFAULT_CONFIG, ...d.data.config });
          }
        });
    }
  }, [id]);

  const updateQuestion = (key, val) =>
    setConfig(c => ({ ...c, questions: { ...c.questions, [key]: val } }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!title || !partnerId) return showToast('Title and partner are required');
    setSaving(true);
    try {
      const url = isEdit ? `${API}/api/forms/${id}` : `${API}/api/forms`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, partnerId, config }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? 'Form updated' : 'Form created');
        setTimeout(() => navigate(isEdit ? `/forms/${id}` : `/forms/${data.data.id}`), 800);
      } else {
        showToast(data.error || 'Save failed');
      }
    } finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)' }}>
      {/* NAV */}
      <nav style={{
        background: 'linear-gradient(135deg, var(--plum-dark) 0%, var(--plum) 100%)',
        display: 'flex', alignItems: 'center', padding: '0 2rem', height: 56, flexShrink: 0,
      }}>
        <div
          onClick={() => navigate('/dashboard')}
          style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--beige)', cursor: 'pointer', letterSpacing: '0.02em' }}
        >
          La Vallée Village
        </div>
        <span style={{ color: 'rgba(245,240,230,0.35)', margin: '0 12px' }}>/</span>
        <span style={{ fontSize: 13, color: 'rgba(245,240,230,0.7)', fontWeight: 300 }}>
          {isEdit ? 'Edit Form' : 'New Form'}
        </span>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>

        {/* LEFT — Config */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--beige-mid)', padding: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--plum-dark)', marginBottom: '1.75rem' }}>
            {isEdit ? 'Edit Form' : 'Create Form'}
          </div>

          <Field label="Form Title">
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Peninsula Paris — Spring 2026" />
          </Field>

          <Field label="Hotel Partner">
            <select style={inputStyle} value={partnerId} onChange={e => setPartnerId(e.target.value)}>
              <option value="">Select a partner...</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>

          <Field label="Hotel Name (shown to guests)">
            <input style={inputStyle} value={config.hotelName} onChange={e => setConfig(c => ({ ...c, hotelName: e.target.value }))} placeholder="The Peninsula Paris" />
          </Field>

          <Field label="Language">
            <select style={inputStyle} value={config.language} onChange={e => setConfig(c => ({ ...c, language: e.target.value }))}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="both">Bilingual (EN / FR)</option>
            </select>
          </Field>

          <div style={{ marginTop: '1.5rem', marginBottom: 8 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginBottom: 4 }}>
              Optional Sections
            </div>
            <Toggle label="Sizing System" checked={config.questions.sizing} onChange={v => updateQuestion('sizing', v)} />
            <Toggle label="Lifestyle" checked={config.questions.lifestyle} onChange={v => updateQuestion('lifestyle', v)} />
            <Toggle label="Upcoming Travel" checked={config.questions.travel} onChange={v => updateQuestion('travel', v)} />
            <Toggle label="Upcoming Events" checked={config.questions.events} onChange={v => updateQuestion('events', v)} />
          </div>

          <Field label="Thank You Message">
            <textarea
              style={{ ...inputStyle, height: 80, resize: 'vertical' }}
              value={config.thankYouMessage}
              onChange={e => setConfig(c => ({ ...c, thankYouMessage: e.target.value }))}
            />
          </Field>

          <div style={{ display: 'flex', gap: 10, marginTop: '1rem' }}>
            <button onClick={() => navigate('/dashboard')} style={{
              flex: 1, padding: '11px', border: '1px solid var(--beige-mid)', borderRadius: 8,
              background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 12,
              fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{
              flex: 2, padding: '11px', border: 'none', borderRadius: 8,
              background: saving ? 'rgba(82,56,73,0.4)' : 'var(--plum)',
              color: 'var(--beige)', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: 12, fontFamily: 'var(--font-sans)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Form'}
            </button>
          </div>
        </div>

        {/* RIGHT — Preview */}
        <div style={{ background: 'linear-gradient(160deg, var(--plum-dark), var(--plum))', borderRadius: 12, padding: '2rem', color: 'var(--beige)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(245,240,230,0.45)', marginBottom: '1.5rem' }}>
            Preview
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 8, lineHeight: 1.3 }}>
            {config.hotelName || 'Hotel Name'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(201,168,76,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            × La Vallée Village
          </div>
          <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.7)', lineHeight: 1.8, fontWeight: 300, marginBottom: '2rem' }}>
            {title || 'Form title will appear here'}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <div style={{ fontSize: 10, color: 'rgba(245,240,230,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Sections enabled
            </div>
            {Object.entries(config.questions).filter(([, v]) => v).map(([k]) => (
              <div key={k} style={{ fontSize: 12, color: 'rgba(201,168,76,0.8)', marginBottom: 4 }}>
                ✦ {k.charAt(0).toUpperCase() + k.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--plum-dark)', color: 'var(--beige)', padding: '12px 24px',
          borderRadius: 8, fontSize: 13, fontWeight: 300, zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
