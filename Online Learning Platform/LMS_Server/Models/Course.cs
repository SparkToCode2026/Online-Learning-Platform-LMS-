using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Course
    {
        [Key]
        [JsonIgnore]
        public int CourseId { get; set; } 

        [Required]
        public string CourseName { get; set; }

        [Required]
        public double CoursePrice { get; set; }

        // 1:M relationship with Enrollment
        [JsonIgnore]
        public List<Enrollment>? Enrollments { get; set; }

        // 1:M relationship with Assignment
        [JsonIgnore]
        public List<Assignment>? Assignments { get; set; }
    }
}
