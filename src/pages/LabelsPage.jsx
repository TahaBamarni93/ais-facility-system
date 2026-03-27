import { useEffect, useRef, useState } from 'react';
import { getRooms, getStaff } from '../lib/supabase';
import { StaffLabel, GradeLabel, RoomLabel, ToiletLabel } from '../components/Labels';
import { exportLabelsBulk, exportElementAsPDF } from '../lib/pdfExport';
import { BRAND, TOILET_TYPES, FLOOR_NAMES } from '../lib/constants';

const LABEL_TYPES = [
  { key:'staff',   label:'Staff Label',      desc:'Room # + Staff name + Role' },
  { key:'grade',   label:'Grade/Class Label', desc:'Room # + Grade + Color name' },
  { key:'room',    label:'Room Only Label',   desc:'Room # + Title only' },
  { key:'toilet',  label:'Facility Label',    desc:'Icon + WOMEN / MEN / etc.' },
];

export default function LabelsPage() {
  const [rooms, setRooms]     = useState([]);
  const [staff, setStaff]     = useState([]);
  const [labelType, setLabelType] = useState('staff');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [toiletType, setToiletType] = useState('women');
  const [floorFilter, setFloorFilter] = useState('all');
  const [bulkSelected, setBulkSelected] = useState(new Set());
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);
  const bulkRefs   = useRef({});

  useEffect(() => {
    Promise.all([getRooms(), getStaff()]).then(([r,s]) => {
      setRooms(r); setStaff(s);
      if (r.length) setSelectedRoomId(r[0].id);
      if (s.length) setSelectedStaffId(s[0].id);
    });
  }, []);

  const filteredRooms = floorFilter === 'all'
    ? rooms
    : rooms.filter(r => r.floor === parseInt(floorFilter));

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Auto-select staff assigned to room
  function onRoomChange(id) {
    setSelectedRoomId(id);
    const room = rooms.find(r => r.id === id);
    if (room?.room_id && staff.find(s => s.room_id === room.id)) {
      const assigned = staff.find(s => s.room_id === room.id);
      if (assigned) setSelectedStaffId(assigned.id);
    }
  }

  function toggleBulk(id) {
    setBulkSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAllFiltered() {
    setBulkSelected(new Set(filteredRooms.map(r => r.id)));
  }

  async function exportSingle() {
    if (!previewRef.current) return;
    setExporting(true);
    const num = selectedRoom?.number || toiletType;
    await exportElementAsPDF(previewRef.current, `label_${num}.pdf`);
    setExporting(false);
  }

  async function exportBulk() {
    setExporting(true);
    const els = [...bulkSelected].map(id => bulkRefs.current[id]).filter(Boolean);
    await exportLabelsBulk(els, 'ais_door_labels.pdf');
    setExporting(false);
  }

  function renderLabel(room, forPrint = false) {
    // For staff labels: find staff assigned to this specific room
    const assignedStaff = room ? staff.find(s => s.room_id === room.id) : null;
    // Override only when a specific staff is manually selected and we're in preview mode
    const staffToUse = (!forPrint && selectedStaffId)
      ? staff.find(s => s.id === selectedStaffId) || assignedStaff
      : assignedStaff;

    switch(labelType) {
      case 'staff':  return <StaffLabel  room={room} staffMember={staffToUse} forPrint={forPrint} />;
      case 'grade':  return <GradeLabel  room={room} forPrint={forPrint} />;
      case 'room':   return <RoomLabel   room={room} forPrint={forPrint} />;
      case 'toilet': return <ToiletLabel type={toiletType} forPrint={forPrint} />;
      default:       return null;
    }
  }

  return (
    <div style={{ flex:1, overflow:'hidden', display:'flex', fontFamily:"'Segoe UI',Arial,sans-serif" }}>

      {/* Left controls */}
      <div style={{
        width:280, flexShrink:0, borderRight:'1px solid #E5E7EB',
        background:'white', overflowY:'auto', padding:'20px 16px',
        display:'flex', flexDirection:'column', gap:20,
      }}>
        {/* Label type */}
        <Section title="Label Type">
          {LABEL_TYPES.map(t => (
            <button key={t.key} onClick={() => setLabelType(t.key)} style={{
              width:'100%', padding:'10px 12px', borderRadius:8, border:'none',
              background: labelType===t.key ? BRAND.navy : '#F9FAFB',
              color: labelType===t.key ? 'white' : '#374151',
              textAlign:'left', cursor:'pointer', fontFamily:'inherit',
              marginBottom:4,
            }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{t.label}</div>
              <div style={{ fontSize:11, opacity:0.7, marginTop:2 }}>{t.desc}</div>
            </button>
          ))}
        </Section>

        {/* Floor filter */}
        <Section title="Floor">
          <div style={{ display:'flex', gap:4 }}>
            {['all',0,1,2].map(f => (
              <button key={f} onClick={() => setFloorFilter(f.toString())} style={{
                flex:1, padding:'7px 4px', borderRadius:6, border:'none',
                background: floorFilter===f.toString() ? BRAND.navy : '#F3F4F6',
                color: floorFilter===f.toString() ? 'white' : '#374151',
                fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
              }}>
                {f==='all' ? 'All' : `F${f}`}
              </button>
            ))}
          </div>
        </Section>

        {/* Room selector */}
        {labelType !== 'toilet' && (
          <Section title="Room">
            <select
              value={selectedRoomId}
              onChange={e => onRoomChange(e.target.value)}
              style={selectSt}
            >
              {filteredRooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.number} · {r.name}
                </option>
              ))}
            </select>
          </Section>
        )}

        {/* Staff selector (for staff labels) */}
        {labelType === 'staff' && (
          <Section title="Staff (override)">
            <select value={selectedStaffId} onChange={e => setSelectedStaffId(e.target.value)} style={selectSt}>
              <option value="">— Use room assignment —</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>
                  {s.employee_number} · {s.first_name} {s.last_name}
                </option>
              ))}
            </select>
          </Section>
        )}

        {/* Toilet type selector */}
        {labelType === 'toilet' && (
          <Section title="Facility Type">
            {TOILET_TYPES.map(t => (
              <button key={t.key} onClick={() => setToiletType(t.key)} style={{
                width:'100%', padding:'9px 12px', borderRadius:7, border:'none',
                background: toiletType===t.key ? BRAND.navy : '#F9FAFB',
                color: toiletType===t.key ? 'white' : '#374151',
                textAlign:'left', cursor:'pointer', fontFamily:'inherit',
                fontWeight:700, fontSize:13, marginBottom:3,
              }}>
                {t.label}
              </button>
            ))}
          </Section>
        )}

        {/* Export single */}
        <button onClick={exportSingle} disabled={exporting} style={{
          padding:'12px', borderRadius:8, border:'none',
          background: exporting ? '#9CA3AF' : BRAND.yellow,
          color: exporting ? 'white' : BRAND.navy,
          fontWeight:900, fontSize:13, cursor: exporting ? 'not-allowed' : 'pointer',
          fontFamily:'inherit',
        }}>
          {exporting ? 'Exporting…' : '⬇ Export This Label PDF'}
        </button>
      </div>

      {/* Right: preview + bulk */}
      <div style={{ flex:1, overflowY:'auto', background:'#F8F9FA', padding:'24px' }}>

        {/* Single preview */}
        <div style={{ marginBottom:32 }}>
          <div style={{ fontWeight:800, fontSize:11, color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>
            Preview
          </div>
          <div ref={previewRef} style={{ display:'inline-block' }}>
            {renderLabel(selectedRoom)}
          </div>
        </div>

        {/* Bulk export */}
        {labelType !== 'toilet' && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ fontWeight:800, fontSize:11, color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                Bulk Export ({bulkSelected.size} selected)
              </div>
              <button onClick={selectAllFiltered} style={smallBtn}>Select All</button>
              <button onClick={() => setBulkSelected(new Set())} style={smallBtn}>Clear</button>
              {bulkSelected.size > 0 && (
                <button onClick={exportBulk} disabled={exporting} style={{
                  ...smallBtn,
                  background: BRAND.yellow, color: BRAND.navy, borderColor: BRAND.yellow, fontWeight:900,
                }}>
                  {exporting ? 'Exporting…' : `⬇ Export ${bulkSelected.size} Labels`}
                </button>
              )}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(580px,1fr))', gap:16 }}>
              {filteredRooms.map(room => (
                <div key={room.id} style={{
                  position:'relative', cursor:'pointer',
                  outline: bulkSelected.has(room.id) ? `3px solid ${BRAND.yellow}` : '3px solid transparent',
                  borderRadius:8, overflow:'hidden',
                }} onClick={() => toggleBulk(room.id)}>
                  <div ref={el => bulkRefs.current[room.id] = el}>
                    {renderLabel(room, true)}
                  </div>
                  {bulkSelected.has(room.id) && (
                    <div style={{
                      position:'absolute', top:8, right:8,
                      background:BRAND.yellow, borderRadius:'50%',
                      width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:900, fontSize:14, color:BRAND.navy,
                    }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toilet label grid */}
        {labelType === 'toilet' && (
          <div>
            <div style={{ fontWeight:800, fontSize:11, color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>
              All Facility Labels
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {TOILET_TYPES.map(t => (
                <div key={t.key}>
                  <ToiletLabel type={t.key} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontWeight:800, fontSize:10, color:'#9CA3AF', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

const selectSt = {
  width:'100%', padding:'10px 12px', borderRadius:7,
  border:'1.5px solid #E5E7EB', fontSize:13, outline:'none',
  fontFamily:'inherit', background:'white',
};

const smallBtn = {
  padding:'5px 12px', borderRadius:6, border:'1px solid #E5E7EB',
  background:'white', color:'#374151', fontSize:12, fontWeight:600,
  cursor:'pointer', fontFamily:'inherit',
};
