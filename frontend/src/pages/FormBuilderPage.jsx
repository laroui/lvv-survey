import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AdminNav from '../components/AdminNav.jsx';
import FormContentEditor from '../components/FormContentEditor.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN = () => localStorage.getItem('lvv_token');

const DEFAULT_CONFIG = {
  hotelName: '',
  language: 'en',
  bilingualEnabled: true,
  enabledLanguages: ['en', 'fr'],
  questions: { sizing: true, brands: true, lifestyle: true, travel: true, events: true },
  thankYouMessage: 'Your Personal Shopper will be in touch before your arrival.',
  thankYouMessageFR: '',
  styles: null,
  categories: null,
  purposes: null,
  psModes: null,
  lifestyle: null,
  travel: null,
  events: null,
};

const Toggle = ({ label, checked, onChange }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px solid var(--beige-mid)',
  }}>
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

const FieldLabel = ({ label, children }) => (
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [title, setTitle] = useState('');
  const [partnerId, setPartnerId] = useState(searchParams.get('partnerId') || '');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [partners, setPartners] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState('settings'); // 'settings' | 'content'

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
  }, [id, isEdit]);

  // Auto-fill hotel name from partner's theme preset
  useEffect(() => {
    if (!partnerId || isEdit) return;
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) return;
    const preset = partner.theme_preset || {};
    if (preset.hotelName && !config.hotelName) {
      setConfig(c => ({ ...c, hotelName: preset.hotelName }));
    }
  }, [partnerId, partners, isEdit]);

  const updateQuestion = (key, val) =>
    setConfig(c => ({ ...c, questions: { ...c.questions, [key]: val } }));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSave = async () => {
    if (!title || !partnerId) return showToast('Title and partner are required');
    setSaving(true);
    try {
      const url = isEdit ? `${API}/api/forms/${id}` : `${API}/api/forms`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
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

  const customisedCount = ['styles', 'categories', 'purposes', 'psModes', 'lifestyle', 'travel', 'events']
    .filter(k => k === 'styles'
      ? (config?.styles?.female || config?.styles?.male)
      : config?.[k] != null
    ).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)' }}>
      <AdminNav active="forms" />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.75rem', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--plum-dark)', marginBottom: 2 }}>
              {isEdit ? 'Edit Form' : 'Create Form'}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', fontWeight: 300 }}>
              Configure settings and customise survey content
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '10px 18px', border: '1px solid var(--beige-mid)', borderRadius: 8,
                background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 12,
                fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 24px', border: 'none', borderRadius: 8,
                background: saving ? 'rgba(35,59,43,0.4)' : 'var(--plum)',
                color: 'var(--beige)', cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: 12, fontFamily: 'var(--font-sans)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Form'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--beige-mid)', marginBottom: 24 }}>
          {[
            { key: 'settings', label: 'Settings' },
            { key: 'content', label: `Content${customisedCount > 0 ? ` (${customisedCount} customised)` : ''}` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '10px 22px', border: 'none', borderBottom: tab === t.key ? '2px solid var(--plum)' : '2px solid transparent',
                background: 'transparent', cursor: 'pointer',
                fontSize: 12, letterSpacing: '0.07em', textTransform: 'uppercase',
                color: tab === t.key ? 'var(--plum)' : '#aaa',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            {/* Left — config */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--beige-mid)', padding: '2rem' }}>
              <FieldLabel label="Form Title">
                <input
                  style={inputStyle}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Peninsula Paris — Spring 2026"
                />
              </FieldLabel>

              <FieldLabel label="Hotel Partner">
                <select style={inputStyle} value={partnerId} onChange={e => setPartnerId(e.target.value)}>
                  <option value="">Select a partner…</option>
                  {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </FieldLabel>

              <FieldLabel label="Hotel Name (shown to guests)">
                <input
                  style={inputStyle}
                  value={config.hotelName}
                  onChange={e => setConfig(c => ({ ...c, hotelName: e.target.value }))}
                  placeholder="The Peninsula Paris"
                />
              </FieldLabel>

              <FieldLabel label="Language">
                <select
                  style={inputStyle}
                  value={config.language}
                  onChange={e => setConfig(c => ({ ...c, language: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="both">Bilingual (EN / FR)</option>
                </select>
              </FieldLabel>

              <div style={{ marginTop: '1.5rem', marginBottom: 16 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginBottom: 4 }}>
                  Optional Languages
                </div>
                <div style={{ fontSize: 11, color: '#bbb', marginBottom: 8, fontWeight: 300 }}>
                  English &amp; Français are always available.
                </div>
                {[{ code: 'es', label: 'Español (Spanish)' }, { code: 'ar', label: 'العربية (Arabic)' }].map(({ code, label }) => {
                  const langs = config.enabledLanguages || ['en', 'fr'];
                  return (
                    <Toggle
                      key={code}
                      label={label}
                      checked={langs.includes(code)}
                      onChange={on => {
                        const next = on
                          ? [...langs.filter(l => l !== code), code]
                          : langs.filter(l => l !== code);
                        setConfig(c => ({ ...c, enabledLanguages: next }));
                      }}
                    />
                  );
                })}
              </div>

              <div style={{ marginTop: '1.5rem', marginBottom: 16 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginBottom: 4 }}>
                  Optional Sections
                </div>
                <Toggle label="Sizing System" checked={config.questions.sizing} onChange={v => updateQuestion('sizing', v)} />
                <Toggle label="Favourite Brands" checked={config.questions.brands !== false} onChange={v => updateQuestion('brands', v)} />
                <Toggle label="Lifestyle" checked={config.questions.lifestyle} onChange={v => updateQuestion('lifestyle', v)} />
                <Toggle label="Upcoming Travel" checked={config.questions.travel} onChange={v => updateQuestion('travel', v)} />
                <Toggle label="Upcoming Events" checked={config.questions.events} onChange={v => updateQuestion('events', v)} />
              </div>

              <FieldLabel label="Thank You Message (EN)">
                <textarea
                  style={{ ...inputStyle, height: 72, resize: 'vertical' }}
                  value={config.thankYouMessage}
                  onChange={e => setConfig(c => ({ ...c, thankYouMessage: e.target.value }))}
                />
              </FieldLabel>

              <FieldLabel label="Thank You Message (FR)">
                <textarea
                  style={{ ...inputStyle, height: 72, resize: 'vertical' }}
                  value={config.thankYouMessageFR || ''}
                  onChange={e => setConfig(c => ({ ...c, thankYouMessageFR: e.target.value }))}
                  placeholder="Optional French version"
                />
              </FieldLabel>
            </div>

            {/* Right — preview */}
            <div style={{
              background: 'linear-gradient(160deg, var(--plum-dark), var(--plum))',
              borderRadius: 12, padding: '2rem', color: 'var(--beige)',
              alignSelf: 'start', position: 'sticky', top: 24,
            }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(245,240,230,0.45)', marginBottom: '1.5rem' }}>
                Preview
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 6, lineHeight: 1.3 }}>
                {config.hotelName || 'Hotel Name'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                × La Vallée Village
              </div>
              <div style={{ fontSize: 13, color: 'rgba(245,240,230,0.7)', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
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
              {customisedCount > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div style={{ fontSize: 10, color: 'rgba(245,240,230,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    Custom content
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(201,168,76,0.8)' }}>
                    ✦ {customisedCount} section{customisedCount !== 1 ? 's' : ''} customised
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {tab === 'content' && (
          <div>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 300, marginBottom: 20, lineHeight: 1.6 }}>
              Customise the options shown to guests in each survey step. Sections using LVV defaults inherit the standard question set. Click <strong>Customise</strong> on any section to override it for this form only.
            </div>
            <FormContentEditor
              config={config}
              onChange={setConfig}
            />
          </div>
        )}
      </div>

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
