import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AISLogo } from '../assets/AISLogo';
import { BRAND } from '../lib/constants';
import FloorPlanPage from './FloorPlanPage';
import StaffPage     from './StaffPage';
import LabelsPage    from './LabelsPage';

const NAV = [
  { key:'floorplan', icon:'🏛️', label:'Floor Plan' },
  { key:'staff',     icon:'👥', label:'Staff' },
  { key:'labels',    icon:'🏷️', label:'Door Labels' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const [page, setPage] = useState('floorplan');

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: '#F8F9FA',
    }}>
      {/* Top nav */}
      <header style={{
        height: 56, background: BRAND.navy,
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 16, flexShrink: 0,
        borderBottom: `3px solid ${BRAND.yellow}`,
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginRight:16 }}>
          <AISLogo size={34} />
          <div>
            <div style={{ fontWeight:900, fontSize:11, color:'white', letterSpacing:'0.06em', lineHeight:1.2 }}>
              THE AMERICAN INTERNATIONAL SCHOOL
            </div>
            <div style={{ fontSize:9, color:BRAND.yellow, fontWeight:700, letterSpacing:'0.1em' }}>
              FACILITY MANAGEMENT SYSTEM
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ display:'flex', gap:4, flex:1 }}>
          {NAV.map(n => (
            <button key={n.key} onClick={() => setPage(n.key)} style={{
              padding: '7px 18px', borderRadius: 7, border: 'none',
              background: page===n.key ? BRAND.yellow : 'transparent',
              color: page===n.key ? BRAND.navy : 'rgba(255,255,255,0.75)',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>

        {/* User */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{user?.email}</span>
          <button onClick={signOut} style={{
            padding:'6px 14px', borderRadius:6,
            border:'1px solid rgba(255,255,255,0.3)',
            background:'transparent', color:'rgba(255,255,255,0.8)',
            fontSize:12, cursor:'pointer', fontFamily:'inherit',
          }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Page content */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {page === 'floorplan' && <FloorPlanPage />}
        {page === 'staff'     && <StaffPage />}
        {page === 'labels'    && <LabelsPage />}
      </div>
    </div>
  );
}
