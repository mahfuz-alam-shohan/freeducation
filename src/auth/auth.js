// Authentication utilities and middleware

// Common headers for API responses
export const defaultHeaders = {
  "Content-Type": "application/json",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

// Normalize email address
export const normalizeEmail = (email) => {
  return String(email || "").trim().toLowerCase();
};

// Simple password hashing (in production, use proper bcrypt/scrypt)
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt"); // Add salt in production
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `sha256:${hashHex}`;
};

// Verify password against hash
export const verifyPassword = async (password, hash) => {
  if (!hash || !password) return false;
  
  const [algorithm, storedHash] = hash.split(':');
  if (algorithm !== 'sha256') return false;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt"); // Match the same salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return computedHash === storedHash;
};

// Generate JWT token (simplified version)
export const generateToken = async (payload, env) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (24 * 60 * 60) // 24 hours
  };
  
  const encoder = new TextEncoder();
  const headerBase64 = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const payloadBase64 = btoa(JSON.stringify(tokenPayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
  const secret = env.JWT_SECRET || 'default-secret-change-in-production';
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const data = encoder.encode(`${headerBase64}.${payloadBase64}`);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
  return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
};

// Verify JWT token
export const verifyToken = async (token, env) => {
  try {
    const [headerBase64, payloadBase64, signatureBase64] = token.split('.');
    
    if (!headerBase64 || !payloadBase64 || !signatureBase64) {
      return null;
    }
    
    const encoder = new TextEncoder();
    const secret = env.JWT_SECRET || 'default-secret-change-in-production';
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const data = encoder.encode(`${headerBase64}.${payloadBase64}`);
    const signature = Uint8Array.from(atob(signatureBase64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    
    const isValid = await crypto.subtle.verify('HMAC', key, signature, data);
    
    if (!isValid) {
      return null;
    }
    
    const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Authentication middleware
export const authenticate = async (request, env) => {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const payload = await verifyToken(token, env);
  
  if (!payload) {
    return null;
  }
  
  // Fetch user from database
  const user = await env.DB.prepare(`
    SELECT users.id, users.email, users.role, user_profiles.username, user_profiles.name
    FROM users
    LEFT JOIN user_profiles ON user_profiles.user_id = users.id
    WHERE users.id = ?
  `).bind(payload.id).first();
  
  if (!user) {
    return null;
  }
  
  // Add additional user data based on role
  let permissions = [];
  let assignment = null;
  let classLabel = null;
  let groupLabel = null;
  
  if (user.role === 'admin') {
    const permResult = await env.DB.prepare("SELECT permissions FROM admin_permissions WHERE user_id = ?").bind(user.id).first();
    permissions = permResult?.permissions ? JSON.parse(permResult.permissions) : [];
  } else if (user.role === 'teacher') {
    const assignResult = await env.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(user.id).first();
    assignment = assignResult ? { level: assignResult.level, subject: assignResult.subject } : null;
    
    const permResult = await env.DB.prepare("SELECT permissions FROM teacher_permissions WHERE user_id = ?").bind(user.id).first();
    permissions = permResult?.permissions ? JSON.parse(permResult.permissions) : [];
  } else if (user.role === 'student') {
    const academicResult = await env.DB.prepare("SELECT class_label, group_label FROM academic_profiles WHERE user_id = ?").bind(user.id).first();
    classLabel = academicResult?.class_label || null;
    groupLabel = academicResult?.group_label || null;
  }
  
  return {
    id: user.id,
    username: user.username || user.email,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions,
    assignment,
    classLabel,
    groupLabel
  };
};

// Check if user has admin permissions
export const requireAdmin = (user) => {
  return user && user.role === 'admin';
};

// Check if user has specific permission
export const requirePermission = (user, permission) => {
  return user && user.permissions && user.permissions.includes(permission);
};

// Check if user has any of the specified permissions
export const requireAnyPermission = (user, permissions) => {
  return user && user.permissions && permissions.some(perm => user.permissions.includes(perm));
};

// Log user action
export const logUserAction = async (db, userId, action, details = null) => {
  try {
    await db.prepare(`
      INSERT INTO edit_history (user_id, action, details)
      VALUES (?, ?, ?)
    `).bind(userId, action, details ? JSON.stringify(details) : null).run();
  } catch (error) {
    console.error('Failed to log user action:', error);
  }
};
