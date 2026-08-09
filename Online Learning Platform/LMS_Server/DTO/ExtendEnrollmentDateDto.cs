namespace LMS_Server.DTO
{
    public record ExtendEnrollmentDateDto
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public DateTime NewDate { get; set; }
    }
}
