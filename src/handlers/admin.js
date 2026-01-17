import { listAdmins, createAdmin, findUserByEmail } from "../db/users.js";
import { deleteSession, getSessionUser } from "../db/sessions.js";
import { renderAdminLayout } from "../layouts/admin.js";
import { clearSessionCookie, getSessionToken, hashPassword } from "../services/auth.js";
import { valueFromForm } from "../utils/forms.js";
import { escapeHtml, formatDate } from "../utils/format.js";
import { htmlHeaders, redirect } from "../utils/http.js";

export async function handleAdminHome(request, env) {
  const sessionUser = await requireAdminSession(request, env);
  if (!sessionUser) {
    return redirect("/login");
  }

  const content = `
    <section class="panel">
      <h2>Welcome back, ${escapeHtml(sessionUser.full_name)}</h2>
      <p class="muted">Start by managing admins or preparing subject modules for future content.</p>
      <div class="card-grid">
        <div class="card">
          <h3>User Management</h3>
          <p>Add or review admin accounts for the platform.</p>
          <a class="button" href="/admin/users">Open user management</a>
        </div>
        <div class="card">
          <h3>Subject Modules</h3>
          <p>Subject folders are prepared for future learning content uploads.</p>
          <div class="chip-row">
            <span class="chip">Bangla</span>
            <span class="chip">English</span>
            <span class="chip">Mathematics</span>
            <span class="chip">Science</span>
            <span class="chip">ICT</span>
          </div>
        </div>
      </div>
    </section>
  `;

  return new Response(renderAdminLayout({
    title: "Admin Dashboard",
    user: sessionUser,
    active: "dashboard",
    content,
  }), {
    headers: htmlHeaders(),
  });
}

export async function handleAdminUsers(request, env) {
  const sessionUser = await requireAdminSession(request, env);
  if (!sessionUser) {
    return redirect("/login");
  }

  let message;
  let status = 200;

  if (request.method === "POST") {
    const form = await request.formData();
    const fullName = valueFromForm(form, "full_name");
    const email = valueFromForm(form, "email").toLowerCase();
    const password = valueFromForm(form, "password");

    const errors = [];
    if (!fullName) errors.push("Full name is required.");
    if (!email) errors.push("Email is required.");
    if (!password) errors.push("Password is required.");

    if (errors.length > 0) {
      message = errors.join(" ");
      status = 400;
    } else {
      const existing = await findUserByEmail(env, email);

      if (existing) {
        message = "An account with that email already exists.";
        status = 400;
      } else {
        const { hash, salt } = await hashPassword(password);
        await createAdmin(env, { fullName, email, hash, salt });
        message = "Admin user added successfully.";
        status = 200;
      }
    }
  }

  const admins = await listAdmins(env);
  const rows = admins
    .map(
      (admin) => `
        <tr>
          <td>${escapeHtml(admin.full_name)}</td>
          <td>${escapeHtml(admin.email)}</td>
          <td>${formatDate(admin.created_at)}</td>
        </tr>
      `
    )
    .join("");

  const content = `
    <section class="panel">
      <h2>User management</h2>
      <p class="muted">Only admins can be added right now. More roles will come later.</p>
      ${message ? `<div class="alert">${escapeHtml(message)}</div>` : ""}
      <div class="split">
        <form class="card form" method="POST" action="/admin/users">
          <h3>Add admin</h3>
          <label>
            Full name
            <input name="full_name" type="text" required />
          </label>
          <label>
            Email address
            <input name="email" type="email" required />
          </label>
          <label>
            Temporary password
            <input name="password" type="password" required />
          </label>
          <button class="button" type="submit">Create admin</button>
        </form>
        <div class="card">
          <h3>Current admins</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="3" class="muted">No admins yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  return new Response(renderAdminLayout({
    title: "User Management",
    user: sessionUser,
    active: "users",
    content,
  }), {
    status,
    headers: htmlHeaders(),
  });
}

export async function handleLogout(request, env) {
  const sessionToken = getSessionToken(request);
  if (sessionToken) {
    await deleteSession(env, sessionToken);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login",
      "Set-Cookie": clearSessionCookie(),
    },
  });
}

async function requireAdminSession(request, env) {
  const sessionToken = getSessionToken(request);
  if (!sessionToken) {
    return null;
  }

  const user = await getSessionUser(env, sessionToken);
  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}
