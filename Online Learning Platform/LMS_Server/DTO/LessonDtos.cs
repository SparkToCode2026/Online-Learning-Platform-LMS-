namespace LMS_Server.DTO
{
    public record CreateLessonDto
    {
        public string LessonTitle { get; set; } = string.Empty;
        public string LessonURL { get; set; } = string.Empty;
        public int ModuleId { get; set; }
    }

    public record UpdateLessonDto
    {
        public string LessonTitle { get; set; } = string.Empty;
        public string LessonURL { get; set; } = string.Empty;
        public int ModuleId { get; set; }
    }
}
