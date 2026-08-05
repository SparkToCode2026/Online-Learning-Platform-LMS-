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








    }
}
