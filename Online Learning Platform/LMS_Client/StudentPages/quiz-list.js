document.addEventListener('DOMContentLoaded', () => {
    const startButtons = document.querySelectorAll('.btn-start');

    startButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quizId = button.getAttribute('data-quiz-id');
            // Navigate to the student quiz page
            window.location.href = `student-quiz.html?quizId=${quizId}`;
        });
    });
});
// quiz-list.js - Student Quiz List Logic

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderQuizzes();
});

/**
 * Fetches quizzes from the C# API and renders them dynamically
 */
async function fetchAndRenderQuizzes() {
    try {
        // Calling C# API endpoint
        const quizzes = await customFetch('/api/Quiz', 'GET');
        console.log('Quizzes loaded successfully:', quizzes);

        // TODO: Map over 'quizzes' array and inject dynamic HTML cards here
    } catch (error) {
        console.error('Failed to load quiz list:', error);
    }
}

/**
 * Handles starting a selected quiz
 * @param {number|string} quizId 
 */
function startQuiz(quizId) {
    window.location.href = `student-quiz.html?quizId=${quizId}`;
}