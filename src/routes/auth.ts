import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { DatabaseManager } from '../db/database.js';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const authRoutes = new Hono<{ Bindings: Bindings }>();

// Login endpoint
authRoutes.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }

    const dbManager = new DatabaseManager(c.env.DB);

    // Find user by username or email
    const userResult = await dbManager.query(`
      SELECT u.*, up.country, up.education_level
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.username = ? OR u.email = ?
      AND u.is_active = 1
    `, [username, username]);

    if (!userResult.results || userResult.results.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const user = userResult.results[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Update last login
    await dbManager.run(`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
    `, [user.id]);

    // Create JWT token
    const token = await createToken(user);

    // Log the login
    await dbManager.run(`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id)
      VALUES (?, 'login', 'user', ?)
    `, [user.id, user.id]);

    return c.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type,
        emailVerified: user.email_verified,
        profile: {
          country: user.country,
          educationLevel: user.education_level
        }
      },
      token
    });

  } catch (error) {
    console.error('Login failed:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Logout endpoint
authRoutes.post('/logout', async (c) => {
  try {
    // In a real implementation, you might want to invalidate the token
    // For now, we'll just return a success response
    // The auth middleware would handle logging when implemented
    
    return c.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout failed:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get current user info
authRoutes.get('/me', async (c) => {
  try {
    // This would normally use auth middleware to get the user
    // For now, return a placeholder response
    return c.json({
      user: null,
      message: 'Authentication middleware not implemented yet'
    });

  } catch (error) {
    console.error('Get user failed:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Helper function to create JWT token
async function createToken(user: any): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    sub: user.id.toString(),
    username: user.username,
    userType: user.user_type,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify(payload));
  
  const signature = await signData(`${headerBase64}.${payloadBase64}`, 'JWT_SECRET_PLACEHOLDER');
  
  return `${headerBase64}.${payloadBase64}.${signature}`;
}

async function signData(data: string, secret: string): Promise<string> {
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

export { authRoutes };
