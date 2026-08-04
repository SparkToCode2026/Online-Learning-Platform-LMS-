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


        // 1:M submit relationship
        [ForeignKey("user")]
        [Required]
        public int UserId { get; set; }


        [JsonIgnore]
        public User? user { get; set; }
    }
}
