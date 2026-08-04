using System.ComponentModel.DataAnnotations.Schema;

namespace LMS_Server.Models
{
    public class Enrollment
    {


        // 1:M register relationship
        [ForeignKey("user")]
        public int UserId { get; set; }
        public User user { get; set; }
    }
}
