import { createSubmission } from '../APIs/SubmissionAPI.js';

document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('backBtn');
    const createBtn = document.getElementById('createBtn');
    const assignmentText = document.getElementById('assignmentText');

    const assignmentId = new URLSearchParams(window.location.search).get('assignmentId');

    // Back button functionality
    backBtn.addEventListener('click', () => {
        window.location.href = 'assignments-hub.html';
    });

    // Create submission functionality
    createBtn.addEventListener('click', async () => {
        const content = assignmentText.value.trim();

        if (content === '') {
            alert('Please write some content for your assignment.');
            assignmentText.focus();
            return;
        }

        if (!assignmentId) {
            alert('Missing assignment reference. Please go back and select an assignment again.');
            return;
        }

        const user = getCurrentUser();
        if (!user || !user.id) {
            alert('You must be logged in to submit an assignment.');
            return;
        }

        const originalText = createBtn.innerText;
        createBtn.disabled = true;
        createBtn.innerText = 'Submitting...';

        try {
            await createSubmission(content, user.id, assignmentId);

            createBtn.innerText = 'Created Successfully!';
            createBtn.style.backgroundColor = '#4caf50';
            createBtn.style.boxShadow = '0 4px 14px rgba(76, 175, 80, 0.35)';

            setTimeout(() => {
                window.location.href = 'assignments-hub.html';
            }, 1200);
        } catch (err) {
            alert(err.message || 'Failed to submit assignment.');
            createBtn.disabled = false;
            createBtn.innerText = originalText;
        }
    });
});

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
