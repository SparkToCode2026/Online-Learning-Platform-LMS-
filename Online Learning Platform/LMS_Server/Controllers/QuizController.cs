using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.DTO;
namespace LMS_Server.Controllers
{
   [ApiController]
   [Route("Quiz")]
   public class QuizController : ControllerBase
   {
       private ProjectContext context;
       public QuizController(ProjectContext _context)
       {
           context = _context;
       }
       // 1. POST: Create new Quiz
       [HttpPost("AddQuiz")]
       public IActionResult AddQuiz([FromBody] CreateQuizDto dto)
       {
           var quiz = new Quiz
           {
               QuizTitle = dto.QuizTitle,
               QuizScore = dto.QuizScore,
               CourseId = dto.CourseId
           };
           context.quizzes.Add(quiz);
           context.SaveChanges();
           return Ok(quiz.QuizId);
       }

       // 2. PUT: Update Quiz title and score
       [HttpPut("UpdateQuiz")]
       public IActionResult UpdateQuiz(int id, string title, double score)
       {
           Quiz quiz = context.quizzes
               .FirstOrDefault(q => q.QuizId == id);
           if (quiz != null)
           {
               quiz.QuizTitle = title;
               quiz.QuizScore = score;
               context.SaveChanges();
               return Ok("Quiz updated successfully");
           }
           else
           {
               return NotFound("Quiz not found");
           }
       }

       // 3. PATCH: Update Quiz course
       [HttpPatch("UpdateQuizCourse")]
       public IActionResult UpdateQuizCourse(int id, int courseId)
       {
           Quiz quiz = context.quizzes
               .FirstOrDefault(q => q.QuizId == id);
           if (quiz != null)
           {
               quiz.CourseId = courseId;
               context.SaveChanges();
               return Ok("Quiz course updated successfully");
           }
           else
           {
               return NotFound("Quiz not found");
           }
       }

       // 4. DELETE: Delete Quiz
       [HttpDelete("DeleteQuiz")]
       public IActionResult DeleteQuiz(int id)
       {
           Quiz quiz = context.quizzes
               .FirstOrDefault(q => q.QuizId == id);
           if (quiz != null)
           {
               context.quizzes.Remove(quiz);
               context.SaveChanges();
               return Ok("Quiz deleted successfully");
           }
           else
           {
               return NotFound("Quiz not found");
           }
       }

       // 5. GET: Get all Quizzes with Course
       [HttpGet("GetAllQuizzes")]
       public IActionResult GetAllQuizzes()
       {
           List<Quiz> quizzes = context.quizzes
               .Include(q => q.course)
               .ToList();
           return Ok(quizzes);
       }

       // 6. GET: Get Quiz by QuizId
       [HttpGet("GetQuizById")]
       public IActionResult GetQuizById(int id)
       {
           Quiz quiz = context.quizzes
               .Include(q => q.course)
               .FirstOrDefault(q => q.QuizId == id);
           if (quiz != null)
           {
               return Ok(quiz);
           }
           else
           {
               return NotFound("Quiz not found");
           }
       }

       // 7. GET: Filter Quizzes by CourseId
       [HttpGet("FilterQuizzes")]
       public IActionResult FilterQuizzes(int courseId)
       {
           List<Quiz> quizzes = context.quizzes
               .Where(q => q.CourseId == courseId)
               .ToList();
           return Ok(quizzes);
       }

       // 8. GET: Sort Quizzes by highest score
       [HttpGet("SortedQuizzes")]
       public IActionResult SortedQuizzes()
       {
           List<Quiz> quizzes = context.quizzes
               .OrderByDescending(q => q.QuizScore)
               .ToList();
           return Ok(quizzes);
       }
   }
}
