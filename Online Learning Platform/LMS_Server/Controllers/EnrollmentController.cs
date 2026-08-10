
using LMS_Server.DTO;
using LMS_Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Models.Enums;
using System.Runtime.InteropServices;

namespace LMS_Server.Controllers
{
    [ApiController]
    [Route("Enrollment")]
    public class EnrollmentController : ControllerBase
    {

        private readonly ProjectContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        private readonly ILogger<EnrollmentController> _logger;

        public EnrollmentController(ProjectContext context, IJwtTokenService jwtTokenService, IEmailService emailService, ILogger<EnrollmentController> logger)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _logger = logger;
        }




        // 1. POST: Enrollment/EnrollStudent 
        [HttpPost("EnrollStudent")]
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
                return NotFound($"Course with ID {dto.CourseId} not found.");
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
                string subject = $"Enrollment Confirmation:  {course.CourseName}";
                string body = $"Welcome {User.UserName},\n You have successfully enrolled in the course '{course.CourseName}'.\n\nHappy Learning!";

                await _emailService.SendEmailAsync(User.UserEmail, subject, body);
            }
            catch (Exception ex)
            {
                // Log email sending failure without breaking the enrollment response
                _logger.LogError(ex, $"Failed to send enrollment email to {User.UserEmail}");
            }

            return Ok(new
            {
                Message = "Student enrolled successfully and confirmation email sent.",
                EnrollmentId = enrollment.EnrollmentId
            });

          
        }



        // 2. PATCH: Update enrollment status (Pending = 0, Active = 1, Completed = 2, Dropped = 3) based on the User ID.

        [HttpPatch("UpdateStatus/{id}")]
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


        // 3.PATCH: Enrollment/ExtendEnrollmentDateByUserID and CourseID
        [HttpPatch("ExtendDate")]
        public async Task<IActionResult> ExtendEnrollmentDateByUser([FromBody] ExtendEnrollmentDateDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid request payload.");
            }

            //  Validate that the new date is in the future
            if (dto.NewDate <= DateTime.UtcNow)
            {
                return BadRequest("The extension date must be in the future.");
            }

            //  Find the enrollment using UserId and CourseId
            var enrollment = await _context.enrollments.FirstOrDefaultAsync(e => e.UserId == dto.UserId && e.CourseId == dto.CourseId);

            if (enrollment == null)
            {
                return NotFound($"No active enrollment found for User ID {dto.UserId} in Course ID {dto.CourseId}.");
            }

            enrollment.EnrolledAt = dto.NewDate;
            await _context.SaveChangesAsync();

            // Send confirmation email about the extension

            var User = await _context.users.FindAsync(dto.UserId);
            var course = await _context.courses.FindAsync(dto.CourseId);
            if (User != null && !string.IsNullOrEmpty(User.UserEmail))
            {
                try
                {
                    string subject = $"Enrollment Confirmation:  {course.CourseName}";
                    string body = $"Welcome {User.UserName},\n You have successfully enrolled in the course '{course.CourseName}'.\n\nHappy Learning!";

                    await _emailService.SendEmailAsync(User.UserEmail, subject, body);
                }
                catch (Exception ex)
                {
                    // Log email sending failure without breaking the enrollment response
                    _logger.LogError(ex, $"Failed to send enrollment email to {User.UserEmail}");
                }

            }
            var statusEnum = (EnrollmentStatusEnum)enrollment.EnrollmentStatus;


            // return response       
            return Ok(new
            {
                Message = "Enrollment date successfully updated.",
                UserId = dto.UserId,
                CourseId = dto.CourseId,
                NewExtendedDate = enrollment.EnrolledAt,
                StatusName = statusEnum.ToString()
            });
        }


        // 4. DELETE: Enrollment/CancelEnrollment/{id}
        [HttpDelete("CancelEnrollment/{id}")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> CancelEnrollment(int id)
        {
            var enrolment = await _context.enrollments.FindAsync(id);
            if (enrolment == null)
                return NotFound(new ErrorResponseDto("Enrollment not found."));

            try
            {
                _context.enrollments.Remove(enrolment);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Enrollment cancelled successfully." });
            }

            catch (DbUpdateException ex)
            {
                // Catches foreign key constraint violations (e.g., related grade or submission records)
                _logger.LogError(ex, "Failed to delete enrollment due to database foreign key constraints.", id);
                return BadRequest(new ErrorResponseDto("An error occurred while cancelling the enrollment due to related records."));
            }
            catch (Exception ex)
            {
                // Catches unexpected errors
                _logger.LogError(ex, "An unexpected error occurred while deleting enrollment {Id}.", id);
                return StatusCode(500, new ErrorResponseDto("An unexpected error occurred on the server."));
            }
        }


        // 5. GET: Enrollment/GetEnrollmentsByCourse/{courseId}

        [HttpGet("GetEnrollmentsByCourse/{id}")]
        public async Task<IActionResult> GetEnrollmentsByCourse(int id)
        {
            var enrollments = await _context.enrollments
                .Where(e => e.CourseId == id)
                .Select(e => new EnrollmentResponseDto
                {
                    EnrollmentId = e.EnrollmentId,
                    UserId = e.UserId,
                    CourseId = e.CourseId,
                    EnrolledAt = e.EnrolledAt,
                    StatusName = ((EnrollmentStatusEnum)e.EnrollmentStatus).ToString()
                })
                .ToListAsync();
            if (enrollments == null)
            {
                return NotFound(new ErrorResponseDto("No enrollments found for the specified course."));
            }
            return Ok(enrollments);

        }


        // 6. GET (Find): Get enrollment by EnrollmentDate.
        [HttpGet("GetEnrollmentByEnrolledAt/{enrollmentDate}")]
        public async Task<IActionResult> GetEnrollmentByEnrolledAt(DateTime EnrollmentDate)
        {
            var enrollment = await _context.enrollments
                .Where(e => e.EnrolledAt == EnrollmentDate)
                .Select(e => new EnrollmentResponseDto
                {
                    EnrollmentId = e.EnrollmentId,
                    UserId = e.UserId,
                    CourseId = e.CourseId,
                    EnrolledAt = e.EnrolledAt,
                    StatusName = ((EnrollmentStatusEnum)e.EnrollmentStatus).ToString()
                })
                .FirstOrDefaultAsync();



            if (enrollment == null)
            {
                return NotFound(new ErrorResponseDto("Enrollment not found."));
            }
            return Ok(enrollment);


        }


        // 7. GET: Enrollment/GetEnrollmentsByUserId
        [HttpGet("GetEnrollmentsByUserId/{userId}")]
        public async Task<ActionResult> GetEnrollmentsByUserId(int userId)
        {
            var enrollments = await _context.enrollments
                .Where(e => e.UserId == userId)
                .Select(e => new EnrollmentResponseDto
                {
                    EnrollmentId = e.EnrollmentId,
                    UserId = e.UserId,
                    CourseId = e.CourseId,
                    EnrolledAt = e.EnrolledAt,
                    StatusName = ((EnrollmentStatusEnum)e.EnrollmentStatus).ToString()
                })
                .ToListAsync();

            return Ok(enrollments);
        }


        // 8 . GET Enrollment statistics by course (total enrollments for a specific course)

        [HttpGet("GetEnrollmentStatsByCourse/{courseId}")]
        public async Task<IActionResult> GetEnrollmentStatsByCourse(int courseId)
        {
            // Validate that the course exists
            var courseExists = await _context.courses.AnyAsync(c => c.CourseId == courseId);
            if (!courseExists)
            {
                return NotFound(new ErrorResponseDto($"Course with ID {courseId} not found."));
            }
            // Perform aggregation to count total enrollments for the specified course
            var enrollmentCount = await _context.enrollments
                .Where(e => e.CourseId == courseId)
                .CountAsync();
            return Ok(new
            {
                CourseId = courseId,
                TotalEnrollments = enrollmentCount
            });
        }


    }    
}
