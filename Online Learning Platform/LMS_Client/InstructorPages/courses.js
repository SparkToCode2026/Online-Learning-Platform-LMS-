import {
  getAllCourses,
  getTopExpensiveCourses
} from './CourseApi.js';

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
async function loadTopExpensiveCourses() {

  try {

    topCoursesData = await getTopExpensiveCourses();

    renderCourseCards(
      topCoursesData,
      'topExpensiveContainer'
    );

  } catch (error) {

    console.error(error);

    const container =
      document.getElementById('topExpensiveContainer');

    if (container) {
      container.innerHTML = `
        <p style="color:red; grid-column:1/-1;">
          ${error.message}
        </p>
      `;
    }
  }
}

// 2. Populate All Courses
async function loadAllCourses() {

  try {

    allCoursesData = await getAllCourses();

    renderCourseCards(
      allCoursesData,
      'allCoursesContainer'
    );

    populateCategoryDropdown();

  } catch (error) {

    console.error(error);

    const container =
      document.getElementById('allCoursesContainer');

    if (container) {
      container.innerHTML = `
        <p style="color:red; grid-column:1/-1;">
          ${error.message}
        </p>
      `;
    }
  }
}

// 3. Load Categories into Dropdown
function populateCategoryDropdown() {

  const dropdown =
    document.getElementById('categoryFilter');

  if (!dropdown) return;

  dropdown.innerHTML =
    '<option value="">All Categories</option>';

  const categories = [];

  allCoursesData.forEach(course => {

    if (
      course.categoryId &&
      course.categoryName
    ) {

      const exists = categories.some(
        category =>
          category.id === course.categoryId
      );

      if (!exists) {

        categories.push({
          id: course.categoryId,
          name: course.categoryName
        });

      }
    }
  });

  categories.forEach(category => {

    const option =
      document.createElement('option');

    option.value = category.id;
    option.textContent = category.name;

    dropdown.appendChild(option);
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

