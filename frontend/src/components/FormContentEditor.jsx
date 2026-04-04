import { useState } from 'react';
import {
  STYLES_FEMALE, STYLES_MALE, CATEGORIES, PURPOSES,
  PS_MODES, LIFESTYLE, TRAVEL_OPTIONS, EVENT_OPTIONS,
} from '../data.js';

// ── helpers ──────────────────────────────────────────────────────────────────

function uid() { return `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

const sectionMeta = [
  { key: 'styles',     label: 'Styles' },
  { key: 'categories', label: 'Categories',  defaults: CATEGORIES },
  { key: 'purposes',   label: 'Intentions',  defaults: PURPOSES },
  { key: 'psModes',    label: 'PS Modes',    defaults: PS_MODES },
  { key: 'lifestyle',  label: 'Lifestyle',   defaults: LIFESTYLE },
  { key: 'travel',     label: 'Travel',      defaults: TRAVEL_OPTIONS },
  { key: 'events',     label: 'Events',      defaults: EVENT_OPTIONS },
];

const inp = (extra = {}) => ({
  padding: '8px 10px', border: '1px solid var(--beige-mid)', borderRadius: 6,
  fontSize: 12, fontFamily: 'var(--font-sans)', color: 'var(--plum-dark)',
  background: 'var(--beige)', outline: 'none', ...extra,
});

// ── Simple EN/FR list editor ──────────────────────────────────────────────────

function ListEditor({ items, onChange }) {
  const update = (i, field, val) =>
    onChange(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  const add = () => onChange([...items, { id: uid(), labelEN: '', labelFR: '' }]);

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 28px', gap: 6, marginBottom: 6 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb' }}>English</div>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb' }}>Français</div>
        <div />
      </div>

      {items.map((item, i) => (
        <div key={item.id || i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 28px', gap: 6, marginBottom: 6 }}>
          <input
            value={item.labelEN}
            onChange={e => update(i, 'labelEN', e.target.value)}
            placeholder="English label"
            style={{ ...inp(), width: '100%', boxSizing: 'border-box' }}
          />
          <input
            value={item.labelFR}
            onChange={e => update(i, 'labelFR', e.target.value)}
            placeholder="Libellé français"
            style={{ ...inp(), width: '100%', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => remove(i)}
            style={{
              width: 28, height: 32, border: '1px solid #e0a0a0', borderRadius: 6,
              background: 'transparent', color: '#c07070', cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={add}
        style={{
          marginTop: 8, padding: '7px 14px', background: 'transparent',
          border: '1px dashed var(--beige-mid)', borderRadius: 6,
          color: '#aaa', fontSize: 11, cursor: 'pointer',
          fontFamily: 'var(--font-sans)', letterSpacing: '0.06em',
        }}
      >
        + Add option
      </button>
    </div>
  );
}

// ── Style archetype editor ────────────────────────────────────────────────────

function StyleItem({ style, index, onChange, onRemove }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      border: '1px solid var(--beige-mid)', borderRadius: 8,
      overflow: 'hidden', marginBottom: 8,
    }}>
      {/* Accordion header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', padding: '10px 14px',
          cursor: 'pointer', background: open ? 'rgba(82,56,73,0.04)' : '#fff',
          gap: 10,
        }}
      >
        {style.photoUrl && (
          <img
            src={style.photoUrl} alt=""
            style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
        {!style.photoUrl && (
          <div style={{
            width: 36, height: 36, borderRadius: 4, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--plum-dark), var(--plum))',
          }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--plum-dark)', fontWeight: 400 }}>
            {style.nameEN || `Style ${index + 1}`}
          </div>
          {style.nameFR && (
            <div style={{ fontSize: 11, color: '#aaa', fontWeight: 300 }}>{style.nameFR}</div>
          )}
        </div>
        <div style={{ fontSize: 12, color: '#bbb', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▾
        </div>
      </div>

      {/* Accordion body */}
      {open && (
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--beige-mid)', background: 'var(--beige)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 5 }}>Name EN</div>
              <input
                value={style.nameEN}
                onChange={e => onChange({ ...style, nameEN: e.target.value })}
                style={{ ...inp(), width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 5 }}>Name FR</div>
              <input
                value={style.nameFR}
                onChange={e => onChange({ ...style, nameFR: e.target.value })}
                style={{ ...inp(), width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 5 }}>
              Brands (comma-separated)
            </div>
            <textarea
              value={(style.brands || []).join(', ')}
              onChange={e => onChange({
                ...style,
                brands: e.target.value.split(',').map(b => b.trim()).filter(Boolean),
              })}
              rows={2}
              style={{ ...inp(), width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'var(--font-sans)' }}
              placeholder="Loro Piana, Brunello Cucinelli, Zegna"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 5 }}>
              Photo URL
            </div>
            <input
              value={style.photoUrl || ''}
              onChange={e => onChange({ ...style, photoUrl: e.target.value })}
              placeholder="https://images.unsplash.com/…"
              style={{ ...inp(), width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={onRemove}
            style={{
              padding: '6px 12px', background: 'transparent',
              border: '1px solid #e0a0a0', borderRadius: 6,
              color: '#c07070', fontSize: 11, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Remove style
          </button>
        </div>
      )}
    </div>
  );
}

function StylesEditor({ value, onChange }) {
  const [gender, setGender] = useState('female');
  const items = value?.[gender] || [];

  const setItems = (next) => onChange({ ...(value || {}), [gender]: next });

  const updateItem = (i, updated) => setItems(items.map((s, idx) => idx === i ? updated : s));
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const addItem = () => setItems([...items, {
    id: uid(), nameEN: '', nameFR: '', brands: [], photoUrl: '',
  }]);

  return (
    <div>
      {/* Female / Male toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['female', 'male'].map(g => (
          <button
            key={g}
            onClick={() => setGender(g)}
            style={{
              padding: '6px 18px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
              border: '1px solid var(--beige-mid)',
              background: gender === g ? 'var(--plum)' : 'transparent',
              color: gender === g ? 'var(--beige)' : '#aaa',
              fontFamily: 'var(--font-sans)', letterSpacing: '0.06em',
              textTransform: 'capitalize', transition: 'all 0.2s',
            }}
          >
            {g === 'female' ? 'Female' : 'Male'}
          </button>
        ))}
      </div>

      {items.map((style, i) => (
        <StyleItem
          key={style.id || i}
          style={style}
          index={i}
          onChange={updated => updateItem(i, updated)}
          onRemove={() => removeItem(i)}
        />
      ))}

      <button
        onClick={addItem}
        style={{
          marginTop: 8, padding: '7px 14px', background: 'transparent',
          border: '1px dashed var(--beige-mid)', borderRadius: 6,
          color: '#aaa', fontSize: 11, cursor: 'pointer',
          fontFamily: 'var(--font-sans)', letterSpacing: '0.06em',
        }}
      >
        + Add style archetype
      </button>
    </div>
  );
}

// ── Default-state banner ──────────────────────────────────────────────────────

function DefaultsBanner({ label, defaults, onCustomize }) {
  return (
    <div style={{
      border: '1px dashed var(--beige-mid)', borderRadius: 8,
      padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: 'var(--plum-dark)', fontWeight: 400, marginBottom: 3 }}>
          Using LVV defaults
        </div>
        <div style={{ fontSize: 11, color: '#aaa', fontWeight: 300 }}>
          {defaults.length} {label.toLowerCase()} — inherited from LVV standard survey
        </div>
      </div>
      <button
        onClick={onCustomize}
        style={{
          padding: '7px 16px', background: 'var(--plum)', border: 'none',
          borderRadius: 6, color: 'var(--beige)', fontSize: 11, cursor: 'pointer',
          fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', whiteSpace: 'nowrap',
        }}
      >
        Customise →
      </button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function FormContentEditor({ config, onChange }) {
  const [activeKey, setActiveKey] = useState('styles');

  const setSection = (key, val) => onChange({ ...config, [key]: val });
  const resetSection = (key) => onChange({ ...config, [key]: null });

  const activeMeta = sectionMeta.find(s => s.key === activeKey);

  return (
    <div style={{ background: '#fff', border: '1px solid var(--beige-mid)', borderRadius: 12, overflow: 'hidden', marginTop: 24 }}>
      {/* Section tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--beige-mid)',
        overflowX: 'auto', background: 'var(--beige)',
      }}>
        {sectionMeta.map(s => {
          const isCustom = s.key === 'styles'
            ? (config?.styles?.female || config?.styles?.male)
            : config?.[s.key] != null;
          return (
            <button
              key={s.key}
              onClick={() => setActiveKey(s.key)}
              style={{
                padding: '11px 18px', border: 'none', borderBottom: activeKey === s.key ? '2px solid var(--plum)' : '2px solid transparent',
                background: 'transparent', cursor: 'pointer',
                fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase',
                color: activeKey === s.key ? 'var(--plum)' : '#aaa',
                fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {s.label}
              {isCustom && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--gold)', display: 'inline-block',
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Section body */}
      <div style={{ padding: '1.5rem' }}>
        {/* Reset button for non-default sections */}
        {activeKey !== 'styles' && config?.[activeKey] != null && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button
              onClick={() => resetSection(activeKey)}
              style={{
                padding: '5px 12px', background: 'transparent',
                border: '1px solid var(--beige-mid)', borderRadius: 6,
                color: '#aaa', fontSize: 11, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              ↺ Reset to defaults
            </button>
          </div>
        )}

        {activeKey === 'styles' && (
          <>
            {(config?.styles?.female || config?.styles?.male) ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <button
                    onClick={() => setSection('styles', null)}
                    style={{
                      padding: '5px 12px', background: 'transparent',
                      border: '1px solid var(--beige-mid)', borderRadius: 6,
                      color: '#aaa', fontSize: 11, cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    ↺ Reset to defaults
                  </button>
                </div>
                <StylesEditor
                  value={config.styles}
                  onChange={val => setSection('styles', val)}
                />
              </>
            ) : (
              <DefaultsBanner
                label="style archetypes (female + male)"
                defaults={[...STYLES_FEMALE, ...STYLES_MALE]}
                onCustomize={() => setSection('styles', {
                  female: STYLES_FEMALE.map(s => ({ ...s })),
                  male: STYLES_MALE.map(s => ({ ...s })),
                })}
              />
            )}
          </>
        )}

        {activeKey !== 'styles' && activeMeta && (
          config?.[activeKey] != null ? (
            <ListEditor
              items={config[activeKey]}
              onChange={val => setSection(activeKey, val)}
            />
          ) : (
            <DefaultsBanner
              label={activeMeta.label}
              defaults={activeMeta.defaults}
              onCustomize={() => setSection(activeKey, activeMeta.defaults.map(d => ({ ...d })))}
            />
          )
        )}
      </div>
    </div>
  );
}
