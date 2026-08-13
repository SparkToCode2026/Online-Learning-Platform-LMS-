import { getAllUsers } from '../APIs/UserAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('user-search');
  const roleSelect = document.getElementById('role-filter');
  const tableBody = document.getElementById('user-table-body');

  let allUsers = [];

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderUsers(usersToRender) {
    if (!tableBody) return;

    if (!usersToRender || usersToRender.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 24px; color: #8C827A;">No users found.</td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = usersToRender.map(user => {
      const id = user.id !== undefined ? user.id : (user.Id !== undefined ? user.Id : '');
      const formattedId = `USR-${String(id).padStart(4, '0')}`;
      const fullName = user.fullName || user.FullName || user.userName || user.UserName || 'Unnamed User';
      const email = user.email || user.Email || user.userEmail || user.UserEmail || 'N/A';
      const role = user.role || user.Role || user.userRole || user.UserRole || 'Student';
      
      const roleClass = role.toLowerCase() === 'instructor' ? 'role-instructor' : (role.toLowerCase() === 'admin' ? 'role-admin' : 'role-student');

      return `
        <tr>
          <td class="user-id">${escapeHtml(formattedId)}</td>
          <td class="user-name">${escapeHtml(fullName)}</td>
          <td class="user-email">${escapeHtml(email)}</td>
          <td><span class="role-badge ${roleClass}">${escapeHtml(role)}</span></td>
          <td class="text-right">
            <div class="action-buttons">
              <button class="action-btn" title="Edit User">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="action-btn" title="Permissions">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </button>
              <button class="action-btn delete-btn" title="Delete User">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function applyFilters() {
    const searchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const selectedRole = (roleSelect ? roleSelect.value : 'all').toLowerCase();

    const filtered = allUsers.filter(user => {
      const id = String(user.id !== undefined ? user.id : (user.Id || '')).toLowerCase();
      const formattedId = `usr-${id.padStart(4, '0')}`;
      const fullName = (user.fullName || user.FullName || user.userName || user.UserName || '').toLowerCase();
      const email = (user.email || user.Email || user.userEmail || user.UserEmail || '').toLowerCase();
      const role = (user.role || user.Role || user.userRole || user.UserRole || '').toLowerCase();

      const matchesSearch = !searchTerm || fullName.includes(searchTerm) || email.includes(searchTerm) || id.includes(searchTerm) || formattedId.includes(searchTerm);
      const matchesRole = selectedRole === 'all' || role === selectedRole;

      return matchesSearch && matchesRole;
    });

    renderUsers(filtered);
  }

  // Fetch real users from LMS_Server
  try {
    allUsers = await getAllUsers();
    renderUsers(allUsers);
  } catch (err) {
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 24px; color: #EE5A36;">
            Failed to load users: ${escapeHtml(err.message)}
          </td>
        </tr>
      `;
    }
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (roleSelect) roleSelect.addEventListener('change', applyFilters);
});