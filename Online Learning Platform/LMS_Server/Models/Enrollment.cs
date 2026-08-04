using System.ComponentModel.DataAnnotations.Schema;

namespace LMS_Server.Models
{
    public class Enrollment
    {
        public int EnrollmentId { get; set; }
        public DateTime EnrolledAt { get; set; }
        public int EnrollmentStatus { get; set; }


        // 1:M register relationship
        [ForeignKey("user")]
        public int UserId { get; set; }
        public User user { get; set; }
    }
}
