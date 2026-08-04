using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class User
    {
        [Key]
        [JsonIgnore]
        public int UserId { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string UserEmail { get; set; }

        [Required]
        public string UserPassword { get; set; }

        [Required]
        public string UserRole { get; set; }


        // 1:M submit relationship
        [JsonIgnore]
        public List<Submission>? submissions { get; set; }


        // 1:M register relationship
        [JsonIgnore]
        public List<Enrollment>? enrollments { get; set; }

        // 1:M Earn relationship
        [JsonIgnore]
        public List<Certificate>? certificates { get; set; }


        // 1:M undertake relationship
        [JsonIgnore]
        public List<QuizAttempt>? quizAttempts { get; set; }

        // 1:1 create relationship
        [JsonIgnore]
        public InstructorProfile? instructorProfile { get; set; }
    }
}
