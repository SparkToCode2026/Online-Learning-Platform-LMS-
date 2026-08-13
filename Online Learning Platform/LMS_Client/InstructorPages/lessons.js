import {
    getAllLessons,
    deleteLesson
} from "../APIs/LessonApi.js";


// ==========================================
// Page Data
// ==========================================

// Lessons loaded from the backend.
let lessons = [];

// Stores the LessonId selected for deletion.
let lessonToDelete = null;


// ==========================================
// Page Elements
// ==========================================

const lessonsTable =
    document.querySelector(".lessons-table");

const searchInput =
    document.getElementById("searchInput");

const moduleFilter =
    document.getElementById("moduleFilter");

const deleteModal =
    document.getElementById("deleteModal");

const cancelDeleteButton =
    document.getElementById("cancelDelete");

const confirmDeleteButton =
    document.getElementById("confirmDelete");


// ==========================================
// Load Lessons From Backend
// ==========================================

async function loadLessons() {

    try {

        // Get all lessons from LMS_Server.
        lessons = await getAllLessons();

        // Build the module filter from database data.
        loadModuleFilter();

        // Display lessons on the page.
        displayLessons();

    } catch (error) {

        console.error(
            "Failed to load lessons:",
            error
        );

        alert(
            "Could not load lessons from the server."
        );
    }
}


// ==========================================
// Load Module Filter
// ==========================================

function loadModuleFilter() {

    // Keep only the default All Modules option.
    moduleFilter.innerHTML = `
        <option value="all">
            All Modules
        </option>
    `;


    // Store unique modules.
    const modules = new Map();


    lessons.forEach(function (lesson) {

        modules.set(
            lesson.moduleId,
            lesson.moduleName
        );
    });


    // Add modules to dropdown.
    modules.forEach(function (moduleName, moduleId) {

        const option =
            document.createElement("option");

        option.value =
            moduleId;

        option.textContent =
            moduleName;

        moduleFilter.appendChild(option);
    });
}


// ==========================================
// Display Lessons
// ==========================================

function displayLessons() {

    // Remove previously generated lesson rows.
    document
        .querySelectorAll(".dynamic-lesson-row")
        .forEach(function (row) {
            row.remove();
        });


    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedModule =
        moduleFilter.value;


    lessons.forEach(function (lesson) {

        // Search by lesson title.
        const matchesSearch =
            lesson.lessonTitle
                .toLowerCase()
                .includes(searchValue);


        // Filter by ModuleId.
        const matchesModule =
            selectedModule === "all" ||
            Number(selectedModule) === lesson.moduleId;


        if (!matchesSearch || !matchesModule) {
            return;
        }


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
                ${lesson.moduleName}
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
                    type="button"
                    data-id="${lesson.lessonId}"
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
// Search
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        displayLessons();
    }
);


// ==========================================
// Module Filter
// ==========================================

moduleFilter.addEventListener(
    "change",
    function () {

        displayLessons();
    }
);


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

loadLessons();