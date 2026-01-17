import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRoutes = new Hono();
const JWT_SECRET = 'your-secret-key-change-in-production';

// Check if admin is initialized
authRoutes.get('/check-init', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT value FROM system_config WHERE key = ?')
      .bind('admin_initialized')
      .first();
    
    const isInitialized = result && result.value === 'true';
    
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
    const result = await c.env.DB.prepare('SELECT value FROM system_config WHERE key = ?')
      .bind('admin_initialized')
      .first();
    
    if (result && result.value === 'true') {
      return c.json({ error: 'Admin already registered' }, 400);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create admin
    const adminResult = await c.env.DB.prepare(`
      INSERT INTO admins (name, email, password_hash, date_of_birth) 
      VALUES (?, ?, ?, ?)
    `).bind(name, email, passwordHash, date_of_birth).run();
    
    // Mark as initialized
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO system_config (key, value) 
      VALUES ('admin_initialized', 'true')
    `).run();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: adminResult.meta.last_row_id, 
        email: email,
        userType: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return c.json({
      message: 'First admin registered successfully',
      admin: {
        id: adminResult.meta.last_row_id,
        name,
        email
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
    const admin = await c.env.DB.prepare('SELECT * FROM admins WHERE email = ?')
      .bind(email)
      .first();
    
    if (!admin) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Check if active
    if (!admin.is_active) {
      return c.json({ error: 'Account is deactivated' }, 401);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: admin.id, 
        email: admin.email,
        userType: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return c.json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
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
