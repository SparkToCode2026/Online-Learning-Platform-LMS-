namespace LMS_Server.DTO
{
    public record CreateQuizDto
    {
        public string QuizTitle { get; set; } = string.Empty;
        public double QuizScore { get; set; }
        public int CourseId { get; set; }
    }
}
