const API_BASE_URL = "http://localhost:5236/Quiz";

// ==========================================
// Page Elements
// ==========================================
const modal =
    document.getElementById("changeCourseModal");
const form =
    document.getElementById("changeCourseForm");
const closeModalBtn =
    document.getElementById("closeModalBtn");
const cancelBtn =
    document.getElementById("cancelBtn");
const quizIdInput =
    document.getElementById("quizId");
const quizTitleInput =
    document.getElementById("quizTitle");
const currentCourseInput =
    document.getElementById("currentCourse");
const newCourseSelect =
    document.getElementById("newCourse");

// ==========================================
// Courses
// ==========================================
const courses = [
    {
        id: 101,
        name: "C# Programming"
    },
    {
        id: 102,
        name: "Database Design"
    },
    {
        id: 103,
        name: "Web Development"
    }
];

// ==========================================
// Load Courses
// ==========================================
function loadCourses() {
    newCourseSelect.innerHTML =
        '<option value="">Select New Course</option>';
    courses.forEach(function (course) {
        const option =
            document.createElement("option");
        option.value =
            course.id;
        option.textContent =
            course.name;
        newCourseSelect.appendChild(option);
    });
}

// ==========================================
// Open Modal
// ==========================================
function openChangeCourseModal(
    quizId,
    quizTitle,
    currentCourseName,
    currentCourseId
) {
    quizIdInput.value =
        quizId;
    quizTitleInput.value =
        quizTitle;
    currentCourseInput.value =
        currentCourseName;
    loadCourses();
    // Don't allow selecting
    // the current course again.
    const currentOption =
        newCourseSelect.querySelector(
            `option[value="${currentCourseId}"]`
        );
    if (currentOption) {
        currentOption.disabled = true;
    }
    newCourseSelect.value = "";
    modal.classList.add("active");
}

// ==========================================
// Close Modal
// ==========================================
function closeModal() {
    modal.classList.remove("active");
    form.reset();
}

// ==========================================
// Update Quiz Course
// ==========================================
form.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();
        const quizId =
            Number(quizIdInput.value);
        const courseId =
            Number(newCourseSelect.value);

        if (!quizId || !courseId) {
            alert(
                "Please select a new course."
            );
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/UpdateQuizCourse?id=${quizId}&courseId=${courseId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to update quiz course."
                );
            }

            alert(
                "Quiz course updated successfully."
            );

            closeModal();

            // Refresh parent page if available
            if (
                typeof window.refreshQuizList ===
                "function"
            ) {
                window.refreshQuizList();
            }
        } catch (error) {
            console.error(
                "Error updating quiz course:",
                error
            );
            alert(
                "Could not update the quiz course."
            );
        }
    }
);

// ==========================================
// Buttons
// ==========================================
closeModalBtn.addEventListener(
    "click",
    closeModal
);
cancelBtn.addEventListener(
    "click",
    closeModal
);

// ==========================================
// Close when clicking outside
// ==========================================
modal.addEventListener(
    "click",
    function (event) {
        if (event.target === modal) {
            closeModal();
        }
    }
);

// ==========================================
// Start
// ==========================================
loadCourses();

// Make function available to quiz-management.js
window.openChangeCourseModal =
    openChangeCourseModal;