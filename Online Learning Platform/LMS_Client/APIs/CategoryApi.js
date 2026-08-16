const API_BASE_URL = 'https://localhost:7135/Category';

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}


/*
 * POST: Create a new category
 */
export async function addCategory(categoryName) {

  let response;

  try {

    response = await fetch(
      `${API_BASE_URL}/AddCategory`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          categoryName: categoryName
        })
      }
    );

  } catch (error) {

    throw new Error(
      'Connection refused. Please make sure the backend server (LMS_Server) is running.'
    );

  }


  let data;

  try {

    data = await response.json();

  } catch (error) {

    data = null;

  }


  if (!response.ok) {

    const errorMessage =
      data && data.message
        ? data.message
        : 'Failed to create category.';

    throw new Error(errorMessage);
  }


  return data;
}

/**
 * PATCH: Update category name
 */
export async function updateCategoryName(id, name) {

  let response;

  try {

    const params = new URLSearchParams();

    params.append('id', id);
    params.append('name', name);

    response = await fetch(
      `${API_BASE_URL}/UpdateCategoryName?${params.toString()}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders()
      }
    );

  } catch (error) {

    throw new Error(
      'Connection refused. Please make sure the backend server (LMS_Server) is running.'
    );

  }


  let data;

  try {

    data = await response.json();

  } catch (error) {

    data = null;

  }


  if (!response.ok) {

    let errorMessage = 'Failed to rename category.';

    if (typeof data === 'string') {
      errorMessage = data;
    }
    else if (data && data.message) {
      errorMessage = data.message;
    }

    throw new Error(errorMessage);
  }


  return data;
}