using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Quiz
    {






        // 1:M relationship between Course & Quiz
        [ForeignKey("Course")]
        public int CourseId { get; set; }
        public Course Course { get; set; }

        // 1:M relationship between Quiz & QuizAttempt LSIE>

    }
}
