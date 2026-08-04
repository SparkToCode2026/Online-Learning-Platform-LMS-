using System.ComponentModel.DataAnnotations.Schema;

namespace LMS_Server.Models
{
    public class Certificate
    {

        // 1:M Earn relationship
        [ForeignKey("user")]
        public int UserId { get; set; }
        public User user { get; set; }

        
    }
}
