# AIS Facility Management System — Setup Guide

## What's in this folder

```
ais-system/
├── schema.sql              ← Run this ONCE in Supabase SQL editor
├── netlify.toml            ← Netlify deployment config
├── package.json
└── src/
    ├── App.jsx             ← Root (auth routing)
    ├── index.js
    ├── assets/
    │   └── AISLogo.jsx     ← School logo SVG
    ├── components/
    │   ├── FloorPlan.jsx   ← Interactive SVG floor maps
    │   ├── Labels.jsx      ← All 4 door label types
    │   └── RoomModal.jsx   ← Room edit popup
    ├── hooks/
    │   └── useAuth.jsx     ← Supabase auth context
    ├── lib/
    │   ├── constants.js    ← Categories, class levels, colors
    │   ├── floorData.js    ← Room coordinates (from AutoCAD plans)
    │   ├── pdfExport.js    ← PDF/print export
    │   └── supabase.js     ← Database client + queries
    └── pages/
        ├── Login.jsx
        ├── AdminLayout.jsx ← Nav shell
        ├── FloorPlanPage.jsx
        ├── StaffPage.jsx
        └── LabelsPage.jsx
```

---

## STEP 1 — Supabase Setup

1. Go to https://supabase.com/dashboard/project/zcruhhvqyjcrwgjzvzwd
2. Click **SQL Editor** in the left sidebar
3. Paste the entire contents of `schema.sql` and click **Run**
4. This creates: `rooms`, `staff`, `label_exports` tables + seeds all rooms and staff from your PDFs

### Create your admin user
In Supabase → **Authentication** → **Users** → **Add User**:
- Email: your email
- Password: choose a strong password
- This is the login for the system

---

## STEP 2 — Deploy to Netlify

### Option A — Connect via GitHub (recommended)
1. Push this folder to a GitHub repo (private)
2. Go to https://app.netlify.com → **Add new site** → **Import from Git**
3. Choose your repo
4. Build command: `npm run build`
5. Publish directory: `build`
6. Click **Deploy**

### Option B — Drag and drop (quick)
1. Run locally: `npm install && npm run build`
2. Go to https://app.netlify.com → drag the `build/` folder onto the deploy area

### Set the URL path (optional)
The app will live at your Netlify URL root. If you want it at `pixtra.co/admin`:
- In Netlify → **Domain settings** → configure your custom domain
- Or use a subdomain: `admin.pixtra.co`

---

## STEP 3 — Local development

```bash
cd ais-system
npm install
npm start
```
Opens at http://localhost:3000 — sign in with your Supabase admin user.

---

## How the system works

### Floor Plan
- Click any room → edit panel opens
- Set: name, category, class level (KG Blue / Grade 5 Yellow etc.), staff assignment, notes
- Every save goes to Supabase instantly — no export needed
- Scroll to zoom, drag to pan

### Staff
- Add / edit / delete staff members
- Assign each staff to a room
- Employee number matches your door label numbering

### Door Labels
- Choose label type: Staff / Grade / Room / Facility
- Select a room or toilet type
- Preview updates live
- **Export This Label PDF** — single label as PDF
- **Bulk Export** — select multiple rooms, export all as one multi-page PDF

### Label types produced (matching your existing designs exactly):
| Type | Left panel | Right panel |
|---|---|---|
| Staff | Navy + room number + gold bar | AIS logo + staff name + gold divider + role |
| Grade | Navy + room number + gold bar | AIS logo + Grade X + gold divider + color name in color |
| Room only | Navy + room number + gold bar | AIS logo + room title + gold bar |
| Facility | Navy + gender icon + gold bar | AIS logo + WOMEN/MEN/etc in large bold |

---

## Room numbering system
- Ground floor: 001 – 035
- First floor:  101 – 131
- Second floor: 201 – 228

---

## Future: Staff ID Cards
The `staff` table already has all fields needed:
- `employee_number`, `first_name`, `last_name`, `role`, `department`, `photo_url`
- When you're ready, add a new page `IDCardsPage.jsx` using the same pattern

---

## Support
All data is in your Supabase project: https://supabase.com/dashboard/project/zcruhhvqyjcrwgjzvzwd
