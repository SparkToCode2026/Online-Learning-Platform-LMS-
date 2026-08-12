// Get the Create Module form.
const createModuleForm = document.getElementById("createModuleForm");


// Run when the user clicks Create Module.
createModuleForm.addEventListener("submit", function (event) {

    // Prevent page refresh.
    event.preventDefault();


    // Get values from the form.
    const courseName =
        document.getElementById("course").value;

    const moduleTitle =
        document.getElementById("moduleTitle").value.trim();

    const orderNumber =
        document.getElementById("orderNumber").value;


    // Create the new module object.
    const newModule = {
        courseName: courseName,
        moduleTitle: moduleTitle,
        orderNumber: orderNumber
    };


    // Get existing modules from localStorage.
    let modules =
        JSON.parse(localStorage.getItem("modules")) || [];


    // Add the new module.
    modules.push(newModule);


    // Save modules.
    localStorage.setItem(
        "modules",
        JSON.stringify(modules)
    );


    // Return to Module Management.
    window.location.href = "module-management.html";
});