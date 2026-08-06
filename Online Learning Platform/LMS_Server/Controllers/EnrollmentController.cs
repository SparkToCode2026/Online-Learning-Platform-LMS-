
using LMS_Server.DTO;
using LMS_Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Models.Enums;

namespace LMS_Server.Controllers
{
    [ApiController]
    [Route("Enrollment")]
    public class EnrollmentController : ControllerBase
    {

        private readonly ProjectContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        private readonly ILogger<UserController> _logger;

        public EnrollmentController(ProjectContext context, IJwtTokenService jwtTokenService, IEmailService emailService, ILogger<UserController> logger)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _logger = logger;
        }




        // 1. POST: Enrollment/EnrollStudent 
        [HttpPost("EnrollStudent")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> EnrollStudent([FromBody] EnrollmentRequestDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid enrollment payload.");
            }

            //  Verify that the user exists
            var User = await _context.users.FindAsync(dto.StudentId);
            if (User == null)
            {
                return NotFound($"Student with ID {dto.StudentId} not found.");
            }

            //  Verify that the course exists
            var course = await _context.courses.FindAsync(dto.CourseId);
            if (course == null)
            {
                return NotFound("Course with ID {dto.CourseId} not found.");
            }

            //  Prevent duplicate enrollment
            var existingEnrollment = await _context.enrollments
                .FirstOrDefaultAsync(e => e.UserId == dto.StudentId && e.CourseId == dto.CourseId);

            if (existingEnrollment != null)
            {
                return BadRequest("Student is already enrolled in this course.");
            }

            //  Create and save the new enrollment entity
            var enrollment = new Enrollment
            {
                UserId = dto.StudentId,
                CourseId = dto.CourseId,
                EnrolledAt = DateTime.UtcNow
            };

            _context.enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            // Trigger enrollment confirmation email using the email service (.SendEmailAsync)
            try
            {
                string subject = "Enrollment Confirmation: {course.CourseName}";
                string body = "Welcome {student.UserName},\n You have successfully enrolled in the course '{course.CourseName}'.\n\nHappy Learning!";

                await _emailService.SendEmailAsync(User.UserEmail, subject, body);
            }
            catch (Exception ex)
            {
                // Log email sending failure without breaking the enrollment response
                _logger.LogError(ex, "Failed to send enrollment email to {Email}", User.UserEmail);
            }

            return Ok(new
            {
                Message = "<H1>Student enrolled successfully and confirmation email sent.</H1>",
                EnrollmentId = enrollment.EnrollmentId
            });

            //Generate JWT token 
            var token = _jwtTokenService.GenerateToken(
                User.UserId.ToString(),
                User.UserEmail,
                User.UserRole
            );
        }



        // 2. Update enrollment status (Pending = 0, Active = 1, Completed = 2, Dropped = 3).

        [HttpPatch("UpdateStatus/{enrollmentId}")]
        [Authorize(Roles = "Instructor")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateEnrollmentStatusDto dto)
    {
        //  Validate if the integer exists in your enum definition
        if (!Enum.IsDefined(typeof(EnrollmentStatusEnum), dto.EnrollmentStatus))
        {
            return BadRequest("Invalid status. Allowed values: 0 (Pending), 1 (Active), 2 (Completed), 3 (Dropped).");
        }
            //  Find the enrollment by ID
            var enrollment = await _context.enrollments.FindAsync(id);
        if (enrollment == null)
        {
            return NotFound("Enrollment not found.");
        }

        //  Assign integer value to model
        enrollment.EnrollmentStatus = dto.EnrollmentStatus;
        await _context.SaveChangesAsync();

        //  Return response with both numeric code and readable name
        var statusOfEnum = (EnrollmentStatusEnum)enrollment.EnrollmentStatus;

        return Ok(new
        {
            Message = "Status updated successfully.",
            StatusCode = enrollment.EnrollmentStatus,
            StatusName = statusOfEnum.ToString() 
        });
    }

}
}
