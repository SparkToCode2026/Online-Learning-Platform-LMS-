document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initAddButtons();
});

function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const courseCards = document.querySelectorAll('.course-item-card');

  function filterCourses() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    courseCards.forEach(card => {
      const title = card.querySelector('.course-item-title').textContent.toLowerCase();
      const price = card.querySelector('.course-price').textContent.toLowerCase();
      if (title.includes(query) || price.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCourses);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', filterCourses);
  }
}

function initAddButtons() {
  const addBtns = document.querySelectorAll('.btn-add-course');
  
  // Load existing enrolled courses from localStorage
  let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

  addBtns.forEach(btn => {
    const card = btn.closest('.course-item-card');
    const courseId = card.getAttribute('data-id');
    
    if (enrolledCourses.includes(courseId)) {
      btn.classList.add('added');
      btn.textContent = 'Added';
    }

    btn.addEventListener('click', () => {
      if (!btn.classList.contains('added')) {
        const title = card.querySelector('.course-item-title').textContent;
        const instructor = card.getAttribute('data-instructor') || 'Dr. Mike Andrew';
        
        btn.classList.add('added');
        btn.textContent = 'Added';

        // Add course object to stored array
        const newCourseObj = {
          id: courseId || Date.now(),
          title: title,
          instructor: instructor,
          progress: '0%',
          status: 'Active'
        };

        let storedList = JSON.parse(localStorage.getItem('myNewEnrollments') || '[]');
        storedList.unshift(newCourseObj);
        localStorage.setItem('myNewEnrollments', JSON.stringify(storedList));

        if (!enrolledCourses.includes(courseId)) {
          enrolledCourses.push(courseId);
          localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        }

        showToast(`Enrolled in "${title}" successfully!`);
      }
    });
  });
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
