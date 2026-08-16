import {getAllCategories,
        getElementById,
        searchCategory,
    countCoursesPerCategory
} from '../APIs/CourseApi';

// ==========================================
// API Configuration
// ==========================================

const CATEGORY_API_URL = "https://localhost:7135/Category";


// ==========================================
// Page Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadCategories();


    // Search button
    const searchBtn =
        document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener(
            "click",
            applyFilter
        );
    }


    // Clear button
    const clearBtn =
        document.getElementById("clearBtn");

    if (clearBtn) {
        clearBtn.addEventListener(
            "click",
            resetFilter
        );
    }

});


// ==========================================
// GET All Categories
// ==========================================

async function loadCategories() {

    try {

        const response = await fetch(
            `${CATEGORY_API_URL}/GetAllCategories`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load categories."
            );

        }


        const categories =
            await response.json();


        console.log(
            "Categories received:",
            categories
        );


        populateDropdown(categories);

        renderTable(categories);


    } catch (error) {

        console.error(
            "Error loading categories:",
            error
        );


        showError(
            "Unable to load categories."
        );

    }

}


// ==========================================
// Populate Category Dropdown
// ==========================================

function populateDropdown(categories) {

    const select =
        document.getElementById(
            "categorySelect"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">All Categories</option>';


    categories.forEach(category => {

        const option =
            document.createElement("option");


        option.value =
            category.categoryId;


        option.textContent =
            category.categoryName;


        select.appendChild(option);

    });

}


// ==========================================
// Render Categories Table
// ==========================================

function renderTable(categories) {

    const tbody =
        document.getElementById(
            "categoryTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (!categories ||
        categories.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="3"
                    style="text-align: center; color: #888;">
                    No categories found
                </td>
            </tr>
        `;

        return;
    }


    categories.forEach(category => {

        const tr =
            document.createElement("tr");


        const id =
            category.categoryId;


        const name =
            category.categoryName || "N/A";


        tr.innerHTML = `

            <td>
                <strong>${name}</strong>
            </td>

            <td>
                -
            </td>

            <td>

                <div class="action-cell">

                    <a
                        href="rename_category.html?id=${id}&name=${encodeURIComponent(name)}"
                        class="icon-btn"
                        title="Rename">

                        <i class="fa-regular fa-pen-to-square"></i>

                    </a>


                    <button
                        class="icon-btn"
                        title="Delete"
                        onclick="deleteCategory(${id}, '${escapeForAttribute(name)}')">

                        <i class="fa-regular fa-trash-can"></i>

                    </button>

                </div>

            </td>
        `;


        tbody.appendChild(tr);

    });

}


// ==========================================
// Search Category
// ==========================================

async function applyFilter() {

    const select =
        document.getElementById(
            "categorySelect"
        );


    const selectedId =
        select ? select.value : "";


    // If "All Categories" selected
    if (!selectedId) {

        loadCategories();

        return;
    }


    try {

        const response =
            await fetch(
                `${CATEGORY_API_URL}/GetCategoryById?id=${selectedId}`
            );


        if (!response.ok) {

            throw new Error(
                "Category not found."
            );

        }


        const category =
            await response.json();


        renderTable([category]);


    } catch (error) {

        console.error(
            "Error searching category:",
            error
        );


        showError(
            "Unable to find category."
        );

    }

}


// ==========================================
// Delete Category
// ==========================================

async function deleteCategory(id, name) {

    const confirmed =
        confirm(
            `Are you sure you want to delete the category "${name}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${CATEGORY_API_URL}/DeleteEmptyCategory?id=${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const errorMessage =
                await response.text();


            alert(errorMessage);

            return;
        }


        const result =
            await response.text();


        console.log(
            "Delete response:",
            result
        );


        alert(
            "Category deleted successfully."
        );


        // Reload categories from database
        loadCategories();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to delete category."
        );

    }

}


// ==========================================
// Clear Filter
// ==========================================

function resetFilter() {

    const select =
        document.getElementById(
            "categorySelect"
        );


    if (select) {
        select.value = "";
    }


    loadCategories();

}


// ==========================================
// Display Error
// ==========================================

function showError(message) {

    const tbody =
        document.getElementById(
            "categoryTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = `
        <tr>
            <td colspan="3"
                style="text-align: center; color: #888;">
                ${message}
            </td>
        </tr>
    `;

}


// ==========================================
// Helper
// ==========================================

function escapeForAttribute(value) {

    return String(value)
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

}