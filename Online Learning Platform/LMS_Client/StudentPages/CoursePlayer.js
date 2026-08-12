document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Collapse Functionality ---
    const collapseBtn = document.getElementById('collapseBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

    collapseBtn.addEventListener('click', () => {
        sidebar.classList.add('collapsed');
        sidebarToggleBtn.style.display = 'flex';
    });

    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.remove('collapsed');
        sidebarToggleBtn.style.display = 'none';
    });

    // --- 2. Lesson Selection & Completion Tracking ---
    const lessonItems = document.querySelectorAll('.lesson-item');
    const markCompleteBtn = document.getElementById('markCompleteBtn');

    // Helper to check if a lesson is completed
    function isLessonCompleted(lessonItem) {
        const icon = lessonItem.querySelector('.completed-icon, .pending-icon');
        return icon && icon.classList.contains('completed-icon');
    }

    // Helper to toggle completion state
    function toggleLessonCompletion(lessonItem) {
        const icon = lessonItem.querySelector('.completed-icon, .pending-icon');
        if (!icon) return;

        if (icon.classList.contains('completed-icon')) {
            // Change to pending/incomplete
            icon.className = 'fa-regular fa-circle pending-icon';
        } else {
            // Change to completed
            icon.className = 'fa-solid fa-circle-check completed-icon';
        }
        
        // Update parent module progress counter
        const moduleEl = lessonItem.closest('.module');
        if (moduleEl) {
            updateModuleProgress(moduleEl);
        }

        // Update overall top header progress bar
        updateOverallProgress();

        // If this lesson is active, sync the 'Mark as Complete' button state
        if (lessonItem.classList.contains('active')) {
            syncMarkCompleteButtonState(lessonItem);
        }
    }

    // Helper to update progress counts for a specific module
    function updateModuleProgress(moduleEl) {
        const lessons = moduleEl.querySelectorAll('.lesson-item');
        const completedCount = Array.from(lessons).filter(isLessonCompleted).length;
        const totalCount = lessons.length;

        const progressSpan = moduleEl.querySelector('.module-progress');
        if (progressSpan) {
            progressSpan.innerHTML = `<i class="fa-solid fa-check-double"></i> ${completedCount}/${totalCount}`;
            
            // Adjust visual class based on completion progress
            progressSpan.classList.remove('full', 'partial', 'empty');
            if (completedCount === totalCount) {
                progressSpan.classList.add('full');
            } else if (completedCount > 0) {
                progressSpan.classList.add('partial');
            } else {
                progressSpan.classList.add('empty');
            }
        }
    }

    // Helper to update overall top header progress bar
    function updateOverallProgress() {
        const allLessons = document.querySelectorAll('.lesson-item');
        const total = allLessons.length;
        const completed = Array.from(allLessons).filter(isLessonCompleted).length;
        const percent = total > 0 ? (completed / total) * 100 : 0;
        
        const progressFill = document.querySelector('.progress-bar-fill');
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
    }

    // Helper to sync the markCompleteBtn display based on active lesson completion
    function syncMarkCompleteButtonState(activeLessonItem) {
        if (!markCompleteBtn) return;

        if (isLessonCompleted(activeLessonItem)) {
            // Active lesson is completed -> Show green "Completed" state
            markCompleteBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Completed';
            markCompleteBtn.style.backgroundColor = '#2ec4b6'; // Premium Teal Green
            markCompleteBtn.style.color = '#ffffff';
        } else {
            // Active lesson is incomplete -> Show standard orange "Mark as Complete" state
            markCompleteBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mark as Complete';
            markCompleteBtn.style.backgroundColor = 'var(--primary-orange)';
            markCompleteBtn.style.color = '#ffffff';
        }
    }

    // Set a lesson active
    function makeLessonActive(lessonItem) {
        // Remove active class from all lessons
        lessonItems.forEach(item => item.classList.remove('active'));

        // Add active class to selected lesson
        lessonItem.classList.add('active');

        // Update the lesson title in the content card
        const lessonTitleText = lessonItem.querySelector('.lesson-info span').textContent;
        const mainTitleEl = document.querySelector('.lesson-header h2');
        if (mainTitleEl) {
            mainTitleEl.textContent = lessonTitleText;
        }

        // Sync the complete button
        syncMarkCompleteButtonState(lessonItem);
    }

    // Add click listeners to all lesson items
    lessonItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Check if user clicked directly on the completion check/pending icon
            const iconClick = e.target.closest('.completed-icon, .pending-icon');
            if (iconClick) {
                toggleLessonCompletion(item);
            } else {
                makeLessonActive(item);
            }
        });
    });

    // Mark as Complete button click toggles the active lesson completion
    if (markCompleteBtn) {
        markCompleteBtn.addEventListener('click', () => {
            const activeLesson = document.querySelector('.lesson-item.active');
            if (activeLesson) {
                toggleLessonCompletion(activeLesson);
            }
        });
    }

    // Initialize UI state on load
    const initialActiveLesson = document.querySelector('.lesson-item.active');
    if (initialActiveLesson) {
        syncMarkCompleteButtonState(initialActiveLesson);
    }
    updateOverallProgress();

    // --- 3. Back Button Navigation ---
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'enrollment.html';
        });
    }

    // --- 4. Play Button Interaction ---
    const playBtn = document.querySelector('.play-btn-large');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playBtn.style.paddingLeft = '0'; // reset center
            setTimeout(() => {
                alert('Video playback simulation initiated.');
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                playBtn.style.paddingLeft = '6px';
            }, 500);
        });
    }
});