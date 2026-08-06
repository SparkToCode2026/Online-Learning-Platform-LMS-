using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace LMS_Server.Controllers
{

    [Route("api/submission")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ProjectContext _context;

        public SubmissionController(ProjectContext context)
        {
            _context = context;
        }


        //Create new submission
        [HttpPost("CreateSubmission")]
        public async Task<IActionResult> CreateSubmission([FromBody] CreateSubmissionDto dto)
        {
            var submission = new Submission
            {
                SubmissionContent = dto.Content,
                SubmissionGrade = string.IsNullOrWhiteSpace(dto.Grade) ? "Pending" : dto.Grade,
                UserId = dto.UserId,
                AssignmentId = dto.AssignmentId
            };

            _context.submissions.Add(submission);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubmissionById), new { id = submission.SubmissionId }, submission);
        }

        //get submission by Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubmissionById(int id)
        {
            var submission = await _context.submissions
                .Include(s => s.user)
                .Include(s => s.assignment)
                .FirstOrDefaultAsync(s => s.SubmissionId == id);

            if (submission == null)
                return NotFound(new { Message = "Submission not found." });

            return Ok(submission);
        }


        //update of submission content
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubmission(int id, [FromBody] UpdateSubmissionDto dto)
        {
            var submission = await _context.submissions.FindAsync(id);
            if (submission == null)
                return NotFound(new { Message = "Submission not found." });

            submission.SubmissionContent = dto.Content;
            await _context.SaveChangesAsync();

            return Ok(submission);
        }


        //update of submission grade
        [HttpPatch("{id}/grade")]
        public async Task<IActionResult> GradeSubmission(int id, [FromBody] GradeSubmissionDto dto)
        {
            var submission = await _context.submissions.FindAsync(id);
            if (submission == null)
                return NotFound(new { Message = "Submission not found." });

            submission.SubmissionGrade = dto.Grade;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Grade updated successfully.", Grade = submission.SubmissionGrade });
        }


        //Delete submission
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubmission(int id)
        {
            var submission = await _context.submissions.FindAsync(id);
            if (submission == null)
                return NotFound(new { Message = "Submission not found." });

            _context.submissions.Remove(submission);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Submission deleted successfully." });
        }

        //get all submissions with user and assignment details
        [HttpGet]
        public async Task<IActionResult> GetAllSubmissions()
        {
            var submissions = await _context.submissions
                .Include(s => s.user)
                .Include(s => s.assignment)
                .Select(s => new SubmissionResponseDto(
                    s.SubmissionId,
                    s.SubmissionContent,
                    s.SubmissionGrade,
                    s.UserId,
                    s.user.UserName,
                    s.AssignmentId
                ))
                .ToListAsync();

            return Ok(submissions);
        }


        // get all submissions for a specific assignment with user details
        [HttpGet("assignment/{assignmentId}")]
        public async Task<IActionResult> GetSubmissionsByAssignment(int assignmentId)
        {
            var filteredSubmissions = await _context.submissions
                .Where(s => s.AssignmentId == assignmentId)
                .Include(s => s.user)
                .Select(s => new SubmissionResponseDto(
                    s.SubmissionId,
                    s.SubmissionContent,
                    s.SubmissionGrade,
                    s.UserId,
                    s.user.UserName,
                    s.AssignmentId
                ))
                .ToListAsync();

            return Ok(filteredSubmissions);
        }


        //Aggregate total counts, group by grade, and sort by Id
        [HttpGet("stats")]
        public async Task<IActionResult> GetSubmissionStats()
        {
            var totalCount = await _context.submissions.CountAsync();

            var gradeBreakdown = await _context.submissions
                .GroupBy(s => s.SubmissionGrade)
                .Select(g => new { Grade = g.Key, Count = g.Count() })
                .ToListAsync();

            var recentSubmissions = await _context.submissions
                .OrderByDescending(s => s.SubmissionId)
                .Take(5)
                .Select(s => new SubmissionResponseDto(
                    s.SubmissionId,
                    s.SubmissionContent,
                    s.SubmissionGrade,
                    s.UserId,
                    s.user.UserName,
                    s.AssignmentId
                ))
                .ToListAsync();

            return Ok(new
            {
                TotalSubmissions = totalCount,
                GradeDistribution = gradeBreakdown,
                LatestSubmissions = recentSubmissions
            });
        }

    }

    //Request DTOs
    public record CreateSubmissionDto(string Content, int UserId, int AssignmentId, string? Grade);
    public record UpdateSubmissionDto(string Content);
    public record GradeSubmissionDto(string Grade);

    // Response DTOs
    public record SubmissionResponseDto(
        int SubmissionId,
        string Content,
        string Grade,
        int UserId,
        string StudentName,
        int AssignmentId
    );
}
