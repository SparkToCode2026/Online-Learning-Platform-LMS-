namespace LMS_Server.Models
{
    public class Course
    {
        public int CourseId { get; set; } // as a Primary key
        public string CourseName { get; set; }
        public double CoursePrice { get; set; }
    }
}
