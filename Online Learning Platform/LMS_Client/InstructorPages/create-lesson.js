// Get the selected module from the URL.
// Example: create-lesson.html?module=intro
const params = new URLSearchParams(window.location.search);
const selectedModule = params.get("module") || "oop";

const createLessonForm =
    document.getElementById("createLessonForm");

const moduleSelect =
    document.getElementById("module");


// Match the module dropdown with the selected module.
const moduleNames = {
    intro: "Introduction to C#",
    oop: "Object-Oriented Programming",
    linq: "Collections & LINQ"
};


// Automatically show the correct module in the dropdown.
if (moduleSelect && moduleNames[selectedModule]) {
    moduleSelect.value = moduleNames[selectedModule];
}


// When Create Lesson is clicked.
createLessonForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Get form values.
        const lessonTitle =
            document
                .getElementById("lessonTitle")
                .value
                .trim();

        const orderNumber =
            document
                .getElementById("orderNumber")
                .value;

        const duration =
            document
                .getElementById("duration")
                .value;


        // Create new lesson object.
        const newLesson = {
            orderNumber: orderNumber,
            lessonTitle: lessonTitle,
            duration: duration
        };


        // Each module has its own localStorage key.
        const lessonsStorageKey =
            `lessons_${selectedModule}`;


        // Get lessons for this module only.
        let lessons =
            JSON.parse(
                localStorage.getItem(lessonsStorageKey)
            ) || [];


        // Add the new lesson.
        lessons.push(newLesson);


        // Save it under the selected module.
        localStorage.setItem(
            lessonsStorageKey,
            JSON.stringify(lessons)
        );


        // Return to the SAME module.
        window.location.href =
            `module-details.html?module=${selectedModule}`;
    }
);