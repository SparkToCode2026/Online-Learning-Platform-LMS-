// ==========================================
// Default Modules
// ==========================================

const defaultModules = [
    {
        moduleKey: "intro",
        moduleTitle: "Introduction to C#",
        courseName: "C# Programming",
        orderNumber: 1
    },
    {
        moduleKey: "oop",
        moduleTitle: "Object-Oriented Programming",
        courseName: "C# Programming",
        orderNumber: 2
    },
    {
        moduleKey: "linq",
        moduleTitle: "Collections & LINQ",
        courseName: "C# Programming",
        orderNumber: 3
    }
];


// ==========================================
// Custom Modules
// ==========================================

let customModules =
    JSON.parse(localStorage.getItem("modules")) || [];


// ==========================================
// Page Elements
// ==========================================

const modulesGrid =
    document.querySelector(".modules-grid");

const searchInput =
    document.querySelector(".search-box input");

const courseFilter =
    document.querySelector(".header-actions select");


// ==========================================
// Delete Modal Elements
// ==========================================

const deleteModuleModal =
    document.getElementById("deleteModuleModal");

const cancelModuleDelete =
    document.getElementById("cancelModuleDelete");

const confirmModuleDelete =
    document.getElementById("confirmModuleDelete");

let moduleToDelete = null;


// ==========================================
// Count Lessons
// ==========================================

function getLessonCount(moduleKey) {

    const lessons =
        JSON.parse(
            localStorage.getItem(`lessons_${moduleKey}`)
        ) || [];

    return lessons.length;
}


// ==========================================
// Create Module Card
// ==========================================

function createModuleCard(module, type, index) {

    const lessonCount =
        getLessonCount(module.moduleKey);

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
            ${module.moduleTitle}
        </h2>

        <p class="course-name">
            Course: ${module.courseName}
        </p>

        <div class="lesson-count">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="4" width="14" height="16" rx="2"></rect>
                <path d="M8 8h8M8 12h6"></path>
            </svg>

            <span>
                ${lessonCount} Lessons
            </span>
        </div>

        <div class="card-actions">

            <a
                href="module-details.html?module=${module.moduleKey}"
                class="view-button"
            >
                View Lessons
            </a>
<a
    href="${type === "custom"
        ? `update-module.html?moduleIndex=${index}`
        : `update-module.html?module=${module.moduleKey}`}"
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
    data-type="${type}"
    data-index="${index ?? ""}"
    data-module="${module.moduleKey}"
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
        searchInput.value.trim().toLowerCase();

    const selectedCourse =
        courseFilter.value;


    // Prepare custom modules with keys.
    const customModulesWithKeys =
        customModules.map(function (module, index) {

            return {
                ...module,
                moduleKey: `custom-${index}`,
                type: "custom",
                customIndex: index
            };
        });


    // Prepare default modules.
    const defaultModulesWithType =
        defaultModules.map(function (module) {

            return {
                ...module,
                type: "default"
            };
        });


    // Combine all modules.
    const allModules = [
        ...defaultModulesWithType,
        ...customModulesWithKeys
    ];


    allModules.forEach(function (module) {

        const matchesSearch =
            module.moduleTitle
                .toLowerCase()
                .includes(searchValue);


        const matchesCourse =
            selectedCourse === "All Courses" ||
            selectedCourse === module.courseName;


        if (!matchesSearch || !matchesCourse) {
            return;
        }


        const card =
            createModuleCard(
                module,
                module.type,
                module.customIndex
            );


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
// Delete Custom Module
// ==========================================

modulesGrid.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(".delete-button");


        if (!deleteButton) {
            return;
        }


        const index =
            deleteButton.dataset.index;


        if (index === undefined) {
            return;
        }


        moduleToDelete =
            Number(index);


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
    function () {

        if (moduleToDelete === null) {
            return;
        }


        customModules.splice(
            moduleToDelete,
            1
        );


        localStorage.setItem(
            "modules",
            JSON.stringify(customModules)
        );


        moduleToDelete = null;


        deleteModuleModal.classList.add(
            "hidden"
        );


        displayModules();
    }
);


// ==========================================
// Load Modules
// ==========================================

displayModules();