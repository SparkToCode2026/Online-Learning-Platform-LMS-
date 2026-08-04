using System.ComponentModel.DataAnnotations.Schema;

namespace LMS_Server.Models
{
    public class InstructorProfile
    {
        // 1:M create relationship
        [ForeignKey("user")]
        public int UserId { get; set; }
        public User user { get; set; }

        //primary Key
        public int InstructorId { get; set; }
        public string Biography { get; set; }


    }
}
