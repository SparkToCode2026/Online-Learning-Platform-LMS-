using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Controllers; 
using LMS_Server.Models;
using LMS_Server.DTO;

namespace LMS_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificatesController : ControllerBase
    {
        private readonly ProjectContext _context;

        public CertificatesController(ProjectContext context)
        {
            _context = context;
        }

        // Case 1 (POST): Create a new record
        [HttpPost]
        public async Task<ActionResult<Certificate>> Create([FromBody] CreateCertificateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var certificate = new Certificate
            {
                CertificateCode = dto.CertificateCode,
                IssudAT = dto.IssudAT,
                UserId = dto.UserId,
                CourseId = dto.CourseId
            };

            _context.certificates.Add(certificate);
            await _context.SaveChangesAsync();

            var responseDto = new CertificateResponseDto
            {
                CertificateId = certificate.CertificateId,
                CertificateCode = certificate.CertificateCode,
                IssudAT = certificate.IssudAT,
                UserId = certificate.UserId,
                CourseId = certificate.CourseId
            };

            return CreatedAtAction(nameof(GetById), new { CertificateId = certificate.CertificateId }, responseDto);
        }

        // Case 2 (PUT/PATCH): Full Update
        [HttpPut("{CertificateId}")]
        public async Task<IActionResult> Update(int CertificateId, [FromBody] UpdateCertificateDto dto)
        {
            var certificate = await _context.certificates.FindAsync(CertificateId);
            if (certificate == null) return NotFound();

            certificate.CertificateCode = dto.CertificateCode;
            certificate.IssudAT = dto.IssudAT;
            certificate.UserId = dto.UserId;
            certificate.CourseId = dto.CourseId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 3 (PUT/PATCH): Distinct Update (Update Course FK assignment)
        [HttpPatch("{CertificateId}/reassign-course/{newCourseId}")]
        public async Task<IActionResult> ReassignCourse(int CertificateId, int newCourseId)
        {
            var cert = await _context.certificates.FindAsync(CertificateId);
            if (cert == null) return NotFound();

            cert.CourseId = newCourseId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 4 (DELETE): Delete a record
        [HttpDelete("{CertificateId}")]
        public async Task<IActionResult> Delete(int CertificateId)
        {
            var cert = await _context.certificates.FindAsync(CertificateId);
            if (cert == null) return NotFound();

            _context.certificates.Remove(cert);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 5 (GET list): Get all records with Include
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CertificateResponseDto>>> GetAllWithRelations()
        {
            return await _context.certificates
                .Select(c => new CertificateResponseDto
                {
                    CertificateId = c.CertificateId,
                    CertificateCode = c.CertificateCode,
                    IssudAT = c.IssudAT,
                    UserId = c.UserId,
                    UserFullName = c.user.UserName,
                    CourseId = c.CourseId,
                    CourseName = c.course.CourseName
                })
                .ToListAsync();
        }

        // Case 6 (GET find): Get single record by Id
        [HttpGet("{CertificateId}")]
        public async Task<ActionResult<CertificateResponseDto>> GetById(int CertificateId)
        {
            var cert = await _context.certificates
                .Where(c => c.CertificateId == CertificateId)
                .Select(c => new CertificateResponseDto
                {
                    CertificateId = c.CertificateId,
                    CertificateCode = c.CertificateCode,
                    IssudAT = c.IssudAT,
                    UserId = c.UserId,
                    UserFullName = c.user.UserName,
                    CourseId = c.CourseId,
                    CourseName = c.course.CourseName
                })
                .FirstOrDefaultAsync();

            if (cert == null) return NotFound();

            return cert;
        }

        // Case 7 (GET filter): Filter by issued date range or code
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<CertificateResponseDto>>> FilterByDate([FromQuery] DateTime startDate)
        {
            return await _context.certificates
                .Where(c => c.IssudAT >= startDate)
                .Select(c => new CertificateResponseDto
                {
                    CertificateId = c.CertificateId,
                    CertificateCode = c.CertificateCode,
                    IssudAT = c.IssudAT,
                    UserId = c.UserId,
                    UserFullName = c.user.UserName,
                    CourseId = c.CourseId,
                    CourseName = c.course.CourseName
                })
                .ToListAsync();
        }

        // Case 8 (GET sort/aggregate): Sort by IssuedAt and Count
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var count = await _context.certificates.CountAsync();
            var latestCertificates = await _context.certificates
                .OrderByDescending(c => c.IssudAT)
                .Select(c => new CertificateResponseDto
                {
                    CertificateId = c.CertificateId,
                    CertificateCode = c.CertificateCode,
                    IssudAT = c.IssudAT,
                    UserId = c.UserId,
                    UserFullName = c.user.UserName,
                    CourseId = c.CourseId,
                    CourseName = c.course.CourseName
                })
                .ToListAsync();

            return Ok(new { TotalCertificates = count, Certificates = latestCertificates });
        }
    }
}