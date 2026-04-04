import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SurveyForm from './SurveyForm';
import ResponsesPage from './ResponsesPage';
import SettingsPage from './SettingsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const STORAGE_KEY = 'lvv_responses_v2';
const TOKEN_KEY = 'lvv_token';

function loadResponses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveResponses(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const t = (lang, en, fr) => lang === 'fr' ? fr : en;

function Dashboard() {
  const [page, setPage] = useState('survey');
  const [responses, setResponses] = useState(loadResponses);
  const [surveyState, setSurveyState] = useState('start');
  const [thanksData, setThanksData] = useState(null);

  const handleComplete = (entry, firstName, lang) => {
    const updated = [...responses, entry];
    setResponses(updated);
    saveResponses(updated);
    setThanksData({ firstName, lang });
    setSurveyState('thanks');
  };

  const handleDelete = (id) => {
    const updated = responses.filter(r => r.id !== id);
    setResponses(updated);
    saveResponses(updated);
  };

  const handleNewResponse = () => {
    setSurveyState('start');
    setThanksData(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  };

  const navItems = [
    { id: 'survey', label: 'Survey' },
    { id: 'responses', label: 'Responses' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--beige)', display: 'flex', flexDirection: 'column' }}>
      {/* NAV */}
      <nav style={{
        background: 'linear-gradient(135deg, var(--plum-dark) 0%, var(--plum) 100%)',
        display: 'flex', alignItems: 'center', padding: '0 2rem',
        height: 56, gap: 0, flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          marginRight: 'auto',
          fontFamily: 'var(--font-display)',
          fontSize: 16, color: 'var(--beige)', fontWeight: 400,
          letterSpacing: '0.02em',
        }}>
          La Vallée Village
        </div>
        {navItems.map(item => (
          <div key={item.id} onClick={() => setPage(item.id)} style={{
            padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center',
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
            cursor: 'pointer', fontWeight: 400, transition: 'all 0.2s',
            color: page === item.id ? 'var(--beige)' : 'rgba(245,240,230,0.45)',
            borderBottom: `2px solid ${page === item.id ? 'var(--gold)' : 'transparent'}`,
          }}>
            {item.label}
          </div>
        ))}
        <div onClick={handleLogout} style={{
          padding: '0 1.25rem', height: 56, display: 'flex', alignItems: 'center',
          fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
          cursor: 'pointer', color: 'rgba(245,240,230,0.35)',
          transition: 'color 0.2s', marginLeft: 8,
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,240,230,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,230,0.35)'}
        >
          Sign out
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {page === 'survey' && (
          <>
            {surveyState === 'start' && <SurveyForm onComplete={handleComplete} />}
            {surveyState === 'thanks' && thanksData && (
              <div style={{ maxWidth: 480, margin: '5rem auto', textAlign: 'center', padding: '0 2rem' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 2rem', fontSize: 28,
                }}>✦</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: 'var(--plum-dark)', marginBottom: 12, letterSpacing: '0.01em' }}>
                  {t(thanksData.lang, `Thank you, ${thanksData.firstName}.`, `Merci, ${thanksData.firstName}.`)}
                </div>
                <div style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 12, fontWeight: 300 }}>
                  {t(thanksData.lang,
                    'Your Personal Shopper will be in touch before your arrival. We look forward to welcoming you to La Vallée Village.',
                    'Votre Personal Shopper vous contactera avant votre arrivée. Nous nous réjouissons de vous accueillir à La Vallée Village.'
                  )}
                </div>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-hint)', marginBottom: 36 }}>
                  La Vallée Village × The Peninsula Paris
                </div>
                <button onClick={handleNewResponse} style={{
                  padding: '11px 28px', border: '1px solid var(--plum)', borderRadius: 'var(--radius-md)',
                  background: 'transparent', color: 'var(--plum)', fontSize: 12,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 400,
                }}>
                  New Response
                </button>
              </div>
            )}
          </>
        )}
        {page === 'responses' && <ResponsesPage responses={responses} onDelete={handleDelete} />}
        {page === 'settings' && <SettingsPage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
