import { useState, useRef, useEffect } from 'react';

const PRIORITY_CODES = [
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+1',   flag: '🇺🇸', name: 'United States' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+39',  flag: '🇮🇹', name: 'Italy' },
  { code: '+34',  flag: '🇪🇸', name: 'Spain' },
  { code: '+41',  flag: '🇨🇭', name: 'Switzerland' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgium' },
  { code: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: '+46',  flag: '🇸🇪', name: 'Sweden' },
  { code: '+47',  flag: '🇳🇴', name: 'Norway' },
  { code: '+45',  flag: '🇩🇰', name: 'Denmark' },
  { code: '+86',  flag: '🇨🇳', name: 'China' },
  { code: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: '+82',  flag: '🇰🇷', name: 'South Korea' },
  { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+7',   flag: '🇷🇺', name: 'Russia' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
  { code: '+7',   flag: '🇰🇿', name: 'Kazakhstan' },
  { code: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: '+54',  flag: '🇦🇷', name: 'Argentina' },
  { code: '+52',  flag: '🇲🇽', name: 'Mexico' },
  { code: '+57',  flag: '🇨🇴', name: 'Colombia' },
  { code: '+1',   flag: '🇨🇦', name: 'Canada' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+64',  flag: '🇳🇿', name: 'New Zealand' },
  { code: '+91',  flag: '🇮🇳', name: 'India' },
];

const OTHER_CODES = [
  { code: '+93',  flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', name: 'Albania' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+376', flag: '🇦🇩', name: 'Andorra' },
  { code: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: '+54',  flag: '🇦🇷', name: 'Argentina' },
  { code: '+374', flag: '🇦🇲', name: 'Armenia' },
  { code: '+43',  flag: '🇦🇹', name: 'Austria' },
  { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+375', flag: '🇧🇾', name: 'Belarus' },
  { code: '+501', flag: '🇧🇿', name: 'Belize' },
  { code: '+229', flag: '🇧🇯', name: 'Benin' },
  { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+387', flag: '🇧🇦', name: 'Bosnia' },
  { code: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: '+673', flag: '🇧🇳', name: 'Brunei' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+855', flag: '🇰🇭', name: 'Cambodia' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+238', flag: '🇨🇻', name: 'Cape Verde' },
  { code: '+236', flag: '🇨🇫', name: 'Central African Rep.' },
  { code: '+56',  flag: '🇨🇱', name: 'Chile' },
  { code: '+243', flag: '🇨🇩', name: 'Congo (DR)' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+385', flag: '🇭🇷', name: 'Croatia' },
  { code: '+53',  flag: '🇨🇺', name: 'Cuba' },
  { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+679', flag: '🇫🇯', name: 'Fiji' },
  { code: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: '+995', flag: '🇬🇪', name: 'Georgia' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+30',  flag: '🇬🇷', name: 'Greece' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+224', flag: '🇬🇳', name: 'Guinea' },
  { code: '+509', flag: '🇭🇹', name: 'Haiti' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: '+36',  flag: '🇭🇺', name: 'Hungary' },
  { code: '+354', flag: '🇮🇸', name: 'Iceland' },
  { code: '+62',  flag: '🇮🇩', name: 'Indonesia' },
  { code: '+98',  flag: '🇮🇷', name: 'Iran' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: '+225', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+850', flag: '🇰🇵', name: 'North Korea' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
  { code: '+856', flag: '🇱🇦', name: 'Laos' },
  { code: '+371', flag: '🇱🇻', name: 'Latvia' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+231', flag: '🇱🇷', name: 'Liberia' },
  { code: '+218', flag: '🇱🇾', name: 'Libya' },
  { code: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: '+370', flag: '🇱🇹', name: 'Lithuania' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+853', flag: '🇲🇴', name: 'Macau' },
  { code: '+389', flag: '🇲🇰', name: 'North Macedonia' },
  { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
  { code: '+60',  flag: '🇲🇾', name: 'Malaysia' },
  { code: '+960', flag: '🇲🇻', name: 'Maldives' },
  { code: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: '+356', flag: '🇲🇹', name: 'Malta' },
  { code: '+222', flag: '🇲🇷', name: 'Mauritania' },
  { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
  { code: '+373', flag: '🇲🇩', name: 'Moldova' },
  { code: '+377', flag: '🇲🇨', name: 'Monaco' },
  { code: '+976', flag: '🇲🇳', name: 'Mongolia' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+258', flag: '🇲🇿', name: 'Mozambique' },
  { code: '+95',  flag: '🇲🇲', name: 'Myanmar' },
  { code: '+264', flag: '🇳🇦', name: 'Namibia' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+92',  flag: '🇵🇰', name: 'Pakistan' },
  { code: '+507', flag: '🇵🇦', name: 'Panama' },
  { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+51',  flag: '🇵🇪', name: 'Peru' },
  { code: '+63',  flag: '🇵🇭', name: 'Philippines' },
  { code: '+48',  flag: '🇵🇱', name: 'Poland' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+40',  flag: '🇷🇴', name: 'Romania' },
  { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { code: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: '+381', flag: '🇷🇸', name: 'Serbia' },
  { code: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: '+421', flag: '🇸🇰', name: 'Slovakia' },
  { code: '+386', flag: '🇸🇮', name: 'Slovenia' },
  { code: '+252', flag: '🇸🇴', name: 'Somalia' },
  { code: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: '+211', flag: '🇸🇸', name: 'South Sudan' },
  { code: '+94',  flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: '+597', flag: '🇸🇷', name: 'Suriname' },
  { code: '+268', flag: '🇸🇿', name: 'Eswatini' },
  { code: '+963', flag: '🇸🇾', name: 'Syria' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+66',  flag: '🇹🇭', name: 'Thailand' },
  { code: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+90',  flag: '🇹🇷', name: 'Turkey' },
  { code: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+998', flag: '🇺🇿', name: 'Uzbekistan' },
  { code: '+58',  flag: '🇻🇪', name: 'Venezuela' },
  { code: '+84',  flag: '🇻🇳', name: 'Vietnam' },
  { code: '+967', flag: '🇾🇪', name: 'Yemen' },
  { code: '+260', flag: '🇿🇲', name: 'Zambia' },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
];

const ALL_CODES = [...PRIORITY_CODES, ...OTHER_CODES];

function resolveNationality(name) {
  if (!name) return null;
  return ALL_CODES.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
}

export default function PhoneInput({ value = '', onChange, nationality = '' }) {
  const natEntry = resolveNationality(nationality);

  // ✅ FIX: value is always a plain string now — parse dial code from it if present
  const defaultCode = natEntry?.code || '+33';
  const [dialCode, setDialCode] = useState(() => {
    if (!value) return defaultCode;
    const sorted = [...ALL_CODES].sort((a, b) => b.code.length - a.code.length);
    const match = sorted.find(c => value.startsWith(c.code));
    return match ? match.code : defaultCode;
  });
  const [selectedName, setSelectedName] = useState(() => {
    if (!value) return natEntry?.name || PRIORITY_CODES[0].name;
    const sorted = [...ALL_CODES].sort((a, b) => b.code.length - a.code.length);
    const match = sorted.find(c => value.startsWith(c.code));
    return match ? match.name : (natEntry?.name || PRIORITY_CODES[0].name);
  });
  const [number, setNumber] = useState(() => {
    if (!value) return '';
    const sorted = [...ALL_CODES].sort((a, b) => b.code.length - a.code.length);
    const match = sorted.find(c => value.startsWith(c.code));
    return match ? value.slice(match.code.length).trim() : value;
  });
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

  // Sync dial code when nationality changes
  useEffect(() => {
    if (!nationality) return;
    const entry = resolveNationality(nationality);
    if (!entry) return;
    setDialCode(entry.code);
    setSelectedName(entry.name);
    // ✅ FIX: always notify with plain string
    onChange(number ? `${entry.code} ${number}` : '');
  }, [nationality]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ FIX: notifyChange always returns a plain string, never an object
  const notifyChange = (dc, num) => {
    onChange(num ? `${dc} ${num}` : '');
  };

  const handleNumberChange = (raw) => {
    if (raw.startsWith('+')) {
      const normalized = raw.replace(/[\s\-().]/g, '');
      const sorted = [...ALL_CODES].sort((a, b) => b.code.length - a.code.length);
      const match = sorted.find(c => normalized.startsWith(c.code));
      if (match) {
        const localNum = normalized.slice(match.code.length);
        setDialCode(match.code);
        setSelectedName(match.name);
        setNumber(localNum);
        notifyChange(match.code, localNum);
        return;
      }
    }
    setNumber(raw);
    notifyChange(dialCode, raw);
  };

  const selectedCountry = ALL_CODES.find(c => c.code === dialCode && c.name === selectedName)
    || ALL_CODES.find(c => c.code === dialCode)
    || PRIORITY_CODES[0];

  const buildList = () => {
    if (search) {
      return ALL_CODES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
      );
    }
    if (natEntry) {
      const rest = ALL_CODES.filter(c => c.name !== natEntry.name);
      return [natEntry, ...rest];
    }
    return ALL_CODES;
  };

  const listItems = buildList();
  const natPinned = !search && natEntry;
  const priorityEnd = PRIORITY_CODES.length + (natPinned ? 1 : 0);

  return (
    <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
      <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => { setOpen(o => !o); setSearch(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '11px 12px', height: 44,
            border: '1px solid var(--beige-dark)', borderRadius: 10,
            background: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 14,
            color: 'var(--plum-dark)', whiteSpace: 'nowrap',
            minWidth: 90,
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>{selectedCountry.flag}</span>
          <span style={{ fontWeight: 400 }}>{dialCode}</span>
          <span style={{ fontSize: 10, color: '#aaa', marginLeft: 2 }}>▾</span>
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, zIndex: 200,
            background: '#fff', border: '1px solid var(--beige-dark)',
            borderRadius: 10, marginTop: 4,
            boxShadow: '0 8px 32px rgba(35,59,43,0.14)',
            width: 'min(260px, calc(100vw - 32px))', maxHeight: 320, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--beige-mid)' }}>
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                style={{
                  width: '100%', padding: '7px 10px', border: '1px solid var(--beige-mid)',
                  borderRadius: 7, fontSize: 16, outline: 'none',
                  fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {listItems.map((c, i) => (
                <>
                  {natPinned && i === 1 && (
                    <div key="divider-nat" style={{ height: 1, background: 'var(--beige-mid)', margin: '4px 0' }} />
                  )}
                  {!search && i === priorityEnd && (
                    <div key="divider-priority" style={{ height: 1, background: 'var(--beige-mid)', margin: '4px 0' }} />
                  )}
                  <div
                    key={`${c.code}-${c.name}`}
                    onClick={() => {
                      setDialCode(c.code);
                      setSelectedName(c.name);
                      setOpen(false);
                      notifyChange(c.code, number);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', cursor: 'pointer',
                      background: c.name === selectedCountry.name ? 'var(--beige)' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--beige)'}
                    onMouseLeave={e => e.currentTarget.style.background = c.name === selectedCountry.name ? 'var(--beige)' : 'transparent'}
                  >
                    <span style={{ fontSize: 18 }}>{c.flag}</span>
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--plum-dark)', fontWeight: 300 }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: '#aaa' }}>{c.code}</span>
                  </div>
                </>
              ))}
            </div>
          </div>
        )}
      </div>

      <input
        type="tel"
        inputMode="tel"
        id="phone-number"
        name="tel"
        autoComplete="tel"
        value={number}
        onChange={e => handleNumberChange(e.target.value)}
        placeholder="6 12 34 56 78"
        style={{
          flex: 1, padding: '11px 14px', height: 44,
          border: '1px solid var(--beige-dark)', borderRadius: 10,
          fontFamily: 'var(--font-sans)', fontSize: 16,
          color: 'var(--plum-dark)', outline: 'none', boxSizing: 'border-box',
          background: '#fff',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--plum-mid)'}
        onBlur={e => e.target.style.borderColor = 'var(--beige-dark)'}
      />
    </div>
  );
}
