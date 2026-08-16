/**
 * SubmissionAPI.js - API client module for assignment submission management.
 */

const API_BASE_URL = 'https://localhost:7135/api/submission';

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
 * Sends a POST request to create a new assignment submission.
 * @param {string} content - The submission content.
 * @param {number|string} userId - The submitting student's user ID.
 * @param {number|string} assignmentId - The assignment ID being submitted for.
 * @param {string} [grade] - Optional grade (defaults to "Pending" on the server if omitted).
 * @returns {Promise<{submissionId: number, submissionContent: string, submissionGrade: string, userId: number, assignmentId: number}>}
 */
export async function createSubmission(content, userId, assignmentId, grade) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/CreateSubmission`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, userId, assignmentId, grade }),
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
    const errorMessage = data && data.message ? data.message : 'Failed to create submission.';
    throw new Error(errorMessage);
  }

  return data;
}
