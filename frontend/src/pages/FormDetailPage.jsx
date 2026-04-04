import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QRCode from 'qrcode';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN = () => localStorage.getItem('lvv_token');

const CSV_COLS = [
  { key: d => `${d.firstName || ''} ${d.surname || ''}`.trim(), label: 'Full Name' },
  { key: d => d.initials || '',        label: 'Initials' },
  { key: d => d.email || '',           label: 'Email' },
  { key: d => d.phone?.full || d.phone || '', label: 'Phone' },
  { key: d => d.gender || '',          label: 'Civility' },
  { key: d => d.nationality || '',     label: 'Nationality' },
  { key: d => d.sizingSystem || '',    label: 'Sizing System' },
  { key: d => d.sizingValue || '',     label: 'Size' },
  { key: d => d.purpose || '',         label: 'Purpose' },
  { key: d => d.psMode || '',          label: 'PS Mode' },
  { key: d => (d.styles || []).join(', '), label: 'Styles' },
  { key: d => (d.categories || []).join(', '), label: 'Categories' },
  { key: d => (d.brands || []).filter(b => b !== 'none').join(', '), label: 'Brands' },
  { key: d => (d.lifestyle || []).join(', '), label: 'Lifestyle' },
  { key: d => (d.travel || []).join(', '),    label: 'Travel' },
  { key: d => (d.events || []).join(', '),    label: 'Events' },
  { key: d => d.consent ? 'Yes' : 'No',      label: 'Consent' },
  { key: d => d.submittedAt || '',            label: 'Submitted At' },
];

