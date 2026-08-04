using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LMS_Server.Models
{
    public class Category
    {
        [Key]
        [JsonIgnore]
        public int CategoryId { get; set; } // as a Primary key

        [Required]
        public string CategoryName { get; set; }


        // 1:M relationship between Course & Category
        // Navigation Property
        public List<Course>? courses { get; set; }
        
      
    }
}
