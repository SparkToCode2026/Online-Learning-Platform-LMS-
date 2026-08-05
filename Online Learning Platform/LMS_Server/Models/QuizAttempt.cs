using System.ComponentModel.DataAnnotations.Schema;

namespace LMS_Server.Models
{
    public class QuizAttempt
    {
        // 1:M undertake relationship
        [ForeignKey("user")]
        public int UserId { get; set; }
        public User user { get; set; }

        // 1:M log relationship 
    }
}
