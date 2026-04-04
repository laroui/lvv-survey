import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Forms', key: 'forms', path: '/dashboard' },
  { label: 'Responses', key: 'responses', path: '/responses' },
  { label: 'Partners', key: 'partners', path: '/partners' },
];

function getUser() {
  try {
    const token = localStorage.getItem('lvv_token');
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
}

export default function AdminNav({ active }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem('lvv_token');
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, var(--plum-dark) 0%, var(--plum) 100%)',
      display: 'flex', alignItems: 'center', padding: '0 2rem',
      height: 56, flexShrink: 0,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          fontFamily: 'var(--font-display)', fontSize: 16,
          color: 'var(--beige)', letterSpacing: '0.02em',
          cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        La Vallée Village
      </div>

      <div style={{ display: 'flex', gap: 2, marginLeft: 32 }}>
        {NAV_ITEMS.map(item => (
          <div
            key={item.key}
            onClick={() => navigate(item.path)}
            style={{
              padding: '6px 16px', borderRadius: 6, cursor: 'pointer',
              fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.2s',
              background: active === item.key ? 'rgba(245,240,230,0.15)' : 'transparent',
              color: active === item.key ? 'var(--beige)' : 'rgba(245,240,230,0.5)',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => {
              if (active !== item.key) e.currentTarget.style.color = 'rgba(245,240,230,0.8)';
            }}
            onMouseLeave={e => {
              if (active !== item.key) e.currentTarget.style.color = 'rgba(245,240,230,0.5)';
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 20 }}>
        {user?.email && (
          <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.5)', fontWeight: 300 }}>
            {user.email}
          </div>
        )}
        <div
          onClick={handleLogout}
          style={{
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
            cursor: 'pointer', color: 'rgba(245,240,230,0.45)',
            transition: 'color 0.2s', fontFamily: 'var(--font-sans)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,240,230,0.8)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,230,0.45)'}
        >
          Sign out
        </div>
      </div>
    </nav>
  );
}
