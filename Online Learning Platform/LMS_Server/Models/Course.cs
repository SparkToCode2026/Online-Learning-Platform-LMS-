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
        
        // 1:M relationship with Module
        [JsonIgnore]
        public List<Module> Modules { get; set; } = new();

        //1:M relationship between Course & Category
        [JsonIgnore]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        // 1:M relationship between Course & Quiz
        public List<Quiz>? Quizzes { get; set; } = new List<Quiz>();

        // 1:M relationship between Course & Assignment
        public List<Assignment>? Assignment { get; set; } = new List<Assignment>();


    }
}
