import { AISLogo } from '../assets/AISLogo';
import { CLASS_COLORS, BRAND } from '../lib/constants';

// ── SHARED LABEL WRAPPER ─────────────────────────────────
// All labels: 560×220px (A4 landscape proportional, printable)
const W = 560;
const H = 210;
const LEFT_W = 175;

function LabelShell({ leftContent, rightContent, forPrint }) {
  return (
    <div style={{
      width: W, height: H,
      display: 'flex',
      fontFamily: "'Arial Black', 'Arial Bold', Arial, sans-serif",
      boxShadow: forPrint ? 'none' : '0 4px 24px rgba(0,0,0,0.18)',
      borderRadius: forPrint ? 0 : 6,
      overflow: 'hidden',
      pageBreakInside: 'avoid',
    }}>
      {/* LEFT — Navy box */}
      <div style={{
        width: LEFT_W, background: BRAND.navy,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', flexShrink: 0,
      }}>
        {leftContent}
        {/* Gold bar bottom */}
        <div style={{
          position: 'absolute', bottom: 16, left: 20, right: 20,
          height: 6, background: BRAND.yellow, borderRadius: 3,
        }} />
      </div>

      {/* RIGHT — White box */}
      <div style={{
        flex: 1, background: 'white',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '12px 24px', gap: 0,
      }}>
        {rightContent}
      </div>
    </div>
  );
}

// ── ROOM NUMBER (left panel) ──────────────────────────────
function RoomNumber({ number }) {
  const fontSize = number.length <= 3 ? 72 : 56;
  return (
    <div style={{
      color: 'white', fontSize, fontWeight: 900,
      lineHeight: 1, letterSpacing: '-2px',
      fontFamily: "'Arial Black', Arial, sans-serif",
    }}>
      {number}
    </div>
  );
}

// ── LOGO HEADER (right panel top) ────────────────────────
function LogoHeader() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
      <AISLogo size={40} />
      <div>
        <div style={{ fontWeight:900, fontSize:12, color:BRAND.navy, letterSpacing:'0.05em', lineHeight:1.2 }}>
          THE AMERICAN
        </div>
        <div style={{ fontWeight:900, fontSize:12, color:BRAND.navy, letterSpacing:'0.05em', lineHeight:1.2 }}>
          INTERNATIONAL SCHOOL
        </div>
      </div>
    </div>
  );
}

function GoldBar({ style }) {
  return (
    <div style={{
      height: 5, background: BRAND.yellow, borderRadius: 2,
      width: '80%', ...style,
    }} />
  );
}

// ══════════════════════════════════════════════════════════
// LABEL TYPE 1 — STAFF
// Left: room number | Right: logo · staff name · gold bar · role
// ══════════════════════════════════════════════════════════
export function StaffLabel({ room, staffMember, forPrint }) {
  const number = room?.number || '000';
  const name   = staffMember
    ? `${staffMember.first_name} ${staffMember.last_name}`
    : 'Staff Name';
  const role   = staffMember?.role || 'Role';

  return (
    <LabelShell
      forPrint={forPrint}
      leftContent={<RoomNumber number={number} />}
      rightContent={
        <>
          <LogoHeader />
          <div style={{
            fontWeight: 900, fontSize: name.length > 20 ? 22 : 28,
            color: BRAND.navy, textAlign: 'center', lineHeight: 1.15,
            marginBottom: 6,
          }}>
            {name}
          </div>
          <GoldBar style={{ marginBottom: 6 }} />
          <div style={{
            fontWeight: 700, fontSize: 16, color: BRAND.navy,
            textAlign: 'center', lineHeight: 1.3,
          }}>
            {role}
          </div>
        </>
      }
    />
  );
}

// ══════════════════════════════════════════════════════════
// LABEL TYPE 2 — GRADE / CLASS
// Left: room number | Right: logo · Grade X · gold bar · Blue (in blue)
// ══════════════════════════════════════════════════════════
export function GradeLabel({ room, forPrint }) {
  const number     = room?.number || '000';
  const level      = room?.class_level || 'Grade —';
  const colorName  = room?.class_color || '';
  const colorHex   = CLASS_COLORS[colorName] || BRAND.navy;

  return (
    <LabelShell
      forPrint={forPrint}
      leftContent={<RoomNumber number={number} />}
      rightContent={
        <>
          <LogoHeader />
          <div style={{
            fontWeight: 900, fontSize: 36, color: BRAND.navy,
            textAlign: 'center', lineHeight: 1.1, marginBottom: 4,
          }}>
            {level}
          </div>
          <GoldBar style={{ marginBottom: 6 }} />
          {colorName && (
            <div style={{
              fontWeight: 900, fontSize: 30, color: colorHex,
              textAlign: 'center', lineHeight: 1,
            }}>
              {colorName}
            </div>
          )}
        </>
      }
    />
  );
}

