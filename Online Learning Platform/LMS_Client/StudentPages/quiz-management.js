// Sample initial quizzes data matching design images
let globalQuizzes = [
    {
        quizId: 1,
        quizTitle: "C# Basics Quiz",
        quizScore: 20,
        courseId: 101,
        courseName: "C# Programming"
    },
    {
        quizId: 2,
        quizTitle: "OOP Concepts Quiz",
        quizScore: 30,
        courseId: 101,
        courseName: "C# Programming"
    },
    {
        quizId: 3,
        quizTitle: "Database Fundamentals",
        quizScore: 25,
        courseId: 102,
        courseName: "Database Design"
    }
];

const API_BASE_URL = 'http://localhost:5000/Quiz'; 

document.addEventListener('DOMContentLoaded', () => {
    // Render initial data directly
    renderQuizList(globalQuizzes);
    populateCourseFilter(globalQuizzes);
    setupEventListeners();
    
    // Optional API fetch
    fetchQuizzesFromAPI();
});

// Render Quizzes inside HTML Container
function renderQuizList(quizzes) {
    const quizListContainer = document.getElementById('quizList');
    if (!quizListContainer) return;
    
    quizListContainer.innerHTML = '';

    if (quizzes.length === 0) {
        quizListContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: #888;">No Quizzes Available.</p>';
        return;
    }

    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.innerHTML = `
            <div class="quiz-info">
                <h4>${quiz.quizTitle}</h4>
                <div class="quiz-meta">
                    <span class="course-badge">${quiz.courseName || 'General Course'}</span>
                    <span class="score-tag"><i class="fa-solid fa-ribbon"></i> ${quiz.quizScore} Points</span>
                </div>
            </div>
            <div class="quiz-actions">
                <button class="btn-action" onclick="viewQuiz(${quiz.quizId})"><i class="fa-regular fa-eye"></i> View</button>
                <button class="btn-action" onclick="openUpdateModal(${quiz.quizId}, '${quiz.quizTitle}', ${quiz.quizScore})"><i class="fa-regular fa-pen-to-square"></i> Edit</button>
                <button class="btn-action" onclick="openChangeCourseModal(${quiz.quizId}, '${quiz.quizTitle}', '${quiz.courseName}', ${quiz.courseId})"><i class="fa-solid fa-arrows-rotate"></i> Change Course</button>
                <button class="btn-action delete" onclick="deleteQuiz(${quiz.quizId})"><i class="fa-regular fa-trash-can"></i> Delete</button>
            </div>
        `;
        quizListContainer.appendChild(quizCard);
    });
}

// 1. Create New Quiz
document.getElementById('createQuizForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('createTitle').value;
    const score = parseFloat(document.getElementById('createScore').value);
    const courseSelect = document.getElementById('createCourse');
    const courseId = parseInt(courseSelect.value) || 101;
    const courseName = courseSelect.options[courseSelect.selectedIndex]?.text || "C# Programming";

    const newQuiz = {
        quizId: Date.now(),
        quizTitle: title,
        quizScore: score,
        courseId: courseId,
        courseName: courseName
    };

    globalQuizzes.unshift(newQuiz);
    renderQuizList(globalQuizzes);
    populateCourseFilter(globalQuizzes);
    closeModal('createModal');
    document.getElementById('createQuizForm').reset();
});

// 2. Update Quiz Title and Score
document.getElementById('updateQuizForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('updateQuizId').value);
    const title = document.getElementById('updateTitle').value;
    const score = parseFloat(document.getElementById('updateScore').value);

    const quiz = globalQuizzes.find(q => q.quizId === id);
    if (quiz) {
        quiz.quizTitle = title;
        quiz.quizScore = score;
        renderQuizList(globalQuizzes);
    }
    closeModal('updateModal');
});

// 3. Update Quiz Course
document.getElementById('changeCourseForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('changeCourseQuizId').value);
    const courseSelect = document.getElementById('changeCourseNewSelect');
    const newCourseId = parseInt(courseSelect.value);
    const newCourseName = courseSelect.options[courseSelect.selectedIndex]?.text;

    const quiz = globalQuizzes.find(q => q.quizId === id);
    if (quiz && newCourseId) {
        quiz.courseId = newCourseId;
        quiz.courseName = newCourseName;
        renderQuizList(globalQuizzes);
    }
    closeModal('changeCourseModal');
});

