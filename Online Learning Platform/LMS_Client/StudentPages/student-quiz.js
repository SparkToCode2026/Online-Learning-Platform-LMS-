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