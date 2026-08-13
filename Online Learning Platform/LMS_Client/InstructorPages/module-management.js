import {
    getAllModules,
    deleteModule
} from "../APIs/ModuleApi.js";


// ==========================================
// Page Data
// ==========================================

// Modules loaded from the backend.
let modules = [];

// Stores the module selected for deletion.
let moduleToDelete = null;


// ==========================================
// Page Elements
// ==========================================

const modulesGrid =
    document.querySelector(".modules-grid");

const searchInput =
    document.getElementById("searchInput");

const courseFilter =
    document.getElementById("courseFilter");

const deleteModuleModal =
    document.getElementById("deleteModuleModal");

const cancelModuleDelete =
    document.getElementById("cancelModuleDelete");

const confirmModuleDelete =
    document.getElementById("confirmModuleDelete");


// ==========================================
// Load Modules From Backend
// ==========================================

async function loadModules() {

    try {

        // Get all modules from LMS_Server.
        modules = await getAllModules();

        displayModules();

    } catch (error) {

        console.error("Failed to load modules:", error);

        alert("Could not load modules from the server.");
    }
}


// ==========================================
// Create Module Card
// ==========================================

function createModuleCard(module) {

    const card =
        document.createElement("article");

    card.classList.add(
        "module-card",
        "dynamic-module-card"
    );


    card.innerHTML = `
        <span class="order-number">
            ${module.orderNumber}
        </span>

        <div class="module-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.5 5.5C5.8 4.5 8.3 4.7 11 6v13c-2.7-1.3-5.2-1.5-7.5-.5V5.5Z"></path>
                <path d="M20.5 5.5C18.2 4.5 15.7 4.7 13 6v13c2.7-1.3 5.2-1.5 7.5-.5V5.5Z"></path>
            </svg>
        </div>

        <h2>
            ${module.moduleName}
        </h2>

        <p class="course-name">
            Course: ${module.courseName}
        </p>

        <div class="card-actions">

            <a
                href="module-details.html?moduleId=${module.moduleId}"
                class="view-button"
            >
                View Lessons
            </a>

            <a
                href="update-module.html?moduleId=${module.moduleId}"
                class="icon-button edit-button"
                title="Edit Module"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m4 20 4.5-1 10-10-3.5-3.5-10 10z"></path>
                    <path d="m14 6 3.5 3.5"></path>
                </svg>
            </a>

            <button
                class="icon-button delete-button"
                data-id="${module.moduleId}"
                type="button"
                title="Delete Module"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"></path>
                    <path d="M10 11v5M14 11v5"></path>
                </svg>
            </button>

        </div>
    `;

    return card;
}


// ==========================================
// Display Modules
// ==========================================

function displayModules() {

    modulesGrid.innerHTML = "";

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedCourse =
        courseFilter.value;


    modules.forEach(function (module) {

        // Check search value.
        const matchesSearch =
            module.moduleName
                .toLowerCase()
                .includes(searchValue);


        // Check selected course.
        const matchesCourse =
            selectedCourse === "All Courses" ||
            selectedCourse === module.courseName;


        if (!matchesSearch || !matchesCourse) {
            return;
        }


        const card =
            createModuleCard(module);

        modulesGrid.appendChild(card);
    });
}


// ==========================================
// Search
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        displayModules();
    }
);


// ==========================================
// Course Filter
// ==========================================

courseFilter.addEventListener(
    "change",
    function () {

        displayModules();
    }
);


// ==========================================
// Open Delete Modal
// ==========================================

modulesGrid.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(".delete-button");


        if (!deleteButton) {
            return;
        }


        moduleToDelete =
            Number(deleteButton.dataset.id);


        deleteModuleModal.classList.remove(
            "hidden"
        );
    }
);


// ==========================================
// Cancel Delete
// ==========================================

cancelModuleDelete.addEventListener(
    "click",
    function () {

        moduleToDelete = null;

        deleteModuleModal.classList.add(
            "hidden"
        );
    }
);


// ==========================================
// Confirm Delete
// ==========================================

confirmModuleDelete.addEventListener(
    "click",
    async function () {

        if (moduleToDelete === null) {
            return;
        }


        try {

            // Delete module from the database.
            await deleteModule(moduleToDelete);


            deleteModuleModal.classList.add(
                "hidden"
            );


            moduleToDelete = null;


            // Reload modules from the database.
            await loadModules();

        } catch (error) {

            console.error(
                "Failed to delete module:",
                error
            );

            alert(
                "Could not delete the module."
            );
        }
    }
);


// ==========================================
// Close Modal When Clicking Outside
// ==========================================

deleteModuleModal.addEventListener(
    "click",
    function (event) {

        if (event.target === deleteModuleModal) {

            moduleToDelete = null;

            deleteModuleModal.classList.add(
                "hidden"
            );
        }
    }
);


// ==========================================
// Start Page
// ==========================================

loadModules();