// 4. Delete Quiz
function deleteQuiz(id) {
    if (confirm('Are you sure you want to delete this quiz?')) {
        globalQuizzes = globalQuizzes.filter(q => q.quizId !== id);
        renderQuizList(globalQuizzes);
        populateCourseFilter(globalQuizzes);
    }
}

function viewQuiz(id) {
    const quiz = globalQuizzes.find(q => q.quizId === id);
    if (quiz) {
        alert(`Viewing Quiz: ${quiz.quizTitle}\nScore: ${quiz.quizScore}\nCourse: ${quiz.courseName}`);
    }
}

// Modal Helpers
function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

function openUpdateModal(id, title, score) {
    document.getElementById('updateQuizId').value = id;
    document.getElementById('updateTitle').value = title;
    document.getElementById('updateScore').value = score;
    openModal('updateModal');
}

function openChangeCourseModal(id, title, currentCourseName, courseId) {
    document.getElementById('changeCourseQuizId').value = id;
    document.getElementById('changeCourseQuizTitle').value = title;
    document.getElementById('changeCourseCurrentName').value = currentCourseName || 'N/A';
    openModal('changeCourseModal');
}

function setupEventListeners() {
    document.getElementById('openCreateModalBtn')?.addEventListener('click', () => openModal('createModal'));
    
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetModal = e.target.getAttribute('data-close');
            closeModal(targetModal);
        });
    });

    // Sort A-Z
    document.getElementById('sortBtn')?.addEventListener('click', () => {
        globalQuizzes.sort((a, b) => a.quizTitle.localeCompare(b.quizTitle));
        renderQuizList(globalQuizzes);
    });

    // Search Filter
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = globalQuizzes.filter(q => q.quizTitle.toLowerCase().includes(query));
        renderQuizList(filtered);
    });

    // Course Filter
    document.getElementById('courseFilter')?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'all') {
            renderQuizList(globalQuizzes);
        } else {
            const filtered = globalQuizzes.filter(q => q.courseId === parseInt(val));
            renderQuizList(filtered);
        }
    });
}

function populateCourseFilter(quizzes) {
    const courseFilter = document.getElementById('courseFilter');
    const createCourse = document.getElementById('createCourse');
    const changeCourseNewSelect = document.getElementById('changeCourseNewSelect');
    
    if (!courseFilter || !createCourse || !changeCourseNewSelect) return;

    // Available courses list
    const defaultCourses = [
        { id: 101, name: 'C# Programming' },
        { id: 102, name: 'Database Design' },
        { id: 103, name: 'Web Development' }
    ];

    courseFilter.innerHTML = '<option value="all">All Courses</option>';
    createCourse.innerHTML = '<option value="">Select Course</option>';
    changeCourseNewSelect.innerHTML = '<option value="">Select New Course</option>';

    defaultCourses.forEach(c => {
        courseFilter.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        createCourse.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        changeCourseNewSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

// Optional API sync when backend is available
async function fetchQuizzesFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/GetAllQuizzes`);
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                globalQuizzes = data;
                renderQuizList(globalQuizzes);
                populateCourseFilter(globalQuizzes);
            }
        }
    } catch (e) {
        console.log("Using static dummy data (API offline).");
    }
}
// quiz-management.js - Instructor Quiz CRUD Logic

document.addEventListener('DOMContentLoaded', () => {
    loadManagedQuizzes();
});

async function loadManagedQuizzes() {
    try {
        const quizzes = await customFetch('/api/Quiz/manage', 'GET');
        console.log('Managed quizzes loaded:', quizzes);
    } catch (error) {
        console.error('Error fetching quiz management table:', error);
    }
}

/**
 * Deletes a quiz by ID
 * @param {number|string} quizId 
 */
async function deleteQuiz(quizId) {
    if (confirm('Are you sure you want to delete this quiz?')) {
        try {
            await customFetch(`/api/Quiz/${quizId}`, 'DELETE');
            alert('Quiz deleted successfully!');
            loadManagedQuizzes(); // Refresh list
        } catch (error) {
            alert('Failed to delete the quiz.');
            console.error('Delete error:', error);
        }
    }
}