// Get module and lesson index from the URL.
// Example:
// update-lesson.html?module=oop&lessonIndex=1

const params = new URLSearchParams(window.location.search);

const selectedModule = params.get("module") || "oop";
const lessonIndex = Number(params.get("lessonIndex"));


// Each module has its own lessons storage.
const lessonsStorageKey = `lessons_${selectedModule}`;


// Get lessons for the selected module.
let lessons =
    JSON.parse(localStorage.getItem(lessonsStorageKey)) || [];


// Get form elements.
const updateLessonForm =
    document.getElementById("updateLessonForm");

const moduleSelect =
    document.getElementById("module");

const lessonTitleInput =
    document.getElementById("lessonTitle");

const orderNumberInput =
    document.getElementById("orderNumber");

const durationInput =
    document.getElementById("duration");


// Module names.
const moduleNames = {
    intro: "Introduction to C#",
    oop: "Object-Oriented Programming",
    linq: "Collections & LINQ"
};


// Show the selected module.
if (moduleSelect && moduleNames[selectedModule]) {
    moduleSelect.value = moduleNames[selectedModule];
}


// Make sure the selected lesson exists.
if (lessons[lessonIndex]) {

    // Fill the form with the old lesson data.
    lessonTitleInput.value =
        lessons[lessonIndex].lessonTitle;

    orderNumberInput.value =
        lessons[lessonIndex].orderNumber;

    durationInput.value =
        lessons[lessonIndex].duration;
}


// Update the lesson.
updateLessonForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        if (!lessons[lessonIndex]) {
            return;
        }


        // Save the new values.
        lessons[lessonIndex].lessonTitle =
            lessonTitleInput.value.trim();

        lessons[lessonIndex].orderNumber =
            orderNumberInput.value;

        lessons[lessonIndex].duration =
            durationInput.value;


        // Save lessons for this module.
        localStorage.setItem(
            lessonsStorageKey,
            JSON.stringify(lessons)
        );


        // Return to the same module.
        window.location.href =
            `module-details.html?module=${selectedModule}`;
    }
);