/**
 * EnrollmentAPIs.js - API client module for enrollment management.
 */

const API_BASE_URL = 'https://localhost:7135/Enrollment';

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
 * Sends a POST request to enroll a student in a course.
 * @param {number|string} studentId - The student's user ID.
 * @param {number|string} courseId - The course ID.
 * @returns {Promise<{message: string, enrollmentId: number}>}
 */
export async function enrollStudent(studentId, courseId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/EnrollStudent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId, courseId }),
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
    const errorMessage = data && data.message ? data.message : 'Failed to enroll student.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a PATCH request to update an enrollment's status.
 * @param {number|string} id - The enrollment ID.
 * @param {number} enrollmentStatus - The new status (0=Pending, 1=Active, 2=Completed, 3=Dropped).
 * @returns {Promise<{message: string, statusCode: number, statusName: string}>}
 */
export async function updateEnrollmentStatus(id, enrollmentStatus) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/UpdateStatus/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ enrollmentStatus }),
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
    const errorMessage = data && data.message ? data.message : 'Failed to update enrollment status.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a PATCH request to extend a student's enrollment date for a course.
 * @param {number|string} userId - The user ID.
 * @param {number|string} courseId - The course ID.
 * @param {string|Date} newDate - The new enrollment date (must be in the future).
 * @returns {Promise<{message: string, userId: number, courseId: number, newExtendedDate: string, statusName: string}>}
 */
export async function extendEnrollmentDate(userId, courseId, newDate) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/ExtendDate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, courseId, newDate }),
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
    const errorMessage = data && data.message ? data.message : 'Failed to extend enrollment date.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a DELETE request to cancel an enrollment by ID. Requires Instructor role.
 * @param {number|string} id - The enrollment ID.
 * @returns {Promise<{message: string}>}
 */
export async function cancelEnrollment(id) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/CancelEnrollment/${id}`, {
      method: 'DELETE',
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
    const errorMessage = data && data.message ? data.message : 'Failed to cancel enrollment.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a GET request to retrieve all enrollments for a given course.
 * @param {number|string} courseId - The course ID.
 * @returns {Promise<Array<{enrollmentId: number, userId: number, courseId: number, enrolledAt: string, statusName: string}>>}
 */
export async function getEnrollmentsByCourse(courseId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/GetEnrollmentsByCourse/${courseId}`, {
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
    const errorMessage = data && data.message ? data.message : 'No enrollments found for the specified course.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a GET request to retrieve an enrollment by its enrolled date.
 * @param {string|Date} enrollmentDate - The enrollment date.
 * @returns {Promise<{enrollmentId: number, userId: number, courseId: number, enrolledAt: string, statusName: string}>}
 */
export async function getEnrollmentByEnrolledAt(enrollmentDate) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/GetEnrollmentByEnrolledAt/${enrollmentDate}`, {
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
    const errorMessage = data && data.message ? data.message : 'Enrollment not found.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a GET request to retrieve all enrollments for a given user.
 * @param {number|string} userId - The user ID.
 * @returns {Promise<Array<{enrollmentId: number, userId: number, courseId: number, enrolledAt: string, statusName: string}>>}
 */
export async function getEnrollmentsByUserId(userId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/GetEnrollmentsByUserId/${userId}`, {
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
    const errorMessage = data && data.message ? data.message : 'Failed to fetch enrollments for user.';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Sends a GET request to retrieve enrollment statistics (total count) for a given course.
 * @param {number|string} courseId - The course ID.
 * @returns {Promise<{courseId: number, totalEnrollments: number}>}
 */
export async function getEnrollmentStatsByCourse(courseId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/GetEnrollmentStatsByCourse/${courseId}`, {
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
    const errorMessage = data && data.message ? data.message : 'Failed to fetch enrollment stats.';
    throw new Error(errorMessage);
  }

  return data;
}