using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Certificate
    {
        [Key]
        public int CertificateId { get; set; }

        [Required]
        public string CertificateCode { get; set; } = string.Empty;

        [Required]
        public DateTime IssuedAt { get; set; }

        // 1:M Relationship with User
        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        [JsonIgnore]
        public User? User { get; set; }

        // 1:M Relationship with Course
        [Required]
        public int CourseId { get; set; }

        [ForeignKey("CourseId")]
        [JsonIgnore]
        public Course? Course { get; set; }
    }
}

