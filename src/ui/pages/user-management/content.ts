import type { UserListItem, UserRole } from "../../../domains/admin/userManagement";

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
  errorMessage?: string;
};

export const renderUserManagementContent = ({
  users,
  filters,
  successMessage,
  errorMessage,
}: UserManagementContentProps): string => {
  const queryValue = filters.query ? escapeValue(filters.query) : "";
  const roleValue = filters.role ?? "";

  const rows = users.length
    ? users
        .map(
          (user, index) => `
        <tr>
          <td>${formatRoleLabel(user.role)}</td>
          <td title="${escapeValue(user.name)}">${escapeValue(user.name)}</td>
          <td title="${escapeValue(user.email)}">${escapeValue(user.email)}</td>
          <td title="${escapeValue(new Date(user.createdAt).toLocaleDateString())}">${escapeValue(new Date(user.createdAt).toLocaleDateString())}</td>
          <td>
            <div class="confirm-delete">
              <input class="confirm-delete__toggle" type="checkbox" id="confirm-delete-${index}" />
              <label class="button-link button-link--danger" for="confirm-delete-${index}">Delete</label>
              <div class="confirm-delete__modal" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-${index}-title">
                <div class="confirm-delete__panel">
                  <div class="confirm-delete__header">
                    <h3 id="confirm-delete-${index}-title" class="confirm-delete__title">Confirm delete</h3>
                    <label class="confirm-delete__close" for="confirm-delete-${index}" aria-label="Close">×</label>
                  </div>
                  <form class="confirm-delete__form" method="post" action="/admin/users/delete">
                    <input type="hidden" name="role" value="${escapeValue(user.role)}" />
                    <input type="hidden" name="email" value="${escapeValue(user.email)}" />
                    <div class="confirm-delete__field">
                      <span>Admin password</span>
                      <input type="password" name="adminPassword" required autocomplete="current-password" />
                    </div>
                    <div class="confirm-delete__actions">
                      <label class="button-link" for="confirm-delete-${index}">Cancel</label>
                      <button type="submit" class="button-link button-link--danger">Confirm delete</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </td>
        </tr>`,
        )
        .join("")
    : `
        <tr>
          <td colspan="5" style="text-align: center; padding: 24px; color: var(--color-text-muted); font-style: italic;">No users found for this filter.</td>
        </tr>`;

  return `
    <header class="page-header">
      <h1 class="page-title">User management</h1>
      <p class="page-subtitle">Review and create student, teacher, and admin accounts.</p>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <section class="page-section">
      <div class="user-management-toolbar">
        <form class="filter-form" method="get" action="/admin/users">
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
              <input name="q" placeholder="Name or email" value="${queryValue}" autocomplete="off" />
            </label>
          </div>
          <div class="filter-actions">
            <button type="submit" class="button-link">Filter</button>
            <a class="button-link" href="/admin/users">Reset</a>
          </div>
        </form>
        <div class="toolbar-actions">
          <a class="button-link button-link--primary" href="/admin/users/new">Add user</a>
        </div>
      </div>
    </section>
    <section class="page-section">
      <div class="table-scroll">
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
      </div>
    </section>
  `;
};
