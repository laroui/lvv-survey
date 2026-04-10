import { useState } from 'react';

/* ── Button ── */
export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-sans)', letterSpacing: '0.05em',
    textTransform: 'uppercase', transition: 'all 0.2s', opacity: disabled ? 0.45 : 1,
    borderRadius: 'var(--radius-md)',
    fontSize: size === 'sm' ? 11 : size === 'lg' ? 14 : 12,
    padding: size === 'sm' ? '7px 16px' : size === 'lg' ? '14px 36px' : '10px 22px',
    fontWeight: 400,
    ...style,
  };

  const variants = {
    primary: { background: 'linear-gradient(135deg, var(--plum) 0%, var(--plum-dark) 100%)', color: 'var(--beige)' },
    outline: { background: 'transparent', border: '1px solid var(--plum)', color: 'var(--plum)' },
    gold: { background: 'var(--gold)', color: 'var(--plum-dark)' },
    danger: { background: '#c0392b', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--beige-dark)' },
  };

  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/* ── Card ── */
export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--white)', border: '1px solid var(--beige-mid)',
      borderRadius: 'var(--radius-lg)', padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)', ...style,
    }}>
      {children}
    </div>
  );
}

/* ── CardTitle ── */
export function CardTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 14, color: 'var(--plum-dark)', letterSpacing: '0.06em' }}>
        {children}
      </span>
    </div>
  );
}

/* ── Field ── */
export function Field({ label, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </label>
      )}
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--text-hint)', fontStyle: 'italic' }}>{hint}</span>}
    </div>
  );
}

/* ── TextInput ── */
export function TextInput({ value, onChange, placeholder, type = 'text', style }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', border: '1px solid var(--beige-dark)', borderRadius: 'var(--radius-sm)',
        padding: '10px 14px', fontSize: 16, fontFamily: 'var(--font-sans)',
        color: 'var(--text-dark)', background: 'var(--beige)', outline: 'none',
        transition: 'border 0.2s, background 0.2s',
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--plum-mid)'; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--beige-dark)'; e.target.style.background = 'var(--beige)'; }}
    />
  );
}

/* ── Select ── */
export function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', border: '1px solid var(--beige-dark)', borderRadius: 'var(--radius-sm)',
        padding: '10px 14px', fontSize: 16, fontFamily: 'var(--font-sans)',
        color: value ? 'var(--text-dark)' : 'var(--text-hint)',
        background: 'var(--beige)', outline: 'none', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a7080' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
        cursor: 'pointer',
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
      ))}
    </select>
  );
}

/* ── OptionItem (radio style) ── */
export function OptionItem({ label, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        border: `1.5px solid ${selected ? 'var(--gold)' : 'var(--beige-dark)'}`,
        borderRadius: 'var(--radius-md)', padding: '13px 18px',
        cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        background: selected ? 'var(--gold-light)' : 'var(--beige)',
        color: selected ? 'var(--plum-dark)' : 'var(--text-dark)',
        fontSize: 14, fontWeight: selected ? 400 : 300,
        transform: selected ? 'scale(1.01)' : 'scale(1)',
        touchAction: 'manipulation',
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? 'var(--gold)' : 'var(--beige-dark)'}`,
        background: selected ? 'var(--gold)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        {selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
      </div>
      {label}
    </div>
  );
}

/* ── MultiTag ── */
export function MultiTag({ label, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '9px 20px', border: `1.5px solid ${selected ? 'var(--gold)' : 'var(--beige-dark)'}`,
        borderRadius: 20, fontSize: 13, cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        background: selected ? 'var(--gold)' : 'var(--beige)',
        color: selected ? 'var(--plum-dark)' : 'var(--text-dark)',
        fontWeight: selected ? 400 : 300,
        userSelect: 'none',
        transform: selected ? 'scale(1.04)' : 'scale(1)',
        touchAction: 'manipulation',
      }}
    >
      {label}
    </div>
  );
}

/* ── StyleCard ── */
export function StyleCard({ name, brands, selected, onClick, photoUrl }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(hover: none)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.02)`;
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
    setHovered(false);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: `2.5px solid ${selected ? 'var(--gold)' : 'rgba(216,207,189,0.4)'}`,
        cursor: 'pointer',
        transition: 'transform 0.15s ease, border-color 0.2s',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        boxShadow: selected
          ? '0 0 0 1px var(--gold), 0 8px 24px rgba(17,30,22,0.2)'
          : '0 2px 8px rgba(17,30,22,0.1)',
      }}
    >
      {/* Background — photo or fallback gradient */}
      {photoUrl && !imgFailed ? (
        <img
          src={photoUrl}
          alt={name}
          onError={() => setImgFailed(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            display: 'block',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, var(--plum-dark) 0%, var(--plum-mid) 100%)',
        }} />
      )}
      {/* Dark gradient overlay — always present for text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(26,10,18,0.88) 0%, rgba(26,10,18,0.3) 55%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Gold tint when selected */}
      {selected && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(201,168,76,0.12)',
          pointerEvents: 'none',
        }} />
      )}
      {/* Checkmark badge */}
      {selected && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 11, fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 2,
        }}>✓</div>
      )}
      {/* Text overlay — bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 14px 16px',
        zIndex: 1,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 19,
          fontWeight: 400,
          color: '#fff',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          marginBottom: 5,
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 300,
          lineHeight: 1.4,
          letterSpacing: '0.02em',
        }}>
          {brands.slice(0, 3).join(' · ')}
        </div>
      </div>
    </div>
  );
}

/* ── BrandTag ── */
export function BrandTag({ label, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '11px 10px', border: `1.5px solid ${selected ? 'var(--gold)' : 'var(--beige-dark)'}`,
        borderRadius: 'var(--radius-sm)', fontSize: 12, cursor: 'pointer',
        textAlign: 'center', transition: 'all 0.2s',
        background: selected ? 'var(--gold-light)' : 'var(--beige)',
        color: selected ? 'var(--plum-dark)' : 'var(--text-dark)',
        fontWeight: selected ? 400 : 300,
      }}
    >
      {label}
    </div>
  );
}

