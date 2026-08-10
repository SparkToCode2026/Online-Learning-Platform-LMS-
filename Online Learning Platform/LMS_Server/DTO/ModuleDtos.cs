namespace LMS_Server.DTO
{
    public record CreateModuleDto
    {
        public string ModuleName { get; set; } = string.Empty;
        public int OrderNumber { get; set; }
        public int CourseId { get; set; }
    }

    public record ModuleResponseDto
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; } = string.Empty;
        public int OrderNumber { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
    }
}
