using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Assignment
    {

        [Key]
        [JsonIgnore]
        public int AssignmentId { get; set; }

        [Required]
        public string AssignmentTitle { get; set; }

        [Required]
        public DateTime DeadLine { get; set; }



        // 1:M relationship Have with Course 
        [ForeignKey("course")]
        [Required]
        public int CourseId { get; set; }
        public Course course { get; set; }


        // 1:M relationship has with Submission
        [JsonIgnore]
        public List<Submission>? Submissions { get; set; }

      
        
       

    }
}
