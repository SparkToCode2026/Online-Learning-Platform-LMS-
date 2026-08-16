/**
 * QuizAttemptAPI.js - API client module for quiz attempt management.
 */

const API_BASE_URL = 'https://localhost:7135/QuizAttempt';

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
 * Sends a POST request to create a new quiz attempt.
 * @param {number} score - The score achieved on the attempt.
 * @param {boolean} isPassed - Whether the attempt passed.
 * @param {number|string} userId - The student's user ID.
 * @param {number|string} quizId - The quiz ID being attempted.
 * @returns {Promise<number>} The newly created quiz attempt's ID.
 */
export async function createQuizAttempt(score, isPassed, userId, quizId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/AddQuizAttempt`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ score, isPassed, userId, quizId }),
    });
  } catch (netErr) {
    throw new Error(`Connection refused. Please make sure the backend server (LMS_Server) is running.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data && data.message ? data.message : 'Failed to create quiz attempt.';
    throw new Error(errorMessage);
  }

  return data;
}
