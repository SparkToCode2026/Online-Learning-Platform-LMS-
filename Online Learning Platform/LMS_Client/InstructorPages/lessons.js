// ==========================================
// Default Modules
// ==========================================

const defaultModules = {
    intro: "Introduction to C#",
    oop: "Object-Oriented Programming",
    linq: "Collections & LINQ"
};


// ==========================================
// Custom Modules
// ==========================================

const customModules =
    JSON.parse(localStorage.getItem("modules")) || [];

customModules.forEach(function (module, index) {
    defaultModules[`custom-${index}`] = module.moduleTitle;
});


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
// Add Custom Modules To Filter
// ==========================================

customModules.forEach(function (module, index) {

    const option =
        document.createElement("option");

    option.value =
        `custom-${index}`;

    option.textContent =
        module.moduleTitle;

    moduleFilter.appendChild(option);
});


// ==========================================
// Collect Lessons From All Modules
// ==========================================

function getAllLessons() {

    const allLessons = [];

    Object.keys(defaultModules).forEach(function (moduleKey) {

        const lessons =
            JSON.parse(
                localStorage.getItem(`lessons_${moduleKey}`)
            ) || [];

        lessons.forEach(function (lesson, lessonIndex) {

            allLessons.push({
                moduleKey: moduleKey,
                moduleName: defaultModules[moduleKey],
                lessonIndex: lessonIndex,
                orderNumber: lesson.orderNumber,
                lessonTitle: lesson.lessonTitle,
                duration: lesson.duration
            });

        });

    });

    return allLessons;
}


// ==========================================
// Display Lessons
// ==========================================

function displayLessons() {

    // Remove old generated rows.
    document
        .querySelectorAll(".dynamic-lesson-row")
        .forEach(function (row) {
            row.remove();
        });


    const searchValue =
        searchInput.value.trim().toLowerCase();

    const selectedModule =
        moduleFilter.value;


    const allLessons =
        getAllLessons();


    allLessons.forEach(function (lesson) {

        const matchesSearch =
            lesson.lessonTitle
                .toLowerCase()
                .includes(searchValue);


        const matchesModule =
            selectedModule === "all" ||
            lesson.moduleKey === selectedModule;


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
            <span>${lesson.orderNumber}</span>

            <span>${lesson.lessonTitle}</span>

            <span>${lesson.moduleName}</span>

            <span>${lesson.duration} min</span>

            <div class="lesson-actions">

                <a
                    href="update-lesson.html?module=${lesson.moduleKey}&lessonIndex=${lesson.lessonIndex}"
                    class="edit-button"
                >
                    Edit
                </a>

                <button
                    class="delete-button"
                    type="button"
                    data-module="${lesson.moduleKey}"
                    data-index="${lesson.lessonIndex}"
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
// Delete Lesson
// ==========================================

let lessonToDelete = null;

lessonsTable.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(".delete-button");

        if (!deleteButton) {
            return;
        }

        lessonToDelete = {
            moduleKey:
            deleteButton.dataset.module,

            lessonIndex:
                Number(deleteButton.dataset.index)
        };

        deleteModal.classList.remove("hidden");
    }
);


// ==========================================
// Cancel Delete
// ==========================================

cancelDeleteButton.addEventListener(
    "click",
    function () {

        lessonToDelete = null;

        deleteModal.classList.add("hidden");
    }
);


// ==========================================
// Confirm Delete
// ==========================================

confirmDeleteButton.addEventListener(
    "click",
    function () {

        if (!lessonToDelete) {
            return;
        }


        const storageKey =
            `lessons_${lessonToDelete.moduleKey}`;


        let lessons =
            JSON.parse(
                localStorage.getItem(storageKey)
            ) || [];


        lessons.splice(
            lessonToDelete.lessonIndex,
            1
        );


        localStorage.setItem(
            storageKey,
            JSON.stringify(lessons)
        );


        lessonToDelete = null;

        deleteModal.classList.add("hidden");

        displayLessons();
    }
);


// ==========================================
// Close Modal Outside
// ==========================================

deleteModal.addEventListener(
    "click",
    function (event) {

        if (event.target === deleteModal) {

            lessonToDelete = null;

            deleteModal.classList.add("hidden");
        }
    }
);


// ==========================================
// Load Lessons
// ==========================================

displayLessons();