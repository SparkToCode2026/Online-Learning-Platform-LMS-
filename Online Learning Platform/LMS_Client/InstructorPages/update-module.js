// ==========================================
// Get Module Index
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const moduleIndex =
    Number(params.get("moduleIndex"));


// ==========================================
// Get Saved Modules
// ==========================================

let modules =
    JSON.parse(localStorage.getItem("modules")) || [];


// ==========================================
// Get Form Elements
// ==========================================

const updateModuleForm =
    document.getElementById("updateModuleForm");

const courseInput =
    document.getElementById("course");

const moduleTitleInput =
    document.getElementById("moduleTitle");

const orderNumberInput =
    document.getElementById("orderNumber");


// ==========================================
// Get Selected Module
// ==========================================

const selectedModule =
    modules[moduleIndex];


// If the module does not exist.
if (!selectedModule) {

    console.log("Module not found");

} else {

    // Show the saved module information.
    courseInput.value =
        selectedModule.courseName;

    moduleTitleInput.value =
        selectedModule.moduleTitle;

    orderNumberInput.value =
        selectedModule.orderNumber;
}


// ==========================================
// Update Module
// ==========================================

updateModuleForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (!selectedModule) {
            return;
        }


        // Update course.
        selectedModule.courseName =
            courseInput.value;


        // Update module title.
        selectedModule.moduleTitle =
            moduleTitleInput.value.trim();


        // Update order number.
        selectedModule.orderNumber =
            orderNumberInput.value;


        // Save the updated modules.
        localStorage.setItem(
            "modules",
            JSON.stringify(modules)
        );


        // Go back to Module Management.
        window.location.href =
            "module-management.html";
    }
);