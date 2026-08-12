const createLessonForm = document.getElementById("createLessonForm");

createLessonForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const moduleName = document.getElementById("module").value;
    const lessonTitle = document.getElementById("lessonTitle").value.trim();
    const orderNumber = document.getElementById("orderNumber").value;
    const duration = document.getElementById("duration").value;

    const newLesson = {
        moduleName: moduleName,
        lessonTitle: lessonTitle,
        orderNumber: orderNumber,
        duration: duration
    };

    let lessons = JSON.parse(localStorage.getItem("lessons")) || [];

    lessons.push(newLesson);

    localStorage.setItem("lessons", JSON.stringify(lessons));

    window.location.href = "module-details.html";
});