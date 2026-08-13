import {
    createModule
} from "../APIs/ModuleApi.js";


// Get form elements
const createModuleForm =
    document.getElementById("createModuleForm");

const courseInput =
    document.getElementById("course");

const moduleTitleInput =
    document.getElementById("moduleTitle");

const orderNumberInput =
    document.getElementById("orderNumber");


// Create new module
createModuleForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        try {

            // IMPORTANT:
            // For now this assumes the selected course value
            // is the real CourseId from the backend.
            const moduleData = {
                moduleName:
                    moduleTitleInput.value.trim(),

                orderNumber:
                    Number(orderNumberInput.value),

                courseId:
                    Number(courseInput.value)
            };


            // Send module to LMS_Server
            await createModule(moduleData);


            // Go back to Module Management
            window.location.href =
                "module-management.html";

        } catch (error) {

            console.error(
                "Failed to create module:",
                error
            );

            alert(
                "Could not create the module."
            );
        }
    }
);