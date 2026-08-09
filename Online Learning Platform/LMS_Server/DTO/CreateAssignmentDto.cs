using System.ComponentModel.DataAnnotations;

namespace LMS_Server.DTO
{
    public record CreateAssignmentDto
    {
        public string AssignmentTitle { get; set; } = string.Empty;
        public DateTime DeadLine { get; set; }
        public int CourseId { get; set; }
    }
}
