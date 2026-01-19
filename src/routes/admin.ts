import { Hono } from 'hono';
import { DatabaseManager } from '../db/database.js';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const adminRoutes = new Hono<{ Bindings: Bindings }>();

// Admin dashboard data
adminRoutes.get('/dashboard', async (c) => {
  try {
    const dbManager = new DatabaseManager(c.env.DB);

    // Get platform statistics
    const stats = await getPlatformStats(dbManager);

    // Get recent users
    const recentUsers = await dbManager.query(`
      SELECT id, username, email, full_name, user_type, created_at, last_login
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Get recent activities
    const recentActivities = await dbManager.query(`
      SELECT al.*, u.username, u.full_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `);

    return c.json({
      success: true,
      stats,
      recentUsers: recentUsers.results || [],
      recentActivities: recentActivities.results || []
    });

  } catch (error) {
    console.error('Dashboard data failed:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// User management
adminRoutes.get('/users', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const userType = c.req.query('userType');
    const search = c.req.query('search');

    const dbManager = new DatabaseManager(c.env.DB);
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (userType) {
      whereClause += ' AND user_type = ?';
      params.push(userType);
    }

    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const offset = (page - 1) * limit;

    // Get users
    const usersResult = await dbManager.query(`
      SELECT u.*, up.country, up.education_level
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Get total count
    const countResult = await dbManager.query(`
      SELECT COUNT(*) as total FROM users u ${whereClause}
    `, params);

    const total = countResult.results?.[0]?.total || 0;

    return c.json({
      success: true,
      users: usersResult.results || [],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users failed:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// System settings
adminRoutes.get('/settings', async (c) => {
  try {
    const dbManager = new DatabaseManager(c.env.DB);

    const settingsResult = await dbManager.query(`
      SELECT * FROM system_settings
      ORDER BY setting_key
    `);

    return c.json({
      success: true,
      settings: settingsResult.results || []
    });

  } catch (error) {
    console.error('Get settings failed:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

adminRoutes.put('/settings', async (c) => {
  try {
    const { settings } = await c.req.json();

    if (!Array.isArray(settings)) {
      return c.json({ error: 'Settings must be an array' }, 400);
    }

    const dbManager = new DatabaseManager(c.env.DB);

    for (const setting of settings) {
      await dbManager.run(`
        UPDATE system_settings 
        SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
        WHERE setting_key = ?
      `, [setting.value, setting.key]);
    }

    return c.json({
      success: true,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Update settings failed:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Analytics data
adminRoutes.get('/analytics', async (c) => {
  try {
    const dbManager = new DatabaseManager(c.env.DB);

    // User growth data
    const userGrowth = await dbManager.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users
      WHERE created_at >= date('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // User type distribution
    const userTypeDistribution = await dbManager.query(`
      SELECT user_type, COUNT(*) as count
      FROM users
      GROUP BY user_type
    `);

    // Study sessions data
    const studySessions = await dbManager.query(`
      SELECT 
        DATE(started_at) as date,
        SUM(duration_minutes) as total_minutes,
        COUNT(*) as session_count
      FROM study_sessions
      WHERE started_at >= date('now', '-30 days')
      GROUP BY DATE(started_at)
      ORDER BY date ASC
    `);

    return c.json({
      success: true,
      userGrowth: userGrowth.results || [],
      userTypeDistribution: userTypeDistribution.results || [],
      studySessions: studySessions.results || []
    });

  } catch (error) {
    console.error('Get analytics failed:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Helper function to get platform statistics
async function getPlatformStats(dbManager: DatabaseManager) {
  const [
    totalUsers,
    activeUsers,
    totalSubjects,
    totalAssessments,
    totalStudyTime,
    totalCredits
  ] = await Promise.all([
    dbManager.query('SELECT COUNT(*) as count FROM users'),
    dbManager.query('SELECT COUNT(*) as count FROM users WHERE last_login >= date("now", "-7 days")'),
    dbManager.query('SELECT COUNT(*) as count FROM subjects WHERE is_active = 1'),
    dbManager.query('SELECT COUNT(*) as count FROM assessments WHERE is_active = 1'),
    dbManager.query('SELECT SUM(duration_minutes) as total FROM study_sessions'),
    dbManager.query('SELECT SUM(amount) as total FROM credit_transactions WHERE transaction_type = "earned"')
  ]);

  return {
    totalUsers: totalUsers.results?.[0]?.count || 0,
    activeUsers: activeUsers.results?.[0]?.count || 0,
    totalSubjects: totalSubjects.results?.[0]?.count || 0,
    totalAssessments: totalAssessments.results?.[0]?.count || 0,
    totalStudyTime: totalStudyTime.results?.[0]?.total || 0,
    totalCreditsEarned: totalCredits.results?.[0]?.total || 0
  };
}

export { adminRoutes };