// ══════════════════════════════════════════════════════════
// LABEL TYPE 3 — ROOM ONLY (title)
// Left: room number | Right: logo · room title · gold bar
// ══════════════════════════════════════════════════════════
export function RoomLabel({ room, forPrint }) {
  const number = room?.number || '000';
  const name   = room?.name || 'Room';

  return (
    <LabelShell
      forPrint={forPrint}
      leftContent={<RoomNumber number={number} />}
      rightContent={
        <>
          <LogoHeader />
          <div style={{
            fontWeight: 900, fontSize: name.length > 22 ? 22 : 28,
            color: BRAND.navy, textAlign: 'center', lineHeight: 1.2,
            marginBottom: 8,
          }}>
            {name}
          </div>
          <GoldBar />
        </>
      }
    />
  );
}

// ══════════════════════════════════════════════════════════
// LABEL TYPE 4 — TOILET / FACILITY
// Left: icon | Right: logo · WOMEN / MEN etc · gold underline
// ══════════════════════════════════════════════════════════
const TOILET_ICONS = {
  women:    <ToiletWoman />,
  men:      <ToiletMan />,
  disabled: <ToiletDisabled />,
  girls:    <ToiletGirl />,
  boys:     <ToiletBoy />,
};

export function ToiletLabel({ type = 'women', forPrint }) {
  const labels = {
    women:'WOMEN', men:'MEN', disabled:'DISABLED', girls:'GIRLS', boys:'BOYS',
  };
  const label = labels[type] || 'WC';

  return (
    <LabelShell
      forPrint={forPrint}
      leftContent={
        <div style={{ color:'white', fontSize:80 }}>
          {TOILET_ICONS[type]}
        </div>
      }
      rightContent={
        <>
          <LogoHeader />
          <div style={{
            fontWeight: 900, fontSize: label.length > 5 ? 44 : 56,
            color: BRAND.navy, letterSpacing: '0.04em',
          }}>
            {label}
          </div>
          <GoldBar style={{ marginTop: 8 }} />
        </>
      }
    />
  );
}

// ── SVG toilet icons (white, minimal) ────────────────────
function ToiletWoman() {
  return (
    <svg width="70" height="120" viewBox="0 0 70 120" fill="white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="12" r="11"/>
      <path d="M20 30 Q12 55 15 80 L25 80 L25 105 Q25 110 35 110 Q45 110 45 105 L45 80 L55 80 Q58 55 50 30 Q42 22 35 22 Q28 22 20 30Z"/>
      <path d="M18 32 Q8 48 12 68 L22 68 L20 30Z" opacity="0.6"/>
      <path d="M52 32 Q62 48 58 68 L48 68 L50 30Z" opacity="0.6"/>
    </svg>
  );
}

function ToiletMan() {
  return (
    <svg width="70" height="120" viewBox="0 0 70 120" fill="white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="12" r="11"/>
      <rect x="22" y="28" width="26" height="42" rx="4"/>
      <rect x="22" y="68" width="10" height="40" rx="4"/>
      <rect x="38" y="68" width="10" height="40" rx="4"/>
    </svg>
  );
}

function ToiletDisabled() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="12" r="10"/>
      <path d="M40 26 L35 60 L60 60 L65 75 L78 72 L72 55 L50 55 L53 35 Z"/>
      <circle cx="40" cy="78" r="16" fill="none" stroke="white" strokeWidth="8"/>
      <path d="M28 62 L20 75" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}

function ToiletGirl() {
  return (
    <svg width="65" height="115" viewBox="0 0 65 115" fill="white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="11" r="10"/>
      {/* bow */}
      <path d="M22 5 Q27 10 32 8 Q37 10 42 5 Q37 2 32 4 Q27 2 22 5Z" opacity="0.9"/>
      <path d="M18 28 Q10 52 13 75 L23 75 L23 100 Q23 105 32 105 Q41 105 41 100 L41 75 L51 75 Q54 52 46 28 Q40 21 32 21 Q24 21 18 28Z"/>
    </svg>
  );
}

function ToiletBoy() {
  return (
    <svg width="65" height="115" viewBox="0 0 65 115" fill="white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="11" r="10"/>
      <rect x="20" y="27" width="24" height="38" rx="4"/>
      <rect x="20" y="63" width="9" height="38" rx="4"/>
      <rect x="35" y="63" width="9" height="38" rx="4"/>
      {/* shorts line */}
      <line x1="20" y1="50" x2="44" y2="50" stroke="#0D1B3E" strokeWidth="2"/>
    </svg>
  );
}
