import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';

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

export const authRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Login endpoint
authRoutes.post('/login', async (c) => {
  const db = c.get('db');
  const { email, password, rememberMe } = await c.req.json();

  try {
    // Find user by email
    const user = await db.prepare(`
      SELECT id, email, username, password, role, firstName, lastName, avatar, credits, totalStudyTime, isActive, isEmailVerified
      FROM users WHERE email = ? AND isActive = 1
    `).bind(email).first();

    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Generate JWT token
    const token = await sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      c.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '7d' }
    );

    // Update last login
    await db.prepare(`
      UPDATE users SET lastLoginAt = ? WHERE id = ?
    `).bind(Date.now(), user.id).run();

    // Log the login
    await db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource, ip_address, user_agent, created_at)
      VALUES (?, ?, 'LOGIN', 'user', ?, ?, ?)
    `).bind(nanoid(), user.id, c.req.header('x-forwarded-for') || c.req.header('x-real-ip'), c.req.header('user-agent'), Date.now()).run();

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        credits: user.credits,
        totalStudyTime: user.totalStudyTime,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Register endpoint
authRoutes.post('/register', async (c) => {
  const db = c.get('db');
  const { firstName, lastName, email, username, password, role, educationLevel, newsletter } = await c.req.json();

  try {
    // Check if email already exists
    const existingEmail = await db.prepare(`
      SELECT id FROM users WHERE email = ?
    `).bind(email).first();

    if (existingEmail) {
      return c.json({ error: 'Email already exists' }, 400);
    }

    // Check if username already exists
    const existingUsername = await db.prepare(`
      SELECT id FROM users WHERE username = ?
    `).bind(username).first();

    if (existingUsername) {
      return c.json({ error: 'Username already exists' }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = nanoid();
    const now = Date.now();

    await db.prepare(`
      INSERT INTO users (
        id, email, username, password, role, firstName, lastName,
        is_active, is_email_verified, credits, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId, email, username, hashedPassword, role, 
      firstName, lastName, 1, 0, 0, now, now
    ).run();

    // Create user profile
    await db.prepare(`
      INSERT INTO user_profiles (user_id, education_level, created_at)
      VALUES (?, ?, ?)
    `).bind(userId, educationLevel || null, now).run();

    // Log the registration
    await db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource, ip_address, user_agent, created_at)
      VALUES (?, ?, 'REGISTER', 'user', ?, ?, ?)
    `).bind(nanoid(), userId, c.req.header('x-forwarded-for') || c.req.header('x-real-ip'), c.req.header('user-agent'), Date.now()).run();

    // Send welcome notification (placeholder)
    if (newsletter) {
      // TODO: Implement newsletter subscription
      console.log('User subscribed to newsletter:', email);
    }

    return c.json({
      success: true,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Get current user info
authRoutes.get('/me', async (c) => {
  const db = c.get('db');
  const userId = c.get('userId');

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const user = await db.prepare(`
      SELECT id, email, username, role, firstName, lastName, avatar, credits, totalStudyTime, isActive, isEmailVerified, created_at, lastLoginAt
      FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Get user profile
    const profile = await db.prepare(`
      SELECT bio, dateOfBirth, phone, address, city, country, educationLevel, institution, interests, socialLinks, preferences
      FROM user_profiles WHERE user_id = ?
    `).bind(userId).first();

    return c.json({
      success: true,
      user: {
        ...user,
        profile: profile || {}
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user info' }, 500);
  }
});

// Logout endpoint
authRoutes.post('/logout', async (c) => {
  const userId = c.get('userId');

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Log the logout
    const db = c.get('db');
    await db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource, ip_address, user_agent, created_at)
      VALUES (?, ?, 'LOGOUT', 'user', ?, ?, ?)
    `).bind(nanoid(), userId, c.req.header('x-forwarded-for') || c.req.header('x-real-ip'), c.req.header('user-agent'), Date.now()).run();

    return c.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Logout failed' }, 500);
  }
});

// Refresh token endpoint
authRoutes.post('/refresh', async (c) => {
  const userId = c.get('userId');
  const userEmail = c.get('userEmail');
  const userRole = c.get('userRole');

  if (!userId || !userEmail || !userRole) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Generate new token
    const token = await sign(
      { userId, email: userEmail, role: userRole },
      c.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return c.json({
      success: true,
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return c.json({ error: 'Token refresh failed' }, 500);
  }
});

// Change password endpoint
authRoutes.post('/change-password', async (c) => {
  const db = c.get('db');
  const userId = c.get('userId');
  const { currentPassword, newPassword } = await c.req.json();

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Get current user
    const user = await db.prepare(`
      SELECT password FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return c.json({ error: 'Current password is incorrect' }, 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.prepare(`
      UPDATE users SET password = ?, updated_at = ? WHERE id = ?
    `).bind(hashedNewPassword, Date.now(), userId).run();

    // Log the password change
    await db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource, ip_address, user_agent, created_at)
      VALUES (?, ?, 'CHANGE_PASSWORD', 'user', ?, ?, ?)
    `).bind(nanoid(), userId, c.req.header('x-forwarded-for') || c.req.header('x-real-ip'), c.req.header('user-agent'), Date.now()).run();

    return c.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return c.json({ error: 'Password change failed' }, 500);
  }
});

// Forgot password endpoint (placeholder)
authRoutes.post('/forgot-password', async (c) => {
  const { email } = await c.req.json();

  try {
    // TODO: Implement password reset email
    console.log('Password reset requested for:', email);
    
    return c.json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ error: 'Failed to process request' }, 500);
  }
});

// Reset password endpoint (placeholder)
authRoutes.post('/reset-password', async (c) => {
  const { token, newPassword } = await c.req.json();

  try {
    // TODO: Implement password reset with token validation
    console.log('Password reset with token:', token);
    
    return c.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ error: 'Password reset failed' }, 500);
  }
});
