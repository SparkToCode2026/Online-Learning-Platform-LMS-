document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.option-item');
    const dots = document.querySelectorAll('.nav-dots .dot');
    const confirmModal = document.getElementById('confirmModal');
    const btnOpenSubmitModal = document.getElementById('btnOpenSubmitModal');
    const btnCancelSubmit = document.getElementById('btnCancelSubmit');
    const btnConfirmSubmit = document.getElementById('btnConfirmSubmit');

    // Option selection handler
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });
    });

    // Navigation dot click handler
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });

    // Modal controls
    if (btnOpenSubmitModal) {
        btnOpenSubmitModal.addEventListener('click', () => {
            confirmModal.style.display = 'flex';
        });
    }

    if (btnCancelSubmit) {
        btnCancelSubmit.addEventListener('click', () => {
            confirmModal.style.display = 'none';
        });
    }

    if (btnConfirmSubmit) {
        btnConfirmSubmit.addEventListener('click', () => {
            window.location.href = 'quiz-result.html';
        });
    }
});
// student-quiz.js - Student Quiz Attempt Logic

document.addEventListener('DOMContentLoaded', () => {
    setupOptionSelection();
    setupNavigationDots();
    setupSubmissionModal();
});

// Handle Multiple Choice Selection
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

// Handle Question Navigation Dots
function setupNavigationDots() {
    const dots = document.querySelectorAll('.nav-dots .dot');
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });
}

// Handle Submission Confirmation Modal and API Submit
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
            await submitQuizAnswers();
        });
    }
}

/**
 * Submits the completed quiz answers to the C# API
 */
async function submitQuizAnswers() {
    const quizData = {
        quizId: 1, // Dynamic Quiz ID
        answers: [
            { questionId: 101, selectedOptionId: 2 }
        ]
    };

    try {
        const response = await customFetch('/api/Quiz/submit', 'POST', quizData);
        console.log('Quiz submitted successfully:', response);
        
        // Redirect to results page
        window.location.href = 'quiz-result.html';
    } catch (error) {
        alert('An error occurred while submitting your quiz. Please try again.');
        console.error('Submission error:', error);
    }
}