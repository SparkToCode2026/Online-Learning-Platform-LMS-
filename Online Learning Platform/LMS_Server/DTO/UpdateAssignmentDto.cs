using System.ComponentModel.DataAnnotations;

namespace LMS_Server.DTO
{
    public record UpdateAssignmentDto
    {
        public string AssignmentTitle { get; set; } = string.Empty;

        public DateTime DeadLine { get; set; }
    }
}
