import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from '../components/FormCard.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() { return localStorage.getItem('lvv_token'); }

export default function DashboardPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = getToken();
  const user = (() => {
    try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
  })();

  useEffect(() => {
    fetch(`${API}/api/forms`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setForms(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lvv_token');
    navigate('/login');
  };

  const activeForms = forms.filter(f => f.is_active);
  const totalResponses = forms.reduce((sum, f) => sum + Number(f.response_count ?? 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', flexDirection: 'column' }}>
      {/* NAV */}
      <nav style={{
        background: 'linear-gradient(135deg, var(--plum-dark) 0%, var(--plum) 100%)',
        display: 'flex', alignItems: 'center', padding: '0 2rem',
        height: 56, flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 16,
          color: 'var(--beige)', marginRight: 'auto', letterSpacing: '0.02em',
        }}>
          La Vallée Village
        </div>
        <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.6)', marginRight: 20, fontWeight: 300 }}>
          {user?.email}
        </div>
        <div
          onClick={handleLogout}
          style={{
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
            cursor: 'pointer', color: 'rgba(245,240,230,0.45)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,240,230,0.8)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,230,0.45)'}
        >
          Sign out
        </div>
      </nav>

      <div style={{ flex: 1, padding: '2.5rem 2rem', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--plum-dark)', marginBottom: 4 }}>
              Partnership Hub
            </div>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 300 }}>
              Manage your guest survey forms
            </div>
          </div>
          <button
            onClick={() => navigate('/forms/new')}
            style={{
              marginLeft: 'auto', padding: '10px 22px',
              background: 'var(--plum)', border: 'none', borderRadius: 8,
              color: 'var(--beige)', fontFamily: 'var(--font-sans)',
              fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--plum-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--plum)'}
          >
            + New Form
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: '2rem' }}>
          {[
            { label: 'Total Forms', value: forms.length },
            { label: 'Active Forms', value: activeForms.length },
            { label: 'Total Responses', value: totalResponses },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff', border: '1px solid var(--beige-mid)',
              borderRadius: 10, padding: '1rem 1.5rem', flex: 1,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--plum)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Forms grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa', fontWeight: 300 }}>
            Loading forms...
          </div>
        ) : forms.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            border: '2px dashed var(--beige-mid)', borderRadius: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--plum-dark)', marginBottom: 8 }}>
              No forms yet
            </div>
            <div style={{ fontSize: 13, color: '#aaa', marginBottom: 20, fontWeight: 300 }}>
              Create your first survey form for a hotel partner
            </div>
            <button
              onClick={() => navigate('/forms/new')}
              style={{
                padding: '10px 24px', background: 'var(--plum)', border: 'none',
                borderRadius: 8, color: 'var(--beige)', fontSize: 12,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}
            >
              + New Form
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {forms.map(form => <FormCard key={form.id} form={form} />)}
          </div>
        )}
      </div>
    </div>
  );
}
