const createLessonForm = document.getElementById("createLessonForm");

createLessonForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the values entered in the form.
    const moduleName = document.getElementById("module").value;
    const lessonTitle = document.getElementById("lessonTitle").value.trim();
    const orderNumber = document.getElementById("orderNumber").value;
    const duration = document.getElementById("duration").value;

    // Create a lesson object.
    const newLesson = {
        moduleName: moduleName,
        lessonTitle: lessonTitle,
        orderNumber: orderNumber,
        duration: duration
    };

    // Get previously saved lessons, or create an empty list.
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];

    // Add the new lesson to the list.
    lessons.push(newLesson);

    // Save the updated list in localStorage.
    localStorage.setItem("lessons", JSON.stringify(lessons));

    // Go back to the Module Details page.
    window.location.href = "module-details.html";
});