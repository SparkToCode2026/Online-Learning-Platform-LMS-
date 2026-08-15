document.addEventListener('DOMContentLoaded', () => {
    const btnBackToQuizzes = document.getElementById('btnBackToQuizzes');

    if (btnBackToQuizzes) {
        btnBackToQuizzes.addEventListener('click', () => {
            window.location.href = 'quiz-list.html';
        });
    }
});
// quiz-result.js - Quiz Results & Scoring Logic

document.addEventListener('DOMContentLoaded', () => {
    loadQuizResult();
    setupNavigationButtons();
});

async function loadQuizResult() {
    try {
        const result = await customFetch('/api/Quiz/result/latest', 'GET');
        console.log('Latest Quiz Result:', result);
        
        // TODO: Bind result metrics (score, percentage, breakdown) to HTML elements
    } catch (error) {
        console.error('Failed to fetch quiz result:', error);
    }
}

function setupNavigationButtons() {
    const btnBackToQuizzes = document.getElementById('btnBackToQuizzes');
    if (btnBackToQuizzes) {
        btnBackToQuizzes.addEventListener('click', () => {
            window.location.href = 'quiz-list.html';
        });
    }
}