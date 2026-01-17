import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { admins, system_config, sessions } from '../db/schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRoutes = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Check if admin is initialized
authRoutes.get('/check-init', async (c) => {
  try {
    const config = await db.select()
      .from(system_config)
      .where(eq(system_config.key, 'admin_initialized'))
      .limit(1);
    
    const isInitialized = config.length > 0 && config[0].value === 'true';
    
    return c.json({ 
      initialized: isInitialized 
    });
  } catch (error) {
    console.error('Error checking initialization:', error);
    return c.json({ error: 'Failed to check initialization status' }, 500);
  }
});

// First admin registration
authRoutes.post('/register-first-admin', async (c) => {
  try {
    const { name, email, password, date_of_birth } = await c.req.json();
    
    // Validation
    if (!name || !email || !password || !date_of_birth) {
      return c.json({ error: 'All fields are required' }, 400);
    }
    
    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters long' }, 400);
    }
    
    // Check if already initialized
    const config = await db.select()
      .from(system_config)
      .where(eq(system_config.key, 'admin_initialized'))
      .limit(1);
    
    if (config.length > 0 && config[0].value === 'true') {
      return c.json({ error: 'Admin already registered' }, 400);
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
    
    // Mark as initialized
    await db.update(system_config)
      .set({ value: 'true' })
      .where(eq(system_config.key, 'admin_initialized'));
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result[0].id, 
        email: result[0].email,
        userType: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return c.json({
      message: 'First admin registered successfully',
      admin: {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email
      },
      token
    });
  } catch (error) {
    console.error('Error registering first admin:', error);
    return c.json({ error: 'Failed to register admin' }, 500);
  }
});

// Admin login
authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Find admin
    const admin = await db.select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);
    
    if (admin.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, admin[0].password_hash);
    
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Check if active
    if (!admin[0].is_active) {
      return c.json({ error: 'Account is deactivated' }, 401);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: admin[0].id, 
        email: admin[0].email,
        userType: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return c.json({
      message: 'Login successful',
      admin: {
        id: admin[0].id,
        name: admin[0].name,
        email: admin[0].email
      },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    return c.json({ error: 'Failed to login' }, 500);
  }
});

// Logout (client-side token removal)
authRoutes.post('/logout', (c) => {
  return c.json({ message: 'Logout successful' });
});

export { authRoutes };
