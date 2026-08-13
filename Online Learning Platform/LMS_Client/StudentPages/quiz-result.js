document.addEventListener('DOMContentLoaded', () => {
    const btnBackToQuizzes = document.getElementById('btnBackToQuizzes');

    if (btnBackToQuizzes) {
        btnBackToQuizzes.addEventListener('click', () => {
            window.location.href = 'quiz-list.html';
        });
    }
});