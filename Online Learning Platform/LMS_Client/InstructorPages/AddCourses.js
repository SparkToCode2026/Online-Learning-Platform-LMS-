document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createCourseForm");
  const backBtn = document.getElementById("backBtn");

  // Handle Form Submission
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

    // Simulate saving the data
    console.log("Saving new course:", courseData);
    alert(`Course "${courseData.courseName}" created successfully!`);
    
    // Optional: Reset form after creation
    // form.reset();
  });

  // Handle Back Button Click
  backBtn.addEventListener("click", () => {
    // In a real application, this might be window.history.back() or a router push
    console.log("Navigating back...");
    alert("Back button clicked!");
  });
});