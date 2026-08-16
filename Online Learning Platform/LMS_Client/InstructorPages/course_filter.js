import {
  getAllCourses,
  getTopExpensiveCourses
} from '../APIs/CourseApi.js';

// ==========================================
// API Configuration
// ==========================================

const COURSE_API_URL = "https://localhost:7135/Course";
const CATEGORY_API_URL = "https://localhost:7135/Category";


// ==========================================
// Page Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadCategories();
    searchCourses();


    // Search button
    const searchBtn =
        document.getElementById("searchCoursesBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", searchCourses);
    }


    // Clear button
    const clearBtn =
        document.getElementById("clearFiltersBtn");

    if (clearBtn) {
        clearBtn.addEventListener("click", clearFilters);
    }


    // Category change
    const categorySelect =
        document.getElementById("categorySelect");

    if (categorySelect) {
        categorySelect.addEventListener("change", searchCourses);
    }


    // Maximum price change
    const maxPriceInput =
        document.getElementById("maxPriceInput");

    if (maxPriceInput) {
        maxPriceInput.addEventListener("input", searchCourses);
    }

});


// ==========================================
// Load Categories from API
// ==========================================

async function loadCategories() {

    const categorySelect =
        document.getElementById("categorySelect");

    if (!categorySelect) {
        return;
    }


    try {

        const response = await fetch(
            `${CATEGORY_API_URL}/GetAllCategories`
        );


        if (!response.ok) {
            throw new Error("Failed to load categories.");
        }


        const categories = await response.json();


        categorySelect.innerHTML =
            '<option value="">Select a category...</option>';


        categories.forEach(category => {

            const option =
                document.createElement("option");


            option.value =
                category.categoryId;


            option.textContent =
                category.categoryName;


            categorySelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Error loading categories:",
            error
        );

    }

}


// ==========================================
// Search / Filter Courses
// ==========================================

async function searchCourses() {

    const categoryId =
        document.getElementById("categorySelect").value;


    const maxPrice =
        document.getElementById("maxPriceInput").value;


    try {

        let url;


        // ==================================
        // No filters
        // ==================================

        if (!categoryId && !maxPrice) {

            url =
                `${COURSE_API_URL}/GetAllCourses`;

        }


        // ==================================
        // Category and/or price filter
        // ==================================

        else {

            const params =
                new URLSearchParams();


            if (categoryId) {

                params.append(
                    "categoryId",
                    categoryId
                );

            }


            if (maxPrice !== "") {

                params.append(
                    "maxPrice",
                    maxPrice
                );

            }


            url =
                `${COURSE_API_URL}/FilterCourses?${params.toString()}`;

        }


        console.log("API Request:", url);


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Failed to load courses."
            );

        }


        const courses =
            await response.json();


        console.log(
            "Courses received:",
            courses
        );


        renderTableRows(courses);


    } catch (error) {

        console.error(
            "Error loading courses:",
            error
        );


        const tbody =
            document.getElementById(
                "coursesTableBody"
            );


        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    Unable to load courses.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// Render Courses
// ==========================================

function renderTableRows(courses) {

    const tbody =
        document.getElementById(
            "coursesTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (!courses || courses.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No courses match the selected criteria.
                </td>
            </tr>
        `;

        return;

    }


    courses.forEach(course => {

        const tr =
            document.createElement("tr");


        const courseId =
            course.courseId || "-";


        const courseName =
            course.courseName || "N/A";


        const price =
            Number(
                course.coursePrice || 0
            ).toFixed(2);


        const category =
            course.categoryName || "General";


        const instructor =
            course.instructorName ||
            "Not Assigned";


        tr.innerHTML = `
            <td>${courseId}</td>

            <td class="course-title-cell">
                ${courseName}
            </td>

            <td>
                ${price}
            </td>

            <td>
                ${category}
            </td>

            <td>
                ${instructor}
            </td>
        `;


        tbody.appendChild(tr);

    });

}


// ==========================================
// Clear Filters
// ==========================================

function clearFilters() {

    document.getElementById(
        "categorySelect"
    ).value = "";


    document.getElementById(
        "maxPriceInput"
    ).value = "";


    searchCourses();

}