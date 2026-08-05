using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS_Server.Controllers
{
    [ApiController]
    [Route("Course")]
    public class CourseController : ControllerBase
    {
        private ProjectContext context;

        public CourseController(ProjectContext _context)
        {
            context = _context;
        }

        // 1. POST: Create new course
        [HttpPost("AddCourse")]
        public IActionResult AddCourse(Course course)
        {
            context.courses.Add(course);
            context.SaveChanges();

            return Ok(course.CourseId);
        }


        // 2. PATCH: Update course title and price
        [HttpPatch("UpdateCourse")]
        public IActionResult UpdateCourse(int id, string title, double price)
        {
            Course course = context.courses.FirstOrDefault(c => c.CourseId == id);

            if (course != null)
            {
                course.CourseName = title;
                course.CoursePrice = price;

                context.SaveChanges();

                return Ok("Course updated successfully");
            }
            else
            {
                return NotFound("Course not found");
            }
        }

        // 3. PATCH (2nd): Update course category
        [HttpPatch("UpdateCourseCategory")]
        public IActionResult UpdateCourseCategory(int id, int categoryId)
        {
            Course course = context.courses.FirstOrDefault(c => c.CourseId == id);

            if (course != null)
            {
                course.CategoryId = categoryId;

                context.SaveChanges();

                return Ok("Course category updated successfully");
            }
            else
            {
                return NotFound("Course not found");
            }
        }



    }
}
