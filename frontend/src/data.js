const UNS = (id) => `https://images.unsplash.com/${id}?w=600&q=80`;

export const STYLES_FEMALE = [
  {
    id: 'casual-luxury',
    nameEN: 'Casual Luxury',
    nameFR: 'Casual Luxe',
    nameES: 'Lujo Casual',
    nameAR: 'الأناقة العفوية',
    brands: ['Loro Piana', 'Brunello Cucinelli', 'Zegna', 'Burberry', 'Max Mara', 'JM Weston'],
    photoUrl: UNS('photo-1441984904996-e0b6ba687e04'),
  },
  {
    id: 'parisian-elegance',
    nameEN: 'Parisian Elegance',
    nameFR: 'Élégance Parisienne',
    nameES: 'Elegancia Parisina',
    nameAR: 'الأناقة الباريسية',
    brands: ['Saint Laurent', 'Chloé', 'Isabel Marant', 'Valentino', 'Burberry', 'Ami'],
    photoUrl: UNS('photo-1509631179647-0177331693ae'),
  },
  {
    id: 'bold-colorful',
    nameEN: 'Bold & Colorful',
    nameFR: 'Mode & Audacieux',
    nameES: 'Atrevido y Colorido',
    nameAR: 'جريء وملوّن',
    brands: ['Gucci', 'Loewe', 'Marni', 'Balenciaga', 'Dolce & Gabbana', 'Versace'],
    photoUrl: UNS('photo-1558618666-fcd25c85cd64'),
  },
  {
    id: 'boho-romantic',
    nameEN: 'Boho Romantic',
    nameFR: 'Romantique Bohème',
    nameES: 'Romántico Boho',
    nameAR: 'رومانسي بوهيمي',
    brands: ['Chloé', 'Zimmermann', 'Isabel Marant', 'Valentino', 'Gucci', 'Prada / Miu Miu'],
    photoUrl: UNS('photo-1515886657613-9f3515b0c78f'),
  },
];

export const STYLES_MALE = [
  {
    id: 'casual',
    nameEN: 'Casual',
    nameFR: 'Casual',
    nameES: 'Casual',
    nameAR: 'كاجوال',
    brands: ['Loro Piana', 'Brunello Cucinelli', 'Ralph Lauren', "Tod's", 'Barbour'],
    photoUrl: UNS('photo-1552374196-1ab2a1c593e8'),
  },
  {
    id: 'classic',
    nameEN: 'Classic',
    nameFR: 'Classique',
    nameES: 'Clásico',
    nameAR: 'كلاسيكي',
    brands: ['Zegna', 'Brioni', 'Kiton', 'Canali', 'JM Weston'],
    photoUrl: UNS('photo-1507679799987-c73779587ccf'),
  },
  {
    id: 'bold',
    nameEN: 'Bold',
    nameFR: 'Audacieux',
    nameES: 'Atrevido',
    nameAR: 'جريء',
    brands: ['Gucci', 'Balenciaga', 'Versace', 'Dsquared2', 'Dolce & Gabbana'],
    photoUrl: UNS('photo-1583743814966-8936f5b7be1a'),
  },
  {
    id: 'street',
    nameEN: 'Street',
    nameFR: 'Street',
    nameES: 'Urbano',
    nameAR: 'ستريت',
    brands: ['Off-White', 'Palm Angels', 'Stone Island', 'CP Company', 'Ami'],
    photoUrl: UNS('photo-1556821840-3a63f15732ce'),
  },
];

export const CATEGORIES = [
  { id: 'clothing',    labelEN: 'Clothing',      labelFR: 'Prêt-à-porter',  labelES: 'Ropa',               labelAR: 'ملابس' },
  { id: 'accessories', labelEN: 'Accessories',   labelFR: 'Accessoires',    labelES: 'Accesorios',         labelAR: 'إكسسوارات' },
  { id: 'leather',     labelEN: 'Leather Goods', labelFR: 'Maroquinerie',   labelES: 'Artículos de cuero', labelAR: 'منتجات جلدية' },
  { id: 'shoes',       labelEN: 'Shoes',         labelFR: 'Chaussures',     labelES: 'Zapatos',            labelAR: 'أحذية' },
  { id: 'watches',     labelEN: 'Watches',       labelFR: 'Montres',        labelES: 'Relojes',            labelAR: 'ساعات' },
  { id: 'jewelry',     labelEN: 'Jewelry',       labelFR: 'Bijoux',         labelES: 'Joyería',            labelAR: 'مجوهرات' },
];

