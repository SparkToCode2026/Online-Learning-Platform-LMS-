using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Controllers; 
using LMS_Server.Models;

namespace LMS_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CertificatesController(AppDbContext context)
        {
            _context = context;
        }

        // Case 1 (POST): Create a new record
        [HttpPost]
        public async Task<ActionResult<Certificate>> Create(Certificate certificate)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = certificate.CertificateId }, certificate);
        }

        // Case 2 (PUT/PATCH): Full Update
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Certificate certificate)
        {
            if (id != certificate.CertificateId) return BadRequest();

            _context.Entry(certificate).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 3 (PUT/PATCH): Distinct Update (Update Course FK assignment)
        [HttpPatch("{id}/reassign-course/{newCourseId}")]
        public async Task<IActionResult> ReassignCourse(int id, int newCourseId)
        {
            var cert = await _context.Certificates.FindAsync(id);
            if (cert == null) return NotFound();

            cert.CourseId = newCourseId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 4 (DELETE): Delete a record
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cert = await _context.Certificates.FindAsync(id);
            if (cert == null) return NotFound();

            _context.Certificates.Remove(cert);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 5 (GET list): Get all records with Include
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Certificate>>> GetAllWithRelations()
        {
            return await _context.Certificates
                .Include(c => c.User)
                .Include(c => c.Course)
                .ToListAsync();
        }

        // Case 6 (GET find): Get single record by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Certificate>> GetById(int id)
        {
            var cert = await _context.Certificates
                .Include(c => c.User)
                .Include(c => c.Course)
                .FirstOrDefaultAsync(c => c.CertificateId == id);

            if (cert == null) return NotFound();

            return cert;
        }

        // Case 7 (GET filter): Filter by issued date range or code
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Certificate>>> FilterByDate([FromQuery] DateTime startDate)
        {
            return await _context.Certificates
                .Where(c => c.IssuedAt >= startDate)
                .ToListAsync();
        }

        // Case 8 (GET sort/aggregate): Sort by IssuedAt and Count
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var count = await _context.Certificates.CountAsync();
            var latestCertificates = await _context.Certificates
                .OrderByDescending(c => c.IssuedAt)
                .ToListAsync();

            return Ok(new { TotalCertificates = count, Certificates = latestCertificates });
        }
    }
}