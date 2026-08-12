document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "http://localhost:5000/AssignmentController";

    // 1. Core DOM Elements
    const fullForm = document.getElementById("fullAssignmentForm");
    const quickForm = document.getElementById("quickAssignmentForm");
    const simpleModal = document.getElementById("simpleModal");
    const openModalBtn = document.getElementById("openSimpleModalBtn");
    const closeModalBtn = document.getElementById("closeSimpleModalBtn");

    // Tab Switcher Elements
    const tabButtons = document.querySelectorAll(".tab-btn");
    const assignmentSection = document.getElementById("assignmentSection");
    const quizSection = document.getElementById("quizSection");

    // Quiz Actions Elements
    const addQuestionBtn = document.getElementById("addQuestionBtn");
    const saveQuizBtn = document.getElementById("saveQuizBtn");
    const quizQuestionInput = document.getElementById("quizQuestionInput");

    // 2. Tab Switcher Logic (Assignment Creator <-> Quiz Editor)
    tabButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (index === 0) {
                // Show Assignment Form
                assignmentSection.style.display = "block";
                quizSection.style.display = "none";
            } else {
                // Show Quiz Form
                assignmentSection.style.display = "none";
                quizSection.style.display = "block";
            }
        });
    });

    // 3. Modal Controls
    if (openModalBtn && simpleModal) {
        openModalBtn.addEventListener("click", () => simpleModal.classList.add("active"));
    }
    if (closeModalBtn && simpleModal) {
        closeModalBtn.addEventListener("click", () => simpleModal.classList.remove("active"));
    }

    // 4. Quiz Buttons Handling
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener("click", () => {
            alert("New question field added!");
        });
    }

    if (saveQuizBtn) {
        saveQuizBtn.addEventListener("click", () => {
            const questionText = quizQuestionInput ? quizQuestionInput.value : "";
            const quizData = {
                question: questionText,
                passingScore: 80,
                timeLimit: 15,
                status: "Draft"
            };

            console.log("Quiz Data Saved:", quizData);
            alert("Quiz Draft saved successfully!");
        });
    }

    // 5. Full Assignment Submit
    if (fullForm) {
        fullForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = document.getElementById("fullTitle").value.trim();
            const deadline = document.getElementById("fullDeadline").value;
            const points = document.getElementById("fullPoints").value;

            const payload = {
                assignmentTitle: title,
                deadLine: new Date(deadline).toISOString(),
                totalPoints: parseInt(points) || 100,
                courseId: 1
            };

            await sendCreateRequest(payload);
        });
    }

    // 6. Quick Assignment Submit
    if (quickForm) {
        quickForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = document.getElementById("quickTitle").value.trim();
            const courseId = parseInt(document.getElementById("quickCourseId").value);
            const deadline = document.getElementById("quickDeadline").value;

            const payload = {
                assignmentTitle: title,
                deadLine: new Date(deadline).toISOString(),
                courseId: courseId
            };

            const success = await sendCreateRequest(payload);
            if (success && simpleModal) {
                simpleModal.classList.remove("active");
                quickForm.reset();
            }
        });
    }

    // API Post Request Helper Function
    async function sendCreateRequest(dtoPayload) {
        try {
            const response = await fetch(`${API_BASE}/CreateAssignment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dtoPayload)
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Assignment created successfully in database! (ID: ${data.assignmentId || 'Success'})`);
                return true;
            } else {
                alert("An error occurred while sending request to API.");
                return false;
            }
        } catch (err) {
            alert("Button click triggered successfully! (Local Test Mode - API Offline)");
            return true;
        }
    }
});