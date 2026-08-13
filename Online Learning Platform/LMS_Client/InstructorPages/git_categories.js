// Initial seed dataset used if localStorage is empty
const defaultCategories = [
  { id: 1, name: "Development", courseCount: 12 },
  { id: 2, name: "Design", courseCount: 8 },
  { id: 3, name: "Business", courseCount: 5 },
  { id: 4, name: "Data Science", courseCount: 4 },
  { id: 5, name: "Marketing (Empty)", courseCount: 0 }
];

// Helper to load categories from localStorage or initialize defaults
function getCategories() {
  const stored = localStorage.getItem('scholarhub_categories');
  if (!stored) {
    localStorage.setItem('scholarhub_categories', JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  return JSON.parse(stored);
}

// Helper to save categories back to localStorage
function saveCategories(data) {
  localStorage.setItem('scholarhub_categories', JSON.stringify(data));
}

document.addEventListener('DOMContentLoaded', () => {
  initCategories();

  // Attach action button event listeners
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', applyFilter);
  }

  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', resetFilter);
  }
});

function initCategories() {
  const categories = getCategories();
  populateDropdown(categories);
  renderTable(categories);
}

function populateDropdown(data) {
  const select = document.getElementById('categorySelect');
  if (!select) return;

  select.innerHTML = '<option value="">All Categories</option>';
  
  data.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name;
    select.appendChild(opt);
  });
}

function renderTable(data) {
  const tbody = document.getElementById('categoryTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #888;">No categories found</td></tr>`;
    return;
  }

  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${item.courseCount}</td>
      <td>
        <div class="action-cell">
          <!-- Navigates to Rename Category Page passing Query Parameters -->
          <a href="rename_category.html?id=${item.id}&name=${encodeURIComponent(item.name)}" class="icon-btn" title="Rename">
            <i class="fa-regular fa-pen-to-square"></i>
          </a>
          <button class="icon-btn" title="Delete" onclick="deleteCategory(${item.id})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteCategory(id) {
  let categories = getCategories();
  const category = categories.find(cat => Number(cat.id) === Number(id));

  if (!category) return;

  // Validation: Only allow deleting empty categories
  if (category.courseCount > 0) {
    alert(`Cannot delete '${category.name}' because it contains ${category.courseCount} course(s). You can only delete empty categories.`);
    return;
  }

  if (!confirm(`Are you sure you want to delete the empty category '${category.name}'?`)) {
    return;
  }

  // Remove category locally and persist
  categories = categories.filter(cat => Number(cat.id) !== Number(id));
  saveCategories(categories);

  // Re-render components
  populateDropdown(categories);
  resetFilter();
  alert('Category deleted successfully.');
}

function applyFilter() {
  const categories = getCategories();
  const select = document.getElementById('categorySelect');
  const selectedId = select ? select.value : '';

  if (!selectedId) {
    renderTable(categories);
  } else {
    const filtered = categories.filter(cat => String(cat.id) === String(selectedId));
    renderTable(filtered);
  }
}

function resetFilter() {
  const categories = getCategories();
  const select = document.getElementById('categorySelect');
  if (select) {
    select.value = '';
  }
  renderTable(categories);
}