using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Controllers;
using LMS_Server.Models;
using LMS_Server.DTO;

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
        public async Task<ActionResult<InstructorProfile>> Create([FromBody] CreateInstructorProfileDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var profile = new InstructorProfile
            {
                Biography = dto.Biography,
                UserId = dto.UserId
            };

            _context.instructorProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { InstructorId = profile.InstructorId }, profile);
        }
        // Case 2 (PUT/PATCH): Full Update
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateInstructorProfileDto dto)
        {
            var profile = await _context.instructorProfiles.FindAsync(id);
            if (profile == null) return NotFound();

            profile.Biography = dto.Biography;
            profile.UserId = dto.UserId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 3 (PUT/PATCH): Distinct Update (Update Biography only)
        [HttpPatch("{id}/biography")]
        public async Task<IActionResult> UpdateBiography(int InstructorId, [FromBody] string newBio)
        {
            var profile = await _context.instructorProfiles.FindAsync(InstructorId);
            if (profile == null) return NotFound();

            profile.Biography = newBio;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 4 (DELETE): Delete a record
        [HttpDelete("{InstructorId}")]
        public async Task<IActionResult> Delete(int InstructorId)
        {
            var profile = await _context.instructorProfiles.FindAsync(InstructorId);
            if (profile == null) return NotFound();

            _context.instructorProfiles.Remove(profile);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Case 5 (GET list): Get all records with Include
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InstructorProfileResponseDto>>> GetAllWithUser()
        {
            return await _context.instructorProfiles
                .Select(p => new InstructorProfileResponseDto
                {
                    InstructorId = p.InstructorId,
                    Biography = p.Biography,
                    UserId = p.UserId,
                    UserFullName = p.user.UserName
                })
                .ToListAsync();
        }

        // Case 6 (GET find): Get a single record by Id
        [HttpGet("{InstructorId}")]
        public async Task<ActionResult<InstructorProfileResponseDto>> GetById(int InstructorId)
        {
            var profile = await _context.instructorProfiles
                .Where(p => p.InstructorId == InstructorId)
                .Select(p => new InstructorProfileResponseDto
                {
                    InstructorId = p.InstructorId,
                    Biography = p.Biography,
                    UserId = p.UserId,
                    UserFullName = p.user.UserName
                })
                .FirstOrDefaultAsync();

            if (profile == null) return NotFound();

            return profile;
        }

        // Case 7 (GET filter): Filter records using LINQ (Where)
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<InstructorProfileResponseDto>>> SearchByBio([FromQuery] string keyword)
        {
            return await _context.instructorProfiles
                .Where(p => p.Biography.Contains(keyword))
                .Select(p => new InstructorProfileResponseDto
                {
                    InstructorId = p.InstructorId,
                    Biography = p.Biography,
                    UserId = p.UserId,
                    UserFullName = p.user.UserName
                })
                .ToListAsync();
        }

        // Case 8 (GET sort/aggregate): Sort and aggregate (Count)
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalCount = await _context.instructorProfiles.CountAsync();
            var sortedProfiles = await _context.instructorProfiles
                .OrderByDescending(p => p.InstructorId)
                .Select(p => new InstructorProfileResponseDto
                {
                    InstructorId = p.InstructorId,
                    Biography = p.Biography,
                    UserId = p.UserId,
                    UserFullName = p.user.UserName
                })
                .ToListAsync();

            return Ok(new { TotalInstructors = totalCount, Profiles = sortedProfiles });
        }
    }


}
