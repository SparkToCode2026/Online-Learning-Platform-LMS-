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










    }
}
