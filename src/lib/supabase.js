import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zcruhhvqyjcrwgjzvzwd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcnVodnF5amNyd2dqenZwendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNDk4MzUsImV4cCI6MjA4OTgyNTgzNX0.95-ZVkcPEzPqBMD0DfQJgjn_HjP0u529NZpjgrMWSeA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── ROOMS ──────────────────────────────────────────────────
export async function getRooms(floor) {
  let q = supabase.from('rooms').select('*').order('number');
  if (floor !== undefined) q = q.eq('floor', floor);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function upsertRoom(room) {
  // Strip x/y/w/h from the payload — those are layout-only, not in DB schema
  // (DB has x,y,w,h but they are seeded once; we only update metadata fields)
  const { id, floor, number, name, category, class_level, class_color, notes } = room;
  const payload = { name, category, class_level: class_level || null, class_color: class_color || null, notes: notes || null };
  
  // If it has a real UUID id, update it. Otherwise insert by number.
  let result;
  if (id && id.includes('-')) {
    // Real UUID — update
    const { data, error } = await supabase
      .from('rooms').update(payload).eq('id', id).select().single();
    if (error) throw error;
    result = data;
  } else {
    // No UUID yet (static room not yet in DB) — upsert by number
    const { data, error } = await supabase
      .from('rooms').upsert(
        { floor, number, ...payload },
        { onConflict: 'number' }
      ).select().single();
    if (error) throw error;
    result = data;
  }
  return result;
}

export async function deleteRoom(id) {
  const { error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) throw error;
}

// ── STAFF ──────────────────────────────────────────────────
export async function getStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*, room:room_id(id, number, name)')
    .order('employee_number');
  if (error) throw error;
  return data ?? [];
}

export async function upsertStaff(staffMember) {
  const { id, employee_number, first_name, last_name, role, department, room_id } = staffMember;
  const payload = {
    employee_number: employee_number || null,
    first_name, last_name, role,
    department: department || null,
    room_id: room_id || null,
  };
  let result;
  if (id) {
    const { data, error } = await supabase
      .from('staff').update(payload).eq('id', id).select('*, room:room_id(id,number,name)').single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from('staff').insert(payload).select('*, room:room_id(id,number,name)').single();
    if (error) throw error;
    result = data;
  }
  return result;
}

export async function deleteStaff(id) {
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) throw error;
}
