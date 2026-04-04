import { useState, useRef, useEffect } from 'react';

// Priority nationalities — same order as NATIONALITIES in data.js (deduped)
const PRIORITY = [
  { name: 'France',         flag: '🇫🇷' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States',  flag: '🇺🇸' },
  { name: 'Germany',        flag: '🇩🇪' },
  { name: 'Italy',          flag: '🇮🇹' },
  { name: 'Spain',          flag: '🇪🇸' },
  { name: 'Switzerland',    flag: '🇨🇭' },
  { name: 'Belgium',        flag: '🇧🇪' },
  { name: 'Netherlands',    flag: '🇳🇱' },
  { name: 'Sweden',         flag: '🇸🇪' },
  { name: 'Norway',         flag: '🇳🇴' },
  { name: 'Denmark',        flag: '🇩🇰' },
  { name: 'China',          flag: '🇨🇳' },
  { name: 'Japan',          flag: '🇯🇵' },
  { name: 'South Korea',    flag: '🇰🇷' },
  { name: 'Hong Kong',      flag: '🇭🇰' },
  { name: 'Singapore',      flag: '🇸🇬' },
  { name: 'Taiwan',         flag: '🇹🇼' },
  { name: 'Saudi Arabia',   flag: '🇸🇦' },
  { name: 'UAE',            flag: '🇦🇪' },
  { name: 'Qatar',          flag: '🇶🇦' },
  { name: 'Kuwait',         flag: '🇰🇼' },
  { name: 'Bahrain',        flag: '🇧🇭' },
  { name: 'Russia',         flag: '🇷🇺' },
  { name: 'Ukraine',        flag: '🇺🇦' },
  { name: 'Kazakhstan',     flag: '🇰🇿' },
  { name: 'Brazil',         flag: '🇧🇷' },
  { name: 'Argentina',      flag: '🇦🇷' },
  { name: 'Mexico',         flag: '🇲🇽' },
  { name: 'Colombia',       flag: '🇨🇴' },
  { name: 'Canada',         flag: '🇨🇦' },
  { name: 'Australia',      flag: '🇦🇺' },
  { name: 'New Zealand',    flag: '🇳🇿' },
  { name: 'India',          flag: '🇮🇳' },
  { name: 'Other',          flag: '🌐' },
];

const OTHERS = [
  { name: 'Afghanistan',          flag: '🇦🇫' },
  { name: 'Albania',              flag: '🇦🇱' },
  { name: 'Algeria',              flag: '🇩🇿' },
  { name: 'Andorra',              flag: '🇦🇩' },
  { name: 'Angola',               flag: '🇦🇴' },
  { name: 'Armenia',              flag: '🇦🇲' },
  { name: 'Austria',              flag: '🇦🇹' },
  { name: 'Azerbaijan',           flag: '🇦🇿' },
  { name: 'Bangladesh',           flag: '🇧🇩' },
  { name: 'Belarus',              flag: '🇧🇾' },
  { name: 'Belize',               flag: '🇧🇿' },
  { name: 'Benin',                flag: '🇧🇯' },
  { name: 'Bhutan',               flag: '🇧🇹' },
  { name: 'Bolivia',              flag: '🇧🇴' },
  { name: 'Bosnia',               flag: '🇧🇦' },
  { name: 'Botswana',             flag: '🇧🇼' },
  { name: 'Brunei',               flag: '🇧🇳' },
  { name: 'Bulgaria',             flag: '🇧🇬' },
  { name: 'Burkina Faso',         flag: '🇧🇫' },
  { name: 'Cambodia',             flag: '🇰🇭' },
  { name: 'Cameroon',             flag: '🇨🇲' },
  { name: 'Cape Verde',           flag: '🇨🇻' },
  { name: 'Central African Rep.', flag: '🇨🇫' },
  { name: 'Chile',                flag: '🇨🇱' },
  { name: 'Congo (DR)',           flag: '🇨🇩' },
  { name: 'Costa Rica',           flag: '🇨🇷' },
  { name: 'Croatia',              flag: '🇭🇷' },
  { name: 'Cuba',                 flag: '🇨🇺' },
  { name: 'Cyprus',               flag: '🇨🇾' },
  { name: 'Czech Republic',       flag: '🇨🇿' },
  { name: 'Ecuador',              flag: '🇪🇨' },
  { name: 'Egypt',                flag: '🇪🇬' },
  { name: 'El Salvador',          flag: '🇸🇻' },
  { name: 'Estonia',              flag: '🇪🇪' },
  { name: 'Ethiopia',             flag: '🇪🇹' },
  { name: 'Fiji',                 flag: '🇫🇯' },
  { name: 'Finland',              flag: '🇫🇮' },
  { name: 'Gabon',                flag: '🇬🇦' },
  { name: 'Georgia',              flag: '🇬🇪' },
  { name: 'Ghana',                flag: '🇬🇭' },
  { name: 'Greece',               flag: '🇬🇷' },
  { name: 'Guatemala',            flag: '🇬🇹' },
  { name: 'Guinea',               flag: '🇬🇳' },
  { name: 'Haiti',                flag: '🇭🇹' },
  { name: 'Honduras',             flag: '🇭🇳' },
  { name: 'Hungary',              flag: '🇭🇺' },
  { name: 'Iceland',              flag: '🇮🇸' },
  { name: 'Indonesia',            flag: '🇮🇩' },
  { name: 'Iran',                 flag: '🇮🇷' },
  { name: 'Iraq',                 flag: '🇮🇶' },
  { name: 'Ireland',              flag: '🇮🇪' },
  { name: 'Israel',               flag: '🇮🇱' },
  { name: 'Ivory Coast',          flag: '🇨🇮' },
  { name: 'Jordan',               flag: '🇯🇴' },
  { name: 'Kenya',                flag: '🇰🇪' },
  { name: 'North Korea',          flag: '🇰🇵' },
  { name: 'Kyrgyzstan',           flag: '🇰🇬' },
  { name: 'Laos',                 flag: '🇱🇦' },
  { name: 'Latvia',               flag: '🇱🇻' },
  { name: 'Lebanon',              flag: '🇱🇧' },
  { name: 'Liberia',              flag: '🇱🇷' },
  { name: 'Libya',                flag: '🇱🇾' },
  { name: 'Liechtenstein',        flag: '🇱🇮' },
  { name: 'Lithuania',            flag: '🇱🇹' },
  { name: 'Luxembourg',           flag: '🇱🇺' },
  { name: 'Macau',                flag: '🇲🇴' },
  { name: 'North Macedonia',      flag: '🇲🇰' },
  { name: 'Madagascar',           flag: '🇲🇬' },
  { name: 'Malaysia',             flag: '🇲🇾' },
  { name: 'Maldives',             flag: '🇲🇻' },
  { name: 'Mali',                 flag: '🇲🇱' },
  { name: 'Malta',                flag: '🇲🇹' },
  { name: 'Mauritania',           flag: '🇲🇷' },
  { name: 'Mauritius',            flag: '🇲🇺' },
  { name: 'Moldova',              flag: '🇲🇩' },
  { name: 'Monaco',               flag: '🇲🇨' },
  { name: 'Mongolia',             flag: '🇲🇳' },
  { name: 'Morocco',              flag: '🇲🇦' },
  { name: 'Mozambique',           flag: '🇲🇿' },
  { name: 'Myanmar',              flag: '🇲🇲' },
  { name: 'Namibia',              flag: '🇳🇦' },
  { name: 'Nepal',                flag: '🇳🇵' },
  { name: 'Nicaragua',            flag: '🇳🇮' },
  { name: 'Niger',                flag: '🇳🇪' },
  { name: 'Nigeria',              flag: '🇳🇬' },
  { name: 'Oman',                 flag: '🇴🇲' },
  { name: 'Pakistan',             flag: '🇵🇰' },
  { name: 'Panama',               flag: '🇵🇦' },
  { name: 'Papua New Guinea',     flag: '🇵🇬' },
  { name: 'Paraguay',             flag: '🇵🇾' },
  { name: 'Peru',                 flag: '🇵🇪' },
  { name: 'Philippines',          flag: '🇵🇭' },
  { name: 'Poland',               flag: '🇵🇱' },
  { name: 'Portugal',             flag: '🇵🇹' },
  { name: 'Romania',              flag: '🇷🇴' },
  { name: 'Rwanda',               flag: '🇷🇼' },
  { name: 'Senegal',              flag: '🇸🇳' },
  { name: 'Serbia',               flag: '🇷🇸' },
  { name: 'Sierra Leone',         flag: '🇸🇱' },
  { name: 'Slovakia',             flag: '🇸🇰' },
  { name: 'Slovenia',             flag: '🇸🇮' },
  { name: 'Somalia',              flag: '🇸🇴' },
  { name: 'South Africa',         flag: '🇿🇦' },
  { name: 'South Sudan',          flag: '🇸🇸' },
  { name: 'Sri Lanka',            flag: '🇱🇰' },
  { name: 'Sudan',                flag: '🇸🇩' },
  { name: 'Suriname',             flag: '🇸🇷' },
  { name: 'Eswatini',             flag: '🇸🇿' },
  { name: 'Syria',                flag: '🇸🇾' },
  { name: 'Tanzania',             flag: '🇹🇿' },
  { name: 'Thailand',             flag: '🇹🇭' },
  { name: 'Togo',                 flag: '🇹🇬' },
  { name: 'Tunisia',              flag: '🇹🇳' },
  { name: 'Turkey',               flag: '🇹🇷' },
  { name: 'Turkmenistan',         flag: '🇹🇲' },
  { name: 'Uganda',               flag: '🇺🇬' },
  { name: 'Uruguay',              flag: '🇺🇾' },
  { name: 'Uzbekistan',           flag: '🇺🇿' },
  { name: 'Venezuela',            flag: '🇻🇪' },
  { name: 'Vietnam',              flag: '🇻🇳' },
  { name: 'Yemen',                flag: '🇾🇪' },
  { name: 'Zambia',               flag: '🇿🇲' },
  { name: 'Zimbabwe',             flag: '🇿🇼' },
];

const ALL = [...PRIORITY, ...OTHERS];

export default function NationalityInput({ value = '', onChange, placeholder = 'Select country' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = ALL.find(c => c.name === value);

  const filtered = search
    ? ALL.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : ALL;

  const hasDivider = !search;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(''); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: '11px 14px', height: 44,
          border: '1px solid var(--beige-dark)', borderRadius: 10,
          background: '#fff', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-sans)', fontSize: 14,
          color: selected ? 'var(--plum-dark)' : '#aaa',
          boxSizing: 'border-box',
        }}
      >
        {selected && <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{selected.flag}</span>}
        <span style={{ flex: 1, fontWeight: selected ? 400 : 300 }}>
          {selected ? selected.name : placeholder}
        </span>
        <span style={{ fontSize: 10, color: '#aaa', flexShrink: 0 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
          background: '#fff', border: '1px solid var(--beige-dark)',
          borderRadius: 10, marginTop: 4,
          boxShadow: '0 8px 32px rgba(82,56,73,0.14)',
          maxHeight: 320, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--beige-mid)' }}>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country..."
              style={{
                width: '100%', padding: '7px 10px', border: '1px solid var(--beige-mid)',
                borderRadius: 7, fontSize: 13, outline: 'none',
                fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map((c, i) => (
              <>
                {hasDivider && i === PRIORITY.length && (
                  <div key="divider" style={{ height: 1, background: 'var(--beige-mid)', margin: '4px 0' }} />
                )}
                <div
                  key={c.name}
                  onClick={() => { onChange(c.name); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px', cursor: 'pointer',
                    background: c.name === value ? 'var(--beige)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--beige)'}
                  onMouseLeave={e => e.currentTarget.style.background = c.name === value ? 'var(--beige)' : 'transparent'}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{c.flag}</span>
                  <span style={{ fontSize: 13, color: 'var(--plum-dark)', fontWeight: 300 }}>{c.name}</span>
                </div>
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
