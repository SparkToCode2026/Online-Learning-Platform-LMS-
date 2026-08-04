using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Module
    {


        // 1:M relationship with Course
        public int CourseId { get; set; }
        public Course? Course { get; set; }



    }
}
