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
        private readonly AppDbContext _context;

        public InstructorProfilesController(AppDbContext context)
        {
            _context = context;
        }
        // Case 1 (POST): Create a new record
        [HttpPost]
        public async Task<ActionResult<InstructorProfile>> Create(InstructorProfile profile)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.InstructorProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = profile.InstructorId }, profile);
        }


    }
}