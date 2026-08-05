using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Models;
namespace LMS_Server.Controllers
{
    [ApiController]
    [Route("Category")]

    public class CategoryController : ControllerBase
    {
        private ProjectContext context;


        public CategoryController(ProjectContext _context)
        {
            context = _context;
        }

        // 1. POST: Create new course category
        [HttpPost("AddCategory")]
        public IActionResult AddCategory(Category category)
        {
            context.categories.Add(category);
            context.SaveChanges();

            return Ok(category.CategoryId);
        }

        // 2. PATCH: Update category name
        [HttpPatch("UpdateCategoryName")]
        public IActionResult UpdateCategoryName(int id, string name)
        {
            Category category = context.categories
                .FirstOrDefault(c => c.CategoryId == id);


            if (category != null)
            {
                category.CategoryName = name;
                context.SaveChanges();

                return Ok("Category name updated successfully");
            }
            else
            {
                return NotFound("Category not found");
            }
        }

        // 3. PATCH (2nd): Rename category with slug/code
        [HttpPatch("RenameCategoryWithSlug")]
        public IActionResult RenameCategoryWithSlug(int id, string slug)
        {
            Category category = context.categories
                .FirstOrDefault(c => c.CategoryId == id);


            if (category != null)
            {
                category.CategoryName = slug;
                context.SaveChanges();

                return Ok("Category renamed successfully");
            }
            else
            {
                return NotFound("Category not found");
            }
        }

        // 4. DELETE: Delete empty category
        [HttpDelete("DeleteEmptyCategory")]
        public IActionResult DeleteEmptyCategory(int id)
        {
            Category category = context.categories
                .Include(c => c.courses)
                .FirstOrDefault(c => c.CategoryId == id);


            if (category == null)
            {
                return NotFound("Category not found");
            }


            if (category.courses == null || category.courses.Count == 0)
            {
                context.categories.Remove(category);
                context.SaveChanges();

                return Ok("Empty category deleted successfully");
            }
            else
            {
                return BadRequest("Cannot delete category because it contains courses");
            }
        }


        // 5. GET (List + Include): Get categories with associated courses
        [HttpGet("GetAllCategories")]
        public IActionResult GetAllCategories()
        {
            List<Category> categories = context.categories
                .Include(c => c.courses)
                .ToList();


            return Ok(categories);
        }









    }
}
