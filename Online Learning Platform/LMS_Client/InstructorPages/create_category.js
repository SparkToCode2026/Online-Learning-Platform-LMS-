import { addCategory } from '../APIs/CategoryApi';


document.addEventListener('DOMContentLoaded', () => {

  const submitBtn =
    document.getElementById('submitBtn');

  const categoryInput =
    document.getElementById('newCategoryName');


  if (!submitBtn || !categoryInput) {
    return;
  }


  submitBtn.addEventListener(
    'click',
    submitCreateCategory
  );


  async function submitCreateCategory() {

    const nameInput =
      categoryInput.value.trim();


    // Validate input
    if (!nameInput) {

      alert('Please enter a category name.');

      return;
    }


    // Disable button while request is running
    submitBtn.disabled = true;

    submitBtn.textContent = 'Creating...';


    try {

      // Send category to ASP.NET API
      const result =
        await addCategory(nameInput);


      console.log(
        'Category created successfully:',
        result
      );


      alert(
        `Category "${nameInput}" has been created successfully!`
      );


      // Return to categories page
      window.location.href =
        'git_categories.html';


    } catch (error) {

      console.error(
        'Error creating category:',
        error
      );


      alert(
        error.message
      );


      // Enable button again
      submitBtn.disabled = false;

      submitBtn.textContent = 'Create';
    }
  }

});