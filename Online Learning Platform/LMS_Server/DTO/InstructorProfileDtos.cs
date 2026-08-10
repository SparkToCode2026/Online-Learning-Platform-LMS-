namespace LMS_Server.DTO
{
    public record CreateInstructorProfileDto
    {
        public string Biography { get; set; } = string.Empty;
        public int UserId { get; set; }
    }

    public record UpdateInstructorProfileDto
    {
        public string Biography { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}
