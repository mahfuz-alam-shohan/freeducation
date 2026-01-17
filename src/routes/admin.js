import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { admins } from '../db/schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminRoutes = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
    
    const admin = await db.select()
      .from(admins)
      .where(eq(admins.id, user.userId))
      .limit(1);
    
    if (admin.length === 0) {
      return c.json({ error: 'Admin not found' }, 404);
    }
    
    return c.json({
      admin: {
        id: admin[0].id,
        name: admin[0].name,
        email: admin[0].email,
        date_of_birth: admin[0].date_of_birth,
        created_at: admin[0].created_at
      }
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
    const existingAdmin = await db.select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);
    
    if (existingAdmin.length > 0) {
      return c.json({ error: 'Email already exists' }, 400);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create admin
    const result = await db.insert(admins).values({
      name,
      email,
      password_hash: passwordHash,
      date_of_birth
    }).returning();
    
    return c.json({
      message: 'Admin created successfully',
      admin: {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        created_at: result[0].created_at
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
    const adminsList = await db.select({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      date_of_birth: admins.date_of_birth,
      is_active: admins.is_active,
      created_at: admins.created_at
    }).from(admins).orderBy(admins.created_at);
    
    return c.json({
      admins: adminsList
    });
  } catch (error) {
    console.error('Error getting admins list:', error);
    return c.json({ error: 'Failed to get admins list' }, 500);
  }
});

export { adminRoutes };
