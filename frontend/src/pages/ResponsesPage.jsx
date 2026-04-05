import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminNav from '../components/AdminNav.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN = () => localStorage.getItem('lvv_token');
const AUTH = () => ({ Authorization: `Bearer ${TOKEN()}` });

const STYLE_OPTIONS = [
  { id: 'casual-luxury',      label: 'Casual Luxury' },
  { id: 'parisian-elegance',  label: 'Parisian Elegance' },
  { id: 'bold-colorful',      label: 'Bold & Colorful' },
  { id: 'boho-romantic',      label: 'Boho Romantic' },
  { id: 'casual',             label: 'Casual' },
  { id: 'classic',            label: 'Classic' },
  { id: 'bold',               label: 'Bold' },
  { id: 'street',             label: 'Street' },
];

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function thisWeekCount(responses) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return responses.filter(r => new Date(r.submitted_at) >= since).length;
}

function topStyle(responses) {
  const counts = {};
  for (const r of responses) {
    for (const s of r.data?.styles || []) {
      counts[s] = (counts[s] || 0) + 1;
    }
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top) return '—';
  return STYLE_OPTIONS.find(s => s.id === top[0])?.label || top[0];
}

function genderSplit(responses) {
  const female = responses.filter(r => r.data?.gender === 'Ms').length;
  const male = responses.filter(r => r.data?.gender === 'Mr').length;
  const total = female + male;
  if (!total) return '—';
  return `${Math.round((female / total) * 100)}% Ms · ${Math.round((male / total) * 100)}% Mr`;
}

// ── Detail Drawer ────────────────────────────────────────────────────────────

function DrawerRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '9px 0', borderBottom: '1px solid var(--beige-mid)', fontSize: 13,
    }}>
      <span style={{ color: '#aaa', fontWeight: 300, flex: '0 0 130px', fontSize: 12 }}>{label}</span>
      <span style={{ color: 'var(--plum-dark)', fontWeight: 400, textAlign: 'right', flex: 1 }}>{value || '—'}</span>
    </div>
  );
}

function DrawerSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
        color: '#bbb', marginBottom: 4, fontWeight: 400,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DeviceInfoPanel({ response }) {
  const [open, setOpen] = useState(false);
  const dev = response.device_info || {};
  const hasDevice = Object.keys(dev).length > 0;

  const val = (v, transform) => {
    if (v === null || v === undefined) return null;
    return transform ? transform(v) : String(v);
  };

  // Summary line shown when collapsed
  const summary = [
    dev.countryFlag,
    dev.os && dev.osVersion ? `${dev.os} ${dev.osVersion}` : dev.os,
    dev.browser && dev.browserVersion ? `${dev.browser} ${dev.browserVersion}` : dev.browser,
    dev.deviceType,
    dev.ip ? `IP: ${dev.ip}` : null,
  ].filter(Boolean).join(' · ');

  const Group = ({ emoji, title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em',
        color: '#ccc', marginBottom: 4, fontWeight: 400, display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span>{emoji}</span> {title}
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value }) => {
    if (value === null || value === undefined || value === '' || value === 'null') return null;
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '5px 0', borderBottom: '1px solid #f2eee8', fontSize: 11,
      }}>
        <span style={{ color: '#bbb', fontWeight: 300, flex: '0 0 130px' }}>{label}</span>
        <span style={{
          color: 'var(--plum-dark)', fontWeight: 400, textAlign: 'right', flex: 1,
          wordBreak: 'break-all', fontSize: 11,
        }}>{String(value)}</span>
      </div>
    );
  };

  const bool = v => (v === true || v === 'true') ? 'Yes' : (v === false || v === 'false') ? 'No' : String(v ?? '—');

  return (
    <div style={{
      border: '1px solid var(--beige-mid)', borderRadius: 10, overflow: 'hidden',
      marginBottom: 20,
    }}>
      {/* Clickable header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '10px 14px', cursor: 'pointer',
          background: open ? '#faf7f4' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'background 0.15s', userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>📡</span>
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#bbb', fontWeight: 400 }}>
              Device & Session
            </div>
            {!open && hasDevice && (
              <div style={{ fontSize: 11, color: 'var(--plum-dark)', fontWeight: 300, marginTop: 2 }}>
                {summary || 'Tap to expand'}
              </div>
            )}
          </div>
        </div>
        <span style={{
          fontSize: 10, color: '#bbb',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s', display: 'inline-block',
        }}>▼</span>
      </div>

      {/* Expanded body */}
      {open && (
        <div style={{ padding: '14px 14px 8px', background: '#faf7f4', borderTop: '1px solid var(--beige-mid)' }}>
          {!hasDevice ? (
            <div style={{ fontSize: 12, color: '#bbb', fontWeight: 300 }}>No device info captured</div>
          ) : (
            <>
              <Group emoji="📱" title="Device">
                <Row label="IP Address"   value={dev.ip} />
                <Row label="OS"           value={dev.os && dev.osVersion ? `${dev.os} ${dev.osVersion}` : dev.os} />
                <Row label="Browser"      value={dev.browser && dev.browserVersion ? `${dev.browser} ${dev.browserVersion}` : dev.browser} />
                <Row label="Device Type"  value={dev.deviceType} />
                <Row label="User Agent"   value={dev.userAgent} />
                <Row label="UA Brands"    value={dev.uaBrands} />
                <Row label="UA Platform"  value={dev.uaPlatform} />
                <Row label="UA Mobile"    value={dev.uaMobile !== null && dev.uaMobile !== undefined ? bool(dev.uaMobile) : null} />
              </Group>

              <Group emoji="🖥️" title="Screen">
                <Row label="Screen"        value={dev.screenWidth && dev.screenHeight ? `${dev.screenWidth} × ${dev.screenHeight}` : null} />
                <Row label="Avail. Screen" value={dev.screenAvailWidth && dev.screenAvailHeight ? `${dev.screenAvailWidth} × ${dev.screenAvailHeight}` : null} />
                <Row label="Viewport"      value={dev.viewportWidth && dev.viewportHeight ? `${dev.viewportWidth} × ${dev.viewportHeight}` : null} />
                <Row label="Pixel Ratio"   value={dev.devicePixelRatio} />
                <Row label="Color Depth"   value={dev.colorDepth ? `${dev.colorDepth}-bit` : null} />
                <Row label="Orientation"   value={dev.screenOrientation} />
              </Group>

              <Group emoji="🌍" title="Locale & Location">
                <Row label="Country"        value={dev.countryFlag && dev.region ? `${dev.countryFlag} ${dev.region}` : dev.region} />
                <Row label="Language"       value={dev.language} />
                <Row label="All Languages"  value={dev.languages} />
                <Row label="Timezone"       value={dev.timezone} />
                <Row label="UTC Offset"     value={dev.timezoneOffset !== null && dev.timezoneOffset !== undefined ? `UTC${dev.timezoneOffset <= 0 ? '+' : ''}${-dev.timezoneOffset / 60}h` : null} />
              </Group>

              <Group emoji="⚙️" title="Hardware">
                <Row label="Device Memory" value={dev.deviceMemoryGB ? `≈ ${dev.deviceMemoryGB} GB` : null} />
                <Row label="CPU Cores"     value={dev.cpuCores} />
                <Row label="Touch Points"  value={dev.maxTouchPoints} />
                <Row label="Touch Support" value={dev.touchSupport !== undefined ? bool(dev.touchSupport) : null} />
              </Group>

              <Group emoji="📶" title="Network">
                <Row label="Connection"  value={dev.connectionType} />
                <Row label="Downlink"    value={dev.connectionDownlink !== null && dev.connectionDownlink !== undefined ? `${dev.connectionDownlink} Mbps` : null} />
                <Row label="RTT"         value={dev.connectionRtt !== null && dev.connectionRtt !== undefined ? `${dev.connectionRtt} ms` : null} />
                <Row label="Data Saver"  value={dev.connectionSaveData !== null && dev.connectionSaveData !== undefined ? bool(dev.connectionSaveData) : null} />
              </Group>

              <Group emoji="🔒" title="Preferences & Trust">
                <Row label="Dark Mode"       value={dev.prefersDark !== null && dev.prefersDark !== undefined ? bool(dev.prefersDark) : null} />
                <Row label="Reduced Motion"  value={dev.prefersReducedMotion !== null && dev.prefersReducedMotion !== undefined ? bool(dev.prefersReducedMotion) : null} />
                <Row label="High Contrast"   value={dev.prefersContrast !== null && dev.prefersContrast !== undefined ? bool(dev.prefersContrast) : null} />
                <Row label="Cookies"         value={dev.cookiesEnabled !== undefined ? bool(dev.cookiesEnabled) : null} />
                <Row label="Do Not Track"    value={dev.doNotTrack === '1' ? 'On' : dev.doNotTrack === '0' ? 'Off' : dev.doNotTrack ?? null} />
                <Row label="Bot/WebDriver"   value={dev.isWebDriver !== undefined ? bool(dev.isWebDriver) : null} />
              </Group>

              <Group emoji="🌐" title="IP Intelligence">
                {dev.ipGeo ? (
                  <>
                    <Row label="City"       value={dev.ipGeo.city} />
                    <Row label="Region"     value={dev.ipGeo.region} />
                    <Row label="Country"    value={dev.ipGeo.country} />
                    <Row label="ISP"        value={dev.ipGeo.isp} />
                    <Row label="Org / ASN"  value={dev.ipGeo.org} />
                    <Row label="Cellular"   value={dev.ipGeo.mobile !== null && dev.ipGeo.mobile !== undefined ? bool(dev.ipGeo.mobile) : null} />
                    <Row label="VPN/Proxy"  value={dev.ipGeo.proxy !== null && dev.ipGeo.proxy !== undefined ? bool(dev.ipGeo.proxy) : null} />
                    <Row label="Datacenter" value={dev.ipGeo.hosting !== null && dev.ipGeo.hosting !== undefined ? bool(dev.ipGeo.hosting) : null} />
                    <Row label="Lat / Lon"  value={dev.ipGeo.lat && dev.ipGeo.lon ? `${dev.ipGeo.lat}, ${dev.ipGeo.lon}` : null} />
                  </>
                ) : (
                  <div style={{ fontSize: 11, color: '#ccc', fontWeight: 300, padding: '4px 0' }}>
                    Available on next submission
                  </div>
                )}
              </Group>

              <Group emoji="🔗" title="Source">
                <Row label="Referrer"     value={dev.referrer} />
                <Row label="Page URL"     value={dev.pageUrl} />
                <Row label="Collected At" value={dev.collectedAt ? new Date(dev.collectedAt).toLocaleString() : null} />
              </Group>
            </>
          )}

          {/* Session meta always shown */}
          <Group emoji="🎫" title="Session">
            <Row label="Session ID"       value={response.session_id ? `…${response.session_id.slice(-8)}` : null} />
            <Row label="Completion Step"  value={response.completion_step ?? null} />
            <Row label="Complete"         value={response.is_complete !== undefined ? bool(response.is_complete) : null} />
          </Group>
        </div>
      )}
    </div>
  );
}

