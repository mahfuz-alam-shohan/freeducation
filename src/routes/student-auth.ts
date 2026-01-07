import { Hono } from 'hono';
import { sendVerificationEmail } from '../utils/email';

const studentAuth = new Hono<{ 
    Bindings: { 
        DB: D1Database, 
        GMAIL_CLIENT_ID: string,
        GMAIL_CLIENT_SECRET: string,
        GMAIL_REFRESH_TOKEN: string,
        JWT_SECRET: string 
    } 
}>();

// 1. Request OTP (User clicks "Continue")
studentAuth.post('/register-request', async (c) => {
    try {
        const { name, email, password, classLabel, groupLabel } = await c.req.json();

        if (!email || !password || !name) return c.json({ success: false, error: 'Missing fields' }, 400);

        // Check if user already exists
        const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
        if (existing) {
            return c.json({ success: false, error: 'User already exists. Please login.' }, 400);
        }

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Save OTP to DB (Insert or Update if exists)
        await c.env.DB.prepare(`
            INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET code = ?, expires_at = ?, attempts = 0
        `).bind(email, code, expiresAt, code, expiresAt).run();

        // Send Email using Gmail API
        const sent = await sendVerificationEmail(email, code, c.env);

        if (!sent) {
            return c.json({ success: false, error: 'Failed to send email. Please try again later.' }, 500);
        }

        return c.json({ success: true, message: 'OTP sent' });
    } catch (e) {
        console.error("Register Error:", e);
        return c.json({ success: false, error: 'Server error' }, 500);
    }
});

// 2. Verify OTP (User enters code)
studentAuth.post('/register-verify', async (c) => {
    try {
        const { email, code, name, password, classLabel, groupLabel } = await c.req.json();

        // Fetch stored OTP
        const record = await c.env.DB.prepare('SELECT * FROM email_verifications WHERE email = ?').bind(email).first();

        if (!record) return c.json({ success: false, error: 'No verification request found' }, 400);
        
        // Check expiration
        if (Date.now() > (record.expires_at as number)) {
            return c.json({ success: false, error: 'Code expired. Try again.' }, 400);
        }

        // Check code match
        if (String(record.code) !== String(code)) {
            return c.json({ success: false, error: 'Invalid code' }, 400);
        }

        // Create User
        const userId = crypto.randomUUID();
        await c.env.DB.prepare(`
            INSERT INTO users (id, name, email, password, role, class_label, group_label, created_at)
            VALUES (?, ?, ?, ?, 'student', ?, ?, ?)
        `).bind(userId, name, email, password, classLabel, groupLabel, Date.now()).run();

        // Delete used OTP
        await c.env.DB.prepare('DELETE FROM email_verifications WHERE email = ?').bind(email).run();

        return c.json({ success: true, message: 'Account created' });
    } catch (e) {
        console.error("Verify Error:", e);
        return c.json({ success: false, error: 'Database error' }, 500);
    }
});

export default studentAuth;
