import { getAllAssignments } from '../APIs/AssignmentApi.js';
import { getAllCourses } from '../APIs/CourseApi.js';

document.addEventListener('DOMContentLoaded', loadAssignmentsFromServer);

async function loadAssignmentsFromServer() {
  const tbody = document.getElementById('submissions-table-body');
  if (!tbody) return;

  try {
    const [assignments, courses] = await Promise.all([
      getAllAssignments(),
      getAllCourses(),
    ]);

    renderAssignments(assignments || [], courses || []);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-muted">${err.message || 'Failed to load assignments.'}</td></tr>`;
  }
}

function renderAssignments(assignments, courses) {
  const tbody = document.getElementById('submissions-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (assignments.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-muted">No assignments found.</td></tr>';
    return;
  }

  const courseMap = new Map(courses.map(c => [c.courseId, c.courseName]));

  assignments.forEach(assignment => {
    const courseName = courseMap.get(assignment.courseId) || `Course #${assignment.courseId}`;
    const deadline = assignment.deadLine ? new Date(assignment.deadLine).toISOString().slice(0, 10) : '';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="font-bold">${assignment.assignmentTitle}</td>
      <td class="text-muted">${courseName}</td>
      <td class="text-muted">${deadline}</td>
      <td><button class="btn-submit">Submit</button></td>
    `;

    const submitBtn = row.querySelector('.btn-submit');
    submitBtn.addEventListener('click', () => {
      window.location.href = `assignmnetSubmission.html?assignmentId=${assignment.assignmentId}`;
    });

    tbody.appendChild(row);
  });
}
