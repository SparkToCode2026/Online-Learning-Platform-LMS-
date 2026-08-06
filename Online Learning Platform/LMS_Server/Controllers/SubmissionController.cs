using Microsoft.AspNetCore.Mvc;

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


    }
}
