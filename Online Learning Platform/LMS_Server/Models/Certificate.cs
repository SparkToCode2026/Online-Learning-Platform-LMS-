using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Certificate
    {

        // 1:M Earn relationship
        [ForeignKey("user")]
        public int UserId { get; set; }
        public User user { get; set; }


        // 1:M Relationship with Course
        public int CourseId { get; set; }
        [JsonInclude]
        public Course? Course { get; set; }
    }
}
