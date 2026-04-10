// Run once: node src/seed.js
// Creates the first admin user + Peninsula Paris form

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { sql } from './db.js';

// ── 1. Admin user ──────────────────────────────────────────────
const passwordHash = await bcrypt.hash('LVV2025!', 12);

const [user] = await sql`
  INSERT INTO users (email, password_hash, full_name, role)
  VALUES ('admin@lavallee-village.com', ${passwordHash}, 'Nacim Laroui', 'admin')
  ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  RETURNING id, email, role
`;
console.log('✓ Admin:', user.email);

// ── 2. Peninsula Paris partner ─────────────────────────────────
const [partner] = await sql`
  INSERT INTO partners (name, slug)
  VALUES ('The Peninsula Paris', 'peninsula-paris')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id, name
`;
console.log('✓ Partner:', partner.name);

// ── 3. Peninsula form config (full 14-step survey) ─────────────
const peninsulaConfig = {
  hotelName: 'The Peninsula Paris',
  language: 'both',
  bilingualEnabled: true,
  questions: { sizing: true, lifestyle: true, travel: true, events: true },
  thankYouMessage: 'Your Personal Shopper will be in touch before your arrival. We look forward to welcoming you to La Vallée Village.',
  thankYouMessageFR: 'Votre Personal Shopper vous contactera avant votre arrivée. Nous nous réjouissons de vous accueillir à La Vallée Village.',
  styles: {
    female: [
      { id: 'casual-luxury',       nameEN: 'Casual Luxury',      nameFR: 'Casual Luxe',            brands: ['Loro Piana', 'Brunello Cucinelli', 'Zegna', 'Burberry', 'Max Mara', 'JM Weston'] },
      { id: 'parisian-elegance',   nameEN: 'Parisian Elegance',  nameFR: 'Élégance Parisienne',    brands: ['Saint Laurent', 'Chloé', 'Isabel Marant', 'Valentino', 'Burberry', 'Ami'] },
      { id: 'bold-colorful',       nameEN: 'Bold & Colorful',    nameFR: 'Mode & Audacieux',        brands: ['Gucci', 'Loewe', 'Marni', 'Balenciaga', 'Dolce & Gabbana', 'Versace'] },
      { id: 'boho-romantic',       nameEN: 'Boho Romantic',      nameFR: 'Romantique Bohème',       brands: ['Chloé', 'Zimmermann', 'Isabel Marant', 'Valentino', 'Gucci', 'Prada / Miu Miu'] },
    ],
    male: [
      { id: 'casual',  nameEN: 'Casual',   nameFR: 'Casual',     brands: ['Loro Piana', 'Brunello Cucinelli', 'Ralph Lauren', "Tod's", 'Barbour'] },
      { id: 'classic', nameEN: 'Classic',  nameFR: 'Classique',  brands: ['Zegna', 'Brioni', 'Kiton', 'Canali', 'JM Weston'] },
      { id: 'bold',    nameEN: 'Bold',     nameFR: 'Audacieux',  brands: ['Gucci', 'Balenciaga', 'Versace', 'Dsquared2', 'Dolce & Gabbana'] },
      { id: 'street',  nameEN: 'Street',   nameFR: 'Street',     brands: ['Off-White', 'Palm Angels', 'Stone Island', 'CP Company', 'Ami'] },
    ],
  },
  categories: [
    { id: 'clothing',     labelEN: 'Clothing',      labelFR: 'Prêt-à-porter' },
    { id: 'accessories',  labelEN: 'Accessories',   labelFR: 'Accessoires' },
    { id: 'leather',      labelEN: 'Leather Goods', labelFR: 'Maroquinerie' },
    { id: 'shoes',        labelEN: 'Shoes',         labelFR: 'Chaussures' },
    { id: 'watches',      labelEN: 'Watches',       labelFR: 'Montres' },
    { id: 'jewelry',      labelEN: 'Jewelry',       labelFR: 'Bijoux' },
  ],
  lifestyle: [
    { id: 'evening',   labelEN: 'Evening wear',        labelFR: 'Tenue de soirée' },
    { id: 'workwear',  labelEN: 'Workwear',             labelFR: 'Business / Travail' },
    { id: 'lounge',    labelEN: 'Lounge / Airport look',labelFR: 'Lounge / Look voyage' },
    { id: 'sport',     labelEN: 'Sportswear',           labelFR: 'Sport' },
  ],
  travel: [
    { id: 'beach',         labelEN: 'Beach',                   labelFR: 'Plage' },
    { id: 'mountain',      labelEN: 'Mountain',                labelFR: 'Montagne' },
    { id: 'getaway',       labelEN: 'Short getaway',           labelFR: 'Escapade' },
    { id: 'international', labelEN: 'International destination',labelFR: 'Destination internationale' },
  ],
  events: [
    { id: 'gala',        labelEN: 'Gala / Black tie',  labelFR: 'Gala / Black tie' },
    { id: 'wedding',     labelEN: 'Wedding',            labelFR: 'Mariage' },
    { id: 'birthday',    labelEN: 'Birthday',           labelFR: 'Anniversaire' },
    { id: 'anniversary', labelEN: 'Anniversary',        labelFR: 'Anniversaire de couple' },
    { id: 'corporate',   labelEN: 'Corporate event',    labelFR: 'Événement professionnel' },
  ],
};

const peninsulaTheme = {
  primaryColor: '#233B2B',
  primaryDark: '#111e16',
  accentColor: '#C9A84C',
  backgroundColor: '#F5F0E6',
  heroImage: null,
};

const [form] = await sql`
  INSERT INTO forms (partner_id, created_by, title, slug, config, theme, is_active)
  VALUES (
    ${partner.id}, ${user.id},
    'The Peninsula Paris — Pre-Arrival Survey',
    'peninsula-paris-pre-arrival',
    ${JSON.stringify(peninsulaConfig)},
    ${JSON.stringify(peninsulaTheme)},
    true
  )
  ON CONFLICT (slug) DO UPDATE SET
    config = EXCLUDED.config,
    theme  = EXCLUDED.theme
  RETURNING id, title, public_url_token
`;
console.log('✓ Form:', form.title);
console.log('  Public token:', form.public_url_token);
console.log('\nDone. Visit /dashboard to see the form.');
