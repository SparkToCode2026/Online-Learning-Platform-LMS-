using System;

namespace LMS_Server.DTO
{
    public record CreateCertificateDto
    {
        public string CertificateCode { get; set; } = string.Empty;
        public DateTime IssudAT { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
    }

    public record UpdateCertificateDto
    {
        public string CertificateCode { get; set; } = string.Empty;
        public DateTime IssudAT { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
    }
}
