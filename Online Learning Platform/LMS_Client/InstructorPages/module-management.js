// Get saved modules from localStorage.
let modules = JSON.parse(localStorage.getItem("modules")) || [];

// Get the modules grid.
const modulesGrid = document.querySelector(".modules-grid");


// Display modules created by the user.
function displayModules() {

    // Remove previously generated cards.
    document
        .querySelectorAll(".dynamic-module-card")
        .forEach(function (card) {
            card.remove();
        });


    modules.forEach(function (module, index) {

        const moduleCard = document.createElement("article");

        moduleCard.classList.add(
            "module-card",
            "dynamic-module-card"
        );

        moduleCard.innerHTML = `
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

        <span>0 Lessons</span>
    </div>

    <div class="card-actions">

        <a
            href="module-details.html?module=custom-${index}"
            class="view-button"
        >
            View Lessons
        </a>

        <a
    href="update-module.html?moduleIndex=${index}"
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
            data-index="${index}"
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

        modulesGrid.appendChild(moduleCard);
    });
}


// Delete Module Modal
const deleteModuleModal =
    document.getElementById("deleteModuleModal");

const cancelModuleDelete =
    document.getElementById("cancelModuleDelete");

const confirmModuleDelete =
    document.getElementById("confirmModuleDelete");

let moduleToDelete = null;


// Open delete modal
modulesGrid.addEventListener("click", function (event) {

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

    deleteModuleModal.classList.remove("hidden");
});


// Cancel delete
cancelModuleDelete.addEventListener("click", function () {

    moduleToDelete = null;

    deleteModuleModal.classList.add("hidden");
});


// Confirm delete
confirmModuleDelete.addEventListener("click", function () {

    if (moduleToDelete === null) {
        return;
    }

    modules.splice(moduleToDelete, 1);

    localStorage.setItem(
        "modules",
        JSON.stringify(modules)
    );

    moduleToDelete = null;

    deleteModuleModal.classList.add("hidden");

    displayModules();
});


// Show saved modules when page loads.
displayModules();