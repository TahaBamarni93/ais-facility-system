import { useEffect, useState } from 'react';
import { getStaff, upsertStaff, deleteStaff, getRooms } from '../lib/supabase';
import { BRAND } from '../lib/constants';

export default function StaffPage() {
  const [staff, setStaff]   = useState([]);
  const [rooms, setRooms]   = useState([]);
  const [editing, setEditing] = useState(null); // null | {} | staff object
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState('');

  useEffect(() => {
    Promise.all([getStaff(), getRooms()]).then(([s,r]) => {
      setStaff(s); setRooms(r); setLoading(false);
    });
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  const filtered = staff.filter(s =>
    `${s.first_name} ${s.last_name} ${s.role} ${s.employee_number}`.toLowerCase()
      .includes(search.toLowerCase())
  );

  async function handleSave(form) {
    try {
      const saved = await upsertStaff(form);
      setStaff(prev => {
        const idx = prev.findIndex(s => s.id === saved.id);
        if (idx >= 0) { const n=[...prev]; n[idx]=saved; return n; }
        return [...prev, saved];
      });
      setEditing(null);
      showToast('Staff saved ✓');
    } catch(e) { showToast('Error: '+e.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this staff member?')) return;
    await deleteStaff(id);
    setStaff(prev => prev.filter(s => s.id !== id));
    setEditing(null);
    showToast('Deleted');
  }

  return (
    <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>

      {/* Header bar */}
      <div style={{
        padding:'14px 24px', borderBottom:'1px solid #E5E7EB',
        background:'white', display:'flex', alignItems:'center', gap:12,
      }}>
        <input
          placeholder="Search staff…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            padding:'9px 14px', borderRadius:8, border:'1.5px solid #E5E7EB',
            fontSize:13, outline:'none', width:280, fontFamily:'inherit',
          }}
        />
        <button onClick={() => setEditing({})} style={{
          marginLeft:'auto', padding:'9px 20px', borderRadius:8,
          background:BRAND.navy, color:'white', border:'none',
          fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit',
        }}>
          + Add Staff
        </button>
      </div>

      {/* Table */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 24px' }}>
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'#9CA3AF' }}>Loading…</div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #F3F4F6' }}>
                {['#','Name','Role','Department','Room','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 10px', textAlign:'left', fontWeight:700,
                    fontSize:11, color:'#9CA3AF', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom:'1px solid #F9FAFB' }}
                  onMouseEnter={e => e.currentTarget.style.background='#FAFAFA'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}>
                  <td style={{ padding:'12px 10px', fontFamily:'monospace', fontWeight:700, color:BRAND.yellow }}>
                    {s.employee_number || '—'}
                  </td>
                  <td style={{ padding:'12px 10px', fontWeight:600, color:BRAND.navy }}>
                    {s.first_name} {s.last_name}
                  </td>
                  <td style={{ padding:'12px 10px', color:'#374151' }}>{s.role}</td>
                  <td style={{ padding:'12px 10px', color:'#6B7280' }}>{s.department || '—'}</td>
                  <td style={{ padding:'12px 10px' }}>
                    {s.room ? (
                      <span style={{
                        background:BRAND.navy+'11', color:BRAND.navy,
                        borderRadius:12, padding:'3px 10px', fontWeight:700, fontSize:12,
                        fontFamily:'monospace',
                      }}>
                        {s.room.number} · {s.room.name}
                      </span>
                    ) : <span style={{ color:'#D1D5DB' }}>Unassigned</span>}
                  </td>
                  <td style={{ padding:'12px 10px' }}>
                    <button onClick={() => setEditing(s)} style={actionBtn('#F3F4F6','#374151')}>Edit</button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={6} style={{ padding:40, textAlign:'center', color:'#9CA3AF' }}>
                  No staff found
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit modal */}
      {editing !== null && (
        <StaffModal
          staff={editing}
          rooms={rooms}
          onSave={handleSave}
          onDelete={editing.id ? () => handleDelete(editing.id) : null}
          onClose={() => setEditing(null)}
        />
      )}

      {toast && (
        <div style={{
          position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)',
          background:BRAND.navy, color:'white', padding:'12px 24px',
          borderRadius:8, fontWeight:700, fontSize:13, zIndex:999,
        }}>{toast}</div>
      )}
    </div>
  );
}

function StaffModal({ staff, rooms, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    id:              staff.id || undefined,
    employee_number: staff.employee_number || '',
    first_name:      staff.first_name || '',
    last_name:       staff.last_name || '',
    role:            staff.role || '',
    department:      staff.department || '',
    room_id:         staff.room_id || '',
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div style={{
      position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',
      display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,
    }} onClick={onClose}>
      <div style={{
        background:'white',borderRadius:12,padding:'28px 32px',
        width:460,maxWidth:'95vw',boxShadow:'0 20px 60px rgba(0,0,0,0.25)',
      }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:900,fontSize:18,color:BRAND.navy,marginBottom:20 }}>
          {staff.id ? 'Edit Staff' : 'Add Staff'}
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
          {[
            ['Employee #','employee_number','003'],
            ['First Name & Middle','first_name','Salar Jameel'],
            ['Last Name','last_name','Mohammed'],
            ['Role','role','Registration & Parental Relation'],
            ['Department','department','Admin'],
          ].map(([label, key, ph]) => (
            <div key={key} style={{ gridColumn: key==='role' ? '1/-1' : 'auto' }}>
              <label style={{ display:'block',fontSize:11,fontWeight:700,color:'#6B7280',
                letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:5 }}>{label}</label>
              <input value={form[key]} onChange={e=>set(key,e.target.value)}
                placeholder={ph} style={inputSt} />
            </div>
          ))}

          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ display:'block',fontSize:11,fontWeight:700,color:'#6B7280',
              letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:5 }}>Assign Room</label>
            <select value={form.room_id} onChange={e=>set('room_id',e.target.value)} style={inputSt}>
              <option value="">— No room assigned —</option>
              {rooms.map(r=>(
                <option key={r.id} value={r.id}>{r.number} · {r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display:'flex',gap:10,marginTop:22,justifyContent:'flex-end' }}>
          {onDelete && (
            <button onClick={onDelete} style={btnSt('#FEF2F2','#DC2626')}>Delete</button>
          )}
          <button onClick={onClose} style={btnSt('#F3F4F6','#374151')}>Cancel</button>
          <button onClick={()=>onSave(form)} style={btnSt(BRAND.navy,'white')}>Save</button>
        </div>
      </div>
    </div>
  );
}

const inputSt = {
  width:'100%',padding:'10px 12px',borderRadius:7,
  border:'1.5px solid #E5E7EB',fontSize:13,outline:'none',
  fontFamily:'inherit',boxSizing:'border-box',
};

function btnSt(bg,color){
  return { padding:'10px 20px',borderRadius:8,border:'none',
    background:bg,color,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit' };
}

function actionBtn(bg,color){
  return { padding:'5px 14px',borderRadius:6,border:`1px solid #E5E7EB`,
    background:bg,color,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit' };
}
