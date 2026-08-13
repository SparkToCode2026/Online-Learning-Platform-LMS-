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