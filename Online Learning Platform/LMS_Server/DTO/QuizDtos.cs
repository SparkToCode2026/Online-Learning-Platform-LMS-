namespace LMS_Server.DTO
{
    public record CreateQuizDto
    {
        public string QuizTitle { get; set; } = string.Empty;
        public double QuizScore { get; set; }
        public int CourseId { get; set; }
    }

    public record QuizResponseDto
    {
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public double QuizScore { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
    }
}
