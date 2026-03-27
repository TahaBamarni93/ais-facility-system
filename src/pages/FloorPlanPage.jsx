import { useEffect, useState, useCallback } from 'react';
import FloorPlan from '../components/FloorPlan';
import RoomModal from '../components/RoomModal';
import { getRooms, upsertRoom, getStaff } from '../lib/supabase';
import { CATEGORIES, FLOOR_NAMES, BRAND } from '../lib/constants';
import { FLOOR_ROOMS } from '../lib/floorData';

export default function FloorPlanPage() {
  const [floor, setFloor]           = useState(0);
  const [rooms, setRooms]           = useState([]);
  const [staff, setStaff]           = useState([]);
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([getRooms(), getStaff()]);
      setRooms(r);
      setStaff(s);
    } catch (e) {
      showToast('Error loading data: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 3000);
  }

  // Merge DB data with static floor layout
  const floorRooms = (FLOOR_ROOMS[floor] || []).map(staticRoom => {
    const dbRoom = rooms.find(r => r.number === staticRoom.number);
    return dbRoom ? { ...staticRoom, ...dbRoom } : { ...staticRoom, id: staticRoom.number };
  });

  async function handleSave(updatedRoom) {
    setSaving(true);
    try {
      const saved = await upsertRoom(updatedRoom);
      setRooms(prev => {
        const idx = prev.findIndex(r => r.id === saved.id || r.number === saved.number);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [...prev, saved];
      });
      setSelected(null);
      showToast(`Room ${saved.number} saved ✓`);
    } catch (e) {
      showToast('Save failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  // Stats for sidebar
  const currentFloorRooms = floorRooms;
  const catCounts = {};
  currentFloorRooms.forEach(r => { catCounts[r.category] = (catCounts[r.category]||0)+1; });

  return (
    <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink:0,
        background: 'white', borderRight: '1px solid #E5E7EB',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto', padding: '16px 12px',
      }}>
        <div style={{ fontWeight:800, fontSize:11, color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>
          Floor
        </div>
        {FLOOR_NAMES.map((name, i) => (
          <button key={i} onClick={() => setFloor(i)} style={{
            padding:'9px 12px', borderRadius:7, border:'none',
            background: floor===i ? BRAND.navy : 'transparent',
            color: floor===i ? 'white' : '#374151',
            fontWeight:700, fontSize:13, cursor:'pointer', textAlign:'left',
            marginBottom:3, fontFamily:'inherit',
          }}>
            {name}
            <span style={{ float:'right', opacity:0.6, fontWeight:400, fontSize:11 }}>
              {(FLOOR_ROOMS[i]||[]).length} rooms
            </span>
          </button>
        ))}

        <div style={{ borderTop:'1px solid #F3F4F6', margin:'16px 0' }} />

        <div style={{ fontWeight:800, fontSize:11, color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>
          This Floor
        </div>
        {Object.entries(catCounts).map(([cat, count]) => {
          const catInfo = CATEGORIES[cat] || { icon:'📌', label:cat, color:'#6B7280' };
          return (
            <div key={cat} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 4px', fontSize:12 }}>
              <span>{catInfo.icon}</span>
              <span style={{ flex:1, color:'#374151' }}>{catInfo.label}</span>
              <span style={{
                background: catInfo.color + '22', color: catInfo.color,
                borderRadius:12, padding:'2px 8px', fontWeight:700, fontSize:11,
              }}>{count}</span>
            </div>
          );
        })}

        <div style={{ borderTop:'1px solid #F3F4F6', margin:'16px 0' }} />
        <div style={{ fontSize:11, color:'#9CA3AF', lineHeight:1.7 }}>
          <b style={{ color:'#374151' }}>Click</b> any room to edit name, category, class level, color, and staff assignment.<br/><br/>
          Changes save to Supabase instantly.
        </div>
      </aside>

      {/* Main floor plan */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Floor tabs */}
        <div style={{
          display:'flex', gap:4, padding:'10px 16px',
          borderBottom:'1px solid #E5E7EB', background:'white',
          alignItems:'center',
        }}>
          {FLOOR_NAMES.map((name,i) => (
            <button key={i} onClick={() => setFloor(i)} style={{
              padding:'7px 18px', borderRadius:7,
              border:`2px solid ${floor===i ? BRAND.navy : 'transparent'}`,
              background: floor===i ? BRAND.navy : '#F9FAFB',
              color: floor===i ? 'white' : '#374151',
              fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit',
            }}>{name}</button>
          ))}
          {loading && <span style={{ marginLeft:12, fontSize:12, color:'#9CA3AF' }}>Loading…</span>}
          {saving  && <span style={{ marginLeft:12, fontSize:12, color:BRAND.yellow }}>Saving…</span>}
        </div>

        <FloorPlan
          rooms={currentFloorRooms}
          floor={floor}
          onRoomClick={setSelected}
          selectedId={selected?.id}
        />
      </div>

      {/* Room edit modal */}
      {selected && (
        <RoomModal
          room={selected}
          staff={staff}
          onSave={handleSave}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)',
          background: toast.type==='error' ? '#DC2626' : BRAND.navy,
          color:'white', padding:'12px 24px', borderRadius:8,
          fontWeight:700, fontSize:13, zIndex:999,
          boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
