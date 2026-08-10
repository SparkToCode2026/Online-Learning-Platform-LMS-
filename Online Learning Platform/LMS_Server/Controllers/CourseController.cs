using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Models;
using LMS_Server.DTO;

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
        public IActionResult AddCourse([FromBody] CreateCourseDto dto)
        {
            var course = new Course
            {
                CourseName = dto.CourseName,
                CoursePrice = dto.CoursePrice,
                CategoryId = dto.CategoryId,
                InstructorId = dto.InstructorId
            };
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
            var courses = context.courses
                .Select(c => new CourseResponseDto
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    CoursePrice = c.CoursePrice,
                    CategoryId = c.CategoryId,
                    CategoryName = c.Category.CategoryName,
                    InstructorId = c.InstructorId,
                    InstructorName = c.InstructorProfile.user.UserName
                })
                .ToList();

            return Ok(courses);
        }

        // 6. GET: Get course details by CourseId
        [HttpGet("GetCourseById")]
        public IActionResult GetCourseById(int id)
        {
            var course = context.courses
                .Where(c => c.CourseId == id)
                .Select(c => new CourseResponseDto
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    CoursePrice = c.CoursePrice,
                    CategoryId = c.CategoryId,
                    CategoryName = c.Category.CategoryName,
                    InstructorId = c.InstructorId,
                    InstructorName = c.InstructorProfile.user.UserName
                })
                .FirstOrDefault();


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
            IQueryable<Course> query = context.courses;


            if (categoryId != null)
            {
                query = query.Where(c => c.CategoryId == categoryId);
            }


            if (maxPrice != null)
            {
                query = query.Where(c => c.CoursePrice <= maxPrice);
            }

            var courses = query.Select(c => new CourseResponseDto
            {
                CourseId = c.CourseId,
                CourseName = c.CourseName,
                CoursePrice = c.CoursePrice,
                CategoryId = c.CategoryId,
                CategoryName = c.Category.CategoryName,
                InstructorId = c.InstructorId,
                InstructorName = c.InstructorProfile.user.UserName
            }).ToList();


            return Ok(courses);
        }

        // 8. GET: Top 5 highest-priced courses
        [HttpGet("Top5ExpensiveCourses")]
        public IActionResult Top5ExpensiveCourses()
        {
            var courses = context.courses
                .OrderByDescending(c => c.CoursePrice)
                .Take(5)
                .Select(c => new CourseResponseDto
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    CoursePrice = c.CoursePrice,
                    CategoryId = c.CategoryId,
                    CategoryName = c.Category.CategoryName,
                    InstructorId = c.InstructorId,
                    InstructorName = c.InstructorProfile.user.UserName
                })
                .ToList();

            return Ok(courses);
        }





    }
}
