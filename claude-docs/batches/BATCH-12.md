# BATCH-12 — Rebranding couleur : Prune → Vert Sapin (#233B2B)

## Commit
`feat(BATCH-12): rebrand — replace plum #523849 with forest green #233B2B collection palette`

## Contexte
La couleur principale passe du prune (#523849) au vert sapin LVV (#233B2B).
Le fichier `index.css` et `CONTEXT.md` sont déjà mis à jour avec les nouveaux tokens.
Ce batch applique le changement partout dans les composants React et valeurs hardcodées.

## Nouvelle palette
```
--plum:      #233B2B   (vert sapin — était #523849)
--plum-dark: #111e16   (vert très sombre — était #2a1a22)
--plum-mid:  #2f5039   (vert moyen — était #6b4a5e)
--gold:      #C9A84C   (inchangé)
--beige:     #F5F0E6   (inchangé)
--text-muted:#6a7d6f   (légèrement verdâtre — était #8a7080)
```

## Règle principale
Toutes les couleurs passent par les variables CSS var(--plum), var(--plum-dark), var(--plum-mid).
Ce batch traque et remplace les valeurs HEX hardcodées résiduelles.

---

## Task 1 — Global search & replace dans frontend/src/

Rechercher et remplacer dans TOUS les fichiers .jsx et .js de frontend/src/ :

| Ancien HEX       | Nouveau HEX    |
|------------------|----------------|
| #523849          | #233B2B        |
| #2a1a22          | #111e16        |
| #6b4a5e          | #2f5039        |
| rgba(82, 56, 73  | rgba(35, 59, 43 |
| rgba(82,56,73    | rgba(35,59,43   |
| rgba(42,26,34    | rgba(17,30,22   |
| rgba(42, 26, 34  | rgba(17, 30, 22 |

Commande PowerShell pour vérifier les occurrences après remplacement :
```powershell
Select-String -Path "frontend\src\**\*.jsx","frontend\src\**\*.js" `
  -Pattern "#523849|#2a1a22|#6b4a5e|82, 56, 73|42,26,34" -Recurse
```
Résultat attendu : 0 occurrences.

---

## Task 2 — Gradient hero (start screen)

Dans PublicSurveyPage.jsx ou SurveyForm.jsx :

```jsx
// AVANT
background: `
  radial-gradient(ellipse at 20% 50%, rgba(82,56,73,0.6) 0%, transparent 60%),
  linear-gradient(160deg, #1a0a12 0%, #2a1a22 40%, #3d2030 70%, #523849 100%)
`

// APRES
background: `
  radial-gradient(ellipse at 20% 50%, rgba(35,59,43,0.6) 0%, transparent 60%),
  radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
  linear-gradient(160deg, #080f09 0%, #111e16 40%, #1a2e1e 70%, #233B2B 100%)
`
```

---

## Task 3 — Partner theme preset en DB

Dans backend/src/seed.js ou via migration :

```sql
UPDATE partners SET theme_preset = '{
  "primaryColor": "#233B2B",
  "primaryDark": "#111e16",
  "accentColor": "#C9A84C",
  "backgroundColor": "#F5F0E6"
}'::jsonb
WHERE slug = 'peninsula-paris';
```

---

## Acceptance Criteria
- [ ] 0 occurrences de #523849 ou #2a1a22 dans frontend/src/
- [ ] Hero gradient en teintes vertes sapin
- [ ] Nav admin verte (pas prune)
- [ ] Formulaire guest — boutons, progress bar, sélections en vert sapin
- [ ] Accent doré #C9A84C inchangé sur les selections et checkmarks
- [ ] Partner Peninsula theme_preset mis à jour en DB
- [ ] npm run build passe 0 erreurs
- [ ] Git commit + push: feat(BATCH-12): rebrand — forest green #233B2B replaces plum
