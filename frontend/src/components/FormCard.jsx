import { useNavigate } from 'react-router-dom';

export default function FormCard({ form }) {
  const navigate = useNavigate();
  const publicUrl = `${window.location.origin}/f/${form.public_url_token}`;

  return (
    <div
      onClick={() => navigate(`/forms/${form.id}`)}
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(216,207,189,0.6)',
        borderRadius: 16,
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 2px 8px rgba(17,30,22,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.97)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(17,30,22,0.12), 0 0 0 1px rgba(201,168,76,0.2)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(17,30,22,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(216,207,189,0.6)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--plum-dark)', marginBottom: 4 }}>
            {form.title}
          </div>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 300 }}>
            {form.partner_name}
          </div>
        </div>
        <span style={{
          fontSize: 10, padding: '3px 10px', borderRadius: 20,
          background: form.is_active ? 'rgba(35,59,43,0.08)' : 'rgba(0,0,0,0.05)',
          color: form.is_active ? 'var(--plum)' : '#aaa',
          fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {form.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--plum)' }}>
            {form.response_count ?? 0}
          </div>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Responses
          </div>
        </div>
      </div>

      {/* URL */}
      <div
        onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(publicUrl); }}
        style={{
          fontSize: 11, color: 'var(--plum-mid)', background: 'var(--beige)',
          padding: '7px 10px', borderRadius: 6, cursor: 'copy',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          border: '1px solid var(--beige-mid)',
        }}
        title="Click to copy"
      >
        {publicUrl}
      </div>
    </div>
  );
}
