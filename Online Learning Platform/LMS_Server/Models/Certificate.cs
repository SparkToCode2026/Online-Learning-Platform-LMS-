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

        public int CertificateId { get; set; }
        public string CertificateCode { get; set; }
        public DateTime IssudAT { get; set; }

        //course relationship
        [JsonIgnore]
        public int CourseId { get; set; }
        public Course? course { get; set; }
    }
}
