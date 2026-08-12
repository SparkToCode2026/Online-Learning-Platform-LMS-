const params = new URLSearchParams(window.location.search);

// Module we came from.
let selectedModule = params.get("module") || "oop";

const createLessonForm =
    document.getElementById("createLessonForm");

const moduleSelect =
    document.getElementById("module");


// Default modules.
const moduleNames = {
    intro: "Introduction to C#",
    oop: "Object-Oriented Programming",
    linq: "Collections & LINQ"
};


// Get custom modules created by the user.
const customModules =
    JSON.parse(localStorage.getItem("modules")) || [];


// Add custom modules to dropdown.
customModules.forEach(function (module, index) {

    const moduleKey = `custom-${index}`;

    moduleNames[moduleKey] = module.moduleTitle;

    const option = document.createElement("option");

    option.value = moduleKey;
    option.textContent = module.moduleTitle;

    moduleSelect.appendChild(option);
});


// Select the module we came from.
if (moduleNames[selectedModule]) {
    moduleSelect.value = selectedModule;
}


// Create Lesson.
createLessonForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // IMPORTANT:
    // Use the module currently selected in the dropdown.
    selectedModule = moduleSelect.value;

    if (!selectedModule) {
        alert("Please select a module.");
        return;
    }


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


    const newLesson = {
        orderNumber: orderNumber,
        lessonTitle: lessonTitle,
        duration: duration
    };


    // Each module has its own lesson list.
    const lessonsStorageKey =
        `lessons_${selectedModule}`;


    let lessons =
        JSON.parse(
            localStorage.getItem(lessonsStorageKey)
        ) || [];


    lessons.push(newLesson);


    localStorage.setItem(
        lessonsStorageKey,
        JSON.stringify(lessons)
    );


    // Return to the SAME module.
    window.location.href =
        `module-details.html?module=${selectedModule}`;
});