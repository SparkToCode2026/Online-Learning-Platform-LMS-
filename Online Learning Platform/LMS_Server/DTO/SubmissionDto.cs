namespace LMS_Server.DTO
{
    public record SubmissionDto
    {
        public string SubmissionContent { get; set; } = string.Empty;
        public string SubmissionGrade { get; set; } = string.Empty;


    }
}