export const PURPOSES = [
  {
    id: 'new-styles',
    labelEN: 'Discover new styles curated just for me',
    labelFR: 'Découvrir de nouveaux styles rien que pour moi',
    labelES: 'Descubrir nuevos estilos seleccionados solo para mí',
    labelAR: 'اكتشاف أساليب جديدة مختارة خصيصاً لي',
  },
  {
    id: 'shopping-escape',
    labelEN: 'A relaxing and luxury shopping escape',
    labelFR: 'Une escapade shopping luxe et relaxante',
    labelES: 'Una escapada de compras lujosa y relajante',
    labelAR: 'رحلة تسوق فاخرة ومريحة',
  },
  {
    id: 'transformational',
    labelEN: 'A transformational styling moment',
    labelFR: 'Un moment de style transformateur',
    labelES: 'Un momento de estilo transformador',
    labelAR: 'لحظة تحول في الأناقة',
  },
  {
    id: 'celebration',
    labelEN: 'A special celebration (birthday, anniversary, milestone)',
    labelFR: 'Une célébration spéciale (anniversaire, étape importante)',
    labelES: 'Una celebración especial (cumpleaños, aniversario, hito)',
    labelAR: 'احتفال خاص (عيد ميلاد، ذكرى سنوية، مناسبة مميزة)',
  },
];

export const PS_MODES = [
  {
    id: 'full',
    labelEN: 'Full guidance from start to finish',
    labelFR: 'Accompagnement complet du début à la fin',
    labelES: 'Orientación completa de principio a fin',
    labelAR: 'إرشاد كامل من البداية إلى النهاية',
  },
  {
    id: 'mix',
    labelEN: 'A mix of guidance + independent browsing',
    labelFR: 'Guidé(e) + autonome',
    labelES: 'Una combinación de orientación + navegación independiente',
    labelAR: 'مزيج من الإرشاد والتصفح المستقل',
  },
  {
    id: 'independent',
    labelEN: 'Mostly independent',
    labelFR: 'Essentiellement autonome',
    labelES: 'Mayormente independiente',
    labelAR: 'مستقل في معظمه',
  },
];

export const LIFESTYLE = [
  { id: 'evening',  labelEN: 'Evening wear',         labelFR: 'Tenue de soirée',       labelES: 'Ropa de noche',           labelAR: 'ملابس سهرة' },
  { id: 'workwear', labelEN: 'Workwear',              labelFR: 'Business / Travail',    labelES: 'Ropa de trabajo',         labelAR: 'ملابس عمل' },
  { id: 'lounge',   labelEN: 'Lounge / Airport look', labelFR: 'Lounge / Look voyage',  labelES: 'Lounge / Look aeropuerto', labelAR: 'إطلالة مريحة / مطار' },
  { id: 'sport',    labelEN: 'Sportswear',            labelFR: 'Sport',                 labelES: 'Ropa deportiva',          labelAR: 'ملابس رياضية' },
];

export const TRAVEL_OPTIONS = [
  { id: 'beach',         labelEN: 'Beach',                    labelFR: 'Plage',                     labelES: 'Playa',                 labelAR: 'شاطئ' },
  { id: 'mountain',      labelEN: 'Mountain',                 labelFR: 'Montagne',                  labelES: 'Montaña',               labelAR: 'جبال' },
  { id: 'getaway',       labelEN: 'Short getaway',            labelFR: 'Escapade',                  labelES: 'Escapada corta',        labelAR: 'رحلة قصيرة' },
  { id: 'international', labelEN: 'International destination', labelFR: 'Destination internationale', labelES: 'Destino internacional', labelAR: 'وجهة دولية' },
];

export const EVENT_OPTIONS = [
  { id: 'gala',        labelEN: 'Gala / Black tie',   labelFR: 'Gala / Black tie',             labelES: 'Gala / Etiqueta',      labelAR: 'حفل رسمي' },
  { id: 'wedding',     labelEN: 'Wedding',            labelFR: 'Mariage',                      labelES: 'Boda',                 labelAR: 'حفل زفاف' },
  { id: 'birthday',    labelEN: 'Birthday',           labelFR: 'Anniversaire',                 labelES: 'Cumpleaños',           labelAR: 'عيد ميلاد' },
  { id: 'anniversary', labelEN: 'Anniversary',        labelFR: 'Anniversaire de couple',       labelES: 'Aniversario',          labelAR: 'ذكرى سنوية' },
  { id: 'corporate',   labelEN: 'Corporate event',    labelFR: 'Événement professionnel',      labelES: 'Evento corporativo',   labelAR: 'فعالية شركات' },
];

export const NATIONALITIES = [
  'France', 'United Kingdom', 'United States', 'Germany', 'Italy', 'Spain',
  'Switzerland', 'Belgium', 'Netherlands', 'Sweden', 'Norway', 'Denmark',
  'China', 'Japan', 'South Korea', 'Hong Kong', 'Singapore', 'Taiwan',
  'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain',
  'Russia', 'Ukraine', 'Kazakhstan',
  'Brazil', 'Argentina', 'Mexico', 'Colombia',
  'United States', 'Canada', 'Australia', 'New Zealand',
  'India', 'Other',
];