function DetailDrawer({ response, onClose, onDelete }) {
  if (!response) return null;
  const d = response.data || {};
  const initials = d.initials || `${(d.firstName || '')[0] || ''}${(d.surname || '')[0] || ''}`.toUpperCase();

  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(42,26,34,0.35)',
          zIndex: 299, backdropFilter: 'blur(2px)',
        }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 460,
        background: '#fff', boxShadow: '-4px 0 40px rgba(0,0,0,0.14)',
        zIndex: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--plum-dark), var(--plum))',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(245,240,230,0.15)',
              border: '1px solid rgba(245,240,230,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--beige)',
              letterSpacing: '0.05em', flexShrink: 0,
            }}>
              {initials || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 20,
                color: 'var(--beige)', lineHeight: 1.2,
              }}>
                {d.firstName} {d.surname}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.6)', marginTop: 2, fontWeight: 300 }}>
                {d.nationality} · {fmt(response.submitted_at)}
              </div>
            </div>
            <div
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(245,240,230,0.1)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(245,240,230,0.6)', fontSize: 16, flexShrink: 0,
              }}
            >
              ×
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', flex: 1 }}>
          <DrawerSection title="Contact">
            <DrawerRow label="Email" value={d.email} />
            <DrawerRow label="Phone" value={d.phone?.full || d.phone} />
            <DrawerRow label="Gender" value={d.gender} />
          </DrawerSection>

          <DrawerSection title="Sizing">
            <DrawerRow label="System" value={d.sizingSystem} />
            <DrawerRow label="Size" value={d.sizingValue} />
          </DrawerSection>

          <DrawerSection title="Style Preferences">
            <DrawerRow label="Styles" value={(d.styles || []).map(s => STYLE_OPTIONS.find(o => o.id === s)?.label || s).join(', ')} />
            <DrawerRow label="Categories" value={(d.categories || []).join(', ')} />
            <DrawerRow label="Brands" value={(d.brands || []).filter(b => b !== 'none').join(', ')} />
          </DrawerSection>

          <DrawerSection title="Lifestyle & Events">
            <DrawerRow label="Lifestyle" value={(d.lifestyle || []).join(', ')} />
            <DrawerRow label="Travel" value={(d.travel || []).join(', ')} />
            <DrawerRow label="Events" value={(d.events || []).join(', ')} />
          </DrawerSection>

          <DrawerSection title="Visit">
            <DrawerRow label="Purpose" value={d.purpose} />
            <DrawerRow label="PS Mode" value={d.psMode} />
            <DrawerRow label="Consent" value={d.consent ? 'Yes' : 'No'} />
          </DrawerSection>

          {/* Collapsible device info */}
          <DeviceInfoPanel response={response} />
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--beige-mid)' }}>
          {confirming ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { onDelete(response.id); setConfirming(false); }}
                style={{
                  flex: 1, padding: '10px', background: '#c0392b', border: 'none',
                  borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}
              >
                Confirm delete
              </button>
              <button
                onClick={() => setConfirming(false)}
                style={{
                  flex: 1, padding: '10px', background: 'transparent',
                  border: '1px solid var(--beige-mid)', borderRadius: 8,
                  color: '#aaa', fontSize: 12, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              style={{
                width: '100%', padding: '10px', background: 'transparent',
                border: '1px solid #e0a0a0', borderRadius: 8,
                color: '#c07070', fontSize: 12, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}
            >
              Delete response
            </button>
          )}
        </div>
      </div>
    </>
  );
}



