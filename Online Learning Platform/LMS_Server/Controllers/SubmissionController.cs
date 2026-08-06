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