export const SIZING_MAP = {
  'France': 'EU', 'Germany': 'EU', 'Italy': 'EU', 'Spain': 'EU',
  'Switzerland': 'EU', 'Belgium': 'EU', 'Netherlands': 'EU',
  'Sweden': 'EU', 'Norway': 'EU', 'Denmark': 'EU',
  'United States': 'US', 'Canada': 'US',
  'Japan': 'JP', 'South Korea': 'JP', 'Taiwan': 'JP',
};

export const SIZING_VALUES = {
  EU: ['34', '36', '38', '40', '42', '44', '46', '48'],
  US: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '0', '2', '4', '6', '8', '10', '12'],
  JP: ['34', '36', '38', '40', '42', '5', '6', '7', '7.5', '8', '8.5', '9'],
};

// Nationalities that unlock additional languages beyond EN + FR
export const NATIONALITY_LANGUAGES = {
  // Spanish-speaking
  'Spain':       ['en', 'fr', 'es'],
  'Mexico':      ['en', 'fr', 'es'],
  'Argentina':   ['en', 'fr', 'es'],
  'Colombia':    ['en', 'fr', 'es'],
  'Chile':       ['en', 'fr', 'es'],
  'Peru':        ['en', 'fr', 'es'],
  'Venezuela':   ['en', 'fr', 'es'],
  'Ecuador':     ['en', 'fr', 'es'],
  'Guatemala':   ['en', 'fr', 'es'],
  'Cuba':        ['en', 'fr', 'es'],
  'Bolivia':     ['en', 'fr', 'es'],
  'Honduras':    ['en', 'fr', 'es'],
  'Paraguay':    ['en', 'fr', 'es'],
  'El Salvador': ['en', 'fr', 'es'],
  'Nicaragua':   ['en', 'fr', 'es'],
  'Costa Rica':  ['en', 'fr', 'es'],
  'Panama':      ['en', 'fr', 'es'],
  'Uruguay':     ['en', 'fr', 'es'],
  // Arabic-speaking
  'Saudi Arabia': ['en', 'fr', 'ar'],
  'UAE':          ['en', 'fr', 'ar'],
  'Qatar':        ['en', 'fr', 'ar'],
  'Kuwait':       ['en', 'fr', 'ar'],
  'Bahrain':      ['en', 'fr', 'ar'],
  'Oman':         ['en', 'fr', 'ar'],
  'Egypt':        ['en', 'fr', 'ar'],
  'Jordan':       ['en', 'fr', 'ar'],
  'Lebanon':      ['en', 'fr', 'ar'],
  'Morocco':      ['en', 'fr', 'ar'],
  'Algeria':      ['en', 'fr', 'ar'],
  'Tunisia':      ['en', 'fr', 'ar'],
  'Libya':        ['en', 'fr', 'ar'],
  'Iraq':         ['en', 'fr', 'ar'],
  'Syria':        ['en', 'fr', 'ar'],
  'Yemen':        ['en', 'fr', 'ar'],
  'Sudan':        ['en', 'fr', 'ar'],
};

export const SP_COLUMNS = [
  { webapp: 'firstName + surname', sp: 'GuestName / Title', type: 'Single line of text' },
  { webapp: 'initials', sp: 'Initials', type: 'Single line (auto)' },
  { webapp: 'email', sp: 'GuestEmail', type: 'Single line of text' },
  { webapp: 'phone', sp: 'Phone', type: 'Single line of text' },
  { webapp: 'gender', sp: 'Civilite', type: 'Choice: Mr / Ms' },
  { webapp: 'nationality', sp: 'Nationalite', type: 'Single line of text' },
  { webapp: 'sizingSystem', sp: 'SizingSystem', type: 'Choice: EU / US / JP' },
  { webapp: 'sizingValue', sp: 'SizingValue', type: 'Single line of text' },
  { webapp: 'purpose', sp: 'Intention', type: 'Single line of text' },
  { webapp: 'psMode', sp: 'ModePS', type: 'Single line of text' },
  { webapp: 'styles[0]', sp: 'Style1', type: 'Single line of text' },
  { webapp: 'styles[1]', sp: 'Style2', type: 'Single line of text' },
  { webapp: 'categories[]', sp: 'Categories', type: 'Multiple lines (comma-sep)' },
  { webapp: 'brands[]', sp: 'Brands', type: 'Multiple lines (comma-sep)' },
  { webapp: 'lifestyle[]', sp: 'Lifestyle', type: 'Multiple lines (comma-sep)' },
  { webapp: 'travel[]', sp: 'UpcomingTravel', type: 'Single line of text' },
  { webapp: 'events[]', sp: 'UpcomingEvent', type: 'Single line of text' },
  { webapp: 'consent', sp: 'ConsentGiven', type: 'Yes/No' },
  { webapp: 'submittedAt', sp: 'SubmittedAt', type: 'Date and Time' },
];
