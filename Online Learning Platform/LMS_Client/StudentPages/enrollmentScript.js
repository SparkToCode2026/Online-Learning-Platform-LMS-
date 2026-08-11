document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  initEnrollmentEvents();
  initProgressAnimations();
});

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
 * Initializes modal and enrollment interactions
 */
function initEnrollmentEvents() {
  const btnEnrollMain = document.getElementById('btn-enroll-main');
  const modalOverlay = document.getElementById('enroll-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const courseSearchInput = document.getElementById('course-search-input');
  const availableCoursesList = document.getElementById('available-courses-list');

  // Open modal
  if (btnEnrollMain && modalOverlay) {
    btnEnrollMain.addEventListener('click', () => {
      modalOverlay.classList.add('open');
    });
  }

  // Close modal
  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }

  // Search filter
  if (courseSearchInput && availableCoursesList) {
    courseSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const courseItems = availableCoursesList.querySelectorAll('.available-course-card');
      
      courseItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const instructor = item.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || instructor.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Handle click on modal "Enroll" buttons
  if (availableCoursesList) {
    availableCoursesList.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.btn-enroll-card');
      if (targetBtn && !targetBtn.classList.contains('enrolled')) {
        const courseCard = targetBtn.closest('.available-course-card');
        const courseTitle = courseCard.getAttribute('data-title');
        const instructor = courseCard.getAttribute('data-instructor');
        const iconType = courseCard.getAttribute('data-icon') || 'book';

        // Add course to enrollment list
        addNewEnrollmentCard(courseTitle, instructor, iconType);

        // Update button state
        targetBtn.classList.add('enrolled');
        targetBtn.textContent = 'Enrolled';

        // Close modal and notify
        setTimeout(() => {
          modalOverlay.classList.remove('open');
          showToast(`Successfully enrolled in ${courseTitle}!`);
        }, 300);
      }
    });
  }
}

/**
 * Creates and appends a new course card dynamically
 */
function addNewEnrollmentCard(title, instructor, iconType) {
  const container = document.getElementById('enrollments-container');
  if (!container) return;

  const card = document.createElement('article');
  card.className = 'enrollment-card';
  
  let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
  if (iconType === 'tech') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
  } else if (iconType === 'math') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  }

  card.innerHTML = `
    <div class="card-top">
      <div class="course-info-header">
        <div class="course-icon-badge">
          ${iconSvg}
        </div>
        <h3 class="course-title">${title}</h3>
      </div>
      <span class="status-badge active">Active</span>
    </div>
    <p class="instructor-name">Instructor: ${instructor}</p>
    <div class="progress-container">
      <div class="progress-header">
        <span class="progress-label">Progress</span>
        <span class="progress-value">0%</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: 0%;"></div>
      </div>
    </div>
  `;

  container.prepend(card);
  
  // Animate progress bar fill after DOM render
  setTimeout(() => {
    const progressFill = card.querySelector('.progress-bar-fill');
    const progressValue = card.querySelector('.progress-value');
    if (progressFill) progressFill.style.width = '5%';
    if (progressValue) progressValue.textContent = '5%';
  }, 100);

  updateEnrollmentStats();
}

function updateEnrollmentStats() {
  const count = document.querySelectorAll('.enrollment-card').length;
  const statsElem = document.getElementById('enrollment-count-text');
  if (statsElem) {
    statsElem.textContent = `${count} total courses enrolled`;
  }
}

/**
 * Animated entrance for initial progress bars
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

/**
 * Toast Notification Utility
 */
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
