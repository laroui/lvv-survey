import React, { useMemo } from 'react';
import { Card, CardTitle, Btn, Badge, Chip } from './components';
import { SP_COLUMNS } from './data';

function toSPRecord(r) {
  return {
    GuestName: `${r.firstName} ${r.surname}`,
    Initials: r.initials,
    Civilite: r.gender,
    GuestEmail: r.email || '',
    Phone: r.phone || '',
    Nationalite: r.nationality || '',
    SizingSystem: r.sizingSystem || '',
    SizingValue: r.sizingValue || '',
    Intention: r.purpose || '',
    ModePS: r.psMode || '',
    Style1: r.styles?.[0] || '',
    Style2: r.styles?.[1] || '',
    Categories: (r.categories || []).join(', '),
    Brands: (r.brands || []).filter(b => b !== 'none').join(', '),
    Lifestyle: (r.lifestyle || []).join(', '),
    UpcomingTravel: (r.travel || []).join(', '),
    UpcomingEvent: (r.events || []).join(', '),
    ConsentGiven: r.consent ? 'Yes' : 'No',
    SubmittedAt: r.submittedAt,
  };
}

export default function ResponsesPage({ responses, onDelete }) {
  const stats = useMemo(() => {
    const total = responses.length;
    const today = responses.filter(r => new Date(r.submittedAt).toDateString() === new Date().toDateString()).length;
    const female = responses.filter(r => r.gender === 'Ms').length;
    const femalePct = total ? Math.round((female / total) * 100) : 0;
    const allStyles = responses.flatMap(r => r.styles || []);
    const styleCount = {};
    allStyles.forEach(s => { styleCount[s] = (styleCount[s] || 0) + 1; });
    const topStyle = Object.keys(styleCount).sort((a, b) => styleCount[b] - styleCount[a])[0] || '—';
    return { total, today, femalePct, topStyle };
  }, [responses]);

  const exportCSV = () => {
    if (!responses.length) { alert('No responses to export.'); return; }
    const headers = Object.keys(toSPRecord(responses[0]));
    const rows = responses.map(r => {
      const sp = toSPRecord(r);
      return headers.map(h => `"${(sp[h] || '').toString().replace(/"/g, '""')}"`).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    dl('LVV_PreArrival_Responses.csv', csv, 'text/csv');
  };

  const exportJSON = () => {
    if (!responses.length) { alert('No responses to export.'); return; }
    dl('LVV_PreArrival_SharePoint.json', JSON.stringify(responses.map(toSPRecord), null, 2), 'application/json');
  };

  const dl = (name, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--plum-dark)', marginBottom: 4, letterSpacing: '0.01em' }}>
        Guest Responses
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, fontWeight: 300 }}>
        All submissions — exportable for SharePoint injection
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Submissions', value: stats.total },
          { label: 'Today', value: stats.today },
          { label: 'Female', value: `${stats.femalePct}%` },
          { label: 'Top Style', value: stats.topStyle.split(' ')[0] },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 'var(--radius-lg)',
            padding: '1.25rem', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, color: 'var(--plum-dark)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8, fontWeight: 400 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <CardTitle>All Submissions</CardTitle>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="outline" size="sm" onClick={exportCSV}>Export CSV</Btn>
            <Btn variant="primary" size="sm" onClick={exportJSON}>Export JSON</Btn>
          </div>
        </div>

        {responses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: 14, fontWeight: 300 }}>
            No responses yet. Start by filling out the survey.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['#', 'Name', 'Gender', 'Nationality', 'Email', 'Purpose', 'Styles', 'Brands', 'Sizing', 'Date', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', borderBottom: '2px solid var(--beige-mid)', whiteSpace: 'nowrap', background: 'var(--beige)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((r, i) => (
                  <tr key={r.id} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(35,59,43,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)', color: 'var(--text-muted)', fontWeight: 300 }}>{i + 1}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)' }}>
                      <div style={{ fontWeight: 400, color: 'var(--plum-dark)' }}>{r.firstName} {r.surname}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-hint)', letterSpacing: '0.1em', fontWeight: 300 }}>{r.initials}</div>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)' }}>
                      <Badge label={r.gender} variant="plum" />
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)', whiteSpace: 'nowrap', fontWeight: 300 }}>{r.nationality || '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 300 }}>{r.email || '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)', maxWidth: 180, fontWeight: 300 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                        {r.purpose ? r.purpose.replace(/-/g, ' ') : '—'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(r.styles || []).map(s => <Chip key={s} label={s} />)}
                      </div>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)', fontSize: 12, fontWeight: 300 }}>{(r.brands || []).filter(b => b !== 'none').join(', ') || '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)', whiteSpace: 'nowrap', fontWeight: 300 }}>{r.sizingValue ? `${r.sizingValue} (${r.sizingSystem})` : '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 300 }}>
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--beige-mid)' }}>
                      <Btn variant="danger" size="sm" onClick={() => { if (confirm('Delete this response?')) onDelete(r.id); }}>✕</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* SP Mapping reference */}
      <Card>
        <CardTitle>SharePoint Column Mapping</CardTitle>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 300 }}>
          Exported JSON/CSV uses these exact column names for direct SharePoint list injection.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Webapp Field', 'SharePoint Column', 'Column Type'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', borderBottom: '2px solid var(--beige-mid)', background: 'var(--beige)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SP_COLUMNS.map((col, i) => (
                <tr key={i}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(35,59,43,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--beige-mid)', fontFamily: 'monospace', color: 'var(--plum)', fontSize: 12 }}>{col.webapp}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--beige-mid)', fontWeight: 400, color: 'var(--text-dark)' }}>{col.sp}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--beige-mid)', color: 'var(--text-muted)', fontWeight: 300 }}>{col.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
