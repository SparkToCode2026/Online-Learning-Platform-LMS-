using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace LMS_Server.Controllersi
{

    [ApiController]
    [Route("QuizAttempt")]
    public class QuizAttemptController : ControllerBase

    {

        private ProjectContext context;
        public QuizAttemptController(ProjectContext _context)

        {

            context = _context;

        }

        // 1. POST: Create new Quiz Attempt

        [HttpPost("AddQuizAttempt")]
        public IActionResult AddQuizAttempt(QuizAttempt quizAttempt)

        {

            context.quizAttempts.Add(quizAttempt);
            context.SaveChanges();
            return Ok(quizAttempt.QuizAttemptId);

        }


        // 2. PUT: Update Quiz Attempt score and pass status

        [HttpPut("UpdateQuizAttempt")]
        public IActionResult UpdateQuizAttempt(int id, double score, bool isPassed)

        {

            QuizAttempt quizAttempt = context.quizAttempts
                .FirstOrDefault(q => q.QuizAttemptId == id);

            if (quizAttempt != null)
            {

                quizAttempt.Score = score;
                quizAttempt.IsPassed = isPassed;
                context.SaveChanges();
                return Ok("Quiz attempt updated successfully");

            }

            else

            {

                return NotFound("Quiz attempt not found");

            }

        }


        // 3. PATCH: Update Quiz Attempt User

        [HttpPatch("UpdateQuizAttemptUser")]
        public IActionResult UpdateQuizAttemptUser(int id, int userId)

        {

            QuizAttempt quizAttempt = context.quizAttempts

                .FirstOrDefault(q => q.QuizAttemptId == id);
            if (quizAttempt != null)

            {

                quizAttempt.UserId = userId;
                context.SaveChanges();
                return Ok("Quiz attempt user updated successfully");

            }

            else

            {

                return NotFound("Quiz attempt not found");

            }

        }


        // 4. DELETE: Delete Quiz Attempt

        [HttpDelete("DeleteQuizAttempt")]
        public IActionResult DeleteQuizAttempt(int id)

        {

            QuizAttempt quizAttempt = context.quizAttempts
                .FirstOrDefault(q => q.QuizAttemptId == id);

            if (quizAttempt != null)

            {

                context.quizAttempts.Remove(quizAttempt);
                context.SaveChanges();
                return Ok("Quiz attempt deleted successfully");

            }

            else

            {

                return NotFound("Quiz attempt not found");

            }

        }


        // 5. GET: Get all Quiz Attempts with User and Quiz

        [HttpGet("GetAllQuizAttempts")]
        public IActionResult GetAllQuizAttempts()

        {

            List<QuizAttempt> quizAttempts = context.quizAttempts

                .Include(q => q.user)
                .Include(q => q.quiz)
                .ToList();

            return Ok(quizAttempts);

        }


        // 6. GET: Get Quiz Attempt by Id

        [HttpGet("GetQuizAttemptById")]
        public IActionResult GetQuizAttemptById(int id)

        {

            QuizAttempt quizAttempt = context.quizAttempts

                .Include(q => q.user)
                .Include(q => q.quiz)
                .FirstOrDefault(q => q.QuizAttemptId == id);

            if (quizAttempt != null)

            {

                return Ok(quizAttempt);

            }

            else

            {

                return NotFound("Quiz attempt not found");

            }

        }


        // 7. GET: Filter Quiz Attempts by QuizId

        [HttpGet("FilterQuizAttempts")]
        public IActionResult FilterQuizAttempts(int quizId)

        {

            List<QuizAttempt> quizAttempts = context.quizAttempts
                .Where(q => q.QuizId == quizId)
                .ToList();
            return Ok(quizAttempts);

        }


        // 8. GET: Sort Quiz Attempts by highest score

        [HttpGet("SortedQuizAttempts")]
        public IActionResult SortedQuizAttempts()

        {

            List<QuizAttempt> quizAttempts = context.quizAttempts
                .OrderByDescending(q => q.Score)
                .ToList();
            return Ok(quizAttempts);

        }

    }

}
 