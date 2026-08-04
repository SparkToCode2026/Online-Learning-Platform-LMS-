using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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


        //1:M relationship with Course
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        
        // 1:M relationship with Quiz
        public List<Quiz>? Quizzes { get; set; }

        // 1:M relationship with Module
        public List<Module>? Modules { get; set; }


        // 1:M relationship with Enrollment
        [JsonIgnore]
        public List<Enrollment>? Enrollments { get; set; }

        // 1:M relationship with Assignment
        [JsonIgnore]
        public List<Assignment>? Assignments { get; set; }

        


    }
}
