namespace LMS_Server.DTO
{
    public record CreateCategoryDto
    {
        public string CategoryName { get; set; } = string.Empty;
    }

    public record CategoryResponseDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}
