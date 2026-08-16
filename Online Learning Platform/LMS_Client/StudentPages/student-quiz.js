import { createQuizAttempt } from '../APIs/QuizAttemptAPI.js';

const TOTAL_SCORE = 20;
const PASS_THRESHOLD = 0.5;

document.addEventListener('DOMContentLoaded', () => {
    setupBackButton();
    setupOptionSelection();
    setupNavigationDots();
    setupSubmissionModal();
});

function setupBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'quiz-list.html';
        });
    }
}

function setupOptionSelection() {
    const options = document.querySelectorAll('.option-item');
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });
}

function setupNavigationDots() {
    const dots = document.querySelectorAll('.nav-dots .dot');
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });
}

function setupSubmissionModal() {
    const confirmModal = document.getElementById('confirmModal');
    const btnOpenSubmitModal = document.getElementById('btnOpenSubmitModal');
    const btnCancelSubmit = document.getElementById('btnCancelSubmit');
    const btnConfirmSubmit = document.getElementById('btnConfirmSubmit');

    if (btnOpenSubmitModal) {
        btnOpenSubmitModal.addEventListener('click', () => {
            if (confirmModal) confirmModal.style.display = 'flex';
        });
    }

    if (btnCancelSubmit) {
        btnCancelSubmit.addEventListener('click', () => {
            if (confirmModal) confirmModal.style.display = 'none';
        });
    }

    if (btnConfirmSubmit) {
        btnConfirmSubmit.addEventListener('click', async () => {
            await submitQuizAttempt(btnConfirmSubmit);
        });
    }
}

/**
 * Grades the currently selected option and creates a quiz attempt via the API.
 */
async function submitQuizAttempt(btnConfirmSubmit) {
    const quizId = new URLSearchParams(window.location.search).get('quizId');
    if (!quizId) {
        alert('Missing quiz reference. Please go back and start the quiz again.');
        return;
    }

    const user = getCurrentUser();
    if (!user || !user.id) {
        alert('You must be logged in to submit a quiz.');
        return;
    }

    const selectedOption = document.querySelector('.option-item.selected');
    const isPassed = selectedOption ? selectedOption.dataset.correct === 'true' : false;
    const score = isPassed ? TOTAL_SCORE : 0;

    const originalText = btnConfirmSubmit.innerText;
    btnConfirmSubmit.disabled = true;
    btnConfirmSubmit.innerText = 'Submitting...';

    try {
        await createQuizAttempt(score, isPassed, user.id, quizId);
        window.location.href = 'quiz-result.html';
    } catch (err) {
        alert(err.message || 'Failed to submit quiz.');
        btnConfirmSubmit.disabled = false;
        btnConfirmSubmit.innerText = originalText;
    }
}

/**
 * Returns the logged-in user object stored at login, or null.
 */
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (err) {
        return null;
    }
}
