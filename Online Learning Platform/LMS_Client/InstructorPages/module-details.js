// Get saved lessons
let lessons = JSON.parse(localStorage.getItem("lessons")) || [];

// Page elements
const lessonsTable = document.querySelector(".lessons-table");

const deleteModal = document.getElementById("deleteModal");
const cancelDeleteButton = document.getElementById("cancelDelete");
const confirmDeleteButton = document.getElementById("confirmDelete");

// Keeps track of the lesson selected for deletion
let lessonToDelete = null;


// ==========================================
// Display Lessons
// ==========================================

function displayLessons() {

    // Remove only lessons created by JavaScript
    document
        .querySelectorAll(".dynamic-lesson-row")
        .forEach(function (row) {
            row.remove();
        });


    // Add saved lessons to the table
    lessons.forEach(function (lesson, index) {

        const lessonRow = document.createElement("div");

        lessonRow.classList.add(
            "table-row",
            "dynamic-lesson-row"
        );


        lessonRow.innerHTML = `
            <span>${lesson.orderNumber}</span>

            <span>${lesson.lessonTitle}</span>

            <span>${lesson.duration} min</span>

            <div class="lesson-actions">

                <a
                    href="update-lesson.html?lessonIndex=${index}"
                    class="edit-button"
                >
                    Edit
                </a>

                <button
                    class="delete-button"
                    data-index="${index}"
                    type="button"
                >
                    Delete
                </button>

            </div>
        `;


        lessonsTable.appendChild(lessonRow);
    });
}


// ==========================================
// Delete Button
// ==========================================

lessonsTable.addEventListener("click", function (event) {

    const deleteButton =
        event.target.closest(".delete-button");


    if (!deleteButton) {
        return;
    }


    const index = deleteButton.dataset.index;


    // Ignore static HTML delete buttons
    if (index === undefined) {
        return;
    }


    lessonToDelete = Number(index);


    // Open our custom modal
    if (deleteModal) {
        deleteModal.classList.remove("hidden");
    }
});


// ==========================================
// Cancel Delete
// ==========================================

if (cancelDeleteButton) {

    cancelDeleteButton.addEventListener(
        "click",
        function () {

            lessonToDelete = null;

            deleteModal.classList.add("hidden");
        }
    );
}


// ==========================================
// Confirm Delete
// ==========================================

if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
        "click",
        function () {

            if (lessonToDelete === null) {
                return;
            }


            // Delete selected lesson
            lessons.splice(lessonToDelete, 1);


            // Save updated lessons
            localStorage.setItem(
                "lessons",
                JSON.stringify(lessons)
            );


            // Reset selected lesson
            lessonToDelete = null;


            // Close modal
            deleteModal.classList.add("hidden");


            // Refresh lesson list
            displayLessons();
        }
    );
}


// ==========================================
// Close Modal When Clicking Outside
// ==========================================

if (deleteModal) {

    deleteModal.addEventListener(
        "click",
        function (event) {

            if (event.target === deleteModal) {

                lessonToDelete = null;

                deleteModal.classList.add("hidden");
            }
        }
    );
}


// ==========================================
// Load Lessons
// ==========================================

displayLessons();