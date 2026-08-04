using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models;

public class Module
{
    [Key]
    [JsonIgnore]
    public int ModuleId { get; set; }

    [Required]
    public string ModuleName { get; set; } = string.Empty;

    // Foreign key that connects this module to one course.
    [Required]
    [ForeignKey("Course")]
    public int CourseId { get; set; }

    public Course Course { get; set; }

    // One module can contain many lessons.
    [JsonIgnore]
    public List<Lesson>? Lessons { get; set; }
}