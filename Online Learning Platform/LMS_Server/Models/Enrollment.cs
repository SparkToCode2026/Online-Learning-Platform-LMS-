using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Enrollment
    {
        [Key]
        [JsonIgnore]
        public int EnrollmentId { get; set; }

        [Required]
        public DateTime EnrolledAt { get; set; }

        [Required]
        public int EnrollmentStatus { get; set; }


        // 1:M register relationship
        [ForeignKey("user")]
        [Required]
        public int UserId { get; set; }
        public User user { get; set; }

        // 1:M Receive relationship with Enrollment
        [ForeignKey("course")]
        [Required]
        public int CourseId { get; set; }
        public Course course { get; set; }
    }
}
