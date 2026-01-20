import type { UserRole } from "../../../../domains/admin/userManagement";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const formatRoleLabel = (role: UserRole): string => {
  if (role === "admin") {
    return "Admin";
  }
  if (role === "teacher") {
    return "Teacher";
  }
  return "Student";
};

type CreateUserContentProps = {
  role?: UserRole | null;
  errorMessage?: string;
  values?: {
    name?: string;
    email?: string;
    dateOfBirth?: string;
  };
};

export const renderCreateUserContent = ({ role, errorMessage, values }: CreateUserContentProps): string => {
  if (!role) {
    return `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Add a user</h1>
      <p class="page-subtitle">Select who you are creating before entering details.</p>
    </header>
    <form class="form-card form-grid" method="get" action="/admin/users/new">
      <label class="form-field">
        <span>User role</span>
        <select name="role" required>
          <option value="" selected disabled>Select a role</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      </label>
      <div class="form-actions">
        <button type="submit" class="button-link button-link--primary">Continue</button>
        <a class="button-link" href="/admin/users">Back to users</a>
      </div>
    </form>
  </section>
`;
  }

  return `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Add ${formatRoleLabel(role)}</h1>
      <p class="page-subtitle">Create a new ${formatRoleLabel(role).toLowerCase()} account with a Gmail address.</p>
    </header>
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <form class="form-card form-grid" method="post" action="/admin/users/new">
      <input type="hidden" name="role" value="${role}" />
      <label class="form-field">
        <span>Full name</span>
        <input name="name" autocomplete="name" required value="${values?.name ? escapeValue(values.name) : ""}" />
      </label>
      <label class="form-field">
        <span>Date of birth</span>
        <input type="date" name="dateOfBirth" required value="${values?.dateOfBirth ? escapeValue(values.dateOfBirth) : ""}" />
      </label>
      <label class="form-field">
        <span>Gmail address</span>
        <input type="email" name="email" placeholder="user@gmail.com" autocomplete="email" required value="${values?.email ? escapeValue(values.email) : ""}" />
      </label>
      <label class="form-field">
        <span>Temporary password</span>
        <input type="password" name="password" autocomplete="new-password" required minlength="8" />
      </label>
      <div class="form-actions">
        <button type="submit" class="button-link button-link--primary">Create account</button>
        <a class="button-link" href="/admin/users">Back to users</a>
      </div>
      <p class="helper-text">Admins add accounts directly, so no email verification is required.</p>
    </form>
  </section>
`;
};
