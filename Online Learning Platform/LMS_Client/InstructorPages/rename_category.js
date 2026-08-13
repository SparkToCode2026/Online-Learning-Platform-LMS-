let currentCategoryId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Extract category parameters from URL query strings
  const urlParams = new URLSearchParams(window.location.search);
  currentCategoryId = urlParams.get('id');
  const currentName = urlParams.get('name');

  if (currentName) {
    const inputField = document.getElementById('editCategoryName');
    if (inputField) {
      inputField.value = decodeURIComponent(currentName);
    }
  }

  // Attach submit listener
  const renameBtn = document.getElementById('renameBtn');
  if (renameBtn) {
    renameBtn.addEventListener('click', submitRenameCategory);
  }
});

function submitRenameCategory() {
  const inputField = document.getElementById('editCategoryName');
  const newName = inputField ? inputField.value.trim() : '';

  if (!newName) {
    alert('Please enter a valid category name.');
    return;
  }

  if (!currentCategoryId) {
    alert('No category selected.');
    return;
  }

  // Frontend local simulation without live API connection
  alert(`Category #${currentCategoryId} successfully renamed to: "${newName}"`);
  
  // Navigate back to categories overview
  window.location.href = 'git_category.html';
}