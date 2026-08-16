import {
  getAllCourses,
  getTopExpensiveCourses
} from '../APIs/CourseApi.js';

// Store course data locally
let allCoursesData = [];
let topCoursesData = [];

document.addEventListener('DOMContentLoaded', () => {

  // Load data from API
  loadTopExpensiveCourses();
  loadAllCourses();

  // Search input
  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Category filter
  const categoryFilter = document.getElementById('categoryFilter');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }

  // Create course button
  const createCourseBtn = document.getElementById('createCourseBtn');

  if (createCourseBtn) {
    createCourseBtn.addEventListener('click', openCreateCourse);
  }
});


/* =========================================================
   1. LOAD TOP 5 EXPENSIVE COURSES
   ========================================================= */

async function loadTopExpensiveCourses() {

  try {

    // Get top courses from API
    topCoursesData = await getTopExpensiveCourses();

    console.log(
      'Top expensive courses received from API:',
      topCoursesData
    );

    // Display courses
    renderCourseCards(
      topCoursesData,
      'topExpensiveContainer'
    );

  } catch (error) {

    console.error(
      'Error loading top expensive courses:',
      error
    );

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


/* =========================================================
   2. LOAD ALL COURSES
   ========================================================= */

async function loadAllCourses() {

  try {

    // Get all courses from API
    allCoursesData = await getAllCourses();

    console.log(
      'All courses received from API:',
      allCoursesData
    );

    // Display courses
    renderCourseCards(
      allCoursesData,
      'allCoursesContainer'
    );

    // Create category dropdown
    populateCategoryDropdown();

  } catch (error) {

    console.error(
      'Error loading courses:',
      error
    );

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


/* =========================================================
   3. POPULATE CATEGORY DROPDOWN
   ========================================================= */

function populateCategoryDropdown() {

  const dropdown =
    document.getElementById('categoryFilter');

  if (!dropdown) {
    return;
  }

  // Clear existing options
  dropdown.innerHTML = `
    <option value="">All Categories</option>
  `;

  const categories = [];

  // Get unique categories from courses
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

  // Add categories to dropdown
  categories.forEach(category => {

    const option =
      document.createElement('option');

    option.value = category.id;
    option.textContent = category.name;

    dropdown.appendChild(option);
  });
}


/* =========================================================
   4. RENDER COURSE CARDS
   ========================================================= */

function renderCourseCards(courses, containerId) {

  const container =
    document.getElementById(containerId);

  if (!container) {
    return;
  }

  // Clear container
  container.innerHTML = '';

  // No courses
  if (!courses || courses.length === 0) {

    container.innerHTML = `
      <p style="
        color:#888;
        grid-column:1/-1;
        text-align:center;
      ">
        No courses available.
      </p>
    `;

    return;
  }

  // Create card for every course
  courses.forEach(course => {

    const card =
      document.createElement('div');

    card.className = 'course-card';

    // Store information for searching/filtering
    card.setAttribute(
      'data-name',
      (course.courseName || '').toLowerCase()
    );

    card.setAttribute(
      'data-category-id',
      course.categoryId || ''
    );

    card.innerHTML = `
      <div class="course-icon-box">
        <i class="fa-solid fa-book-open-reader"></i>
      </div>

      <h3 class="course-name">
        ${course.courseName || 'Untitled Course'}
      </h3>

      <p class="course-category">
        Category:
        ${course.categoryName || 'General'}
      </p>

      <p class="course-price">
        OMR ${Number(
          course.coursePrice || 0
        ).toFixed(2)}
      </p>

      <p class="instructor-name">
        Instructor:
        ${course.instructorName || 'N/A'}
      </p>

      <button
        class="btn-details"
        data-id="${course.courseId}"
      >
        View Details
      </button>
    `;

    // View Details button
    const btnDetails =
      card.querySelector('.btn-details');

    if (btnDetails) {

      btnDetails.addEventListener(
        'click',
        () => viewDetails(course.courseId)
      );
    }

    // Add card to page
    container.appendChild(card);
  });
}


/* =========================================================
   5. CATEGORY FILTER
   ========================================================= */

function applyFilters() {

  const categoryFilter =
    document.getElementById('categoryFilter');

  if (!categoryFilter) {
    return;
  }

  const selectedCategory =
    categoryFilter.value;

  let filteredCourses =
    allCoursesData;

  // Filter by category
  if (selectedCategory) {

    filteredCourses =
      allCoursesData.filter(
        course =>
          String(course.categoryId) ===
          String(selectedCategory)
      );
  }

  // Display filtered courses
  renderCourseCards(
    filteredCourses,
    'allCoursesContainer'
  );

  // Apply search after category filtering
  handleSearch();
}


/* =========================================================
   6. LIVE SEARCH
   ========================================================= */

function handleSearch() {

  const searchInput =
    document.getElementById('searchInput');

  if (!searchInput) {
    return;
  }

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  const allCards =
    document.querySelectorAll(
      '#allCoursesContainer .course-card'
    );

  allCards.forEach(card => {

    const name =
      card.getAttribute('data-name') || '';

    if (name.includes(query)) {

      card.style.display = 'flex';

    } else {

      card.style.display = 'none';

    }
  });
}


/* =========================================================
   7. VIEW COURSE DETAILS
   ========================================================= */

function viewDetails(courseId) {

  console.log(
    'Opening course details for ID:',
    courseId
  );

  window.location.href =
    `course_details.html?id=${courseId}`;
}


/* =========================================================
   8. CREATE COURSE
   ========================================================= */

function openCreateCourse() {

  console.log(
    'Opening Create Course page...'
  );

  window.location.href =
    'create_course.html';
}