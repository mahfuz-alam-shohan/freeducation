export const usersStyles = `
.users-card-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.users-card-title,.users-modal-title { margin: 0; }
.users-modal-body,.users-form { display: grid; gap: 8px; }
.users-form label { display: grid; gap: 4px; font-size: 12px; color: var(--text); }
.users-form input,.users-form select { height: 32px; border: 1px solid var(--line); border-radius: 6px; padding: 0 8px; font-size: 13px; }
.users-form .btn { justify-self: start; }
.users-table { table-layout: fixed; width: 100%; border-collapse: collapse; }
.users-table thead th { background: #f2f6ff; color: #334155; font-size: 10px; border: 1px solid var(--line); padding: 4px 5px; text-transform: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; vertical-align: middle; }
.users-table tbody td { border: 1px solid var(--line); padding: 3px 5px; font-size: 12px; vertical-align: middle; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.users-modal { border: 0; padding: 0; background: transparent; max-width: none; width: min(720px, 94vw); }
.users-modal::backdrop { background: rgba(15, 23, 42, 0.5); }
.users-modal[open] { display: grid; place-items: center; }
.users-modal-inner { width: 100%; max-height: min(86vh, 760px); overflow: auto; border-radius: 8px; padding: 10px; display: grid; gap: 8px; background: #fff; box-shadow: var(--shadow-soft); }
.users-modal-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; position: sticky; top: 0; background: inherit; z-index: 1; padding-bottom: 5px; border-bottom: 1px solid var(--line); }
.users-modal-inner { border: 1px solid #c8d8f8; box-shadow: 0 16px 30px rgba(56, 79, 157, 0.16); background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%); }
.users-table thead th { background: #ecf2ff; color: #2c4388; }
.users-form input,.users-form select { border-color: #c6d6f8; border-radius: 8px; }
`;