// ── Main Page ────────────────────────────────────────────────────────────────

export default function ResponsesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [forms, setForms] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const formId = searchParams.get('formId') || '';
  const filterFrom = searchParams.get('from') || '';
  const filterTo = searchParams.get('to') || '';
  const filterGender = searchParams.get('gender') || '';
  const filterStyle = searchParams.get('style') || '';

  useEffect(() => {
    fetch(`${API}/api/forms`, { headers: AUTH() })
      .then(r => r.json())
      .then(d => { if (d.success) setForms(d.data); });
  }, []);

  useEffect(() => {
    if (!formId) { setResponses([]); return; }
    setLoading(true);
    const params = new URLSearchParams({ formId, limit: 500 });
    if (filterFrom)   params.set('from', filterFrom);
    if (filterTo)     params.set('to', filterTo);
    if (filterGender) params.set('gender', filterGender);
    if (filterStyle)  params.set('style', filterStyle);

    fetch(`${API}/api/responses?${params}`, { headers: AUTH() })
      .then(r => r.json())
      .then(d => { if (d.success) setResponses(d.data); })
      .finally(() => setLoading(false));
  }, [formId, filterFrom, filterTo, filterGender, filterStyle]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchParams(formId ? { formId } : {});
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/api/responses/${id}`, { method: 'DELETE', headers: AUTH() });
    setResponses(prev => prev.filter(r => r.id !== id));
    setSelected(null);
  };

  const handleExport = (format) => {
    const params = new URLSearchParams({ formId, format });
    if (filterFrom)   params.set('from', filterFrom);
    if (filterTo)     params.set('to', filterTo);
    if (filterGender) params.set('gender', filterGender);
    if (filterStyle)  params.set('style', filterStyle);
    window.open(`${API}/api/responses/export?${params}&_token=${TOKEN()}`, '_blank');
  };

  const currentForm = forms.find(f => f.id === formId);
  const hasFilters = filterFrom || filterTo || filterGender || filterStyle;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', flexDirection: 'column' }}>
      <AdminNav active="responses" />

      <div style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '2.5rem 2rem' }}>
        {/* Page title */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--plum-dark)', marginBottom: 4 }}>
              Responses
            </div>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 300 }}>
              View and export guest survey submissions
            </div>
          </div>
          {formId && responses.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleExport('csv')}
                style={{
                  padding: '9px 18px', background: 'var(--plum)', border: 'none',
                  borderRadius: 8, color: 'var(--beige)', fontSize: 11, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', letterSpacing: '0.07em', textTransform: 'uppercase',
                }}
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                style={{
                  padding: '9px 18px', background: 'transparent',
                  border: '1px solid var(--plum)', borderRadius: 8,
                  color: 'var(--plum)', fontSize: 11, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', letterSpacing: '0.07em', textTransform: 'uppercase',
                }}
              >
                Export JSON
              </button>
            </div>
          )}
        </div>

        {/* Form selector */}
        <div style={{
          background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12,
          padding: '1.25rem 1.5rem', marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 10 }}>
            Survey Form
          </div>
          <select
            value={formId}
            onChange={e => setParam('formId', e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', border: '1px solid var(--beige-mid)',
              borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-sans)',
              color: formId ? 'var(--plum-dark)' : '#aaa',
              background: 'var(--beige)', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">Select a form to view responses…</option>
            {forms.map(f => (
              <option key={f.id} value={f.id}>
                {f.title} — {f.partner_name} ({f.response_count ?? 0} responses)
              </option>
            ))}
          </select>
        </div>

        {/* Stats + Filters — only when form selected */}
        {formId && (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Total Submissions', value: responses.length },
                { label: 'This Week', value: thisWeekCount(responses) },
                { label: 'Gender Split', value: genderSplit(responses), small: true },
                { label: 'Top Style', value: topStyle(responses), small: true },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#fff', border: '1px solid var(--beige-mid)',
                  borderRadius: 10, padding: '1rem 1.25rem',
                }}>
                  <div style={{
                    fontFamily: s.small ? 'var(--font-sans)' : 'var(--font-display)',
                    fontSize: s.small ? 15 : 28,
                    color: 'var(--plum)', fontWeight: s.small ? 400 : 400,
                    marginBottom: 4,
                  }}>
                    {loading ? '…' : s.value}
                  </div>
                  <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{
              background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12,
              padding: '1rem 1.5rem', marginBottom: 16,
              display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end',
            }}>
              <div style={{ flex: '0 0 auto' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 6 }}>From</div>
                <input
                  type="date" value={filterFrom}
                  onChange={e => setParam('from', e.target.value)}
                  style={{
                    padding: '8px 12px', border: '1px solid var(--beige-mid)', borderRadius: 7,
                    fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--beige)',
                    color: 'var(--plum-dark)', outline: 'none',
                  }}
                />
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 6 }}>To</div>
                <input
                  type="date" value={filterTo}
                  onChange={e => setParam('to', e.target.value)}
                  style={{
                    padding: '8px 12px', border: '1px solid var(--beige-mid)', borderRadius: 7,
                    fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--beige)',
                    color: 'var(--plum-dark)', outline: 'none',
                  }}
                />
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 6 }}>Gender</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['', 'Ms', 'Mr'].map(g => (
                    <button
                      key={g}
                      onClick={() => setParam('gender', g)}
                      style={{
                        padding: '7px 14px', border: '1px solid var(--beige-mid)', borderRadius: 7,
                        fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        background: filterGender === g ? 'var(--plum)' : 'var(--beige)',
                        color: filterGender === g ? 'var(--beige)' : 'var(--plum-dark)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {g || 'All'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 6 }}>Style</div>
                <select
                  value={filterStyle}
                  onChange={e => setParam('style', e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid var(--beige-mid)',
                    borderRadius: 7, fontSize: 13, fontFamily: 'var(--font-sans)',
                    background: 'var(--beige)', color: filterStyle ? 'var(--plum-dark)' : '#aaa',
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">All styles</option>
                  {STYLE_OPTIONS.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  style={{
                    padding: '8px 14px', background: 'transparent',
                    border: '1px solid var(--beige-mid)', borderRadius: 7,
                    fontSize: 11, cursor: 'pointer', color: '#aaa',
                    fontFamily: 'var(--font-sans)', letterSpacing: '0.06em',
                    textTransform: 'uppercase', alignSelf: 'flex-end',
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </>
        )}

        {/* Responses table */}
        {formId && (
          <div style={{
            background: '#fff', border: '1px solid var(--beige-mid)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{
              padding: '1rem 1.5rem', borderBottom: '1px solid var(--beige-mid)',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa' }}>
                {loading ? 'Loading…' : `${responses.length} response${responses.length !== 1 ? 's' : ''}`}
                {currentForm ? ` · ${currentForm.title}` : ''}
              </div>
            </div>

            {!loading && responses.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#bbb', fontWeight: 300, fontSize: 13 }}>
                No responses match the current filters
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
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((r, i) => {
                      const d = r.data || {};
                      return (
                        <tr
                          key={r.id}
                          onClick={() => setSelected(r)}
                          style={{
                            borderBottom: '1px solid var(--beige-mid)',
                            background: i % 2 === 0 ? '#fff' : 'rgba(245,240,230,0.4)',
                            cursor: 'pointer', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(82,56,73,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : 'rgba(245,240,230,0.4)'}
                        >
                          <td style={{ padding: '10px 14px', color: 'var(--plum-dark)', fontWeight: 400, whiteSpace: 'nowrap' }}>
                            {d.firstName} {d.surname}
                          </td>
                          <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>{d.email || '—'}</td>
                          <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>{d.phone?.full || d.phone || '—'}</td>
                          <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>{d.nationality || '—'}</td>
                          <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>
                            {d.sizingValue ? `${d.sizingValue} (${d.sizingSystem})` : '—'}
                          </td>
                          <td style={{ padding: '10px 14px', color: '#666', maxWidth: 180 }}>
                            {(d.styles || []).map(s => STYLE_OPTIONS.find(o => o.id === s)?.label || s).join(', ') || '—'}
                          </td>
                          <td style={{ padding: '10px 14px', color: '#aaa', whiteSpace: 'nowrap', fontSize: 11 }}>
                            {fmt(r.submitted_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Empty state when no form selected */}
        {!formId && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            border: '2px dashed var(--beige-mid)', borderRadius: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--plum-dark)', marginBottom: 8 }}>
              Select a survey form
            </div>
            <div style={{ fontSize: 13, color: '#aaa', fontWeight: 300 }}>
              Choose a form above to view its responses and analytics
            </div>
            {forms.length === 0 && (
              <button
                onClick={() => navigate('/forms/new')}
                style={{
                  marginTop: 20, padding: '10px 24px', background: 'var(--plum)',
                  border: 'none', borderRadius: 8, color: 'var(--beige)',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}
              >
                + Create First Form
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        response={selected}
        onClose={() => setSelected(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
