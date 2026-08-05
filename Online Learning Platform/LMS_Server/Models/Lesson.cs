using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS_Server.Models;

public class Lesson
{
    [Key]
    public int LessonId { get; set; }

    [Required]
    public string LessonTitle { get; set; } 

    [Required]
    public string LessonURL { get; set; }


    // Foreign key that connects this lesson to one module.
    [Required]
    [ForeignKey("Module")]
    public int ModuleId { get; set; }
    public Module Module { get; set; }
}