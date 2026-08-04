using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Submission
    {
        [Key]
        [JsonIgnore]
        public int SubmissionId { get; set; }

        [Required]
        public string SubmissionContent { get; set; }

        [Required]
        public string SubmissionGrade { get; set; }


        // 1:M submit relationship with User
        [ForeignKey("user")]
        [Required]
        public int UserId { get; set; }
        public User user { get; set; }



        // 1:M submit relationship with Assignment
        [ForeignKey("assignment")]
        [Required]
        public int AssignmentId { get; set; }
        public Assignment assignment { get; set; }

    }
}
