import { getAllCourses } from '../APIs/CourseApi.js';
import { enrollStudent, getEnrollmentsByUserId } from '../APIs/EnrollmentAPIs.js';

const PLACEHOLDER_IMAGES = ['images/course1.png', 'images/course2.png', 'images/course3.png', 'images/course4.png'];

let allCourses = [];
let enrolledCourseIds = new Set();

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  loadCoursesFromServer();
});

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    return null;
  }
}

async function loadCoursesFromServer() {
  const grid = document.getElementById('courses-grid');
  const user = getCurrentUser();

  try {
    const [courses, enrollments] = await Promise.all([
      getAllCourses(),
      user && user.id ? getEnrollmentsByUserId(user.id) : Promise.resolve([]),
    ]);

    allCourses = courses || [];
    enrolledCourseIds = new Set((enrollments || []).map(e => e.courseId));

    renderCourses(allCourses);
  } catch (err) {
    if (grid) {
      grid.innerHTML = `<p class="empty-state-text">${err.message || 'Failed to load courses.'}</p>`;
    }
  }
}

function renderCourses(courses) {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!courses || courses.length === 0) {
    grid.innerHTML = '<p class="empty-state-text">No courses are available right now.</p>';
    return;
  }

  courses.forEach((course, index) => {
    const isEnrolled = enrolledCourseIds.has(course.courseId);
    const image = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

    const card = document.createElement('article');
    card.className = 'course-item-card';
    card.dataset.id = course.courseId;
    card.dataset.instructor = course.instructorName;

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${image}" alt="${course.courseName}" class="course-img">
      </div>
      <div class="card-content-body">
        <h3 class="course-item-title">${course.courseName}</h3>
        <div class="card-meta-row">
          <span class="course-price">Price: ${course.coursePrice} OMR</span>
          <span class="badge-new">${course.categoryName}</span>
        </div>
        <button class="btn-add-course${isEnrolled ? ' added' : ''}">${isEnrolled ? 'Added' : 'Add'}</button>
      </div>
    `;

    const addBtn = card.querySelector('.btn-add-course');
    addBtn.addEventListener('click', () => handleAddClick(course, addBtn));

    grid.appendChild(card);
  });
}

async function handleAddClick(course, button) {
  if (button.classList.contains('added')) return;

  const user = getCurrentUser();
  if (!user || !user.id) {
    alert('Please log in to enroll in a course.');
    return;
  }

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = 'Enrolling...';

  try {
    await enrollStudent(user.id, course.courseId);
    enrolledCourseIds.add(course.courseId);
    button.classList.add('added');
    button.textContent = 'Added';
    button.disabled = false;
    showToast(`Enrolled in "${course.courseName}" successfully!`);
  } catch (err) {
    button.disabled = false;
    button.textContent = originalText;
    showToast(err.message || 'Failed to enroll in this course.');
  }
}

function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function filterCourses() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cards = document.querySelectorAll('#courses-grid .course-item-card');
    cards.forEach(card => {
      const title = card.querySelector('.course-item-title').textContent.toLowerCase();
      const instructor = (card.dataset.instructor || '').toLowerCase();
      const matches = title.includes(query) || instructor.includes(query);
      card.style.display = matches ? 'flex' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCourses);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', filterCourses);
  }
}

function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
