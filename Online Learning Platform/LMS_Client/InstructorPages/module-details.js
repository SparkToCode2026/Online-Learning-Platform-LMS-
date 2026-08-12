// ==========================================
// Selected Module
// ==========================================

// Get selected module from URL.
// Example:
// module-details.html?module=intro
const params = new URLSearchParams(window.location.search);

const selectedModule = params.get("module") || "oop";


// ==========================================
// Module Information
// ==========================================

const moduleData = {

    intro: {
        title: "Introduction to C#",
        course: "C# Programming",
        order: 1
    },

    oop: {
        title: "Object-Oriented Programming",
        course: "C# Programming",
        order: 2
    },

    linq: {
        title: "Collections & LINQ",
        course: "C# Programming",
        order: 3
    }

};


// Get selected module information.
const currentModule = moduleData[selectedModule];


// Change module title.
document.querySelector(".module-header h1").textContent =
    currentModule.title;


// Change course and order.
const moduleMeta =
    document.querySelectorAll(".module-meta span");

moduleMeta[0].textContent =
    `Course: ${currentModule.course}`;

moduleMeta[1].textContent =
    `Order: ${currentModule.order}`;








// ==========================================
// Default Lessons For Each Module
// ==========================================

const defaultLessons = {

    // Introduction to C#
    intro: [
        {
            orderNumber: 1,
            lessonTitle: "Introduction to C#",
            duration: 20
        },

        {
            orderNumber: 2,
            lessonTitle: "Variables and Data Types",
            duration: 25
        },

        {
            orderNumber: 3,
            lessonTitle: "Conditions",
            duration: 20
        },

        {
            orderNumber: 4,
            lessonTitle: "Loops",
            duration: 25
        }
    ],


    // Object-Oriented Programming
    oop: [
        {
            orderNumber: 1,
            lessonTitle: "Classes and Objects",
            duration: 25
        },

        {
            orderNumber: 2,
            lessonTitle: "Constructors",
            duration: 20
        },

        {
            orderNumber: 3,
            lessonTitle: "Encapsulation",
            duration: 18
        },

        {
            orderNumber: 4,
            lessonTitle: "Inheritance",
            duration: 22
        },

        {
            orderNumber: 5,
            lessonTitle: "Polymorphism",
            duration: 24
        },

        {
            orderNumber: 6,
            lessonTitle: "Abstraction",
            duration: 16
        }
    ],


    // Collections & LINQ
    linq: [
        {
            orderNumber: 1,
            lessonTitle: "Introduction to Collections",
            duration: 20
        },

        {
            orderNumber: 2,
            lessonTitle: "Lists",
            duration: 25
        },

        {
            orderNumber: 3,
            lessonTitle: "Dictionaries",
            duration: 20
        },

        {
            orderNumber: 4,
            lessonTitle: "Introduction to LINQ",
            duration: 25
        },

        {
            orderNumber: 5,
            lessonTitle: "LINQ Queries",
            duration: 30
        }
    ]
};








// ==========================================
// Local Storage
// ==========================================

// Each module has its own storage.
//
// Examples:
// lessons_intro
// lessons_oop
// lessons_linq

const lessonsStorageKey =
    `lessons_${selectedModule}`;


// Get saved lessons for the selected module.
let lessons =
    JSON.parse(
        localStorage.getItem(lessonsStorageKey)
    );


// If this module has no saved lessons,
// use its default lessons.
if (!lessons) {

    lessons =
        defaultLessons[selectedModule].map(function (lesson) {
            return { ...lesson };
        });


    localStorage.setItem(
        lessonsStorageKey,
        JSON.stringify(lessons)
    );
}








// ==========================================
// Page Elements
// ==========================================

const lessonsTable =
    document.querySelector(".lessons-table");

const deleteModal =
    document.getElementById("deleteModal");

const cancelDeleteButton =
    document.getElementById("cancelDelete");

const confirmDeleteButton =
    document.getElementById("confirmDelete");


// Keeps track of the lesson selected for deletion.
let lessonToDelete = null;








// ==========================================
// Display Lessons
// ==========================================

function displayLessons() {

    // Remove old generated lesson rows.
    document
        .querySelectorAll(".dynamic-lesson-row")
        .forEach(function (row) {

            row.remove();

        });


    // Create a row for every lesson.
    lessons.forEach(function (lesson, index) {

        const lessonRow =
            document.createElement("div");


        lessonRow.classList.add(
            "table-row",
            "dynamic-lesson-row"
        );


        lessonRow.innerHTML = `

            <span>
                ${lesson.orderNumber}
            </span>


            <span>
                ${lesson.lessonTitle}
            </span>


            <span>
                ${lesson.duration} min
            </span>


            <div class="lesson-actions">

                <a
                    href="update-lesson.html?module=${selectedModule}&lessonIndex=${index}"
                    class="edit-button"
                >
                    Edit
                </a>


                <button
                    class="delete-button"
                    data-index="${index}"
                    type="button"
                >
                    Delete
                </button>

            </div>

        `;


        lessonsTable.appendChild(lessonRow);

    });

}








// ==========================================
// Delete Button
// ==========================================

lessonsTable.addEventListener(
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


        lessonToDelete =
            Number(index);


        // Open custom delete modal.
        if (deleteModal) {

            deleteModal.classList.remove("hidden");

        }

    }
);








// ==========================================
// Cancel Delete
// ==========================================

if (cancelDeleteButton) {

    cancelDeleteButton.addEventListener(
        "click",
        function () {

            lessonToDelete = null;

            deleteModal.classList.add("hidden");

        }
    );

}








// ==========================================
// Confirm Delete
// ==========================================

if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
        "click",
        function () {

            if (lessonToDelete === null) {
                return;
            }


            // Remove selected lesson.
            lessons.splice(
                lessonToDelete,
                1
            );


            // Save this module's lessons.
            localStorage.setItem(
                lessonsStorageKey,
                JSON.stringify(lessons)
            );


            lessonToDelete = null;


            // Close modal.
            deleteModal.classList.add("hidden");


            // Refresh table.
            displayLessons();

        }
    );

}








// ==========================================
// Close Modal By Clicking Outside
// ==========================================

if (deleteModal) {

    deleteModal.addEventListener(
        "click",
        function (event) {

            if (event.target === deleteModal) {

                lessonToDelete = null;

                deleteModal.classList.add("hidden");

            }

        }
    );

}








// ==========================================
// Add Lesson Link
// ==========================================

// Send the selected module to Create Lesson page.
const addLessonButton =
    document.querySelector(".add-lesson-button");

if (addLessonButton) {

    addLessonButton.href =
        `create-lesson.html?module=${selectedModule}`;

}








// ==========================================
// Load Lessons
// ==========================================

displayLessons();