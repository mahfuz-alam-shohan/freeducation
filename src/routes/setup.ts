import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { DatabaseManager } from '../db/database.js';
import { initDatabase, checkAdminSetup, markAdminSetupCompleted } from '../db/init.js';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const setupRoutes = new Hono<{ Bindings: Bindings }>();

// Check if admin setup is needed
setupRoutes.get('/status', async (c) => {
  try {
    const isSetupComplete = await checkAdminSetup(c.env.DB);
    return c.json({
      setupComplete: isSetupComplete,
      needsSetup: !isSetupComplete
    });
  } catch (error) {
    console.error('Setup status check failed:', error);
    return c.json({ 
      setupComplete: false, 
      needsSetup: true,
      error: 'Failed to check setup status'
    }, 500);
  }
});

// Create first admin account
setupRoutes.post('/admin', async (c) => {
  try {
    // Check if setup is already complete
    const isSetupComplete = await checkAdminSetup(c.env.DB);
    if (isSetupComplete) {
      return c.json({ 
        error: 'Admin setup already completed. Use regular admin registration.' 
      }, 400);
    }

    const { fullName, email, username, password } = await c.req.json();

    // Validation
    if (!fullName || !email || !username || !password) {
      return c.json({ 
        error: 'All fields are required' 
      }, 400);
    }

    if (password.length < 8) {
      return c.json({ 
        error: 'Password must be at least 8 characters long' 
      }, 400);
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return c.json({ 
        error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' 
      }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ 
        error: 'Invalid email format' 
      }, 400);
    }

    const dbManager = new DatabaseManager(c.env.DB);

    // Initialize database if needed
    await initDatabase(c.env.DB);

    // Check if user already exists
    const existingUser = await dbManager.query(`
      SELECT id FROM users WHERE email = ? OR username = ?
    `, [email, username]);

    if (existingUser.results?.length > 0) {
      return c.json({ 
        error: 'User with this email or username already exists' 
      }, 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin user
    const result = await dbManager.run(`
      INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, email_verified)
      VALUES (?, ?, ?, ?, 'admin', 1, 1)
    `, [username, email, passwordHash, fullName]);

    if (!result.success) {
      return c.json({ 
        error: 'Failed to create admin account' 
      }, 500);
    }

    const adminId = result.meta.last_row_id;

    // Create user profile
    await dbManager.run(`
      INSERT INTO user_profiles (user_id, country)
      VALUES (?, 'Bangladesh')
    `, [adminId]);

    // Grant initial credits to admin
    await dbManager.run(`
      INSERT INTO credit_transactions (user_id, transaction_type, amount, description, reference_type)
      VALUES (?, 'earned', 1000, 'Initial admin credits', 'bonus')
    `, [adminId]);

    // Log the admin creation
    await dbManager.run(`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values)
      VALUES (?, 'admin_created', 'user', ?, ?)
    `, [adminId, adminId, JSON.stringify({
      username,
      email,
      fullName,
      userType: 'admin'
    })]);

    // Mark setup as completed
    await markAdminSetupCompleted(c.env.DB);

    // Create JWT token for immediate login
    const token = await createAdminToken(adminId, username, c.env.JWT_SECRET);

    return c.json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: adminId,
        username,
        email,
        fullName,
        userType: 'admin'
      },
      token
    });

  } catch (error) {
    console.error('Admin setup failed:', error);
    return c.json({ 
      error: 'Internal server error during admin setup' 
    }, 500);
  }
});

// Helper function to create JWT token
async function createAdminToken(userId: number, username: string, secret: string): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    sub: userId.toString(),
    username: username,
    userType: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  // Simple JWT implementation (in production, use a proper JWT library)
  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify(payload));
  
  const signature = await signData(`${headerBase64}.${payloadBase64}`, secret);
  
  return `${headerBase64}.${payloadBase64}.${signature}`;
}

async function signData(data: string, secret: string): Promise<string> {
  // Simple HMAC-SHA256 implementation
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export { setupRoutes };
