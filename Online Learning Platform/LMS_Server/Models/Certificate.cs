using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Certificate
    {
        [Key]
        [JsonIgnore]
        public int CertificateId { get; set; }

        [Required]
        public string CertificateCode { get; set; }

        [Required]
        public DateTime IssudAT { get; set; }



        // 1:M Earn relationship
        [ForeignKey("User")]
        [Required]
        public int UserId { get; set; }
        public User user { get; set; }



        //1:M give relationship With course 
        [ForeignKey("course")]
        [Required]
        public int CourseId { get; set; }
        public Course course { get; set; }
    }
}

