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

    }
}