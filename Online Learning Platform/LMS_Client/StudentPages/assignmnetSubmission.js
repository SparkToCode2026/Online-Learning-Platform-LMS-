document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('backBtn');
    const createBtn = document.getElementById('createBtn');
    const assignmentText = document.getElementById('assignmentText');

    // Back button functionality
    backBtn.addEventListener('click', () => {
        // In a real app, this would route to the previous page
        console.log('Back button clicked');
    });

    // Create assignment functionality
    createBtn.addEventListener('click', () => {
        const content = assignmentText.value.trim();
        
        if (content === '') {
            alert('Please write some content for your assignment.');
            assignmentText.focus();
        } else {
            // Simulate form submission
            console.log('Assignment content submitted:', content);
            
            // Simple success state feedback
            const originalText = createBtn.innerText;
            createBtn.innerText = 'Created Successfully!';
            createBtn.style.backgroundColor = '#4caf50'; // Turn green temporarily
            createBtn.style.boxShadow = '0 4px 14px rgba(76, 175, 80, 0.35)';
            
            // Reset UI after 2 seconds
            setTimeout(() => {
                createBtn.innerText = originalText;
                createBtn.style.backgroundColor = ''; 
                createBtn.style.boxShadow = '';
                assignmentText.value = ''; 
            }, 2000);
        }
    });
});
