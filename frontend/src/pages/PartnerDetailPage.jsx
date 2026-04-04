import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNav from '../components/AdminNav.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const AUTH = () => ({ Authorization: `Bearer ${localStorage.getItem('lvv_token')}` });

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PartnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/partners/${id}`, { headers: AUTH() })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setData(d.data);
          setEditForm({
            name: d.data.name || '',
            description: d.data.description || '',
            website: d.data.website || '',
            contactEmail: d.data.contact_email || '',
            logoUrl: d.data.logo_url || '',
            themePreset: d.data.theme_preset || {},
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`${API}/api/partners/${id}`, {
      method: 'PUT',
      headers: { ...AUTH(), 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    const d = await res.json();
    setSaving(false);
    if (d.success) {
      setData(prev => ({ ...prev, ...d.data }));
      setEditing(false);
      showToast('Partner saved');
    }
  };

  const setTheme = (k, v) => setEditForm(prev => ({
    ...prev, themePreset: { ...prev.themePreset, [k]: v },
  }));

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', flexDirection: 'column' }}>
      <AdminNav active="partners" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontWeight: 300 }}>
        Loading…
      </div>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', flexDirection: 'column' }}>
      <AdminNav active="partners" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--plum-dark)' }}>Partner not found</div>
        <button onClick={() => navigate('/partners')} style={{ color: 'var(--plum)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
          ← Back to partners
        </button>
      </div>
    </div>
  );

  const theme = data.theme_preset || {};
  const initials = data.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const activeForms = (data.forms || []).filter(f => f.is_active);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', flexDirection: 'column' }}>
      <AdminNav active="partners" />

      <div style={{ flex: 1, maxWidth: 900, margin: '0 auto', width: '100%', padding: '2.5rem 2rem' }}>
        {/* Back link */}
        <button
          onClick={() => navigate('/partners')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#aaa', fontSize: 12, marginBottom: '1.5rem',
            fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}
        >
          ← Partners
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem', gap: 20 }}>
          {data.logo_url ? (
            <img
              src={data.logo_url} alt={data.name}
              style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'contain', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: 12, flexShrink: 0,
              background: theme.primaryColor || 'var(--plum)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 22,
              color: theme.backgroundColor || 'var(--beige)',
            }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--plum-dark)', marginBottom: 4 }}>
              {data.name}
            </div>
            {data.description && (
              <div style={{ fontSize: 13, color: '#888', fontWeight: 300 }}>{data.description}</div>
            )}
          </div>
          <button
            onClick={() => setEditing(e => !e)}
            style={{
              padding: '9px 18px', background: editing ? 'var(--beige)' : 'var(--plum)',
              border: editing ? '1px solid var(--beige-mid)' : 'none',
              borderRadius: 8, color: editing ? '#aaa' : 'var(--beige)',
              fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Stats */}
            <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 16 }}>Stats</div>
              <div style={{ display: 'flex', gap: 24 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--plum)' }}>
                    {data.form_count ?? 0}
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>Total forms</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--plum)' }}>
                    {activeForms.length}
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>Active forms</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--plum)' }}>
                    {data.response_count ?? 0}
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>Total responses</div>
                </div>
              </div>
            </div>

            {/* Edit form */}
            {editing && (
              <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 16 }}>
                  Edit Partner Info
                </div>

                {[
                  { label: 'Name', key: 'name' },
                  { label: 'Description', key: 'description' },
                  { label: 'Website', key: 'website' },
                  { label: 'Contact Email', key: 'contactEmail' },
                  { label: 'Logo URL', key: 'logoUrl' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 5 }}>
                      {f.label}
                    </label>
                    <input
                      value={editForm[f.key] || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '9px 12px', border: '1px solid var(--beige-mid)',
                        borderRadius: 7, fontSize: 13, fontFamily: 'var(--font-sans)',
                        color: 'var(--plum-dark)', background: 'var(--beige)', outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 10 }}>
                    Theme Preset
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { label: 'Primary', key: 'primaryColor' },
                      { label: 'Accent', key: 'accentColor' },
                      { label: 'Background', key: 'backgroundColor' },
                    ].map(c => (
                      <div key={c.key} style={{ flex: 1, textAlign: 'center' }}>
                        <input
                          type="color"
                          value={editForm.themePreset?.[c.key] || '#000000'}
                          onChange={e => setTheme(c.key, e.target.value)}
                          style={{ width: '100%', height: 32, border: 'none', cursor: 'pointer', borderRadius: 5 }}
                        />
                        <div style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>{c.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%', padding: '10px', background: 'var(--plum)', border: 'none',
                    borderRadius: 8, color: 'var(--beige)', fontSize: 12, cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Forms list */}
            <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{
                padding: '1rem 1.5rem', borderBottom: '1px solid var(--beige-mid)',
                display: 'flex', alignItems: 'center',
              }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', flex: 1 }}>
                  Survey Forms ({(data.forms || []).length})
                </div>
                <button
                  onClick={() => navigate(`/forms/new?partnerId=${id}`)}
                  style={{
                    padding: '6px 14px', background: 'var(--plum)', border: 'none',
                    borderRadius: 6, color: 'var(--beige)', fontSize: 11, cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}
                >
                  + New Form
                </button>
              </div>

              {(data.forms || []).length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#bbb', fontWeight: 300, fontSize: 13 }}>
                  No forms yet
                </div>
              ) : (
                (data.forms || []).map(f => (
                  <div
                    key={f.id}
                    onClick={() => navigate(`/forms/${f.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '12px 1.5rem',
                      borderBottom: '1px solid var(--beige-mid)', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,240,230,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: 'var(--plum-dark)', fontWeight: 400 }}>{f.title}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>Created {fmt(f.created_at)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 12, color: '#aaa' }}>{f.response_count ?? 0} responses</div>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        background: f.is_active ? 'rgba(82,56,73,0.08)' : 'rgba(0,0,0,0.05)',
                        color: f.is_active ? 'var(--plum)' : '#aaa',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {f.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Contact */}
            <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 12 }}>
                Contact
              </div>
              {data.contact_email && (
                <div style={{ fontSize: 12, color: 'var(--plum-dark)', marginBottom: 8, wordBreak: 'break-all' }}>
                  {data.contact_email}
                </div>
              )}
              {data.website && (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--plum)', textDecoration: 'none', display: 'block' }}
                >
                  {data.website.replace(/^https?:\/\//, '')} ↗
                </a>
              )}
              {!data.contact_email && !data.website && (
                <div style={{ fontSize: 12, color: '#bbb', fontWeight: 300 }}>No contact info</div>
              )}
            </div>

            {/* Theme preview */}
            <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 12 }}>
                Theme Preset
              </div>
              {[
                { label: 'Primary', val: theme.primaryColor || '#523849' },
                { label: 'Accent', val: theme.accentColor || '#C9A84C' },
                { label: 'Background', val: theme.backgroundColor || '#F5F0E6' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: c.val, flexShrink: 0, border: '1px solid rgba(0,0,0,0.08)' }} />
                  <div style={{ fontSize: 12, color: '#aaa', flex: 1 }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--plum-dark)', fontFamily: 'monospace' }}>{c.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
