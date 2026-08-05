
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class InstructorProfile
    {

        
        [Key]
        [JsonIgnore]
        public int InstructorId { get; set; }
        [Required]
        public string Biography { get; set; }


        // 1:M create relationship
        [ForeignKey("user")]
        [Required]
        public int UserId { get; set; }
        public User user { get; set; }


        // 1:M teach relationship
        [JsonIgnore]
        public List<Course>? Courses { get; set; }

    }
}