/* ── Badge ── */
export function Badge({ label, variant = 'plum' }) {
  const colors = {
    plum: { bg: 'rgba(35,59,43,0.12)', color: 'var(--plum)' },
    gold: { bg: 'rgba(201,168,76,0.18)', color: '#7a5e1a' },
    green: { bg: 'rgba(39,174,96,0.12)', color: '#1e8449' },
    red: { bg: 'rgba(192,57,43,0.12)', color: '#c0392b' },
  };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 400, letterSpacing: '0.04em',
      ...colors[variant],
    }}>
      {label}
    </span>
  );
}

/* ── Chip ── */
export function Chip({ label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 20,
      background: 'rgba(35,59,43,0.08)', color: 'var(--plum)',
      fontSize: 11, fontWeight: 300,
    }}>
      {label}
    </span>
  );
}

/* ── StepLabel ── */
export function StepLabel({ children }) {
  return (
    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 400 }}>
      {children}
    </div>
  );
}

/* ── StepQuestion — Aimé display font ── */
export function StepQuestion({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: 'var(--plum-dark)', marginBottom: 24, lineHeight: 1.35 }}>
      {children}
    </div>
  );
}

/* ── NavBtns ── */
export function NavBtns({ onBack, onNext, nextLabel, nextVariant = 'primary', backLabel, nextDisabled }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginTop: 32, paddingTop: 24,
      borderTop: '1px solid var(--beige-mid)',
    }}>
      <Btn variant="ghost" onClick={onBack}>{backLabel || '← Back'}</Btn>
      <Btn variant={nextVariant} size="md" onClick={onNext} disabled={nextDisabled}>
        {nextLabel || 'Continue →'}
      </Btn>
    </div>
  );
}

/* ── ProgressBar ── */
export function ProgressBar({ pct }) {
  return (
    <div style={{ height: 2, background: 'var(--beige-mid)', borderRadius: 2, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--plum), var(--gold))', borderRadius: 2, transition: 'width 0.4s ease' }} />
    </div>
  );
}

/* ── Divider ── */
export function Divider({ style }) {
  return <div style={{ height: 1, background: 'var(--beige-mid)', margin: '1.5rem 0', ...style }} />;
}

/* ── ReviewRow ── */
export function ReviewRow({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--beige-mid)', fontSize: 13 }}>
      <span style={{ color: 'var(--text-muted)', fontWeight: 300, flex: '0 0 160px' }}>{k}</span>
      <span style={{ color: 'var(--plum-dark)', fontWeight: 400, textAlign: 'right', flex: 1 }}>{v || '—'}</span>
    </div>
  );
}

/* ── Alert ── */
export function Alert({ message, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.3)',
      borderRadius: 'var(--radius-sm)', padding: '10px 16px',
      fontSize: 13, color: '#1e8449', marginTop: 12,
    }}>
      {message}
    </div>
  );
}
