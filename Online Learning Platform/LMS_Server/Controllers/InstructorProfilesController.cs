using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Controllers;
using LMS_Server.Models;

namespace LMS_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorProfilesController : ControllerBase
    {
        private readonly ProjectContext _context;

        public InstructorProfilesController(ProjectContext context)
        {
            _context = context;
        }
        // Case 1 (POST): Create a new record
        [HttpPost]
        public async Task<ActionResult<InstructorProfile>> Create(InstructorProfile profile)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.instructorProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = profile.InstructorId }, profile);
        }
        // Case 2 (PUT/PATCH): Full Update
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, InstructorProfile profile)
        {
            if (id != profile.InstructorId) return BadRequest();

            _context.Entry(profile).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 3 (PUT/PATCH): Distinct Update (Update Biography only)
        [HttpPatch("{id}/biography")]
        public async Task<IActionResult> UpdateBiography(int id, [FromBody] string newBio)
        {
            var profile = await _context.instructorProfiles.FindAsync(id);
            if (profile == null) return NotFound();

            profile.Biography = newBio;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 4 (DELETE): Delete a record
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var profile = await _context.instructorProfiles.FindAsync(id);
            if (profile == null) return NotFound();

            _context.instructorProfiles.Remove(profile);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 5 (GET list): Get all records with Include
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InstructorProfile>>> GetAllWithUser()
        {
            return await _context.instructorProfiles
                .Include(p => p.user)
                .ToListAsync();
        }

        // Case 6 (GET find): Get a single record by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<InstructorProfile>> GetById(int id)
        {
            var profile = await _context.instructorProfiles
                .Include(p => p.user)
                .FirstOrDefaultAsync(p => p.InstructorId == id);

            if (profile == null) return NotFound();

            return profile;
        }

        // Case 7 (GET filter): Filter records using LINQ (Where)
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<InstructorProfile>>> SearchByBio([FromQuery] string keyword)
        {
            return await _context.instructorProfiles
                .Where(p => p.Biography.Contains(keyword))
                .ToListAsync();
        }

        // Case 8 (GET sort/aggregate): Sort and aggregate (Count)
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalCount = await _context.instructorProfiles.CountAsync();
            var sortedProfiles = await _context.instructorProfiles
                .OrderByDescending(p => p.InstructorId)
                .ToListAsync();

            return Ok(new { TotalInstructors = totalCount, Profiles = sortedProfiles });
        }
    }


}
