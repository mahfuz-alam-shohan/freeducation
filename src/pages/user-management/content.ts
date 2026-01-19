import type { UserListItem, UserRole } from "../../features/admin/userManagement";

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

type UserManagementContentProps = {
  users: UserListItem[];
  filters: {
    role?: UserRole | null;
    query?: string;
  };
  successMessage?: string;
};

export const renderUserManagementContent = ({ users, filters, successMessage }: UserManagementContentProps): string => {
  const queryValue = filters.query ? escapeValue(filters.query) : "";
  const roleValue = filters.role ?? "";

  const rows = users.length
    ? users
        .map(
          (user) => `
        <tr>
          <td>${formatRoleLabel(user.role)}</td>
          <td>${escapeValue(user.name)}</td>
          <td>${escapeValue(user.email)}</td>
          <td>${escapeValue(new Date(user.createdAt).toLocaleDateString())}</td>
          <td>
            <form method="post" action="/admin/users/delete">
              <input type="hidden" name="role" value="${escapeValue(user.role)}" />
              <input type="hidden" name="email" value="${escapeValue(user.email)}" />
              <button type="submit" class="button-link">Delete</button>
            </form>
          </td>
        </tr>`,
        )
        .join("")
    : `
        <tr>
          <td colspan="5">No users found for this filter.</td>
        </tr>`;

  return `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">User management</h1>
      <p class="page-subtitle">Review and create student, teacher, and admin accounts.</p>
      <div class="page-actions">
        <a class="button-link button-link--primary" href="/admin/users/new">Add user</a>
      </div>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    <section class="page-section">
      <form class="filter-bar" method="get" action="/admin/users">
        <div class="filter-fields">
          <label class="filter-field">
            <span>Role</span>
            <select name="role">
              <option value="" ${roleValue === "" ? "selected" : ""}>All roles</option>
              <option value="admin" ${roleValue === "admin" ? "selected" : ""}>Admin</option>
              <option value="teacher" ${roleValue === "teacher" ? "selected" : ""}>Teacher</option>
              <option value="student" ${roleValue === "student" ? "selected" : ""}>Student</option>
            </select>
          </label>
          <label class="filter-field">
            <span>Search</span>
            <input name="q" placeholder="Name or email" value="${queryValue}" />
          </label>
        </div>
        <div class="filter-actions">
          <button type="submit" class="button-link">Filter</button>
          <a class="button-link" href="/admin/users">Reset</a>
        </div>
      </form>
    </section>
    <section class="page-section">
      <table class="data-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </section>
  </section>
`;
};
