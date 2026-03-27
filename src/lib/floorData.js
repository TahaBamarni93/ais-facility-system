// Floor plan room layout — derived from AutoCAD plans
// Coordinate system: SVG units, proportional to actual plan
// Ground floor total area: 2634 m²
// Scale: ~1 SVG unit ≈ 0.13m (fits in 900×680 viewport)

export const FLOOR_ROOMS = {
  // ── GROUND FLOOR ─────────────────────────────────────────
  0: [
    // Left wing — 4 classrooms stacked vertically
    { number:'027', name:'Class Room A',     category:'classroom', x:20,  y:20,  w:130, h:105 },
    { number:'028', name:'Class Room B',     category:'classroom', x:20,  y:135, w:130, h:105 },
    { number:'029', name:'Class Room C',     category:'classroom', x:20,  y:250, w:130, h:105 },
    { number:'030', name:'Class Room D',     category:'classroom', x:20,  y:365, w:130, h:105 },
    // Upper left block
    { number:'031', name:'Class Room E',     category:'classroom', x:160, y:20,  w:130, h:105 },
    { number:'032', name:'Storage A',        category:'storage',   x:160, y:135, w:80,  h:60  },
    { number:'033', name:'Storage B',        category:'storage',   x:160, y:205, w:80,  h:60  },
    // Central column
    { number:'024', name:"Teacher's Lounge", category:'common',    x:300, y:20,  w:130, h:85  },
    { number:'025', name:'WC Men',           category:'wc',        x:300, y:115, w:62,  h:52  },
    { number:'026', name:'WC Women',         category:'wc',        x:372, y:115, w:58,  h:52  },
    { number:'019', name:'Shop',             category:'common',    x:300, y:177, w:130, h:68  },
    { number:'020', name:'Dining Room',      category:'common',    x:300, y:255, w:130, h:68  },
    { number:'021', name:'Play Room',        category:'common',    x:300, y:333, w:130, h:95  },
    { number:'022', name:'Store A',          category:'storage',   x:300, y:438, w:62,  h:52  },
    { number:'023', name:'Store B',          category:'storage',   x:372, y:438, w:58,  h:52  },
    // Stage / auditorium — top right, large
    { number:'014', name:'Stage / Auditorium', category:'stage',   x:445, y:20,  w:295, h:250 },
    { number:'015', name:'Store (Stage A)',   category:'storage',  x:445, y:20,  w:60,  h:50  },
    { number:'016', name:'Store (Stage B)',   category:'storage',  x:515, y:20,  w:60,  h:50  },
    // Restaurant zone
    { number:'017', name:'Restaurant',        category:'common',   x:445, y:280, w:190, h:150 },
    { number:'018', name:'Kitchen',           category:'common',   x:645, y:310, w:90,  h:80  },
    // Right WCs
    { number:'012', name:'WC Women',          category:'wc',       x:645, y:280, w:52,  h:55  },
    { number:'013', name:'WC Men',            category:'wc',       x:705, y:280, w:52,  h:55  },
    // Admin wing — right side
    { number:'006', name:'Placement Test',    category:'common',   x:645, y:400, w:95,  h:75  },
    { number:'011', name:'Tea & Reception',   category:'common',   x:645, y:485, w:95,  h:68  },
    { number:'003', name:'Registration',      category:'admin',    x:650, y:560, w:90,  h:68  },
    { number:'005', name:"Principal's Office",category:'admin',    x:750, y:400, w:110, h:80  },
    { number:'034', name:'WC Women (R)',      category:'wc',       x:750, y:490, w:52,  h:55  },
    { number:'035', name:'WC Men (R)',        category:'wc',       x:812, y:490, w:48,  h:55  },
    { number:'004', name:'HR / Operations',   category:'admin',    x:750, y:555, w:55,  h:65  },
    { number:'002', name:'Finance',           category:'admin',    x:815, y:555, w:75,  h:65  },
    { number:'010', name:'Deputy Principal',  category:'admin',    x:750, y:628, w:140, h:55  },
    { number:'009', name:'Exam Room',         category:'lab',      x:750, y:260, w:110, h:80  },
    { number:'007', name:'Clinic',            category:'clinic',   x:750, y:350, w:55,  h:60  },
    { number:'008', name:'Dental Clinic',     category:'clinic',   x:815, y:350, w:75,  h:60  },
    { number:'001', name:'Security & Transport', category:'admin', x:20,  y:480, w:130, h:70  },
  ],

  // ── FIRST FLOOR ──────────────────────────────────────────
  1: [
    // Left wing classrooms
    { number:'124', name:'Class Room 1F-A',  category:'classroom', x:20,  y:20,  w:130, h:105 },
    { number:'125', name:'Class Room 1F-B',  category:'classroom', x:20,  y:135, w:130, h:105 },
    { number:'126', name:'Class Room 1F-C',  category:'classroom', x:20,  y:250, w:130, h:105 },
    { number:'127', name:'Class Room 1F-D',  category:'classroom', x:20,  y:365, w:130, h:105 },
    { number:'128', name:'Class Room 1F-E',  category:'classroom', x:160, y:20,  w:130, h:105 },
    { number:'129', name:'Storage 1F-A',     category:'storage',   x:160, y:135, w:80,  h:60  },
    { number:'130', name:'Storage 1F-B',     category:'storage',   x:160, y:205, w:80,  h:60  },
    { number:'131', name:'Storage 1F-C',     category:'storage',   x:160, y:275, w:80,  h:60  },
    // Central column
    { number:'121', name:"Teacher's Lounge", category:'common',    x:300, y:20,  w:130, h:85  },
    { number:'122', name:'WC Men',           category:'wc',        x:300, y:115, w:62,  h:52  },
    { number:'123', name:'WC Women',         category:'wc',        x:372, y:115, w:58,  h:52  },
    { number:'120', name:'Store (1F)',        category:'storage',   x:300, y:177, w:130, h:55  },
    { number:'114', name:'Computer Room',     category:'computer',  x:300, y:342, w:130, h:100 },
    // Library — large circular area top right
    { number:'113', name:'Library',           category:'library',  x:445, y:20,  w:295, h:260 },
    // Restaurant zone
    { number:'118', name:'Restaurant (1F)',   category:'common',   x:445, y:290, w:190, h:150 },
    { number:'119', name:'Kitchen (1F)',      category:'common',   x:645, y:320, w:80,  h:80  },
    // Right WCs
    { number:'107', name:'WC Women (R)',      category:'wc',       x:645, y:290, w:52,  h:55  },
    { number:'108', name:'WC Men (R)',        category:'wc',       x:705, y:290, w:52,  h:55  },
    { number:'109', name:'Janitor Room',      category:'storage',  x:645, y:355, w:80,  h:52  },
    // Right wing
    { number:'103', name:'Compliance Coordinator', category:'admin', x:645, y:415, w:95, h:75 },
    { number:'104', name:'Compliance Assistant',   category:'admin', x:645, y:500, w:95, h:70 },
    { number:'105', name:'Academic Affairs Director', category:'admin', x:750, y:290, w:110, h:80 },
    { number:'106', name:'Wellness Counselor', category:'admin',   x:750, y:380, w:110, h:75  },
    { number:'101', name:'IT Support',         category:'admin',   x:750, y:465, w:110, h:75  },
    { number:'110', name:'Science Lab',        category:'lab',     x:750, y:20,  w:140, h:120 },
    { number:'111', name:'Art Room',           category:'art',     x:750, y:150, w:140, h:110 },
    { number:'112', name:'Store (Art)',        category:'storage', x:750, y:270, w:80,  h:55  },
    // Lower
    { number:'115', name:'Multipurpose Room',  category:'common',  x:445, y:450, w:190, h:95  },
    { number:'116', name:'Tea & Café',         category:'common',  x:645, y:580, w:95,  h:70  },
    { number:'117', name:'Terrace / Foyer',    category:'common',  x:445, y:555, w:190, h:95  },
  ],

  // ── SECOND FLOOR ─────────────────────────────────────────
  2: [
    // Left wing classrooms
    { number:'201', name:'Class Room 2F-A',  category:'classroom', x:20,  y:20,  w:130, h:105 },
    { number:'202', name:'Class Room 2F-B',  category:'classroom', x:20,  y:135, w:130, h:105 },
    { number:'203', name:'Class Room 2F-C',  category:'classroom', x:20,  y:250, w:130, h:105 },
    { number:'204', name:'Class Room 2F-D',  category:'classroom', x:20,  y:365, w:130, h:105 },
    { number:'205', name:'Class Room 2F-E',  category:'classroom', x:160, y:20,  w:130, h:105 },
    { number:'227', name:'Storage 2F-A',     category:'storage',   x:160, y:135, w:80,  h:60  },
    // Central column
    { number:'226', name:"Teacher's Lounge", category:'common',    x:300, y:20,  w:130, h:85  },
    { number:'221', name:'WC Men',           category:'wc',        x:300, y:115, w:62,  h:52  },
    { number:'222', name:'WC Women',         category:'wc',        x:372, y:115, w:58,  h:52  },
    { number:'215', name:'Maker Space',       category:'lab',      x:300, y:177, w:130, h:100 },
    { number:'216', name:'Store (Maker A)',   category:'storage',  x:300, y:287, w:62,  h:52  },
    { number:'217', name:'Store (Maker B)',   category:'storage',  x:372, y:287, w:58,  h:52  },
    // Plant House — large open central area
    { number:'218', name:'Plant House',       category:'common',   x:445, y:180, w:280, h:210 },
    // Right wing classrooms
    { number:'206', name:'Class Room 2F-F',  category:'classroom', x:445, y:20,  w:130, h:105 },
    { number:'207', name:'Class Room 2F-G',  category:'classroom', x:605, y:20,  w:130, h:105 },
    { number:'208', name:'Class Room 2F-H',  category:'classroom', x:605, y:135, w:130, h:105 },
    { number:'228', name:'Storage 2F-B',     category:'storage',   x:745, y:20,  w:75,  h:60  },
    { number:'209', name:'Class Room 2F-I',  category:'classroom', x:605, y:250, w:130, h:105 },
    { number:'210', name:'Class Room 2F-J',  category:'classroom', x:605, y:365, w:130, h:105 },
    { number:'211', name:'Social Media & Graphic Design', category:'admin', x:445, y:135, w:130, h:55 },
    // Lower floor
    { number:'223', name:'WC Men (2F R)',     category:'wc',       x:445, y:400, w:52,  h:52  },
    { number:'224', name:'WC Women (2F R)',   category:'wc',       x:507, y:400, w:52,  h:52  },
    { number:'225', name:'Janitor Room',      category:'storage',  x:569, y:400, w:60,  h:52  },
    { number:'214', name:'Music Room',        category:'music',    x:300, y:350, w:130, h:80  },
    { number:'220', name:'Kitchen (2F)',      category:'common',   x:445, y:460, w:90,  h:80  },
    { number:'213', name:'Café (2F)',         category:'common',   x:545, y:460, w:100, h:80  },
    { number:'212', name:'Student Lounge',    category:'common',   x:655, y:460, w:130, h:80  },
    { number:'219', name:'Terrace (2F)',      category:'common',   x:445, y:550, w:340, h:80  },
  ],
};

export const SVG_W = 920;
export const SVG_H = 700;
