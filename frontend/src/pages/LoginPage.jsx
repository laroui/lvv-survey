import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, var(--plum-dark) 0%, var(--plum) 60%, #6b4a5e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(245,240,230,0.04)',
        border: '1px solid rgba(201,168,76,0.18)',
        borderRadius: 16,
        padding: '3rem 2.5rem',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo area */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: 'var(--beige)',
            letterSpacing: '0.02em',
            marginBottom: 6,
            fontWeight: 400,
          }}>
            Partnership Hub
          </div>
          <div style={{
            fontSize: 11,
            color: 'rgba(201,168,76,0.8)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
          }}>
            Partnerships Team
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(245,240,230,0.55)',
              fontFamily: 'var(--font-sans)',
              marginBottom: 8,
              fontWeight: 300,
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(245,240,230,0.06)',
                border: '1px solid rgba(245,240,230,0.18)',
                borderRadius: 8,
                color: 'var(--beige)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(245,240,230,0.18)'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(245,240,230,0.55)',
              fontFamily: 'var(--font-sans)',
              marginBottom: 8,
              fontWeight: 300,
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(245,240,230,0.06)',
                border: '1px solid rgba(245,240,230,0.18)',
                borderRadius: 8,
                color: 'var(--beige)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(245,240,230,0.18)'}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '1.25rem',
              padding: '10px 14px',
              background: 'rgba(220,60,60,0.12)',
              border: '1px solid rgba(220,60,60,0.3)',
              borderRadius: 8,
              fontSize: 13,
              color: '#f5a0a0',
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? 'rgba(201,168,76,0.4)' : 'var(--gold)',
              border: 'none',
              borderRadius: 8,
              color: 'var(--plum-dark)',
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 400,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
