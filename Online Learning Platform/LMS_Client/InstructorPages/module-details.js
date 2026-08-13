import {
    getModuleById
} from "../APIs/ModuleApi.js";

import {
    getLessonsByModule,
    deleteLesson
} from "../APIs/LessonApi.js";


// ==========================================
// Get Module ID From URL
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const moduleId =
    Number(params.get("moduleId"));


// ==========================================
// Page Elements
// ==========================================

const moduleTitle =
    document.querySelector(".module-header h1");

const moduleMeta =
    document.querySelectorAll(".module-meta span");

const lessonsTable =
    document.querySelector(".lessons-table");

const addLessonButton =
    document.querySelector(".add-lesson-button");

const deleteModal =
    document.getElementById("deleteModal");

const cancelDeleteButton =
    document.getElementById("cancelDelete");

const confirmDeleteButton =
    document.getElementById("confirmDelete");


// Stores lessons loaded from backend.
let lessons = [];

// Stores selected LessonId for deletion.
let lessonToDelete = null;


// ==========================================
// Load Module Information
// ==========================================

async function loadModule() {

    try {

        // Get module details from LMS_Server.
        const module =
            await getModuleById(moduleId);


        // Display module name.
        moduleTitle.textContent =
            module.moduleName;


        // Display course name.
        moduleMeta[0].textContent =
            `Course: ${module.courseName}`;


        // Display module order number.
        moduleMeta[1].textContent =
            `Order: ${module.orderNumber}`;

    } catch (error) {

        console.error(
            "Failed to load module:",
            error
        );

        alert(
            "Could not load module details."
        );
    }
}


// ==========================================
// Load Lessons
// ==========================================

async function loadLessons() {

    try {

        // Get lessons that belong to this module.
        lessons =
            await getLessonsByModule(moduleId);


        displayLessons();

    } catch (error) {

        console.error(
            "Failed to load lessons:",
            error
        );

        alert(
            "Could not load lessons."
        );
    }
}


// ==========================================
// Display Lessons
// ==========================================

function displayLessons() {

    // Remove old generated lesson rows.
    document
        .querySelectorAll(".dynamic-lesson-row")
        .forEach(function (row) {
            row.remove();
        });


    lessons.forEach(function (lesson) {

        const lessonRow =
            document.createElement("div");


        lessonRow.classList.add(
            "table-row",
            "dynamic-lesson-row"
        );


        lessonRow.innerHTML = `
            <span>
                ${lesson.lessonId}
            </span>

            <span>
                ${lesson.lessonTitle}
            </span>

            <span>
                <a
                    href="${lesson.lessonURL}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Lesson
                </a>
            </span>

            <div class="lesson-actions">

                <a
                    href="update-lesson.html?lessonId=${lesson.lessonId}"
                    class="edit-button"
                >
                    Edit
                </a>

                <button
                    class="delete-button"
                    data-id="${lesson.lessonId}"
                    type="button"
                >
                    Delete
                </button>

            </div>
        `;


        lessonsTable.appendChild(
            lessonRow
        );
    });
}


// ==========================================
// Add Lesson
// ==========================================

if (addLessonButton) {

    // Send the real ModuleId to Create Lesson.
    addLessonButton.href =
        `create-lesson.html?moduleId=${moduleId}`;
}


// ==========================================
// Open Delete Modal
// ==========================================

lessonsTable.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(".delete-button");


        if (!deleteButton) {
            return;
        }


        lessonToDelete =
            Number(deleteButton.dataset.id);


        deleteModal.classList.remove(
            "hidden"
        );
    }
);


// ==========================================
// Cancel Delete
// ==========================================

cancelDeleteButton.addEventListener(
    "click",
    function () {

        lessonToDelete = null;

        deleteModal.classList.add(
            "hidden"
        );
    }
);


// ==========================================
// Confirm Delete
// ==========================================

confirmDeleteButton.addEventListener(
    "click",
    async function () {

        if (lessonToDelete === null) {
            return;
        }


        try {

            // Delete lesson from database.
            await deleteLesson(
                lessonToDelete
            );


            lessonToDelete = null;


            // Close modal.
            deleteModal.classList.add(
                "hidden"
            );


            // Reload lessons from database.
            await loadLessons();

        } catch (error) {

            console.error(
                "Failed to delete lesson:",
                error
            );

            alert(
                "Could not delete the lesson."
            );
        }
    }
);


// ==========================================
// Close Modal When Clicking Outside
// ==========================================

deleteModal.addEventListener(
    "click",
    function (event) {

        if (event.target === deleteModal) {

            lessonToDelete = null;

            deleteModal.classList.add(
                "hidden"
            );
        }
    }
);


// ==========================================
// Start Page
// ==========================================

loadModule();
loadLessons();