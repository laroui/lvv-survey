export const STYLES_FEMALE = [
  {
    id: 'casual-luxury',
    nameEN: 'Casual Luxury',
    nameFR: 'Casual Luxe',
    brands: ['Loro Piana', 'Brunello Cucinelli', 'Zegna', 'Burberry', 'Max Mara', 'JM Weston'],
  },
  {
    id: 'parisian-elegance',
    nameEN: 'Parisian Elegance',
    nameFR: 'Élégance Parisienne',
    brands: ['Saint Laurent', 'Chloé', 'Isabel Marant', 'Valentino', 'Burberry', 'Ami'],
  },
  {
    id: 'bold-colorful',
    nameEN: 'Bold & Colorful',
    nameFR: 'Mode & Audacieux',
    brands: ['Gucci', 'Loewe', 'Marni', 'Balenciaga', 'Dolce & Gabbana', 'Versace'],
  },
  {
    id: 'boho-romantic',
    nameEN: 'Boho Romantic',
    nameFR: 'Romantique Bohème',
    brands: ['Chloé', 'Zimmermann', 'Isabel Marant', 'Valentino', 'Gucci', 'Prada / Miu Miu'],
  },
];

export const STYLES_MALE = [
  {
    id: 'casual',
    nameEN: 'Casual',
    nameFR: 'Casual',
    brands: ['Loro Piana', 'Brunello Cucinelli', 'Ralph Lauren', "Tod's", 'Barbour'],
  },
  {
    id: 'classic',
    nameEN: 'Classic',
    nameFR: 'Classique',
    brands: ['Zegna', 'Brioni', 'Kiton', 'Canali', 'JM Weston'],
  },
  {
    id: 'bold',
    nameEN: 'Bold',
    nameFR: 'Audacieux',
    brands: ['Gucci', 'Balenciaga', 'Versace', 'Dsquared2', 'Dolce & Gabbana'],
  },
  {
    id: 'street',
    nameEN: 'Street',
    nameFR: 'Street',
    brands: ['Off-White', 'Palm Angels', 'Stone Island', 'CP Company', 'Ami'],
  },
];

export const CATEGORIES = [
  { id: 'clothing', labelEN: 'Clothing', labelFR: 'Prêt-à-porter' },
  { id: 'accessories', labelEN: 'Accessories', labelFR: 'Accessoires' },
  { id: 'leather', labelEN: 'Leather Goods', labelFR: 'Maroquinerie' },
  { id: 'shoes', labelEN: 'Shoes', labelFR: 'Chaussures' },
  { id: 'watches', labelEN: 'Watches', labelFR: 'Montres' },
  { id: 'jewelry', labelEN: 'Jewelry', labelFR: 'Bijoux' },
];

export const PURPOSES = [
  {
    id: 'new-styles',
    labelEN: 'Discover new styles curated just for me',
    labelFR: 'Découvrir de nouveaux styles rien que pour moi',
  },
  {
    id: 'shopping-escape',
    labelEN: 'A relaxing and luxury shopping escape',
    labelFR: 'Une escapade shopping luxe et relaxante',
  },
  {
    id: 'transformational',
    labelEN: 'A transformational styling moment',
    labelFR: 'Un moment de style transformateur',
  },
  {
    id: 'celebration',
    labelEN: 'A special celebration (birthday, anniversary, milestone)',
    labelFR: 'Une célébration spéciale (anniversaire, étape importante)',
  },
];

export const PS_MODES = [
  {
    id: 'full',
    labelEN: 'Full guidance from start to finish',
    labelFR: 'Accompagnement complet du début à la fin',
  },
  {
    id: 'mix',
    labelEN: 'A mix of guidance + independent browsing',
    labelFR: 'Guidé(e) + autonome',
  },
  {
    id: 'independent',
    labelEN: 'Mostly independent',
    labelFR: 'Essentiellement autonome',
  },
];

export const LIFESTYLE = [
  { id: 'evening', labelEN: 'Evening wear', labelFR: 'Tenue de soirée' },
  { id: 'workwear', labelEN: 'Workwear', labelFR: 'Business / Travail' },
  { id: 'lounge', labelEN: 'Lounge / Airport look', labelFR: 'Lounge / Look voyage' },
  { id: 'sport', labelEN: 'Sportswear', labelFR: 'Sport' },
];

export const TRAVEL_OPTIONS = [
  { id: 'beach', labelEN: 'Beach', labelFR: 'Plage' },
  { id: 'mountain', labelEN: 'Mountain', labelFR: 'Montagne' },
  { id: 'getaway', labelEN: 'Short getaway', labelFR: 'Escapade' },
  { id: 'international', labelEN: 'International destination', labelFR: 'Destination internationale' },
];

export const EVENT_OPTIONS = [
  { id: 'gala', labelEN: 'Gala / Black tie', labelFR: 'Gala / Black tie' },
  { id: 'wedding', labelEN: 'Wedding', labelFR: 'Mariage' },
  { id: 'birthday', labelEN: 'Birthday', labelFR: 'Anniversaire' },
  { id: 'anniversary', labelEN: 'Anniversary', labelFR: 'Anniversaire de couple' },
  { id: 'corporate', labelEN: 'Corporate event', labelFR: 'Événement professionnel' },
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