function exportCSV(responses, formTitle) {
  const header = CSV_COLS.map(c => `"${c.label}"`).join(',');
  const rows = responses.map(r => {
    const d = r.data || {};
    return CSV_COLS.map(c => `"${String(c.key(d)).replace(/"/g, '""')}"`).join(',');
  });
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${formTitle.replace(/\s+/g, '_')}_responses.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FormDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const qrRef = useRef(null);

  const publicUrl = form ? `${window.location.origin}/f/${form.public_url_token}` : '';

  useEffect(() => {
    fetch(`${API}/api/forms/${id}`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setForm(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch(`${API}/api/responses?formId=${id}&limit=200`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setResponses(d.data); });
  }, [id]);

  useEffect(() => {
    if (form && qrRef.current) {
      QRCode.toCanvas(qrRef.current, publicUrl, { width: 160, margin: 1, color: { dark: '#523849', light: '#F5F0E6' } });
    }
  }, [form, publicUrl]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const copyUrl = () => { navigator.clipboard.writeText(publicUrl); showToast('URL copied!'); };

  const handleDelete = async () => {
    if (!confirm('Deactivate this form? Guests will no longer be able to access it.')) return;
    await fetch(`${API}/api/forms/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${TOKEN()}` } });
    showToast('Form deactivated');
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontWeight: 300 }}>
      Loading...
    </div>
  );

  if (!form) return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--plum-dark)', marginBottom: 12 }}>Form not found</div>
        <button onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: 'var(--plum)', background: 'none', border: 'none', fontSize: 13 }}>← Back to dashboard</button>
      </div>
    </div>
  );

  const embedCode = `<iframe src="${publicUrl}" width="100%" height="800" frameborder="0" style="border-radius:12px;"></iframe>`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)' }}>
      {/* NAV */}
      <nav style={{
        background: 'linear-gradient(135deg, var(--plum-dark) 0%, var(--plum) 100%)',
        display: 'flex', alignItems: 'center', padding: '0 2rem', height: 56,
      }}>
        <div onClick={() => navigate('/dashboard')} style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--beige)', cursor: 'pointer', letterSpacing: '0.02em' }}>
          La Vallée Village
        </div>
        <span style={{ color: 'rgba(245,240,230,0.35)', margin: '0 12px' }}>/</span>
        <span style={{ fontSize: 13, color: 'rgba(245,240,230,0.7)', fontWeight: 300 }}>{form.title}</span>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--plum-dark)', marginBottom: 4 }}>
              {form.title}
            </div>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 300 }}>{form.partner_name}</div>
          </div>
          <span style={{
            padding: '4px 14px', borderRadius: 20, fontSize: 11,
            background: form.is_active ? 'rgba(82,56,73,0.08)' : 'rgba(0,0,0,0.05)',
            color: form.is_active ? 'var(--plum)' : '#aaa',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {form.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Stats */}
            <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 12 }}>Stats</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--plum)' }}>
                {form.response_count ?? 0}
              </div>
              <div style={{ fontSize: 12, color: '#aaa' }}>Responses collected</div>
            </div>

            {/* Public URL */}
            <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 12 }}>
                Public Survey URL
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{
                  flex: 1, padding: '10px 12px', background: 'var(--beige)', border: '1px solid var(--beige-mid)',
                  borderRadius: 8, fontSize: 12, color: 'var(--plum-mid)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {publicUrl}
                </div>
                <button onClick={copyUrl} style={{
                  padding: '10px 16px', background: 'var(--plum)', border: 'none',
                  borderRadius: 8, color: 'var(--beige)', fontSize: 12, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
                }}>
                  Copy
                </button>
              </div>
            </div>

            {/* Embed */}
            <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 12 }}>
                Embed Code
              </div>
              <textarea
                readOnly value={embedCode}
                onClick={e => { e.target.select(); navigator.clipboard.writeText(embedCode); showToast('Embed code copied!'); }}
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid var(--beige-mid)',
                  borderRadius: 8, fontSize: 11, fontFamily: 'monospace', resize: 'none',
                  background: 'var(--beige)', color: '#666', cursor: 'copy', height: 72, boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate(`/forms/${id}/edit`)} style={{
                flex: 1, padding: '11px', background: 'var(--plum)', border: 'none',
                borderRadius: 8, color: 'var(--beige)', fontSize: 12, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                Edit Form
              </button>
              <button onClick={handleDelete} style={{
                flex: 1, padding: '11px', background: 'transparent',
                border: '1px solid #e0a0a0', borderRadius: 8,
                color: '#c07070', fontSize: 12, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                Deactivate
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa' }}>QR Code</div>
            <canvas ref={qrRef} style={{ borderRadius: 8 }} />
            <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center', fontWeight: 300 }}>
              Scan to open survey
            </div>
          </div>
        </div>

        {/* Responses table */}
        <div style={{ marginTop: 28, background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--beige-mid)' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', flex: 1 }}>
              Responses ({responses.length})
            </div>
            {responses.length > 0 && (
              <button
                onClick={() => exportCSV(responses, form.title)}
                style={{
                  padding: '7px 16px', background: 'var(--plum)', border: 'none',
                  borderRadius: 7, color: 'var(--beige)', fontSize: 11, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', letterSpacing: '0.07em', textTransform: 'uppercase',
                }}
              >
                Export CSV
              </button>
            )}
          </div>

          {responses.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#bbb', fontWeight: 300, fontSize: 13 }}>
              No responses yet
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'var(--beige)' }}>
                    {['Name', 'Email', 'Phone', 'Nationality', 'Size', 'Styles', 'Submitted'].map(h => (
                      <th key={h} style={{
                        padding: '10px 14px', textAlign: 'left', fontWeight: 400,
                        color: '#aaa', fontSize: 10, textTransform: 'uppercase',
                        letterSpacing: '0.08em', whiteSpace: 'nowrap',
                        borderBottom: '1px solid var(--beige-mid)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r, i) => {
                    const d = r.data || {};
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--beige-mid)', background: i % 2 === 0 ? '#fff' : 'rgba(245,240,230,0.4)' }}>
                        <td style={{ padding: '10px 14px', color: 'var(--plum-dark)', fontWeight: 400, whiteSpace: 'nowrap' }}>
                          {d.firstName} {d.surname}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>{d.email || '—'}</td>
                        <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>{d.phone?.full || d.phone || '—'}</td>
                        <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>{d.nationality || '—'}</td>
                        <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>
                          {d.sizingValue ? `${d.sizingValue} (${d.sizingSystem})` : '—'}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#666' }}>
                          {(d.styles || []).join(', ') || '—'}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#aaa', whiteSpace: 'nowrap', fontSize: 11 }}>
                          {new Date(r.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
