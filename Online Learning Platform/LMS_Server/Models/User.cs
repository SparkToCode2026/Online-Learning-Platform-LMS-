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

    }
}
