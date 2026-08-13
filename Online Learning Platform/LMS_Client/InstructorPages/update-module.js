import {
    getModuleById,
    updateModuleName,
    updateModuleOrder
} from "../APIs/ModuleApi.js";


// ==========================================
// Get Module ID From URL
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const moduleId =
    Number(params.get("moduleId"));


// ==========================================
// Page Elements
// ==========================================

const updateModuleForm =
    document.getElementById("updateModuleForm");

const moduleTitleInput =
    document.getElementById("moduleTitle");

const orderNumberInput =
    document.getElementById("orderNumber");


// ==========================================
// Load Module Data
// ==========================================

async function loadModule() {

    try {

        // Get module from backend by ID.
        const module =
            await getModuleById(moduleId);


        // Fill the form with current values.
        moduleTitleInput.value =
            module.moduleName;

        orderNumberInput.value =
            module.orderNumber;

    } catch (error) {

        console.error(
            "Failed to load module:",
            error
        );

        alert(
            "Could not load the module."
        );
    }
}


// ==========================================
// Update Module
// ==========================================

updateModuleForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        try {

            const newModuleName =
                moduleTitleInput.value.trim();

            const newOrderNumber =
                Number(orderNumberInput.value);


            // Update module name in database.
            await updateModuleName(
                moduleId,
                newModuleName
            );


            // Update module order number in database.
            await updateModuleOrder(
                moduleId,
                newOrderNumber
            );


            // Return to Module Management.
            window.location.href =
                "module-management.html";

        } catch (error) {

            console.error(
                "Failed to update module:",
                error
            );

            alert(
                "Could not update the module."
            );
        }
    }
);


// ==========================================
// Start Page
// ==========================================

loadModule();