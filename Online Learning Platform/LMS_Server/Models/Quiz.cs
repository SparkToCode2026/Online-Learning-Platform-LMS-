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
        [Required]
        public string QuizTitle { get; set; }
        [Required]
        public double QuizScore { get; set; }


        // 1:M relationship with Course
        [ForeignKey("course")]
        [Required]
        public int CourseId { get; set; }
        public Course course { get; set; }


        // 1:M relationship with QuizAttempt
        [JsonIgnore]
        public List<QuizAttempt>? QuizAttempts { get; set; }
    }
}

