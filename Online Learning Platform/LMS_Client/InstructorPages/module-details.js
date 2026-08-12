// Get saved lessons from localStorage.
const lessons = JSON.parse(localStorage.getItem("lessons")) || [];

// Get the lessons table container.
const lessonsTable = document.querySelector(".lessons-table");

// Add each saved lesson to the table.
lessons.forEach(function (lesson) {

    const lessonRow = document.createElement("div");
    lessonRow.classList.add("table-row");

    lessonRow.innerHTML = `
        <span>${lesson.orderNumber}</span>
        <span>${lesson.lessonTitle}</span>
        <span>${lesson.duration} min</span>

        <div class="lesson-actions">
            <a href="update-lesson.html" class="edit-button">
                Edit
            </a>

            <button class="delete-button">
                Delete
            </button>
        </div>
    `;

    lessonsTable.appendChild(lessonRow);
});