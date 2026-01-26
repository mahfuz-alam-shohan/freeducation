export function renderUserForm() {
  return `
    <div class="modal" data-modal>
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>Create user</h2>
            <p>Invite a new admin or educator</p>
          </div>
          <button class="button ghost" data-action="close-modal">Close</button>
        </div>
        <form data-form="user-create">
          <div class="form-grid">
            <div class="field">
              <label>First name</label>
              <input class="input" name="firstName" required />
            </div>
            <div class="field">
              <label>Last name</label>
              <input class="input" name="lastName" required />
            </div>
            <div class="field">
              <label>Email</label>
              <input class="input" type="email" name="email" required />
            </div>
            <div class="field">
              <label>Password</label>
              <input class="input" type="password" name="password" required />
            </div>
            <div class="field">
              <label>Role</label>
              <select class="input" name="role">
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:18px;">
            <button class="button ghost" type="button" data-action="close-modal">Cancel</button>
            <button class="button" type="submit">Create user</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
