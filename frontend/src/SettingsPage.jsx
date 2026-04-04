import React, { useState } from 'react';
import { Card, CardTitle, Btn, Field, TextInput, Select, Alert } from './components';

export default function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'fields', label: 'Fields & Options' },
    { id: 'deploy', label: 'Deploy' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--plum-dark)', marginBottom: 4, letterSpacing: '0.01em' }}>
        Survey Settings
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, fontWeight: 300 }}>
        Configure form fields, language and deployment
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--beige-mid)', marginBottom: 28, gap: 0 }}>
        {tabs.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 24px', fontSize: 13, cursor: 'pointer',
            borderBottom: `2px solid ${tab === t.id ? 'var(--plum)' : 'transparent'}`,
            color: tab === t.id ? 'var(--plum)' : 'var(--text-muted)',
            fontWeight: tab === t.id ? 400 : 300, transition: 'all 0.2s',
          }}>
            {t.label}
          </div>
        ))}
      </div>

      {/* General */}
      {tab === 'general' && (
        <>
          <Card style={{ marginBottom: 20 }}>
            <CardTitle>Survey Identity</CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="Hotel Partner Name"><TextInput value="The Peninsula Paris" onChange={() => {}} /></Field>
              <Field label="Village Name"><TextInput value="La Vallée Village" onChange={() => {}} /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="PS Team Email"><TextInput type="email" value="" onChange={() => {}} placeholder="personalshoppers@lavallee.com" /></Field>
              <Field label="Thank You Message (EN)"><TextInput value="Your Personal Shopper will be in touch before your arrival." onChange={() => {}} /></Field>
            </div>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <CardTitle>Language</CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Default Language">
                <Select value="en" onChange={() => {}} options={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }]} />
              </Field>
              <Field label="Enable Bilingual Toggle">
                <Select value="yes" onChange={() => {}} options={[{ value: 'yes', label: 'Yes — EN + FR' }, { value: 'no', label: 'English only' }]} />
              </Field>
            </div>
          </Card>

          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Btn variant="primary" onClick={save}>Save Settings</Btn>
          </div>
          <Alert message="Settings saved successfully." visible={saved} />
        </>
      )}

      {/* Fields */}
      {tab === 'fields' && (
        <>
          {[
            { title: 'Style Archetypes — Female (Q12a)', items: ['Casual Luxury', 'Parisian Elegance', 'Bold & Colorful', 'Boho Romantic'] },
            { title: 'Style Archetypes — Male (Q12b)', items: ['Casual', 'Classic', 'Bold', 'Street'] },
            { title: 'Categories (Q11)', items: ['Clothing', 'Accessories', 'Leather Goods', 'Shoes', 'Watches', 'Jewelry'] },
            { title: 'Purpose Options (Q9)', items: ['Discover new styles curated just for me', 'A relaxing and luxury shopping escape', 'A transformational styling moment', 'A special celebration'] },
          ].map(section => (
            <Card key={section.title} style={{ marginBottom: 20 }}>
              <CardTitle>{section.title}</CardTitle>
              {section.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <TextInput value={item} onChange={() => {}} style={{ flex: 1 }} />
                  <Btn variant="danger" size="sm" onClick={() => {}}>✕</Btn>
                </div>
              ))}
              <Btn variant="outline" size="sm" onClick={() => {}}>+ Add Option</Btn>
            </Card>
          ))}
        </>
      )}

      {/* Deploy */}
      {tab === 'deploy' && (
        <>
          <Card style={{ marginBottom: 20 }}>
            <CardTitle>Vercel Deployment</CardTitle>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 20, fontWeight: 300 }}>
              This project is a standard Vite + React app. Deploy to Vercel in minutes with zero cost on the Hobby plan.
            </div>
            <div style={{ background: 'var(--plum-dark)', borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem', fontFamily: 'monospace', fontSize: 13, color: '#e8e0d0', marginBottom: 16, lineHeight: 2 }}>
              <div style={{ color: 'rgba(245,240,230,0.4)', fontSize: 11, marginBottom: 4 }}># Install Vercel CLI once</div>
              npm install -g vercel<br />
              <div style={{ color: 'rgba(245,240,230,0.4)', fontSize: 11, margin: '8px 0 4px' }}># Build and deploy</div>
              npm run build<br />
              vercel deploy ./dist --prod
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300 }}>
              Or connect your GitHub repo to Vercel for automatic deployments on every push.
            </div>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <CardTitle>Data Storage Options</CardTitle>
            {[
              { name: 'localStorage (current)', desc: 'Demo mode — data stored in browser. No backend needed.', badge: 'Active', badgeV: 'green' },
              { name: 'Microsoft Graph API', desc: 'Write directly to SharePoint list on submit. Requires Azure App Registration and Graph permissions.', badge: 'Recommended', badgeV: 'gold' },
              { name: 'Power Automate Webhook', desc: 'POST to a Power Automate HTTP trigger on submit. Simplest integration path for Microsoft 365 environments.', badge: 'Easy', badgeV: 'plum' },
            ].map(opt => (
              <div key={opt.name} style={{ padding: '14px 0', borderBottom: '1px solid var(--beige-mid)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--plum-dark)', marginBottom: 4 }}>{opt.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.6 }}>{opt.desc}</div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {React.createElement(require('./components').Badge, { label: opt.badge, variant: opt.badgeV })}
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <CardTitle>Environment Variables</CardTitle>
            <div style={{ background: 'var(--plum-dark)', borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem', fontFamily: 'monospace', fontSize: 12, color: '#e8e0d0', lineHeight: 2.2 }}>
              <span style={{ color: 'var(--gold)' }}>VITE_SP_SITE_URL</span>=https://yourcompany.sharepoint.com/sites/LVV<br />
              <span style={{ color: 'var(--gold)' }}>VITE_SP_LIST_NAME</span>=LVV_PreArrival<br />
              <span style={{ color: 'var(--gold)' }}>VITE_PA_WEBHOOK_URL</span>=https://prod-xx.westeurope.logic.azure.com/...<br />
              <span style={{ color: 'var(--gold)' }}>VITE_PS_EMAIL</span>=personalshoppers@lavallee.com
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
