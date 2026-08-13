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

// Local variables to hold our state
let allCoursesData = [];
let topCoursesData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadTopExpensiveCourses();
  loadAllCourses();
  populateCategoryDropdown();

  // Attach event listeners dynamically
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }

  const createCourseBtn = document.getElementById('createCourseBtn');
  if (createCourseBtn) {
    createCourseBtn.addEventListener('click', openCreateCourse);
  }
});

// 1. Populate Top 5 Highest Priced Courses (Derived locally from static data)
function loadTopExpensiveCourses() {
  // Sort courses by price descending and take top 5
  topCoursesData = [...staticCourses]
    .sort((a, b) => b.coursePrice - a.coursePrice)
    .slice(0, 5);

  renderCourseCards(topCoursesData, 'topExpensiveContainer');
}

// 2. Populate All Courses
function loadAllCourses() {
  allCoursesData = [...staticCourses];
  renderCourseCards(allCoursesData, 'allCoursesContainer');
}

// 3. Load Static Categories into Dropdown
function populateCategoryDropdown() {
  const dropdown = document.getElementById('categoryFilter');
  if (!dropdown) return;

  // Clear existing options except the default one
  dropdown.innerHTML = '<option value="">All Categories</option>';

  staticCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    dropdown.appendChild(opt);
  });
}

// 4. Render Course Cards
function renderCourseCards(courses, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';

  if (!courses || courses.length === 0) {
    container.innerHTML = `<p style="color:#888; grid-column: 1/-1;">No courses available.</p>`;
    return;
  }

  courses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.setAttribute('data-name', (course.courseName || '').toLowerCase());
    card.setAttribute('data-category-id', course.categoryId || '');

    card.innerHTML = `
      <div class="course-icon-box">
        <i class="fa-solid fa-book-open-reader"></i>
      </div>
      <h3 class="course-name">${course.courseName || 'Untitled Course'}</h3>
      <p class="course-category">Category: ${course.categoryName || 'General'}</p>
      <p class="course-price">OMR ${Number(course.coursePrice || 0).toFixed(2)}</p>
      <p class="instructor-name">Instructor: ${course.instructorName || 'N/A'}</p>
      <button class="btn-details" data-id="${course.courseId}">View Details</button>
    `;

    // Attach click handler for details button
    const btnDetails = card.querySelector('.btn-details');
    if (btnDetails) {
      btnDetails.addEventListener('click', () => viewDetails(course.courseId));
    }

    container.appendChild(card);
  });
}

// 5. Category Dropdown Filter Implementation (Filtering locally)
function applyFilters() {
  const selectedCat = document.getElementById('categoryFilter').value;

  let filteredCourses = allCoursesData;

  if (selectedCat) {
    filteredCourses = allCoursesData.filter(
      course => String(course.categoryId) === String(selectedCat)
    );
  }

  renderCourseCards(filteredCourses, 'allCoursesContainer');
  // Re-apply current live search query on the newly filtered list
  handleSearch();
}

// 6. Live Search Bar Filter Implementation
function handleSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const allCards = document.querySelectorAll('.course-card');

  allCards.forEach(card => {
    const name = card.getAttribute('data-name') || '';
    if (name.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Redirect to Course Details page with query string ID
function viewDetails(courseId) {
  window.location.href = `course_details.html?id=${courseId}`;
}

function openCreateCourse() {
  alert('Redirecting to Create Course page...');
}

