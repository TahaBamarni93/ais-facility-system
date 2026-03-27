import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, BRAND } from '../lib/constants';
import { SVG_W, SVG_H } from '../lib/floorData';

const FLOOR_NAMES = ['Ground Floor', 'First Floor', 'Second Floor'];

export default function FloorPlan({ rooms, floor, onRoomClick, selectedId }) {
  const wrapRef = useRef(null);
  const [scale, setScale]   = useState(1);
  const [pan, setPan]       = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ mx:0, my:0, px:0, py:0 });
  const [hovered, setHovered] = useState(null);

  // Fit to container on mount / floor change
  useEffect(() => {
    if (!wrapRef.current) return;
    const { width, height } = wrapRef.current.getBoundingClientRect();
    const s = Math.min((width - 40) / SVG_W, (height - 40) / SVG_H) * 0.95;
    setScale(s);
    setPan({ x: (width - SVG_W * s) / 2, y: 10 });
  }, [floor]);

  function onWheel(e) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale(s => Math.min(5, Math.max(0.2, s * factor)));
  }

  function onMouseDown(e) {
    if (e.button !== 0) return;
    if (e.target.closest('[data-roomid]')) return;
    setDragging(true);
    setDragStart({ mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y });
  }
  function onMouseMove(e) {
    if (!dragging) return;
    setPan({ x: dragStart.px + e.clientX - dragStart.mx, y: dragStart.py + e.clientY - dragStart.my });
  }
  function onMouseUp() { setDragging(false); }

  return (
    <div
      ref={wrapRef}
      style={{ flex:1, overflow:'hidden', position:'relative', background:'#F1F5F9', cursor: dragging ? 'grabbing' : 'default' }}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div style={{ position:'absolute', transform:`translate(${pan.x}px,${pan.y}px) scale(${scale})`, transformOrigin:'0 0' }}>
        <svg width={SVG_W} height={SVG_H} xmlns="http://www.w3.org/2000/svg" style={{ display:'block', userSelect:'none' }}>
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#CBD5E1" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)"/>
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#94A3B8" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

          {/* Building outline — light border to show floor boundary */}
          <rect x="10" y="10" width={SVG_W-20} height={SVG_H-20}
            fill="none" stroke="#CBD5E1" strokeWidth="1.5" rx="4" strokeDasharray="8,4"/>

          {/* Render rooms — storage/WC behind, then normal, then selected on top */}
          {[...(rooms||[])].sort((a,b) => {
            const order = { wc:0, storage:0, common:1, classroom:2, admin:2, lab:2, grade:2, clinic:2, library:2, stage:2, art:2, music:2, computer:2 };
            return (order[a.category]||1) - (order[b.category]||1);
          }).map(room => <RoomShape key={room.id || room.number} room={room} isSelected={room.id === selectedId} isHovered={hovered === (room.id||room.number)} onRoomClick={onRoomClick} onHover={setHovered} />)}

          {/* Floor watermark */}
          <text x={SVG_W - 16} y={SVG_H - 16}
            textAnchor="end" fill="#E2E8F0"
            fontSize="36" fontWeight="900"
            fontFamily="'Segoe UI', Arial, sans-serif"
            style={{ userSelect:'none' }}
          >{FLOOR_NAMES[floor]?.toUpperCase()}</text>
        </svg>
      </div>

      {/* Zoom controls */}
      <div style={{ position:'absolute', bottom:16, right:16, display:'flex', flexDirection:'column', gap:4, zIndex:10 }}>
        {[['＋',1.2],['－',0.83]].map(([label,factor]) => (
          <button key={label}
            onClick={() => setScale(s => Math.min(5, Math.max(0.2, s*factor)))}
            style={{ width:34, height:34, borderRadius:7, border:'1px solid #D1D5DB', background:'white', cursor:'pointer', fontSize:18, fontWeight:700, color:BRAND.navy, display:'flex', alignItems:'center', justifyContent:'center' }}
          >{label}</button>
        ))}
        <button
          onClick={() => {
            const { width, height } = wrapRef.current.getBoundingClientRect();
            const s = Math.min((width-40)/SVG_W,(height-40)/SVG_H)*0.95;
            setScale(s); setPan({ x:(width-SVG_W*s)/2, y:10 });
          }}
          style={{ width:34, height:34, borderRadius:7, border:'1px solid #D1D5DB', background:'white', cursor:'pointer', fontSize:13, color:BRAND.navy, display:'flex', alignItems:'center', justifyContent:'center' }}
          title="Fit to screen"
        >⊡</button>
        <div style={{ textAlign:'center', fontSize:10, color:'#9CA3AF', marginTop:2 }}>{Math.round(scale*100)}%</div>
      </div>

      {/* Legend */}
      <div style={{
        position:'absolute', top:12, left:12, background:'white',
        borderRadius:8, padding:'10px 12px', fontSize:11,
        boxShadow:'0 2px 8px rgba(0,0,0,0.1)', zIndex:10,
        display:'flex', flexDirection:'column', gap:4,
      }}>
        {Object.entries(CATEGORIES).slice(0,7).map(([k,v]) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:v.color, flexShrink:0 }}/>
            <span style={{ color:'#374151' }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomShape({ room, isSelected, isHovered, onRoomClick, onHover }) {
  const cat   = CATEGORIES[room.category] || { icon:'📌', color:'#6B7280', label:'Room' };
  const color = room.class_color ? CLASS_COLOR_HEX[room.class_color] || cat.color : cat.color;
  const rid   = room.id || room.number;
  const cx    = room.x + room.w / 2;
  const cy    = room.y + room.h / 2;
  const small = room.w < 70 || room.h < 45;
  const tiny  = room.w < 50 || room.h < 35;

  // Wrap room name to fit width
  const words = room.name.split(' ');
  const maxChars = Math.floor(room.w / 7);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; }
    else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  // Limit lines to avoid overflow
  const maxLines = small ? 1 : (room.h < 70 ? 2 : 3);
  const displayLines = lines.slice(0, maxLines);

  const lineH  = small ? 9 : 11;
  const labelY = cy - ((displayLines.length - 1) * lineH) / 2 + (room.class_level && !small ? -8 : 0);

  return (
    <g
      data-roomid={rid}
      style={{ cursor:'pointer' }}
      onClick={() => onRoomClick && onRoomClick(room)}
      onMouseEnter={() => onHover(rid)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Shadow on hover/select */}
      {(isSelected || isHovered) && (
        <rect x={room.x-2} y={room.y-2} width={room.w+4} height={room.h+4}
          rx="6" fill="none"
          stroke={isSelected ? BRAND.yellow : color}
          strokeWidth={isSelected ? 3 : 1.5}
          strokeDasharray={isSelected ? '' : '4,2'}
          opacity={0.8}
        />
      )}

      {/* Room background */}
      <rect
        x={room.x} y={room.y} width={room.w} height={room.h}
        rx="4"
        fill={isHovered ? color + '35' : color + '1A'}
        stroke={isSelected ? BRAND.yellow : color}
        strokeWidth={isSelected ? 2.5 : 1.5}
      />

      {/* Top color bar */}
      <rect x={room.x} y={room.y} width={room.w} height={tiny ? 3 : 5} fill={color} rx="4" />

      {/* Room number — top left badge */}
      {!tiny && (
        <>
          <rect x={room.x+4} y={room.y+6} width={small ? 22 : 28} height={small ? 11 : 13} rx="3" fill={color} opacity="0.9"/>
          <text x={room.x+5} y={room.y + (small ? 15 : 17)}
            fill="white" fontSize={small ? 7 : 8} fontWeight="800"
            fontFamily="'Courier New', monospace"
            style={{ userSelect:'none' }}
          >{room.number}</text>
        </>
      )}

      {/* Category icon */}
      {!small && (
        <text x={room.x + room.w - 8} y={room.y + 18}
          textAnchor="end" fontSize="12"
          style={{ userSelect:'none' }}
        >{cat.icon}</text>
      )}

      {/* Room name lines */}
      {!tiny && displayLines.map((line, i) => (
        <text key={i}
          x={cx} y={labelY + i * lineH}
          textAnchor="middle" dominantBaseline="middle"
          fill={BRAND.navy} fontSize={small ? 8 : 10} fontWeight="600"
          fontFamily="'Segoe UI', Arial, sans-serif"
          style={{ userSelect:'none' }}
        >{line}</text>
      ))}

      {/* Class level + color badge */}
      {room.class_level && !small && (
        <text
          x={cx} y={room.y + room.h - 8}
          textAnchor="middle"
          fill={room.class_color ? CLASS_COLOR_HEX[room.class_color] || color : color}
          fontSize="8" fontWeight="800"
          fontFamily="'Segoe UI', Arial, sans-serif"
          style={{ userSelect:'none' }}
        >{room.class_level}{room.class_color ? ` · ${room.class_color}` : ''}</text>
      )}
    </g>
  );
}

const CLASS_COLOR_HEX = {
  Yellow:'#D97706', Blue:'#2563EB', Orange:'#EA580C',
  Red:'#DC2626', Green:'#16A34A', Purple:'#9333EA',
  Pink:'#EC4899', White:'#6B7280',
};


