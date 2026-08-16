// ==========================================
// API
// ==========================================
const API_BASE_URL = "http://localhost:5236";

// ==========================================
// Elements
// ==========================================
const modal = document.getElementById("createQuizModal");
const form = document.getElementById("createQuizForm");
const closeModalBtn =
    document.getElementById("closeModalBtn");
const cancelBtn =
    document.getElementById("cancelBtn");
const quizTitleInput =
    document.getElementById("quizTitle");
const quizScoreInput =
    document.getElementById("quizScore");
const courseSelect =
    document.getElementById("courseId");
const createBtn =
    document.getElementById("createBtn");
const errorMessage =
    document.getElementById("errorMessage");

// ==========================================
// Load Courses
// GET /Course/GetAllCourses
// ==========================================
async function loadCourses() {
    try {
        console.log("Loading courses...");
        const response = await fetch(
            `${API_BASE_URL}/Course/GetAllCourses`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load courses: ${response.status}`
            );
        }

        const courses = await response.json();
        console.log("Courses received:", courses);

        // Clear old options
        courseSelect.innerHTML = `
<option value="">
               Select Course
</option>
       `;

        // Add courses
        courses.forEach(course => {
            const option =
                document.createElement("option");

            option.value =
                course.courseId;

            option.textContent =
                course.courseName;

            courseSelect.appendChild(option);
        });

    } catch (error) {
        console.error(
            "Error loading courses:",
            error
        );

        courseSelect.innerHTML = `
<option value="">
               Could not load courses
</option>
       `;

        showError(
            "Could not load courses from the server."
        );
    }
}

// ==========================================
// Create Quiz
// POST /Quiz/AddQuiz
// ==========================================
form.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();
        hideError();

        // Get values
        const quizTitle =
            quizTitleInput.value.trim();

        const quizScore =
            Number(quizScoreInput.value);

        const courseId =
            Number(courseSelect.value);

        // ==================================
        // Validation
        // ==================================
        if (!quizTitle) {
            showError(
                "Please enter a quiz title."
            );
            return;
        }

        if (
            isNaN(quizScore) ||
            quizScore < 0
        ) {
            showError(
                "Please enter a valid quiz score."
            );
            return;
        }

        if (!courseId) {
            showError(
                "Please select a course."
            );
            return;
        }

        // ==================================
        // Data
        // ==================================
        const quizData = {
            quizTitle: quizTitle,
            quizScore: quizScore,
            courseId: courseId
        };

        console.log(
            "Sending quiz data:",
            quizData
        );

        // ==================================
        // Send to Backend
        // ==================================
        try {
            createBtn.disabled = true;
            createBtn.textContent =
                "Creating...";

            const response = await fetch(
                `${API_BASE_URL}/Quiz/AddQuiz`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(quizData)
                }
            );

            if (!response.ok) {
                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to create quiz."
                );
            }

            // Backend returns QuizId
            const quizId =
                await response.json();

            console.log(
                "Quiz created successfully:",
                quizId
            );

            alert(
                "Quiz created successfully!"
            );

            // Reset form
            form.reset();

            // Close modal
            closeModal();

            // Refresh parent page
            if (
                window.parent &&
                window.parent !== window
            ) {
                window.parent.location.reload();
            } else {
                window.location.reload();
            }

        } catch (error) {
            console.error(
                "Create Quiz Error:",
                error
            );

            showError(
                "Could not create the quiz. Please try again."
            );

        } finally {
            createBtn.disabled = false;
            createBtn.textContent =
                "Create Quiz";
        }
    }
);

// ==========================================
// Close Modal
// ==========================================
function closeModal() {
    modal.classList.remove("active");
}

// ==========================================
// Close Buttons
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
// Click Outside
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
// Error
// ==========================================
function showError(message) {
    errorMessage.textContent =
        message;
    errorMessage.classList.add(
        "show"
    );
}

function hideError() {
    errorMessage.textContent =
        "";
    errorMessage.classList.remove(
        "show"
    );
}

// ==========================================
// Start
// ==========================================
loadCourses();

