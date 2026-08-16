// quiz-list.js - Student Quiz List Logic
import { getAllQuizzes } from '../APIs/quizAPI.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderQuizzes();
});

/**
 * Fetches quizzes from the C# API and renders them dynamically
 */
async function fetchAndRenderQuizzes() {
    const container = document.getElementById('quiz-list-container');
    if (!container) return;

    try {
        const quizzes = await getAllQuizzes();
        renderQuizzes(quizzes || []);
    } catch (error) {
        container.innerHTML = `<p class="text-muted">${error.message || 'Failed to load quizzes.'}</p>`;
    }
}

function renderQuizzes(quizzes) {
    const container = document.getElementById('quiz-list-container');
    if (!container) return;

    container.innerHTML = '';

    if (quizzes.length === 0) {
        container.innerHTML = '<p class="text-muted">No quizzes found.</p>';
        return;
    }

    quizzes.forEach(quiz => {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <div>
                <h3 class="quiz-card-title">${quiz.quizTitle}</h3>
                <p class="quiz-card-meta">Course: ${quiz.courseName} • ${quiz.quizScore} Points</p>
            </div>
            <button class="primary-btn btn-start" data-quiz-id="${quiz.quizId}">Start Quiz</button>
        `;

        const startBtn = card.querySelector('.btn-start');
        startBtn.addEventListener('click', () => startQuiz(quiz.quizId));

        container.appendChild(card);
    });
}

/**
 * Handles starting a selected quiz
 * @param {number|string} quizId
 */
function startQuiz(quizId) {
    window.location.href = `student-quiz.html?quizId=${quizId}`;
}
