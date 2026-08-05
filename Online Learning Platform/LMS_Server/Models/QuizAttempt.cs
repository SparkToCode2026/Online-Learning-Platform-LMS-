using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class QuizAttempt
    {
        [Key]
        [JsonIgnore]
        public int QuizAttemptId { get; set; }
        [Required]
        public double Score { get; set; }
        [Required]
        public bool IsPassed { get; set; }


        // 1:M undertake relationship
        [ForeignKey("user")]
        [Required]
        public int UserId { get; set; }
        public User user { get; set; }


        // 1:M relationship with Quiz
        [ForeignKey("quiz")]
        [Required]
        public int QuizId { get; set; }
        public Quiz quiz { get; set; }
    }
}
