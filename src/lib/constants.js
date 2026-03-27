// ── SCHOOL BRANDING ───────────────────────────────────────
export const BRAND = {
  navy:   '#0D1B3E',
  yellow: '#C9A84C',
  silver: '#A8A9AD',
  white:  '#FFFFFF',
};

// ── ROOM CATEGORIES ───────────────────────────────────────
export const CATEGORIES = {
  classroom: { label: 'Classroom',      color: '#1D4ED8', icon: '🎓' },
  admin:     { label: 'Admin',          color: '#C9A84C', icon: '🏛️' },
  lab:       { label: 'Lab / Science',  color: '#059669', icon: '🔬' },
  computer:  { label: 'Computer Lab',   color: '#7C3AED', icon: '💻' },
  art:       { label: 'Art Room',       color: '#DB2777', icon: '🎨' },
  music:     { label: 'Music Room',     color: '#EA580C', icon: '🎵' },
  library:   { label: 'Library',        color: '#0369A1', icon: '📚' },
  clinic:    { label: 'Clinic',         color: '#DC2626', icon: '🏥' },
  common:    { label: 'Common Area',    color: '#6B7280', icon: '🏠' },
  storage:   { label: 'Storage',        color: '#374151', icon: '📦' },
  wc:        { label: 'WC',             color: '#0284C7', icon: '🚻' },
  stage:     { label: 'Stage / Hall',   color: '#7C2D12', icon: '🎭' },
  daycare:   { label: 'Daycare',        color: '#F472B6', icon: '🧸' },
  prek:      { label: 'Pre-K',          color: '#FB923C', icon: '🌟' },
  kg:        { label: 'Kindergarten',   color: '#34D399', icon: '🌈' },
  grade:     { label: 'Grade Class',    color: '#60A5FA', icon: '📖' },
};

// ── CLASS LEVELS ──────────────────────────────────────────
export const CLASS_LEVELS = [
  'Daycare',
  'Pre-K',
  'KG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10', // upcoming
];

// ── CLASS COLORS ──────────────────────────────────────────
export const CLASS_COLORS = {
  Yellow: '#F5C518',
  Blue:   '#2563EB',
  Orange: '#F97316',
  Red:    '#EF4444',
  Green:  '#22C55E',
  Purple: '#A855F7',
  Pink:   '#EC4899',
  White:  '#F9FAFB',
};

// ── TOILET LABEL TYPES ────────────────────────────────────
export const TOILET_TYPES = [
  { key: 'women',    label: 'WOMEN',    icon: 'woman' },
  { key: 'men',      label: 'MEN',      icon: 'man' },
  { key: 'disabled', label: 'DISABLED', icon: 'wheelchair' },
  { key: 'girls',    label: 'GIRLS',    icon: 'girl' },
  { key: 'boys',     label: 'BOYS',     icon: 'boy' },
];

// ── LABEL TYPES ───────────────────────────────────────────
// staff:  room number | staff name | role
// grade:  room number | grade level | class color
// room:   room number | room title only
// toilet: toilet icon | toilet type
export const LABEL_TYPES = ['staff','grade','room','toilet'];

export const FLOOR_NAMES = ['Ground Floor', 'First Floor', 'Second Floor'];
export const FLOOR_PREFIXES = ['0', '1', '2'];
