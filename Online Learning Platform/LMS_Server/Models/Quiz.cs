using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace LMS_Server.Models
{
    public class Quiz
    {
        [Key]
        [JsonIgnore]
        public int QuizId { get; set; }





        // 1:M relationship with Course
        [ForeignKey("Course")]
        public int CourseId { get; set; }
        public Category category { get; set; } 



    }





}
