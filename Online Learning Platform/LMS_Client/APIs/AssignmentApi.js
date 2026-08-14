/**
 * AssignmentApi.js - API client module for assignment management.
 */

const API_BASE_URL = 'https://localhost:7135/AssignmentController';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Sends a POST request to create a new assignment for a course.
 * NO UI: no create-assignment form exists in the client yet.
 * @param {string} assignmentTitle - The assignment's title.
 * @param {string|Date} deadLine - The assignment deadline (must be in the future).
 * @param {number|string} courseId - The course ID this assignment belongs to.
 * @returns {Promise<{assignmentId: number, assignmentTitle: string, deadLine: string, courseId: number}>}
 */
export async function createAssignment(assignmentTitle, deadLine, courseId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/CreateAssignment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ assignmentTitle, deadLine, courseId }),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    const errorMessage = data && data.message ? data.message : 'Failed to create assignment.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a PUT request to update an assignment's title and deadline.
 * NO UI: no edit-assignment form exists in the client yet.
 * @param {number|string} id - The assignment ID.
 * @param {string} assignmentTitle - The updated title.
 * @param {string|Date} deadLine - The updated deadline.
 * @returns {Promise<void>}
 */
export async function updateAssignment(id, assignmentTitle, deadLine) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ assignmentTitle, deadLine }),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = {};
    }
    const errorMessage = data && data.message ? data.message : 'Failed to update assignment.';
    throw new Error(errorMessage);
  }
}

/**
 * Sends a PATCH request to extend an assignment's deadline.
 * NO UI: no extend-deadline control exists in the client yet.
 * @param {number|string} id - The assignment ID.
 * @param {string|Date} newDeadline - The new deadline (must be later than the current one).
 * @returns {Promise<{message: string, newDeadline: string}>}
 */
export async function extendDeadline(id, newDeadline) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/${id}/extend-deadline`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newDeadline }),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    const errorMessage = data && data.message ? data.message : 'Failed to extend deadline.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a DELETE request to remove an assignment by ID.
 * NO UI: no delete-assignment control exists in the client yet.
 * @param {number|string} id - The assignment ID.
 * @returns {Promise<void>}
 */
export async function deleteAssignment(id) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = {};
    }
    const errorMessage = data && data.message ? data.message : 'Failed to delete assignment.';
    throw new Error(errorMessage);
  }
}

/**
 * Sends a GET request to retrieve all assignments together with their submissions.
 * @returns {Promise<Array<{assignmentId: number, assignmentTitle: string, deadLine: string, courseId: number, submissions: Array<{submissionContent: string, submissionGrade: number}>|null}>>}
 */
export async function getAssignmentsWithSubmissions() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/with-submissions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = [];
  }

  if (!response.ok) {
    const errorMessage = data && data.message ? data.message : 'Failed to fetch assignments with submissions.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a GET request to retrieve a single assignment by ID.
 * NO UI: no assignment-detail view exists in the client yet.
 * @param {number|string} id - The assignment ID.
 * @returns {Promise<{assignmentId: number, assignmentTitle: string, deadLine: string, courseId: number}>}
 */
export async function getAssignmentById(id) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    const errorMessage = data && data.message ? data.message : 'Assignment not found.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a GET request to retrieve all assignments.
 * @returns {Promise<Array<{assignmentId: number, assignmentTitle: string, deadLine: string, courseId: number}>>}
 */
export async function getAllAssignments() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/GetAssignmentsAll`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = [];
  }

  if (!response.ok) {
    const errorMessage = data && data.message ? data.message : 'Failed to fetch assignments.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a GET request to retrieve all assignments sorted by closest deadline.
 * NO UI: no sorted-by-deadline view exists in the client yet.
 * @returns {Promise<Array<{assignmentId: number, assignmentTitle: string, deadLine: string, courseId: number}>>}
 */
export async function getAssignmentsSortedByDeadline() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/sorted-by-deadline`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = [];
  }

  if (!response.ok) {
    const errorMessage = data && data.message ? data.message : 'Failed to fetch sorted assignments.';
    throw new Error(errorMessage);
  }

  return data;
}
