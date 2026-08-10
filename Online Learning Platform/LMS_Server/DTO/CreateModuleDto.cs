namespace LMS_Server.DTO;

public class CreateModuleDto
{
    public string ModuleName { get; set; } = string.Empty;
    public int OrderNumber { get; set; }
    public int CourseId { get; set; }
}