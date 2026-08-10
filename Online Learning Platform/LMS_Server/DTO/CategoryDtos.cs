namespace LMS_Server.DTO
{
    public record CreateCategoryDto
    {
        public string CategoryName { get; set; } = string.Empty;
    }
}
