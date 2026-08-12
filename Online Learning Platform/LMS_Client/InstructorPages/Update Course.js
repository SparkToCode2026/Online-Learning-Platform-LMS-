document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("updateCourseForm");
  const backBtn = document.getElementById("backBtn");

  // Handle Form Submission for Update
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Gather form data
    const formData = new FormData(form);
    const courseData = {
      courseName: formData.get("courseName"),
      coursePrice: formData.get("coursePrice"),
      category: formData.get("category"),
      instructor: formData.get("instructor")
    };

    // Simulate updating the data
    console.log("Updating course with new data:", courseData);
    alert(`Course "${courseData.courseName}" has been updated successfully!`);
  });

  // Handle Back Button Click
  backBtn.addEventListener("click", () => {
    // In a real app, this would route to the previous page
    console.log("Navigating back to course list...");
    alert("Back button clicked!");
  });
});