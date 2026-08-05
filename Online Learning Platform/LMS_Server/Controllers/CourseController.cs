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

    }
}
