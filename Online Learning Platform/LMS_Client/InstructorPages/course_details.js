import {
  getAllCourses,
  getTopExpensiveCourses
} from '../APIs/CourseApi.js';
// ===============================
// API Configuration
// ===============================

const API_URL = "https://localhost:7135/Course";

// ===============================
// Get Course ID from URL
// Example:
// course_details.html?id=101
// ===============================

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("id");


// ===============================
// When Page Loads
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    if (courseId) {
        loadCourseDetails(courseId);
    } else {
        showError("No course ID was provided.");
    }

});


// ===============================
// GET Course Details
// ===============================

async function loadCourseDetails(id) {

    try {

        const response = await fetch(
            `${API_URL}/GetCourseById?id=${id}`
        );

        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("Course not found.");
            }

            throw new Error("Failed to load course.");

        }

        const course = await response.json();

        console.log("Course received from API:", course);

        renderDetails(course);

    } catch (error) {

        console.error("Error:", error);

        showError(error.message);

    }

}


// ===============================
// Display Course Details
// ===============================

function renderDetails(course) {

    const container = document.getElementById("detailsContainer");

    container.innerHTML = `

        <div class="detail-item">

            <div class="detail-icon">
                <i class="fa-solid fa-graduation-cap icon-grad"></i>
            </div>

            <div class="detail-content">

                <span class="detail-label">
                    Course Name
                </span>

                <span class="detail-value">
                    ${course.courseName || "N/A"}
                </span>

            </div>

        </div>


        <div class="detail-item">

            <div class="detail-icon">
                <i class="fa-solid fa-circle-dollar-to-slot"></i>
            </div>

            <div class="detail-content">

                <span class="detail-label">
                    Course Price
                </span>

                <span class="detail-value">
                    ${Number(course.coursePrice || 0).toFixed(2)} OMR
                </span>

            </div>

        </div>


        <div class="detail-item">

            <div class="detail-icon">
                <i class="fa-regular fa-folder-open"></i>
            </div>

            <div class="detail-content">

                <span class="detail-label">
                    Course Category
                </span>

                <span class="detail-value">
                    ${course.categoryName || "General"}
                </span>

            </div>

        </div>


        <div class="detail-item">

            <div class="detail-icon">
                <i class="fa-regular fa-user"></i>
            </div>

            <div class="detail-content">

                <span class="detail-label">
                    Course Instructor
                </span>

                <span class="detail-value">
                    ${course.instructorName || "Not Assigned"}
                </span>

            </div>

        </div>

    `;
}


// ===============================
// Show Error
// ===============================

function showError(message) {

    document.getElementById("detailsContainer").innerHTML = `

        <p style="
            color: var(--danger-red);
            text-align: center;
            padding: 20px 0;
        ">
            ${message}
        </p>

    `;

}


// ===============================
// Back Button
// ===============================

function goBack() {

    window.location.href = "courses.html";

}


// ===============================
// Edit Button
// ===============================

function editCourse() {

    const targetId = courseId;

    window.location.href =
        `update_course.html?id=${targetId}`;

}


// ===============================
// DELETE Course
// ===============================

async function deleteCourse() {

    const targetId = courseId;

    if (!targetId) {

        alert("Course ID is missing.");

        return;

    }


    const confirmed = confirm(
        `Are you sure you want to delete course ID: ${targetId}?`
    );


    if (!confirmed) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/DeleteCourse?id=${targetId}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("Course not found.");
            }

            throw new Error("Failed to delete course.");

        }


        const result = await response.text();

        console.log("Delete response:", result);


        alert("Course deleted successfully.");


        goBack();


    } catch (error) {

        console.error("Delete error:", error);

        alert(error.message);

    }

}