-- Seed Classes (NCTB Structure)
INSERT INTO classes (name, slug) VALUES 
('Class 9 (SSC)', 'class-9'),
('Class 10 (SSC)', 'class-10'),
('HSC 1st Year', 'hsc-1'),
('HSC 2nd Year', 'hsc-2')
ON CONFLICT(slug) DO NOTHING;

-- Seed Subjects for Class 9 Science
INSERT INTO subjects (class_id, name, group_type, icon) 
SELECT id, 'Physics', 'science', '⚛️' FROM classes WHERE slug = 'class-9'
UNION ALL
SELECT id, 'Chemistry', 'science', '🧪' FROM classes WHERE slug = 'class-9'
UNION ALL
SELECT id, 'Higher Math', 'science', '📐' FROM classes WHERE slug = 'class-9'
UNION ALL
SELECT id, 'Bangla', 'common', '📖' FROM classes WHERE slug = 'class-9';

-- NOTE: No default admin is inserted. The first user to access /admin will set it up.
