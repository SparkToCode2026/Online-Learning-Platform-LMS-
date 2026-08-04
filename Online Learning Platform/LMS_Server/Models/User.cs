namespace LMS_Server.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public string UserRole { get; set; }


        // 1:M submit relationship
        public List<Submission> submissions { get; set; }


        // 1:M register relationship
        public List<Enrollment> enrollments { get; set; }

        // 1:M Earn relationship
        public List<Certificate> certificates { get; set; }


        // 1:M undertake relationship
        public List<QuizAttempt> quizAttempts { get; set; }

        // 1:1 create relationship
        public InstructorProfile instructorProfile { get; set; }
    }
}
