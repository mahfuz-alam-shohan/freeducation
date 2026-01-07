import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';

// Import all your routes
import auth from './routes/auth';
import users from './routes/users';
import classes from './routes/classes';
import content from './routes/content';
import videos from './routes/videos';
import thumbnails from './routes/thumbnails';
import settings from './routes/settings';
import setup from './routes/setup';
import profile from './routes/profile';
import shared from './routes/shared';
import fonts from './routes/fonts';
import studentAuth from './routes/student-auth'; // <--- The new route

const app = new Hono<{ Bindings: Env }>();

// Global Middleware
app.use('/api/*', cors());

// Register Routes
app.route('/api/auth', auth);
app.route('/api/users', users);
app.route('/api/classes', classes);
app.route('/api/content', content);
app.route('/api/videos', videos);
app.route('/api/thumbnails', thumbnails);
app.route('/api/settings', settings);
app.route('/api/setup', setup);
app.route('/api/profile', profile);
app.route('/api/shared', shared);
app.route('/api/fonts', fonts);

// Register the Student Auth Route
app.route('/api/student', studentAuth); 

// Root API check
app.get('/api', (c) => c.json({ status: 'ok', version: '1.0.0' }));

// Export the handler for index.ts
export const handleApiRequest = (request: Request, env: Env) => app.fetch(request, env);
