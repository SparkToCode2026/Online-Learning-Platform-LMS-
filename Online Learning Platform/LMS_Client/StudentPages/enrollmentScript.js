document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  initEnrollmentEvents();
  loadNewlyAddedCourses();
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
 * Initializes button navigation to enrollCourses.html
 */
function initEnrollmentEvents() {
  const btnEnrollMain = document.getElementById('btn-enroll-main');

  if (btnEnrollMain) {
    btnEnrollMain.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'enrollCourses.html';
    });
  }
}

/**
 * Reads any newly added courses from localStorage and appends them to My Enrollments
 */
function loadNewlyAddedCourses() {
  const storedList = JSON.parse(localStorage.getItem('myNewEnrollments') || '[]');
  const container = document.getElementById('enrollments-container');

  if (storedList.length > 0 && container) {
    storedList.forEach(course => {
      // Check if already rendered to prevent duplicates
      const existingTitles = Array.from(container.querySelectorAll('.course-title')).map(el => el.textContent);
      if (!existingTitles.includes(course.title)) {
        const card = document.createElement('article');
        card.className = 'enrollment-card';
        
        card.innerHTML = `
          <div class="card-top">
            <div class="course-info-header">
              <div class="course-icon-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3 class="course-title">${course.title}</h3>
            </div>
            <span class="status-badge active">Active</span>
          </div>
          <p class="instructor-name">Instructor: ${course.instructor}</p>
          <div class="progress-container">
            <div class="progress-header">
              <span class="progress-label">Progress</span>
              <span class="progress-value">5%</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" data-progress="5%" style="width: 5%;"></div>
            </div>
          </div>
        `;
        container.prepend(card);
      }
    });

    updateEnrollmentStats();
  }
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
