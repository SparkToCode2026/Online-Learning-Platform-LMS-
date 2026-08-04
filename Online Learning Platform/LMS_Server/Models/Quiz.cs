using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Quiz
    {






        // 1:M relationship between Course & Quiz
        [JsonIgnore]
        public int CourseId { get; set; }
        public Course? Course { get; set; }



    }
}
