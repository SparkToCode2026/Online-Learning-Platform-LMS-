import {
    createLesson
} from "../APIs/LessonApi.js";

import {
    getAllModules
} from "../APIs/ModuleApi.js";


// ==========================================
// Get Module ID From URL
// ==========================================

// Example:
// create-lesson.html?moduleId=2

const params =
    new URLSearchParams(window.location.search);

const selectedModuleId =
    Number(params.get("moduleId"));


// ==========================================
// Page Elements
// ==========================================

const createLessonForm =
    document.getElementById("createLessonForm");

const moduleSelect =
    document.getElementById("module");

const lessonTitleInput =
    document.getElementById("lessonTitle");

const lessonURLInput =
    document.getElementById("lessonURL");

const cancelButton =
    document.getElementById("cancelButton");


// ==========================================
// Load Modules From Backend
// ==========================================

async function loadModules() {

    try {

        // Get all modules from the database.
        const modules =
            await getAllModules();


        // Add modules to dropdown.
        modules.forEach(function (module) {

            const option =
                document.createElement("option");

            // Backend ModuleId
            option.value =
                module.moduleId;

            // Backend ModuleName
            option.textContent =
                module.moduleName;

            moduleSelect.appendChild(option);
        });


        // If user came from a specific module,
        // select it automatically.
        if (selectedModuleId) {

            moduleSelect.value =
                selectedModuleId;
        }

    } catch (error) {

        console.error(
            "Failed to load modules:",
            error
        );

        alert(
            "Could not load modules from the server."
        );
    }
}


// ==========================================
// Create Lesson
// ==========================================

createLessonForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const lessonData = {

            lessonTitle:
                lessonTitleInput.value.trim(),

            lessonURL:
                lessonURLInput.value.trim(),

            moduleId:
                Number(moduleSelect.value)
        };


        try {

            // Save lesson in the database.
            await createLesson(
                lessonData
            );


            // Return to selected module.
            window.location.href =
                `module-details.html?moduleId=${lessonData.moduleId}`;

        } catch (error) {

            console.error(
                "Failed to create lesson:",
                error
            );

            alert(
                "Could not create the lesson."
            );
        }
    }
);


// ==========================================
// Cancel Button
// ==========================================

// If we came from Module Details,
// Cancel returns to the same module.

if (selectedModuleId) {

    cancelButton.href =
        `module-details.html?moduleId=${selectedModuleId}`;
}


// ==========================================
// Start Page
// ==========================================

loadModules();