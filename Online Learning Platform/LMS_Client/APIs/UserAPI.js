/**
 * UserAPI.js - API client module for user authentication and management.
 */

const API_BASE_URL = 'https://localhost:7135/api/user';

/**
 * Sends a POST request to authenticate a user.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{token: string, user: {id: number, email: string, fullName: string, role: string}, message: string}>}
 */
export async function loginUser(email, password) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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
    const errorMessage = data && data.message ? data.message : 'Invalid email or password.';
    throw new Error(errorMessage);
  }

  return data;
}
