using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Models;

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

        // 4. DELETE: Delete a course
        [HttpDelete("DeleteCourse")]
        public IActionResult DeleteCourse(int id)
        {
            Course course = context.courses.FirstOrDefault(c => c.CourseId == id);

            if (course != null)
            {
                context.courses.Remove(course);
                context.SaveChanges();

                return Ok("Course successfully deleted");
            }
            else
            {
                return NotFound("Course not found");
            }
        }

        // 5. GET: Get all courses with Category and Instructor
        [HttpGet("GetAllCourses")]
        public IActionResult GetAllCourses()
        {
            List<Course> courses = context.courses
                .Include(c => c.Category)
                .Include(c => c.InstructorProfile)
                .ToList();

            return Ok(courses);
        }

        // 6. GET: Get course details by CourseId
        [HttpGet("GetCourseById")]
        public IActionResult GetCourseById(int id)
        {
            Course course = context.courses
                .Include(c => c.Category)
                .Include(c => c.InstructorProfile)
                .FirstOrDefault(c => c.CourseId == id);


            if (course != null)
            {
                return Ok(course);
            }
            else
            {
                return NotFound("Course not found");
            }
        }

        // 7. GET: Filter courses by CategoryId or Max Price
        [HttpGet("FilterCourses")]
        public IActionResult FilterCourses(int? categoryId, double? maxPrice)
        {
            IQueryable<Course> courses = context.courses;


            if (categoryId != null)
            {
                courses = courses.Where(c => c.CategoryId == categoryId);
            }


            if (maxPrice != null)
            {
                courses = courses.Where(c => c.CoursePrice <= maxPrice);
            }


            return Ok(courses.ToList());
        }

        // 8. GET: Top 5 highest-priced courses
        [HttpGet("Top5ExpensiveCourses")]
        public IActionResult Top5ExpensiveCourses()
        {
            List<Course> courses = context.courses
                .OrderByDescending(c => c.CoursePrice)
                .Take(5)
                .ToList();

            return Ok(courses);
        }





    }
}
