namespace LMS_Server.DTO
{
    public record CreateQuizAttemptDto
    {
        public double Score { get; set; }
        public bool IsPassed { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
    }
}
