namespace LMS_Server.DTO
{
    public record CreateQuizAttemptDto
    {
        public double Score { get; set; }
        public bool IsPassed { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
    }

    public record QuizAttemptResponseDto
    {
        public int QuizAttemptId { get; set; }
        public double Score { get; set; }
        public bool IsPassed { get; set; }
        public int UserId { get; set; }
        public string UserFullName { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
    }
}
