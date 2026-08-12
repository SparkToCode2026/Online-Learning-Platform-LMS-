document.addEventListener("DOMContentLoaded", () => {
    // Select all the review buttons inside the table
    const submitButtons = document.querySelectorAll('.btn-review');

    // Add a click event listener to each button
    submitButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            // Find the closest table row (tr) to get context
            const row = e.target.closest('tr');
            
            // Extract the assignment title and course name from the table cells
            const assignmentTitle = row.querySelector('td:nth-child(1)').innerText;
            const courseName = row.querySelector('td:nth-child(2)').innerText;

            // Simulate the submission action
            console.log(`Action triggered for: ${assignmentTitle}`);
            alert(`Opening submission template for: \n${assignmentTitle} (${courseName})`);
        });
    });

    // Optional: Add active state toggling for sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to the clicked link
            this.classList.add('active');
        });
    });
});