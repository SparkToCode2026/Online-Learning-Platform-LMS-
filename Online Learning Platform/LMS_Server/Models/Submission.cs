using System.ComponentModel.DataAnnotations.Schema;

namespace LMS_Server.Models
{
    public class Submission
    {
        public int SubmissionId { get; set; }
        public string SubmissionContent { get; set; }
        public string SubmissionGrade { get; set; }


        // 1:M submit relationship
        [ForeignKey("user")]
        public int UserId { get; set; }
        public User user { get; set; }
    }
}
