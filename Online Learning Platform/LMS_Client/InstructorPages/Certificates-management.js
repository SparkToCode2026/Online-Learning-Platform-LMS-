document.addEventListener("DOMContentLoaded", () => {
    // 1. Handle Table Actions (Delete)
    function bindRowActions() {

        document.querySelectorAll('.btn-delete').forEach((button) => {
            button.addEventListener('click', function (e) {
                const row = e.target.closest('tr');
                const studentName = row.querySelector('.font-bold').innerText;
                const confirmDelete = confirm(`Are you sure you want to delete the certificate for ${studentName}?`);

                if (confirmDelete) {
                    row.style.opacity = '0';
                    setTimeout(() => row.remove(), 300);
                }
            });
        });
    }

    bindRowActions();

    // 2. Search Box Implementation
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.querySelector('.data-table tbody');

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const tableRows = tableBody.querySelectorAll('tr');

        tableRows.forEach(row => {
            const textContent = row.innerText.toLowerCase();
            if (textContent.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // 3. Sidebar Active State toggling (Optional enhancement)
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 5. Create Certificate Modal
    const modal = document.getElementById('certModal');
    const createBtn = document.getElementById('createCertBtn');
    const closeBtn = document.getElementById('modalCloseBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const certForm = document.getElementById('createCertForm');

    function openModal() {
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        certForm.reset();
    }

    createBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 6. Handle Form Submission — add new certificate row
    certForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const studentName = document.getElementById('studentName').value.trim();
        const courseTitle = document.getElementById('courseTitle').value.trim();
        const issueDate = document.getElementById('issueDate').value;

        if (!studentName || !courseTitle || !issueDate) return;

        // Generate next certificate ID
        const existingRows = tableBody.querySelectorAll('tr');
        let maxId = 100;
        existingRows.forEach(row => {
            const id = parseInt(row.querySelector('td').innerText);
            if (id > maxId) maxId = id;
        });
        const newId = maxId + 1;

        // Create the new row
        const newRow = document.createElement('tr');
        newRow.style.opacity = '0';
        newRow.innerHTML = `
            <td>${newId}</td>
            <td class="font-bold">${studentName}</td>
            <td class="text-muted">${courseTitle}</td>
            <td><span class="date-badge">${issueDate}</span></td>
            <td class="align-right">
                <div class="action-buttons">
                    <button class="btn-action btn-delete" title="Delete"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </td>
        `;

        tableBody.appendChild(newRow);

        // Animate the new row in
        requestAnimationFrame(() => {
            newRow.style.transition = 'opacity 0.3s ease';
            newRow.style.opacity = '1';
        });

        // Re-bind actions for new buttons
        bindRowActions();

        closeModal();
    });
});