import { createAdmin, getAdminCount, getUserByEmail } from "../db/users.js";
import { createSession, getSessionUser } from "../db/sessions.js";
import { renderPublicLayout } from "../layouts/public.js";
import { buildSessionCookie, generateToken, getSessionToken, hashPassword } from "../services/auth.js";
import { valueFromForm } from "../utils/forms.js";
import { escapeHtml } from "../utils/format.js";
import { htmlHeaders, redirect } from "../utils/http.js";

export async function handleHome(request, env) {
  const adminCount = await getAdminCount(env);

  if (adminCount === 0) {
    return new Response(renderSetupPage(), {
      headers: htmlHeaders(),
    });
  }

  const sessionUser = await getSessionUserFromRequest(request, env);
  if (sessionUser) {
    return redirect("/admin");
  }

  return redirect("/login");
}

export async function handleSetup(request, env) {
  const adminCount = await getAdminCount(env);
  if (adminCount > 0) {
    return redirect("/login");
  }

  if (request.method !== "POST") {
    return new Response(renderSetupPage(), {
      headers: htmlHeaders(),
    });
  }

  const form = await request.formData();
  const fullName = valueFromForm(form, "full_name");
  const email = valueFromForm(form, "email").toLowerCase();
  const password = valueFromForm(form, "password");
  const confirm = valueFromForm(form, "confirm_password");

  const errors = [];
  if (!fullName) errors.push("Full name is required.");
  if (!email) errors.push("Email is required.");
  if (!password) errors.push("Password is required.");
  if (password !== confirm) errors.push("Passwords do not match.");

  if (errors.length > 0) {
    return new Response(renderSetupPage(errors), {
      status: 400,
      headers: htmlHeaders(),
    });
  }

  const { hash, salt } = await hashPassword(password);
  await createAdmin(env, { fullName, email, hash, salt });

  return redirect("/login?setup=done");
}

export async function handleLogin(request, env) {
  const adminCount = await getAdminCount(env);
  const sessionUser = await getSessionUserFromRequest(request, env);

  if (sessionUser) {
    return redirect("/admin");
  }

  if (adminCount === 0) {
    return redirect("/");
  }

  if (request.method !== "POST") {
    const url = new URL(request.url);
    const status = url.searchParams.get("setup") === "done"
      ? "Admin account created. Please sign in."
      : null;

    return new Response(renderLoginPage(status), {
      headers: htmlHeaders(),
    });
  }

  const form = await request.formData();
  const email = valueFromForm(form, "email").toLowerCase();
  const password = valueFromForm(form, "password");

  const user = await getUserByEmail(env, email);
  if (!user || user.role !== "admin") {
    return new Response(renderLoginPage("Invalid credentials."), {
      status: 401,
      headers: htmlHeaders(),
    });
  }

  const { hash } = await hashPassword(password, user.password_salt);
  if (hash !== user.password_hash) {
    return new Response(renderLoginPage("Invalid credentials."), {
      status: 401,
      headers: htmlHeaders(),
    });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 8 * 1000).toISOString();
  await createSession(env, { token, userId: user.id, expiresAt });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin",
      "Set-Cookie": buildSessionCookie(token),
    },
  });
}

export async function getSessionUserFromRequest(request, env) {
  const sessionToken = getSessionToken(request);
  if (!sessionToken) {
    return null;
  }

  return getSessionUser(env, sessionToken);
}

function renderSetupPage(errors = []) {
  return renderPublicLayout({
    title: "Create first admin",
    heading: "Create the first admin",
    subtitle: "This one-time setup form will disappear after the first admin is created.",
    body: `
      ${errors.length ? `<div class="alert">${errors.map(escapeHtml).join(" ")}</div>` : ""}
      <form class="card form" method="POST" action="/setup">
        <label>
          Full name
          <input name="full_name" type="text" required />
        </label>
        <label>
          Email address
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required />
        </label>
        <label>
          Confirm password
          <input name="confirm_password" type="password" required />
        </label>
        <button class="button" type="submit">Create admin</button>
      </form>
    `,
  });
}

function renderLoginPage(message) {
  return renderPublicLayout({
    title: "Admin login",
    heading: "Admin login",
    subtitle: "Sign in to manage the platform.",
    body: `
      ${message ? `<div class="alert">${escapeHtml(message)}</div>` : ""}
      <form class="card form" method="POST" action="/login">
        <label>
          Email address
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required />
        </label>
        <button class="button" type="submit">Sign in</button>
      </form>
    `,
  });
}
