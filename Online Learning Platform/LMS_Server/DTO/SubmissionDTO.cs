namespace LMS_Server.DTO
{
    // REQUEST DTOs
    public record CreateSubmissionDto(string Content, int UserId, int AssignmentId, string? Grade);
    public record UpdateSubmissionDto(string Content);
    public record GradeSubmissionDto(string Grade);

    public record SubmissionDto
    {
        public string SubmissionContent  = string.Empty;
        public string SubmissionGrade  = string.Empty;
    }

    // RESPONSE DTOs
    public record SubmissionResponseDto(
        int SubmissionId,
        string Content,
        string Grade,
        int UserId,
        string StudentName,
        int AssignmentId
    );
}
