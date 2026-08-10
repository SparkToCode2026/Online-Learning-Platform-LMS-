namespace LMS_Server.DTO
{
    public record EnrollmentResponseDto
    {
        public int EnrollmentId { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public DateTime EnrolledAt { get; set; }
        public string StatusName { get; set; } = string.Empty;
    }
}
