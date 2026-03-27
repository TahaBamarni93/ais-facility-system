-- ============================================================
-- AIS Facility Management System — Supabase Schema
-- Run this once in your Supabase SQL editor
-- ============================================================

-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- ── ROOMS ──────────────────────────────────────────────────
create table if not exists rooms (
  id           uuid primary key default gen_random_uuid(),
  floor        int not null check (floor in (0,1,2)),
  number       text not null unique,   -- '001', '102', '215'
  name         text not null,
  category     text not null default 'room',
  -- category: classroom | admin | lab | common | storage | wc | clinic | library | stage | computer | art | music | daycare | prek | kg | grade
  class_level  text,                   -- 'Daycare','Pre-K','KG','Grade 1'…'Grade 10'
  class_color  text,                   -- 'Yellow','Blue','Orange','Red','Green'
  icon         text,                   -- emoji or icon key
  notes        text,
  x            float not null default 0,
  y            float not null default 0,
  w            float not null default 100,
  h            float not null default 80,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── STAFF ──────────────────────────────────────────────────
create table if not exists staff (
  id              uuid primary key default gen_random_uuid(),
  employee_number text unique,         -- '001','002','003'…
  first_name      text not null,
  last_name       text not null,
  role            text not null,
  department      text,
  room_id         uuid references rooms(id) on delete set null,
  photo_url       text,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── LABEL PRINT LOG ────────────────────────────────────────
create table if not exists label_exports (
  id         uuid primary key default gen_random_uuid(),
  label_type text not null,  -- 'staff'|'grade'|'room'|'toilet'
  room_id    uuid references rooms(id) on delete cascade,
  staff_id   uuid references staff(id) on delete set null,
  exported_by text,
  exported_at timestamptz default now()
);

-- ── UPDATED_AT TRIGGERS ────────────────────────────────────
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger rooms_updated_at before update on rooms
  for each row execute function handle_updated_at();

create trigger staff_updated_at before update on staff
  for each row execute function handle_updated_at();

-- ── ROW LEVEL SECURITY ────────────────────────────────────
alter table rooms enable row level security;
alter table staff enable row level security;
alter table label_exports enable row level security;

-- Only authenticated users can read/write
create policy "Authenticated users can do everything on rooms"
  on rooms for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on staff"
  on staff for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on label_exports"
  on label_exports for all to authenticated using (true) with check (true);

-- ── SEED: INITIAL ROOMS (from AutoCAD plans) ──────────────
-- Ground Floor (floor=0)
insert into rooms (floor, number, name, category, x, y, w, h) values
  (0,'001','Security & Transportation','admin',20,520,110,70),
  (0,'002','Finance','admin',820,490,80,70),
  (0,'003','Registration & Parental Relations','admin',640,480,120,70),
  (0,'004','HR / Operations','admin',720,480,80,70),
  (0,'005','Principal Office','admin',740,390,110,80),
  (0,'006','Placement Test Room','common',640,390,95,80),
  (0,'007','Clinic','clinic',820,350,80,80),
  (0,'008','Dental Clinic','clinic',820,430,80,60),
  (0,'009','Exam Room','lab',730,260,110,80),
  (0,'010','Deputy Principal','admin',740,490,80,60),
  (0,'011','Tea & Reception','common',620,460,100,70),
  (0,'012','WC Women (Main)','wc',640,295,55,55),
  (0,'013','WC Men (Main)','wc',700,295,55,55),
  (0,'014','Stage / Auditorium','stage',470,20,310,260),
  (0,'015','Store (Stage A)','storage',470,20,60,55),
  (0,'016','Store (Stage B)','storage',540,20,60,55),
  (0,'017','Restaurant','common',400,295,200,160),
  (0,'018','Kitchen','common',620,340,90,80),
  (0,'019','Shop','common',240,300,130,70),
  (0,'020','Dining Room','common',240,380,130,75),
  (0,'021','Play Room','common',240,465,130,100),
  (0,'022','Store A','storage',240,575,60,55),
  (0,'023','Store B','storage',310,575,60,55),
  (0,'024','Teacher''s Lounge','common',240,130,130,85),
  (0,'025','WC Men (Left)','wc',240,225,65,55),
  (0,'026','WC Women (Left)','wc',315,225,55,55),
  (0,'027','Class Room A','classroom',20,20,130,110),
  (0,'028','Class Room B','classroom',20,145,130,110),
  (0,'029','Class Room C','classroom',20,270,130,110),
  (0,'030','Class Room D','classroom',20,395,130,110),
  (0,'031','Class Room E','classroom',160,20,130,110),
  (0,'032','Storage A','storage',160,145,80,65),
  (0,'033','Storage B','storage',160,220,80,65),
  (0,'034','WC Women (Right)','wc',760,460,55,55),
  (0,'035','WC Men (Right)','wc',760,520,55,55)
on conflict (number) do nothing;

-- First Floor (floor=1)
insert into rooms (floor, number, name, category, x, y, w, h) values
  (1,'101','IT Support','admin',820,240,80,80),
  (1,'102','IT Support Office','admin',820,240,80,80),
  (1,'103','Compliance Coordinator','admin',640,240,80,80),
  (1,'104','Compliance Assistant','admin',720,240,80,80),
  (1,'105','Academic Affairs Director','admin',740,390,110,80),
  (1,'106','Wellness Counselor','admin',640,390,100,80),
  (1,'107','WC Women (Right)','wc',640,295,55,55),
  (1,'108','WC Men (Right)','wc',700,295,55,55),
  (1,'109','Janitor Room','storage',680,310,80,55),
  (1,'110','Science Lab','lab',740,130,130,110),
  (1,'111','Art Room','lab',740,255,130,100),
  (1,'112','Store (Art)','storage',740,365,65,55),
  (1,'113','Library','library',470,20,310,260),
  (1,'114','Computer Room','lab',240,465,130,100),
  (1,'115','Multipurpose Activity Room','common',400,465,200,100),
  (1,'116','Tea & Café','common',620,460,100,70),
  (1,'117','Terrace / Foyer','common',620,540,130,80),
  (1,'118','Restaurant (1F)','common',400,295,200,160),
  (1,'119','Kitchen (1F)','common',620,340,80,80),
  (1,'120','Store (1F)','storage',240,400,65,55),
  (1,'121','Teacher''s Lounge (1F)','common',240,130,130,85),
  (1,'122','WC Men (Left)','wc',240,225,65,55),
  (1,'123','WC Women (Left)','wc',315,225,55,55),
  (1,'124','Class Room 1F-A','classroom',20,20,130,110),
  (1,'125','Class Room 1F-B','classroom',20,145,130,110),
  (1,'126','Class Room 1F-C','classroom',20,270,130,110),
  (1,'127','Class Room 1F-D','classroom',20,395,130,110),
  (1,'128','Class Room 1F-E','classroom',160,20,130,110),
  (1,'129','Storage 1F-A','storage',160,145,80,65),
  (1,'130','Storage 1F-B','storage',160,220,80,65),
  (1,'131','Storage 1F-C','storage',160,295,80,65)
on conflict (number) do nothing;

-- Second Floor (floor=2)
insert into rooms (floor, number, name, category, x, y, w, h) values
  (2,'201','Class Room 2F-A','classroom',20,20,130,110),
  (2,'202','Class Room 2F-B','classroom',20,145,130,110),
  (2,'203','Class Room 2F-C','classroom',20,270,130,110),
  (2,'204','Class Room 2F-D','classroom',20,395,130,110),
  (2,'205','Class Room 2F-E','classroom',160,20,130,110),
  (2,'206','Class Room 2F-F','classroom',560,20,130,110),
  (2,'207','Class Room 2F-G','classroom',720,20,130,110),
  (2,'208','Class Room 2F-H','classroom',720,145,130,110),
  (2,'209','Class Room 2F-I','classroom',720,270,130,110),
  (2,'210','Class Room 2F-J','classroom',720,395,130,110),
  (2,'211','Social Media & Graphic Design','admin',560,200,80,55),
  (2,'212','Student Lounge','common',720,490,130,80),
  (2,'213','Café (2F)','common',640,490,80,80),
  (2,'214','Music Room','common',400,410,130,80),
  (2,'215','Maker Space','lab',240,380,130,100),
  (2,'216','Store (Maker A)','storage',240,490,65,55),
  (2,'217','Store (Maker B)','storage',315,490,55,55),
  (2,'218','Plant House','common',400,200,280,200),
  (2,'219','Terrace (2F)','common',540,590,220,80),
  (2,'220','Kitchen (2F)','common',540,490,90,80),
  (2,'221','WC Men (2F Left)','wc',240,225,65,55),
  (2,'222','WC Women (2F Left)','wc',315,225,55,55),
  (2,'223','WC Men (2F Right)','wc',560,420,55,55),
  (2,'224','WC Women (2F Right)','wc',620,420,55,55),
  (2,'225','Janitor Room (2F)','storage',680,420,60,55),
  (2,'226','Teacher''s Lounge (2F)','common',240,130,130,85),
  (2,'227','Storage 2F-A','storage',160,145,80,65),
  (2,'228','Storage 2F-B','storage',860,20,60,65)
on conflict (number) do nothing;

-- ── SEED: STAFF (from your PDFs) ──────────────────────────
insert into staff (employee_number, first_name, last_name, role, department) values
  ('001','Berzhang Hikmat','Khalid','Security and Transportation Supervisor','Operations'),
  ('002','Ahmed Omar','Hameed','Finance','Finance'),
  ('003','Salar Jameel','Mohammed','Registration & Parental Relation','Admin'),
  ('004','Faiq Mokhtar','Naz','HR / Manager Operations','HR'),
  ('005','Hassan','Sherine','Principal','Leadership'),
  ('007','Hasan Mustafa','Noora','Clinic','Clinic'),
  ('102','Abdullah','Dakhaz','IT Support Specialist','IT'),
  ('104','Hussein Rashid','Rewan','Institutional Compliance & Effectiveness Coordinator','Compliance'),
  ('104b','Mustafa Luqman','Saher','Institutional Compliance & Effectiveness Assistant','Compliance'),
  ('113','Abdullah Taher','Dilveen','Wellness Counselor','Wellbeing'),
  ('211','Abdullah Kamal','Taha','Social Media & Graphic Design Coordinator','Media'),
  ('215','Ferhadi Abdulrazaq','Vena','Director of Academic Affairs','Academic')
on conflict (employee_number) do nothing;
