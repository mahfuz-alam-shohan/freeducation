import { Hono } from 'hono';
import { sendVerificationEmail } from '../../../../shared/utils/email';
import { buildPasswordHash } from '../shared/utils';

const studentAuth = new Hono<{
  Bindings: {
    DB: D1Database;
    GMAIL_CLIENT_ID: string;
    GMAIL_CLIENT_SECRET: string;
    GMAIL_REFRESH_TOKEN: string;
    JWT_SECRET: string;
  };
}>();

studentAuth.post('/register-request', async (c) => {
  try {
    const { name, email, password, classLabel, groupLabel } = await c.req.json();

    if (!email || !password || !name) return c.json({ success: false, error: 'Missing fields' }, 400);

    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existing) {
      return c.json({ success: false, error: 'User already exists. Please login.' }, 400);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await c.env.DB.prepare(`
      INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET code = ?, expires_at = ?, attempts = 0
    `).bind(email, code, expiresAt, code, expiresAt).run();

    const sent = await sendVerificationEmail(email, code, c.env);
    if (!sent) {
      return c.json({ success: false, error: 'Failed to send email. Please try again later.' }, 500);
    }

    return c.json({ success: true, message: 'OTP sent' });
  } catch (e) {
    console.error('Register Error:', e);
    return c.json({ success: false, error: 'Server error' }, 500);
  }
});

studentAuth.post('/register-verify', async (c) => {
  try {
    const { email, code, name, password, classLabel, groupLabel } = await c.req.json();

    const record = await c.env.DB.prepare('SELECT * FROM email_verifications WHERE email = ?').bind(email).first();
    if (!record) return c.json({ success: false, error: 'No verification request found' }, 400);

    if (Date.now() > (record.expires_at as number)) {
      return c.json({ success: false, error: 'Code expired. Try again.' }, 400);
    }

    if (String(record.code) !== String(code)) {
      return c.json({ success: false, error: 'Invalid code' }, 400);
    }

    const { passwordHash } = await buildPasswordHash(password);

    await c.env.DB
      .prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)')
      .bind(email, passwordHash, 'student')
      .run();

    const inserted = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (!inserted?.id) {
      return c.json({ success: false, error: 'Account creation failed' }, 500);
    }

    await c.env.DB.batch([
      c.env.DB.prepare('INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)').bind(inserted.id, email, name),
      c.env.DB
        .prepare('INSERT INTO academic_profiles (user_id, class_label, group_label) VALUES (?, ?, ?)')
        .bind(inserted.id, classLabel || null, groupLabel || null),
    ]);

    await c.env.DB.prepare('DELETE FROM email_verifications WHERE email = ?').bind(email).run();

    return c.json({ success: true, message: 'Account created' });
  } catch (e) {
    return c.json({ success: false, error: 'Database error: ' + (e instanceof Error ? e.message : String(e)) }, 500);
  }
});

export default studentAuth;
