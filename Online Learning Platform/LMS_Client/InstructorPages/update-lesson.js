import {
    getLessonById,
    updateLesson
} from "../APIs/LessonApi.js";

import {
    getAllModules
} from "../APIs/ModuleApi.js";


// ==========================================
// Get Lesson ID
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const lessonId =
    Number(params.get("lessonId"));


// ==========================================
// Page Elements
// ==========================================

const updateLessonForm =
    document.getElementById("updateLessonForm");

const moduleSelect =
    document.getElementById("module");

const lessonTitleInput =
    document.getElementById("lessonTitle");

const lessonURLInput =
    document.getElementById("lessonURL");

const cancelButton =
    document.getElementById("cancelButton");


// ==========================================
// Load Modules
// ==========================================

async function loadModules() {

    const modules =
        await getAllModules();


    modules.forEach(function (module) {

        const option =
            document.createElement("option");

        option.value =
            module.moduleId;

        option.textContent =
            module.moduleName;

        moduleSelect.appendChild(option);
    });
}


// ==========================================
// Load Lesson
// ==========================================

async function loadLesson() {

    try {

        // Get selected lesson from backend.
        const lesson =
            await getLessonById(lessonId);


        // Fill old lesson data.
        lessonTitleInput.value =
            lesson.lessonTitle;

        lessonURLInput.value =
            lesson.lessonURL;

        moduleSelect.value =
            lesson.moduleId;


        // Cancel returns to the correct module.
        cancelButton.href =
            `module-details.html?moduleId=${lesson.moduleId}`;

    } catch (error) {

        console.error(
            "Failed to load lesson:",
            error
        );

        alert(
            "Could not load the lesson."
        );
    }
}


// ==========================================
// Update Lesson
// ==========================================

updateLessonForm.addEventListener(
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

            // Update lesson in database.
            await updateLesson(
                lessonId,
                lessonData
            );


            // Return to selected module.
            window.location.href =
                `module-details.html?moduleId=${lessonData.moduleId}`;

        } catch (error) {

            console.error(
                "Failed to update lesson:",
                error
            );

            alert(
                "Could not update the lesson."
            );
        }
    }
);


// ==========================================
// Start Page
// ==========================================

async function startPage() {

    try {

        // Load dropdown first.
        await loadModules();

        // Then load lesson values.
        await loadLesson();

    } catch (error) {

        console.error(
            "Failed to prepare update page:",
            error
        );

        alert(
            "Could not prepare the update page."
        );
    }
}


startPage();