import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const AUTH = () => ({ Authorization: `Bearer ${localStorage.getItem('lvv_token')}` });

const DEFAULT_THEME = { primaryColor: '#233B2B', accentColor: '#C9A84C', backgroundColor: '#F5F0E6' };

function PartnerModal({ partner, onClose, onSave }) {
  const editing = !!partner?.id;
  const [form, setForm] = useState({
    name: partner?.name || '',
    description: partner?.description || '',
    website: partner?.website || '',
    contactEmail: partner?.contact_email || '',
    logoUrl: partner?.logo_url || '',
    themePreset: { ...DEFAULT_THEME, ...(partner?.theme_preset || {}) },
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const setTheme = (k, v) => setForm(prev => ({ ...prev, themePreset: { ...prev.themePreset, [k]: v } }));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const url = editing ? `${API}/api/partners/${partner.id}` : `${API}/api/partners`;
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { ...AUTH(), 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) onSave(data.data);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(17,30,22,0.4)', zIndex: 299, backdropFilter: 'blur(2px)' }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff', borderRadius: 16, padding: '2rem',
        width: 520, maxHeight: '90vh', overflowY: 'auto',
        zIndex: 300, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 22,
          color: 'var(--plum-dark)', marginBottom: '1.5rem',
        }}>
          {editing ? 'Edit Partner' : 'New Partner'}
        </div>

        {/* Fields */}
        {[
          { label: 'Hotel / Partner Name *', key: 'name', placeholder: 'e.g. The Peninsula Paris' },
          { label: 'Description', key: 'description', placeholder: '5-star luxury hotel, Avenue Kléber, Paris 16e' },
          { label: 'Website', key: 'website', placeholder: 'https://www.peninsula.com/paris' },
          { label: 'Contact Email', key: 'contactEmail', placeholder: 'concierge@hotel.com' },
          { label: 'Logo URL', key: 'logoUrl', placeholder: 'https://…/logo.png' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{
              display: 'block', fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: '#aaa', marginBottom: 6,
            }}>
              {f.label}
            </label>
            <input
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={{
                width: '100%', padding: '10px 14px', border: '1px solid var(--beige-mid)',
                borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-sans)',
                color: 'var(--plum-dark)', background: 'var(--beige)', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        {/* Theme preset */}
        <div style={{ marginBottom: 20 }}>
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
                  value={form.themePreset[c.key] || '#000000'}
                  onChange={e => setTheme(c.key, e.target.value)}
                  style={{ width: '100%', height: 36, border: 'none', cursor: 'pointer', borderRadius: 6 }}
                />
                <div style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            style={{
              flex: 1, padding: '11px', background: 'var(--plum)', border: 'none',
              borderRadius: 8, color: 'var(--beige)', fontSize: 12, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
              opacity: saving || !form.name.trim() ? 0.5 : 1,
            }}
          >
            {saving ? 'Saving…' : (editing ? 'Save Changes' : 'Create Partner')}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px', background: 'transparent',
              border: '1px solid var(--beige-mid)', borderRadius: 8,
              color: '#aaa', fontSize: 12, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

function PartnerCard({ partner, onClick }) {
  const initials = partner.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const theme = partner.theme_preset || {};

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12,
        padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--plum)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(35,59,43,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--beige-mid)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            background: theme.primaryColor || 'var(--plum)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 16,
            color: theme.backgroundColor || 'var(--beige)',
          }}>
            {initials}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 16,
            color: 'var(--plum-dark)', marginBottom: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {partner.name}
          </div>
          {partner.description && (
            <div style={{
              fontSize: 12, color: '#aaa', fontWeight: 300,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {partner.description}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, borderTop: '1px solid var(--beige-mid)', paddingTop: 12 }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--plum)' }}>
            {partner.form_count ?? 0}
          </div>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Forms</div>
        </div>
        <div style={{ width: 1, background: 'var(--beige-mid)' }} />
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--plum)' }}>
            {partner.response_count ?? 0}
          </div>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Responses</div>
        </div>
        {partner.website && (
          <div style={{ width: 1, background: 'var(--beige-mid)' }} />
        )}
        {partner.website && (
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--plum)', fontWeight: 300 }}>
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Website ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PartnersPage() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { partner } | { partner: null } for new

  useEffect(() => {
    fetch(`${API}/api/partners`, { headers: AUTH() })
      .then(r => r.json())
      .then(d => { if (d.success) setPartners(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (saved) => {
    setPartners(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...prev[idx], ...saved };
        return next;
      }
      return [...prev, saved];
    });
    setModal(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', flexDirection: 'column' }}>
      <AdminNav active="partners" />

      <div style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--plum-dark)', marginBottom: 4 }}>
              Partners
            </div>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 300 }}>
              Hotel partners and their branding profiles
            </div>
          </div>
          <button
            onClick={() => setModal({ partner: null })}
            style={{
              marginLeft: 'auto', padding: '10px 22px', background: 'var(--plum)',
              border: 'none', borderRadius: 8, color: 'var(--beige)',
              fontFamily: 'var(--font-sans)', fontSize: 12, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            + Add Partner
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa', fontWeight: 300 }}>
            Loading partners…
          </div>
        ) : partners.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            border: '2px dashed var(--beige-mid)', borderRadius: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--plum-dark)', marginBottom: 8 }}>
              No partners yet
            </div>
            <div style={{ fontSize: 13, color: '#aaa', marginBottom: 20, fontWeight: 300 }}>
              Add your first hotel partner to start creating survey forms
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {partners.map(p => (
              <PartnerCard
                key={p.id}
                partner={p}
                onClick={() => navigate(`/partners/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <PartnerModal
          partner={modal.partner}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
