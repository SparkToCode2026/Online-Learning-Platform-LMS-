using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.Models;
namespace LMS_Server.Controllers
{
    [ApiController]
    [Route("Category")]

    public class CategoryController : ControllerBase
    {
        private ProjectContext context;


        public CategoryController(ProjectContext _context)
        {
            context = _context;
        }
    }
}
