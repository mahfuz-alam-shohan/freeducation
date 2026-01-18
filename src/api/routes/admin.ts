import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
  JWT_SECRET: string;
};

type Variables = {
  db: any;
  userId?: string;
  userEmail?: string;
  userRole?: string;
};

export const adminRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Admin setup endpoint
adminRoutes.post('/setup/admin', async (c) => {
  const db = c.get('db');
  const { token, firstName, lastName, email, username, password } = await c.req.json();

  try {
    // Verify setup token
    const setupData = await db.prepare(`
      SELECT value FROM system_settings 
      WHERE key = 'setup_token' AND value = ? AND CAST(value AS INTEGER) > ?
    `).bind(token, Date.now()).first();

    if (!setupData) {
      return c.json({ error: 'Invalid or expired setup token' }, 400);
    }

    // Check if admin already exists
    const adminExists = await db.prepare(`
      SELECT id FROM users WHERE role = 'admin' LIMIT 1
    `).first();

    if (adminExists) {
      return c.json({ error: 'Admin already exists' }, 403);
    }

    // Check if email or username already exists
    const existingUser = await db.prepare(`
      SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1
    `).bind(email, username).first();

    if (existingUser) {
      return c.json({ error: 'Email or username already exists' }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const userId = nanoid();
    const now = Date.now();

    await db.prepare(`
      INSERT INTO users (
        id, email, username, password, role, first_name, last_name,
        is_active, is_email_verified, credits, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId, email, username, hashedPassword, 'admin', 
      firstName, lastName, 1, 1, 1000, now, now
    ).run();

    // Create user profile
    await db.prepare(`
      INSERT INTO user_profiles (user_id, created_at) VALUES (?, ?)
    `).bind(userId, now).run();

    // Clean up setup token
    await db.prepare(`
      DELETE FROM system_settings WHERE key = 'setup_token'
    `).run();

    // Log the setup
    await db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource, resource_id, created_at)
      VALUES (?, ?, 'CREATE', 'user', ?, ?)
    `).bind(nanoid(), userId, userId, now).run();

    return c.json({
      message: 'Admin account created successfully',
      admin: {
        id: userId,
        email,
        username,
        firstName,
        lastName,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin setup failed:', error);
    return c.json({ error: 'Admin setup failed' }, 500);
  }
});

// Placeholder admin routes
adminRoutes.get('/dashboard', (c) => c.json({ message: 'Admin dashboard endpoint' }));
adminRoutes.get('/users', (c) => c.json({ message: 'Admin users endpoint' }));
adminRoutes.get('/settings', (c) => c.json({ message: 'Admin settings endpoint' }));
