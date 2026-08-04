using LMS_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS_Server
{
    public class ProjectContext : DbContext
    {
        public DbSet<User> users { get; set; }
        public DbSet<InstructorProfile> instructorProfiles { get; set; }
        public DbSet<Category> categories { get; set; }
        public DbSet<Course> courses { get; set; }
        public DbSet<Module> modules { get; set; }
        public DbSet<Lesson> lessons { get; set; }
        public DbSet<Enrollment> enrollments { get; set; }
        public DbSet<Assignment> assignments { get; set; }
        public DbSet<Submission> submissions { get; set; }
        public DbSet<Quiz> quizzes { get; set; }
        public DbSet<QuizAttempt> quizAttempts { get; set; }
        public DbSet<Certificate> certificates { get; set; }

        public ProjectContext(DbContextOptions<ProjectContext> options) : base(options)
        {
        }
    }
}
