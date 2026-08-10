using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.DTO;
using Microsoft.AspNetCore.Authorization;

namespace LMS_Server.Controllers
{
    [ApiController]
    [Route("AssignmentController")]
    public class AssignmentController : ControllerBase
    {
        private readonly ProjectContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        private readonly ILogger<UserController> _logger;

        public AssignmentController(ProjectContext context, IJwtTokenService jwtTokenService, IEmailService emailService, ILogger<UserController> logger)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _logger = logger;
        }


        // 1. POST: Create course assignment
        [HttpPost("CreateAssignment")]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentDto dto)
        {
            if (dto.DeadLine <= DateTime.Now)
                return BadRequest("Deadline must be in the future.");

            var courseExists = await _context.courses.AnyAsync(c => c.CourseId == dto.CourseId);
            if (!courseExists)
                return NotFound($"Course with ID {dto.CourseId} does not exist.");

            var assignment = new Assignment
            {
                AssignmentTitle = dto.AssignmentTitle,
                DeadLine = dto.DeadLine,
                CourseId = dto.CourseId
            };

            _context.assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return Ok(assignment);
        }


        // 2. PUT: Update assignment title and deadline
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAssignmentDto dto)
        {
            var assignment = await _context.assignments.FindAsync(id);
            if (assignment == null)
                return NotFound("Assignment not found.");

            assignment.AssignmentTitle = dto.AssignmentTitle;
            assignment.DeadLine = dto.DeadLine;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 3. PATCH: Extend deadline date
        [HttpPatch("{id}/extend-deadline")]
        public async Task<IActionResult> ExtendDeadline(int id, [FromBody] ExtendDeadlineDto dto)
        {
            var assignment = await _context.assignments.FindAsync(id);
            if (assignment == null)
                return NotFound("Assignment not found.");

            if (dto.NewDeadline <= assignment.DeadLine)
                return BadRequest("New deadline must be later than the current deadline.");

            assignment.DeadLine = dto.NewDeadline;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Deadline updated successfully", newDeadline = assignment.DeadLine });
        }


        // 4. DELETE: Delete assignment
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var assignment = await _context.assignments.FindAsync(id);
            if (assignment == null)
                return NotFound("Assignment not found.");

            _context.assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 5. GET (List + Include): Get assignments with submissions
        [HttpGet("with-submissions")]
        public async Task<IActionResult> GetWithSubmissions()
        {
            var result = await _context.assignments
                .Include(a => a.Submissions)
                .Select(a => new AssignmentResponseDto
                {
                    AssignmentId = a.AssignmentId,
                    AssignmentTitle = a.AssignmentTitle,
                    DeadLine = a.DeadLine,
                    CourseId = a.CourseId,
                    Submissions = a.Submissions != null ? a.Submissions.Select(s => new SubmissionDto
                    {
                        SubmissionContent = s.SubmissionContent,
                        SubmissionGrade = s.SubmissionGrade
                    }).ToList()
                        : null
                })
                .ToListAsync();

            return Ok(result);
        }


        // 6. GET: Get assignment by ID 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var assignment = await _context.assignments
                .Where(a => a.AssignmentId == id)
                .Select(a => new AssignmentResponseDto
                {
                    AssignmentId = a.AssignmentId,
                    AssignmentTitle = a.AssignmentTitle,
                    DeadLine = a.DeadLine,
                    CourseId = a.CourseId
                })
                .FirstOrDefaultAsync();

            if (assignment == null)
                return NotFound("Assignment not found.");
            return Ok(assignment);
        }

        // 7. GET: Get all assignments
        [HttpGet("GetAssignmentsAll")]
        public async Task<IActionResult> GetAssignmentsAll()
        {
            var assignments = await _context.assignments
                .Select(a => new AssignmentResponseDto
                {
                    AssignmentId = a.AssignmentId,
                    AssignmentTitle = a.AssignmentTitle,
                    DeadLine = a.DeadLine,
                    CourseId = a.CourseId
                })
                .ToListAsync();
            return Ok(assignments);
        }



        // 8. GET (Sort/Aggregate): Sort assignments by closest deadline
        [HttpGet("sorted-by-deadline")]
        public async Task<IActionResult> GetSortedByDeadline()
        {
            var sorted = await _context.assignments
                .OrderBy(a => a.DeadLine)
                .Select(a => new AssignmentResponseDto
                {
                    AssignmentId = a.AssignmentId,
                    AssignmentTitle = a.AssignmentTitle,
                    DeadLine = a.DeadLine,
                    CourseId = a.CourseId
                })
                .ToListAsync();

            return Ok(sorted);
        }

    }
}   
