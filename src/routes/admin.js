import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminRoutes = new Hono();
const JWT_SECRET = 'your-secret-key-change-in-production';

// Authentication middleware
const authenticate = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization token required' }, 401);
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set('user', decoded);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

// Get current admin profile
adminRoutes.get('/profile', authenticate, async (c) => {
  try {
    const user = c.get('user');
    
    const admin = await c.env.DB.prepare('SELECT id, name, email, date_of_birth, created_at FROM admins WHERE id = ?')
      .bind(user.userId)
      .first();
    
    if (!admin) {
      return c.json({ error: 'Admin not found' }, 404);
    }
    
    return c.json({
      admin: admin
    });
  } catch (error) {
    console.error('Error getting admin profile:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Create new admin (only existing admin can create)
adminRoutes.post('/create', authenticate, async (c) => {
  try {
    const { name, email, password, date_of_birth } = await c.req.json();
    
    // Validation
    if (!name || !email || !password || !date_of_birth) {
      return c.json({ error: 'All fields are required' }, 400);
    }
    
    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters long' }, 400);
    }
    
    // Check if email already exists
    const existingAdmin = await c.env.DB.prepare('SELECT id FROM admins WHERE email = ?')
      .bind(email)
      .first();
    
    if (existingAdmin) {
      return c.json({ error: 'Email already exists' }, 400);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create admin
    const result = await c.env.DB.prepare(`
      INSERT INTO admins (name, email, password_hash, date_of_birth) 
      VALUES (?, ?, ?, ?)
    `).bind(name, email, passwordHash, date_of_birth).run();
    
    return c.json({
      message: 'Admin created successfully',
      admin: {
        id: result.meta.last_row_id,
        name,
        email,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return c.json({ error: 'Failed to create admin' }, 500);
  }
});

// Get all admins
adminRoutes.get('/list', authenticate, async (c) => {
  try {
    const adminsList = await c.env.DB.prepare(`
      SELECT id, name, email, date_of_birth, is_active, created_at 
      FROM admins 
      ORDER BY created_at DESC
    `).all();
    
    return c.json({
      admins: adminsList.results || adminsList
    });
  } catch (error) {
    console.error('Error getting admins list:', error);
    return c.json({ error: 'Failed to get admins list' }, 500);
  }
});

export { adminRoutes };
