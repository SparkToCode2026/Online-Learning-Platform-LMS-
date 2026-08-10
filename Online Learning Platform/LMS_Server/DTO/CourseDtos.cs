namespace LMS_Server.DTO
{
    public record CreateCourseDto
    {
        public string CourseName { get; set; } = string.Empty;
        public double CoursePrice { get; set; }
        public int CategoryId { get; set; }
        public int InstructorId { get; set; }
    }

    public record CourseResponseDto
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public double CoursePrice { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int InstructorId { get; set; }
        public string InstructorName { get; set; } = string.Empty;
    }
}
