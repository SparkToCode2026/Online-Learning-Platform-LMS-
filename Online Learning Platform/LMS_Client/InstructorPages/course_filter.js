// --- Static Mock Data ---
const staticCategories = [
  { id: 1, name: "Development" },
  { id: 2, name: "Design" },
  { id: 3, name: "Business" },
  { id: 4, name: "Data Science" }
];

const staticCourses = [
  {
    courseId: 101,
    courseName: "Full-Stack Web Development Bootcamp",
    categoryName: "Development",
    categoryId: 1,
    coursePrice: 350.00,
    instructorName: "Sarah Jenkins"
  },
  {
    courseId: 102,
    courseName: "Advanced UI/UX Design Masterclass",
    categoryName: "Design",
    categoryId: 2,
    coursePrice: 280.00,
    instructorName: "Alex Rivera"
  },
  {
    courseId: 103,
    courseName: "Data Science & Machine Learning with Python",
    categoryName: "Data Science",
    categoryId: 4,
    coursePrice: 420.00,
    instructorName: "Dr. Michael Chen"
  },
  {
    courseId: 104,
    courseName: "Digital Marketing & Brand Strategy",
    categoryName: "Business",
    categoryId: 3,
    coursePrice: 150.00,
    instructorName: "Emma Watson"
  },
  {
    courseId: 105,
    courseName: "Cloud Computing & AWS Architecture",
    categoryName: "Development",
    categoryId: 1,
    coursePrice: 310.00,
    instructorName: "David Miller"
  },
  {
    courseId: 106,
    courseName: "Financial Modeling & Business Analysis",
    categoryName: "Business",
    categoryId: 3,
    coursePrice: 190.00,
    instructorName: "Robert Vance"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  searchCourses(); // Render initial set of courses

  // 1. Button click listeners
  const searchBtn = document.getElementById('searchCoursesBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', searchCourses);
  }

  const clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearFilters);
  }

  // 2. Real-time dynamic listeners on the inputs
  const categorySelect = document.getElementById('categorySelect');
  if (categorySelect) {
    categorySelect.addEventListener('change', searchCourses);
  }

  const maxPriceInput = document.getElementById('maxPriceInput');
  if (maxPriceInput) {
    maxPriceInput.addEventListener('input', searchCourses);
  }
});

// Load Categories into Dropdown from static data
function loadCategories() {
  const categorySelect = document.getElementById('categorySelect');
  if (!categorySelect) return;

  categorySelect.innerHTML = '<option value="">Select a category...</option>';

  staticCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    categorySelect.appendChild(opt);
  });
}

// Main Filter Function (Handles both Category and Max Price)
function searchCourses() {
  const categoryId = document.getElementById('categorySelect').value;
  const maxPrice = document.getElementById('maxPriceInput').value;

  let filtered = [...staticCourses];

  // Filter by Selected Category
  if (categoryId) {
    filtered = filtered.filter(c => String(c.categoryId) === String(categoryId));
  }

  // Filter by Maximum Price
  if (maxPrice !== '' && !isNaN(maxPrice)) {
    filtered = filtered.filter(c => Number(c.coursePrice) <= Number(maxPrice));
  }

  renderTableRows(filtered);
}

// Render Table Rows
function renderTableRows(courses) {
  const tbody = document.getElementById('coursesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!courses || courses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">No courses match the selected criteria.</td>
      </tr>
    `;
    return;
  }

  courses.forEach(course => {
    const tr = document.createElement('tr');

    const courseId = course.courseId || '-';
    const courseName = course.courseName || 'N/A';
    const price = Number(course.coursePrice || 0).toFixed(2);
    const category = course.categoryName || 'General';
    const instructor = course.instructorName || 'Not Assigned';

    tr.innerHTML = `
      <td>${courseId}</td>
      <td class="course-title-cell">${courseName}</td>
      <td>${price}</td>
      <td>${category}</td>
      <td>${instructor}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Reset Filters
function clearFilters() {
  document.getElementById('categorySelect').value = '';
  document.getElementById('maxPriceInput').value = '';
  searchCourses();
}