-- Create a default Admin (Email: admin@free.edu, Pass: admin123)
-- NOTE: You should change the password immediately after deployment
INSERT INTO users (email, password_hash, name, role) 
VALUES ('admin@free.edu', 'admin123', 'Super Admin', 'admin')
ON CONFLICT(email) DO NOTHING;

-- Seed Classes
INSERT INTO classes (name, slug) VALUES 
('Class 9 (SSC)', 'class-9'),
('Class 10 (SSC)', 'class-10'),
('HSC 1st Year', 'hsc-1'),
('HSC 2nd Year', 'hsc-2')
ON CONFLICT(slug) DO NOTHING;

-- Seed Subjects for Class 9 Science
-- We use sub-queries to get IDs dynamically so it never breaks
INSERT INTO subjects (class_id, name, group_type, icon) 
SELECT id, 'Physics', 'science', '⚛️' FROM classes WHERE slug = 'class-9'
UNION ALL
SELECT id, 'Chemistry', 'science', '🧪' FROM classes WHERE slug = 'class-9'
UNION ALL
SELECT id, 'Higher Math', 'science', '📐' FROM classes WHERE slug = 'class-9'
UNION ALL
SELECT id, 'Bangla', 'common', '📖' FROM classes WHERE slug = 'class-9';
