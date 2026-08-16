import {getAllCategories,
        getElementById,
        searchCategory,
    countCoursesPerCategory
} from '../APIs/CourseApi';


let currentCategoryId = null;


document.addEventListener('DOMContentLoaded', () => {

  // Get category information from URL
  const urlParams =
    new URLSearchParams(window.location.search);

  currentCategoryId =
    urlParams.get('id');

  const currentName =
    urlParams.get('name');


  // Put current category name inside input
  if (currentName) {

    const inputField =
      document.getElementById('editCategoryName');

    if (inputField) {

      inputField.value =
        decodeURIComponent(currentName);

    }
  }


  // Rename button
  const renameBtn =
    document.getElementById('renameBtn');

  if (renameBtn) {

    renameBtn.addEventListener(
      'click',
      submitRenameCategory
    );
  }

});


async function submitRenameCategory() {

  const inputField =
    document.getElementById('editCategoryName');


  const newName =
    inputField
      ? inputField.value.trim()
      : '';


  // Validate name
  if (!newName) {

    alert(
      'Please enter a valid category name.'
    );

    return;
  }


  // Validate category ID
  if (!currentCategoryId) {

    alert(
      'No category selected.'
    );

    return;
  }


  const renameBtn =
    document.getElementById('renameBtn');


  // Disable button while API request is running
  if (renameBtn) {

    renameBtn.disabled = true;
    renameBtn.textContent = 'Renaming...';

  }


  try {

    // Send PATCH request to API
    const result =
      await updateCategoryName(
        currentCategoryId,
        newName
      );


    console.log(
      'Category renamed successfully:',
      result
    );


    alert(
      `Category #${currentCategoryId} successfully renamed to "${newName}".`
    );


    // Return to categories page
    window.location.href =
      'git_categories.html';


  } catch (error) {

    console.error(
      'Error renaming category:',
      error
    );


    alert(
      error.message
    );


    // Enable button again
    if (renameBtn) {

      renameBtn.disabled = false;
      renameBtn.textContent = 'Rename';

    }

  }

}