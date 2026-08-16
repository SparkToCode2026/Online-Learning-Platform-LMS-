const API_BASE_URL = "http://localhost:5236/Quiz";

// ==============================
// Get Elements
// ==============================
const modal = document.getElementById("updateQuizModal");
const form = document.getElementById("updateQuizForm");
const quizIdInput = document.getElementById("quizId");
const quizTitleInput = document.getElementById("quizTitle");
const quizScoreInput = document.getElementById("quizScore");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

// ==============================
// Close Modal
// ==============================
function closeModal() {
    modal.classList.remove("active");
}

// ==============================
// Open Modal
// ==============================
function openModal(quizId, quizTitle, quizScore) {
    quizIdInput.value = quizId;
    quizTitleInput.value = quizTitle;
    quizScoreInput.value = quizScore;
    modal.classList.add("active");
}

// ==============================
// Update Quiz
// ==============================
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const quizId = Number(quizIdInput.value);
    const title = quizTitleInput.value.trim();
    const score = Number(quizScoreInput.value);

    // Basic validation
    if (!quizId) {
        alert("Quiz ID is required.");
        return;
    }

    if (!title) {
        alert("Please enter a quiz title.");
        return;
    }

    if (score < 0 || Number.isNaN(score)) {
        alert("Please enter a valid quiz score.");
        return;
    }

    try {
        /*
         Backend endpoint:
         PUT /Quiz/UpdateQuiz?id=1&title=NewTitle&score=20
        */
        const url =
            `${API_BASE_URL}/UpdateQuiz` +
            `?id=${quizId}` +
            `&title=${encodeURIComponent(title)}` +
            `&score=${score}`;

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                errorText || "Failed to update quiz."
            );
        }

        alert("Quiz updated successfully.");

        closeModal();

        /*
         Refresh the parent page
         so the updated quiz appears.
        */
        if (window.parent !== window) {
            window.parent.location.reload();
        } else {
            window.location.reload();
        }

    } catch (error) {
        console.error(
            "Update Quiz Error:",
            error
        );

        alert(
            "Could not update the quiz."
        );
    }
});

// ==============================
// Buttons
// ==============================
closeModalBtn.addEventListener(
    "click",
    closeModal
);

cancelBtn.addEventListener(
    "click",
    closeModal
);

// ==============================
// Close when clicking outside
// ==============================
modal.addEventListener(
    "click",
    function (event) {
        if (event.target === modal) {
            closeModal();
        }
    }
);

// ==============================
// Example
// ==============================
/*
To open the modal from quiz-management.js:
openModal(
   quiz.quizId,
   quiz.quizTitle,
   quiz.quizScore
);
*/


