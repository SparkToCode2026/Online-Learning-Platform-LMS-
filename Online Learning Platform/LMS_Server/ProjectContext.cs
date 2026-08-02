using LMS_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS_Server
{
    public class ProjectContext : DbContext
    {
        public DbSet<User> users { get; set; }

        public ProjectContext(DbContextOptions<ProjectContext> options) : base(options)
        {
        }
    }
}
