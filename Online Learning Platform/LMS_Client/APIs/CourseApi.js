/**
 * CourseApi.js - API client module for course data.
 */

const API_BASE_URL = 'https://localhost:7135/Course';

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
 * Sends a GET request to retrieve all courses with category and instructor info.
 * @returns {Promise<Array<{courseId: number, courseName: string, coursePrice: number, categoryId: number, categoryName: string, instructorId: number, instructorName: string}>>}
 */
export async function getAllCourses() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/GetAllCourses`, {
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
    const errorMessage = data && data.message ? data.message : 'Failed to fetch courses.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a GET request to retrieve a single course by ID.
 * @param {number|string} id - The course ID.
 * @returns {Promise<{courseId: number, courseName: string, coursePrice: number, categoryId: number, categoryName: string, instructorId: number, instructorName: string}>}
 */
export async function getCourseById(id) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/GetCourseById?id=${id}`, {
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
    const errorMessage = data && data.message ? data.message : 'Course not found.';
    throw new Error(errorMessage);
  }

  return data;
}