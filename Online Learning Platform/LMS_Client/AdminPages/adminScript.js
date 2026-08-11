document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('user-search');
  const roleSelect = document.getElementById('role-filter');
  const tableRows = document.querySelectorAll('#user-table-body tr');

  function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedRole = roleSelect.value.toLowerCase();

    tableRows.forEach(row => {
      const name = row.querySelector('.user-name').textContent.toLowerCase();
      const email = row.querySelector('.user-email').textContent.toLowerCase();
      const id = row.querySelector('.user-id').textContent.toLowerCase();
      const role = row.querySelector('.role-badge').textContent.toLowerCase();

      const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm) || id.includes(searchTerm);
      const matchesRole = selectedRole === 'all' || role === selectedRole;

      if (matchesSearch && matchesRole) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  searchInput.addEventListener('input', filterUsers);
  roleSelect.addEventListener('change', filterUsers);
});