import { Context, Next } from 'hono';
import { sign, verify } from 'hono/jwt';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization header required' }, 401);
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET) as any;
    
    // Store user info in context
    c.set('userId', payload.userId);
    c.set('userEmail', payload.email);
    c.set('userRole', payload.role);
    
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};

export const adminOnly = async (c: Context, next: Next) => {
  const userRole = c.get('userRole');
  
  if (userRole !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }
  
  await next();
};

export const roleBased = (allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const userRole = c.get('userRole');
    
    if (!allowedRoles.includes(userRole || '')) {
      return c.json({ error: 'Insufficient permissions' }, 403);
    }
    
    await next();
  };
};
