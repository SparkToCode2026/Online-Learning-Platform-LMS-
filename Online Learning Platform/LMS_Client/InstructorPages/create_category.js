document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  const categoryInput = document.getElementById('newCategoryName');

  if (!submitBtn || !categoryInput) return;

  submitBtn.addEventListener('click', submitCreateCategory);

  function submitCreateCategory() {
    const nameInput = categoryInput.value.trim();

    if (!nameInput) {
      alert('Please enter a category name.');
      return;
    }

    // Default seed dataset if localStorage is empty
    const defaultCategories = [
      { id: 1, name: "Development", courseCount: 12 },
      { id: 2, name: "Design", courseCount: 8 },
      { id: 3, name: "Business", courseCount: 5 },
      { id: 4, name: "Data Science", courseCount: 4 },
      { id: 5, name: "Marketing (Empty)", courseCount: 0 }
    ];

    // Retrieve existing categories or fall back to defaults
    let categories = JSON.parse(localStorage.getItem('scholarhub_categories')) || defaultCategories;

    // Check for duplicate category names (case-insensitive)
    const isDuplicate = categories.some(
      cat => cat.name.toLowerCase() === nameInput.toLowerCase()
    );

    if (isDuplicate) {
      alert(`The category "${nameInput}" already exists! Please enter a unique name.`);
      return;
    }

    // Create new category object
    const newCategory = {
      id: Date.now(),
      name: nameInput,
      courseCount: 0
    };

    categories.push(newCategory);

    // Save updated array to browser storage
    localStorage.setItem('scholarhub_categories', JSON.stringify(categories));

    // Redirect back to main categories view
    window.location.href = 'git_categories.html';
  }
});