/**
 * quizAPI.js - API client module for quiz management.
 */

const API_BASE_URL = 'https://localhost:7135/Quiz';

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
 * Sends a GET request to retrieve all quizzes, each including its course name.
 * @returns {Promise<Array<{quizId: number, quizTitle: string, quizScore: number, courseId: number, courseName: string}>>}
 */
export async function getAllQuizzes() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/GetAllQuizzes`, {
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
    const errorMessage = data && data.message ? data.message : 'Failed to fetch quizzes.';
    throw new Error(errorMessage);
  }

  return data;
}
