namespace LMS_Server.DTO
{
    public record AssignmentResponseDto
    {
        public int AssignmentId { get; set; }
        public string AssignmentTitle { get; set; } = string.Empty;
        public DateTime DeadLine { get; set; }
        public int CourseId { get; set; }
        public List<SubmissionDto>? Submissions { get; set; }
    }
}
