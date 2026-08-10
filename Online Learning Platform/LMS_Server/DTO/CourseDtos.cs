namespace LMS_Server.DTO
{
    public record CreateCourseDto
    {
        public string CourseName { get; set; } = string.Empty;
        public double CoursePrice { get; set; }
        public int CategoryId { get; set; }
        public int InstructorId { get; set; }
    }
}
