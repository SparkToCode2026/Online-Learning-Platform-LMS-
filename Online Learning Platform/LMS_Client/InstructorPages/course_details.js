// Static Mock Dataset replacing backend connections
const staticCourses = [
  {
    courseId: "101",
    courseName: "Full-Stack Web Development Bootcamp",
    coursePrice: 350.00,
    categoryName: "Development",
    instructorName: "Sarah Jenkins"
  },
  {
    courseId: "102",
    courseName: "Advanced UI/UX Design Masterclass",
    coursePrice: 280.00,
    categoryName: "Design",
    instructorName: "Alex Rivera"
  },
  {
    courseId: "103",
    courseName: "Data Science & Machine Learning with Python",
    coursePrice: 420.00,
    categoryName: "Data Science",
    instructorName: "Dr. Michael Chen"
  },
  {
    courseId: "104",
    courseName: "Digital Marketing & Brand Strategy",
    coursePrice: 150.00,
    categoryName: "Business",
    instructorName: "Emma Watson"
  }
];

// Extract Course ID from URL parameters (e.g. course_details.html?id=101)
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
  if (courseId) {
    loadStaticCourseDetails(courseId);
  } else {
    // Default fallback to first mock course if no ID parameter is in URL
    loadStaticCourseDetails("101");
  }
});

// 1. Fetch Course Details from Static Data
function loadStaticCourseDetails(id) {
  const course = staticCourses.find(c => String(c.courseId) === String(id));

  if (course) {
    renderDetails(course);
  } else {
    showError('Course not found in static records.');
  }
}

// 2. Render Details onto the Card
function renderDetails(course) {
  const container = document.getElementById('detailsContainer');
  
  container.innerHTML = `
    <div class="detail-item">
      <div class="detail-icon">
        <i class="fa-solid fa-graduation-cap icon-grad"></i>
      </div>
      <div class="detail-content">
        <span class="detail-label">Course Name</span>
        <span class="detail-value">${course.courseName || 'N/A'}</span>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-icon">
        <i class="fa-solid fa-circle-dollar-to-slot"></i>
      </div>
      <div class="detail-content">
        <span class="detail-label">Course Price</span>
        <span class="detail-value">${Number(course.coursePrice || 0).toFixed(2)} OMR</span>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-icon">
        <i class="fa-regular fa-folder-open"></i>
      </div>
      <div class="detail-content">
        <span class="detail-label">Course Category</span>
        <span class="detail-value">${course.categoryName || 'General'}</span>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-icon">
        <i class="fa-regular fa-user"></i>
      </div>
      <div class="detail-content">
        <span class="detail-label">Course Instructor</span>
        <span class="detail-value">${course.instructorName || 'Not Assigned'}</span>
      </div>
    </div>
  `;
}

function showError(message) {
  document.getElementById('detailsContainer').innerHTML = `
    <p style="color: var(--danger-red); text-align: center; padding: 20px 0;">${message}</p>
  `;
}

// 3. Navigation & Actions
function goBack() {
  window.location.href = 'courses.html';
}

function editCourse() {
  const targetId = courseId || "101";
  window.location.href = `update_course.html?id=${targetId}`;
}

function deleteCourse() {
  const targetId = courseId || "101";

  if (confirm(`Are you sure you want to delete course ID: ${targetId}?`)) {
    alert('Course deleted successfully (Simulated).');
    goBack();
  }
}