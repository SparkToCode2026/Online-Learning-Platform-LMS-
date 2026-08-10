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

    public record InstructorProfileResponseDto
    {
        public int InstructorId { get; set; }
        public string Biography { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserFullName { get; set; } = string.Empty;
    }
}
