import { useState, useEffect } from 'react';
import { CATEGORIES, CLASS_LEVELS, CLASS_COLORS, BRAND } from '../lib/constants';

export default function RoomModal({ room, staff, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', category: 'classroom', class_level: '',
    class_color: '', notes: '',
  });

  useEffect(() => {
    if (room) {
      setForm({
        name:        room.name        || '',
        category:    room.category    || 'classroom',
        class_level: room.class_level || '',
        class_color: room.class_color || '',
        notes:       room.notes       || '',
      });
    }
  }, [room]);

  if (!room) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isClassroom = ['classroom','daycare','prek','kg','grade'].includes(form.category);

  // Find staff assigned to this room
  const assignedStaff = (staff || []).filter(s => s.room_id === room.id);

  function handleSave() {
    onSave({ ...room, ...form });
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:200,
    }} onClick={onClose}>
      <div style={{
        background:'white', borderRadius:12, padding:'28px 32px',
        width:480, maxWidth:'95vw', maxHeight:'90vh', overflowY:'auto',
        boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                background: BRAND.navy, color: BRAND.yellow,
                borderRadius:8, padding:'4px 12px',
                fontWeight:900, fontSize:22, fontFamily:'monospace',
              }}>
                {room.number}
              </div>
              <div style={{ fontWeight:700, fontSize:16, color: BRAND.navy }}>
                {room.name}
              </div>
            </div>
            {assignedStaff.length > 0 && (
              <div style={{ marginTop:6, fontSize:12, color:'#6B7280' }}>
                👤 {assignedStaff.map(s => `${s.first_name} ${s.last_name}`).join(', ')}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#9CA3AF', padding:'0 4px' }}>✕</button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Name */}
          <Field label="Room Name">
            <input value={form.name} onChange={e => set('name', e.target.value)}
              style={inputStyle} placeholder="e.g. Grade 5 Blue" />
          </Field>

          {/* Category */}
          <Field label="Category">
            <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
              {Object.entries(CATEGORIES).map(([k,v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </Field>

          {/* Class level — only for classrooms */}
          {isClassroom && (
            <Field label="Class Level">
              <select value={form.class_level} onChange={e => set('class_level', e.target.value)} style={inputStyle}>
                <option value="">— Select level —</option>
                {CLASS_LEVELS.map(l => (
                  <option key={l} value={l}>{l}{l==='Grade 10' ? ' (upcoming)' : ''}</option>
                ))}
              </select>
            </Field>
          )}

          {/* Class color */}
          {isClassroom && form.class_level && (
            <Field label="Class Color">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <button
                  onClick={() => set('class_color', '')}
                  style={{
                    padding:'6px 14px', borderRadius:20,
                    border:`2px solid ${!form.class_color ? BRAND.navy : '#E5E7EB'}`,
                    background: !form.class_color ? '#F3F4F6' : 'white',
                    color:'#374151', fontSize:12, fontWeight:600, cursor:'pointer',
                  }}
                >None</button>
                {Object.entries(CLASS_COLORS).map(([name, hex]) => (
                  <button
                    key={name}
                    onClick={() => set('class_color', form.class_color === name ? '' : name)}
                    style={{
                      padding:'6px 14px', borderRadius:20,
                      border:`2px solid ${form.class_color === name ? hex : '#E5E7EB'}`,
                      background: form.class_color === name ? hex + '22' : 'white',
                      color: form.class_color === name ? hex : '#374151',
                      fontSize:12, fontWeight:700, cursor:'pointer',
                      display:'flex', alignItems:'center', gap:6,
                    }}
                  >
                    <span style={{ width:10, height:10, borderRadius:'50%', background:hex, display:'inline-block' }} />
                    {name}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {/* Notes */}
          <Field label="Notes (semester info, etc.)">
            <input value={form.notes} onChange={e => set('notes', e.target.value)}
              style={inputStyle} placeholder="e.g. Semester 1 · 2024–2025" />
          </Field>

          {/* Staff assigned info */}
          <div style={{ background:'#F9FAFB', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#6B7280' }}>
            <b style={{ color:'#374151' }}>Staff assignment:</b> Manage in the Staff tab. Assign staff to room by editing the staff member directly.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:24 }}>
          <button onClick={onClose} style={btnStyle('#F3F4F6','#374151')}>Cancel</button>
          <button onClick={handleSave} style={btnStyle(BRAND.navy, 'white')}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6B7280',
        letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:'10px 12px', borderRadius:7,
  border:'1.5px solid #E5E7EB', fontSize:13, outline:'none',
  fontFamily:'inherit', boxSizing:'border-box', background:'white',
};

function btnStyle(bg, color) {
  return {
    padding:'10px 22px', borderRadius:8, border:'none',
    background:bg, color, fontSize:13, fontWeight:700,
    cursor:'pointer', fontFamily:'inherit',
  };
}

  if (!room) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isClassroom = ['classroom','daycare','prek','kg','grade'].includes(form.category);

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:200,
    }} onClick={onClose}>
      <div style={{
        background:'white', borderRadius:12, padding:'28px 32px',
        width:480, maxWidth:'95vw', maxHeight:'90vh', overflowY:'auto',
        boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
          <div>
            <div style={{ fontWeight:900, fontSize:20, color:BRAND.navy }}>
              Room {room.number}
            </div>
            <div style={{ color:'#6B7280', fontSize:13, marginTop:2 }}>{room.name}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#9CA3AF' }}>✕</button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Name */}
          <Field label="Room Name">
            <input value={form.name} onChange={e => set('name', e.target.value)}
              style={inputStyle} placeholder="e.g. Grade 5 Blue" />
          </Field>

          {/* Category */}
          <Field label="Category">
            <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
              {Object.entries(CATEGORIES).map(([k,v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </Field>

          {/* Class level — only for classrooms */}
          {isClassroom && (
            <Field label="Class Level">
              <select value={form.class_level} onChange={e => set('class_level', e.target.value)} style={inputStyle}>
                <option value="">— Select level —</option>
                {CLASS_LEVELS.map(l => <option key={l} value={l}>{l}{l==='Grade 10'?' (upcoming)':''}</option>)}
              </select>
            </Field>
          )}

          {/* Class color */}
          {isClassroom && (
            <Field label="Class Color">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {Object.entries(CLASS_COLORS).map(([name, hex]) => (
                  <button
                    key={name}
                    onClick={() => set('class_color', form.class_color === name ? '' : name)}
                    style={{
                      padding:'6px 14px', borderRadius:20,
                      border:`2px solid ${form.class_color === name ? hex : '#E5E7EB'}`,
                      background: form.class_color === name ? hex + '22' : 'white',
                      color: form.class_color === name ? hex : '#374151',
                      fontSize:12, fontWeight:700, cursor:'pointer',
                      display:'flex', alignItems:'center', gap:6,
                    }}
                  >
                    <span style={{ width:10, height:10, borderRadius:'50%', background:hex, display:'inline-block' }} />
                    {name}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {/* Assign staff */}
          <Field label="Assigned Staff">
            <select value={form.staff_id} onChange={e => set('staff_id', e.target.value)} style={inputStyle}>
              <option value="">— No staff assigned —</option>
              {(staff || []).map(s => (
                <option key={s.id} value={s.id}>
                  {s.employee_number} · {s.first_name} {s.last_name} — {s.role}
                </option>
              ))}
            </select>
          </Field>

          {/* Notes */}
          <Field label="Notes (semester info, etc.)">
            <input value={form.notes} onChange={e => set('notes', e.target.value)}
              style={inputStyle} placeholder="e.g. Semester 1 · 2024–2025" />
          </Field>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:24 }}>
          <button onClick={onClose} style={btnStyle('#F3F4F6','#374151')}>Cancel</button>
          <button
            onClick={() => onSave({ ...room, ...form })}
            style={btnStyle(BRAND.navy, 'white')}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6B7280',
        letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:'10px 12px', borderRadius:7,
  border:'1.5px solid #E5E7EB', fontSize:13, outline:'none',
  fontFamily:'inherit', boxSizing:'border-box', background:'white',
};

function btnStyle(bg, color) {
  return {
    padding:'10px 22px', borderRadius:8, border:'none',
    background:bg, color, fontSize:13, fontWeight:700,
    cursor:'pointer', fontFamily:'inherit',
  };
}
