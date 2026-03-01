import { listUsers } from "../../infrastructure/db/usersRepository.js";

export async function getWorkspaceMetrics(env) {
  const users = await listUsers(env.DB);
  const sessions = await env.DB.prepare("SELECT COUNT(*) total FROM freeducation_sessions").first();
  return {
    totalUsers: users.length,
    totalAdmins: users.length,
    activeSessions: Number(sessions?.total || 0),
  };
}
