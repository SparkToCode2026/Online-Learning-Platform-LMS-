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




        // 1:M relationship with Enrollment
        [JsonIgnore]
        public List<Enrollment>? Enrollments { get; set; }



        // 1:M relationship HAVE with Assignment 
        [JsonIgnore]
        public List<Assignment>? Assignments { get; set; }
        

        // 1:M relationship with Module
        [JsonIgnore]
        public List<Module>? Modules { get; set; }


        //1:M relationship between Course & Category
        [ForeignKey("Category")]
        [Required]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }



        // 1:M relationship between Course & Quiz evaluate 
        [JsonIgnore]
        public List<Quiz>? Quizzes { get; set; }


        // 1:M relationship between Course & Certificate
        [JsonIgnore]
        public List<Certificate>? certificates { get; set; }


        // 1:M relationship between Course & InstructorProfile
        [ForeignKey("InstructorProfile")]
        [Required]
        public int InstructorId { get; set; }
        public InstructorProfile InstructorProfile { get; set; }



    }
}
