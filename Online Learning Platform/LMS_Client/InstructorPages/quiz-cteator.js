const API_BASE_URL = "http://localhost:5000/Quiz";

// =====================================================
// COURSE DATA
// =====================================================
let courses = [];

// =====================================================
// PAGE LOAD
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    loadCourses();
    setupPreview();
    setupForm();
    setupButtons();
});

// =====================================================
// LOAD COURSES
// =====================================================
async function loadCourses() {
    const courseSelect = document.getElementById("quizCourse");
    try {
        /*
         * Change this URL if your CourseController
         * uses another route.
         *
         * Example:
         * http://localhost:5000/Course/GetAllCourses
         */
        const response = await fetch(
            "http://localhost:5000/Course/GetAllCourses"
        );
        if (!response.ok) {
            throw new Error("Failed to load courses");
        }
        courses = await response.json();
        courseSelect.innerHTML =
            '<option value="">Select Course</option>';
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.courseId;
            option.textContent = course.courseName;
            courseSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Course API error:", error);
        /*
         * Temporary fallback courses.
         * Remove these once your Course API is confirmed.
         */
        courses = [
            {
                courseId: 1,
                courseName: "C# Programming"
            },
            {
                courseId: 2,
                courseName: "Database Design"
            },
            {
                courseId: 3,
                courseName: "Web Development"
            }
        ];
        courseSelect.innerHTML =
            '<option value="">Select Course</option>';
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.courseId;
            option.textContent = course.courseName;
            courseSelect.appendChild(option);
        });
    }
}

// =====================================================
// LIVE PREVIEW
// =====================================================
function setupPreview() {
    const titleInput =
        document.getElementById("quizTitle");
    const scoreInput =
        document.getElementById("quizScore");
    const questionInput =
        document.getElementById("questionText");
    const answerInputs =
        document.querySelectorAll(".answer-input");

    // Quiz title
    titleInput.addEventListener("input", () => {
        const title =
            titleInput.value.trim();
        document.querySelector(".preview-header h3")
            .textContent =
            title || "Quiz Preview";
    });

    // Score
    scoreInput.addEventListener("input", () => {
        const score =
            scoreInput.value || "0";
        document.getElementById("previewScore")
            .textContent = score;
    });

    // Question
    questionInput.addEventListener("input", () => {
        const question =
            questionInput.value.trim();
        document.getElementById("previewQuestion")
            .textContent =
            question || "Your question will appear here";
    });

    // Answers
    answerInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            const text =
                input.value.trim();
            const preview =
                document.getElementById(
                    `previewOption${index + 1}`
                );
            preview.textContent =
                text || `Answer option ${index + 1}`;
        });
    });
}

// =====================================================
// CREATE QUIZ
// =====================================================
function setupForm() {
    const form =
        document.getElementById("quizCreatorForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title =
            document.getElementById("quizTitle")
                .value.trim();
        const score =
            parseFloat(
                document.getElementById("quizScore")
                    .value
            );
        const courseId =
            parseInt(
                document.getElementById("quizCourse")
                    .value
            );

        // Validation
        if (!title) {
            alert("Please enter a quiz title.");
            return;
        }

        if (!score || score <= 0) {
            alert("Please enter a valid quiz score.");
            return;
        }

        if (!courseId) {
            alert("Please select a course.");
            return;
        }

        // =================================================
        // CREATE QUIZ OBJECT
        // =================================================
        const quizData = {
            quizTitle: title,
            quizScore: score,
            courseId: courseId
        };

        try {
            const response = await fetch(
                `${API_BASE_URL}/AddQuiz`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(quizData)
                }
            );

            if (!response.ok) {
                const errorText =
                    await response.text();
                console.error(errorText);
                throw new Error(
                    "Failed to create quiz"
                );
            }

            const quizId =
                await response.json();

            alert(
                `Quiz created successfully!\nQuiz ID: ${quizId}`
            );

            // Reset form
            form.reset();

            // Reset preview
            resetPreview();

        } catch (error) {
            console.error(
                "Create Quiz Error:",
                error
            );
            alert(
                "Unable to create quiz. Please check that the server is running."
            );
        }
    });
}

// =====================================================
// BUTTONS
// =====================================================
function setupButtons() {
    // Cancel
    document
        .getElementById("cancelBtn")
        .addEventListener("click", () => {
            const confirmed =
                confirm(
                    "Are you sure you want to cancel?"
                );
            if (confirmed) {
                window.history.back();
            }
        });

    // Add Question
    document
        .getElementById("addQuestionBtn")
        .addEventListener("click", () => {
            alert(
                "Question editor is ready on the frontend. To save questions to the database, a Question model and API are required."
            );
        });

    // Remove Question
    document
        .getElementById("removeQuestionBtn")
        .addEventListener("click", () => {
            const question =
                document.getElementById("questionText");
            const answers =
                document.querySelectorAll(".answer-input");

            question.value = "";
            answers.forEach(input => {
                input.value = "";
            });

            resetPreview();
        });

    // Tabs
    document
        .getElementById("quizTab")
        .addEventListener("click", () => {
            document
                .getElementById("quizTab")
                .classList.add("active");
            document
                .getElementById("assignmentTab")
                .classList.remove("active");
        });

    document
        .getElementById("assignmentTab")
        .addEventListener("click", () => {
            alert(
                "Assignment Creator will be implemented separately."
            );
        });
}

// =====================================================
// RESET PREVIEW
// =====================================================
function resetPreview() {
    document.getElementById("previewQuestion")
        .textContent =
        "Your question will appear here";

    document.getElementById("previewScore")
        .textContent = "20";

    document.querySelector(".preview-header h3")
        .textContent =
        "Quiz Preview";

    const previews = [
        "Answer option 1",
        "Answer option 2",
        "Answer option 3",
        "Answer option 4"
    ];

    previews.forEach((text, index) => {
        document.getElementById(
            `previewOption${index + 1}`
        ).textContent = text;
    });
}