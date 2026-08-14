import { enrollStudent, getEnrollmentsByUserId } from '../APIs/EnrollmentAPIs.js';
import { getAllCourses } from '../APIs/CourseApi.js';

let allCourses = [];
let myEnrollments = [];

document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  initEnrollmentEvents();
  loadEnrollmentsFromServer();
  renderWelcomeBanner();
});

function renderWelcomeBanner() {
  const user = getCurrentUser();
  const banner = document.getElementById('banner-welcome-text');
  if (banner && user && user.fullName) {
    banner.textContent = `WELCOME BACK, ${user.fullName.toUpperCase()}!`;
  }
}

/**
 * Loads studentSidebar.html dynamically into #sidebar-container if needed
 */
function loadSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  fetch('studentSidebar.html')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
      highlightActiveNavLink();
    })
    .catch(error => {
      console.log('Sidebar pre-loaded or opened via local file protocol, applying navigation highlighting.', error);
      highlightActiveNavLink();
    });
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const page = link.getAttribute('data-page');
    if (page && currentPath.includes(page)) {
      link.classList.add('active');
    } else if (currentPath.endsWith('enrollment.html') || currentPath.endsWith('/') || currentPath === '') {
      if (page === 'enrollment') link.classList.add('active');
      else link.classList.remove('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Returns the logged-in user object stored at login, or null.
 */
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    return null;
  }
}

/**
 * Wires up the "Enroll in a New Course" button and the enrollment modal.
 */
function initEnrollmentEvents() {
  const btnEnrollMain = document.getElementById('btn-enroll-main');
  const modal = document.getElementById('enroll-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const searchInput = document.getElementById('course-search-input');

  if (btnEnrollMain && modal) {
    btnEnrollMain.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      loadAvailableCourses();
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => filterAvailableCourses(searchInput.value));
  }
}

/**
 * Fetches the current student's enrollments and renders them.
 */
async function loadEnrollmentsFromServer() {
  const container = document.getElementById('enrollments-container');
  const emptyText = document.getElementById('enrollments-empty-text');
  const user = getCurrentUser();

  if (!user || !user.id) {
    if (emptyText) emptyText.textContent = 'Please log in to view your enrollments.';
    updateEnrollmentStats(0);
    return;
  }

  try {
    const [enrollments, courses] = await Promise.all([
      getEnrollmentsByUserId(user.id),
      getAllCourses(),
    ]);

    myEnrollments = enrollments || [];
    allCourses = courses || [];

    renderEnrollments(myEnrollments, allCourses);
  } catch (err) {
    if (emptyText) emptyText.textContent = err.message || 'Failed to load your enrollments.';
    updateEnrollmentStats(0);
  }
}

/**
 * Renders enrollment cards using live enrollment + course data.
 */
function renderEnrollments(enrollments, courses) {
  const container = document.getElementById('enrollments-container');
  if (!container) return;

  container.innerHTML = '';

  if (!enrollments || enrollments.length === 0) {
    const emptyText = document.createElement('p');
    emptyText.className = 'empty-state-text';
    emptyText.id = 'enrollments-empty-text';
    emptyText.textContent = 'You are not enrolled in any courses yet.';
    container.appendChild(emptyText);
    updateEnrollmentStats(0);
    return;
  }

  const courseMap = new Map(courses.map(c => [c.courseId, c]));

  enrollments.forEach(enrollment => {
    const course = courseMap.get(enrollment.courseId);
    const title = course ? course.courseName : `Course #${enrollment.courseId}`;
    const instructor = course ? course.instructorName : 'Unknown';
    const statusName = enrollment.statusName || 'Pending';
    const progress = statusName === 'Completed' ? 100 : 0;

    const link = document.createElement('a');
    link.href = 'Course Player.html';
    link.className = 'enrollment-card-link';

    link.innerHTML = `
      <article class="enrollment-card">
        <div class="card-top">
          <div class="course-info-header">
            <div class="course-icon-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h3 class="course-title">${title}</h3>
          </div>
          <span class="status-badge ${statusName.toLowerCase()}">${statusName}</span>
        </div>
        <p class="instructor-name">Instructor: ${instructor}</p>
        <div class="progress-container">
          <div class="progress-header">
            <span class="progress-label">Progress</span>
            <span class="progress-value">${progress}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" data-progress="${progress}%" style="width: 0%;"></div>
          </div>
        </div>
      </article>
    `;

    container.appendChild(link);
  });

  updateEnrollmentStats(enrollments.length);
  initProgressAnimations();
}

function updateEnrollmentStats(count) {
  const statsElem = document.getElementById('enrollment-count-text');
  if (statsElem) {
    statsElem.textContent = `${count} total course${count === 1 ? '' : 's'} enrolled`;
  }
}

/**
 * Fetches all courses and renders the ones the student isn't already enrolled in.
 */
async function loadAvailableCourses() {
  const listContainer = document.getElementById('available-courses-list');
  if (!listContainer) return;

  listContainer.innerHTML = '<p class="empty-state-text">Loading available courses...</p>';

  try {
    if (allCourses.length === 0) {
      allCourses = await getAllCourses();
    }

    const enrolledCourseIds = new Set(myEnrollments.map(e => e.courseId));
    const availableCourses = allCourses.filter(c => !enrolledCourseIds.has(c.courseId));

    renderAvailableCourses(availableCourses);
  } catch (err) {
    listContainer.innerHTML = `<p class="empty-state-text">${err.message || 'Failed to load available courses.'}</p>`;
  }
}

function renderAvailableCourses(courses) {
  const listContainer = document.getElementById('available-courses-list');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  if (!courses || courses.length === 0) {
    listContainer.innerHTML = '<p class="empty-state-text">No available courses to enroll in right now.</p>';
    return;
  }

  courses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'available-course-card';
    card.dataset.title = course.courseName;
    card.dataset.instructor = course.instructorName;
    card.dataset.courseId = course.courseId;

    card.innerHTML = `
      <div class="course-info">
        <h4>${course.courseName}</h4>
        <p>Instructor: ${course.instructorName} • ${course.categoryName}</p>
      </div>
      <button class="btn-enroll-card">Enroll Now</button>
    `;

    const enrollBtn = card.querySelector('.btn-enroll-card');
    enrollBtn.addEventListener('click', () => handleEnrollClick(course, enrollBtn));

    listContainer.appendChild(card);
  });
}

function filterAvailableCourses(query) {
  const normalizedQuery = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('#available-courses-list .available-course-card');

  cards.forEach(card => {
    const title = (card.dataset.title || '').toLowerCase();
    const instructor = (card.dataset.instructor || '').toLowerCase();
    const matches = title.includes(normalizedQuery) || instructor.includes(normalizedQuery);
    card.style.display = matches ? 'flex' : 'none';
  });
}

/**
 * Enrolls the current student in the selected course via the API and refreshes the UI.
 */
async function handleEnrollClick(course, button) {
  const user = getCurrentUser();
  if (!user || !user.id) {
    alert('Please log in to enroll in a course.');
    return;
  }

  button.disabled = true;
  button.textContent = 'Enrolling...';

  try {
    await enrollStudent(user.id, course.courseId);

    button.textContent = 'Enrolled';
    button.classList.add('enrolled');

    await loadEnrollmentsFromServer();
  } catch (err) {
    button.disabled = false;
    button.textContent = 'Enroll Now';
    alert(err.message || 'Failed to enroll in this course.');
  }
}

/**
 * Animated entrance for progress bars
 */
function initProgressAnimations() {
  const bars = document.querySelectorAll('.progress-bar-fill');
  bars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-progress') || '0%';
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 200);
  });
}
