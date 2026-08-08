namespace LMS_Server.DTOs
{
    // REQUEST DTOs
    public record RegisterDto(string Email, string Password, string FullName, string? Role);
    public record LoginDto(string Email, string Password);
    public record UpdateUserDto(string FullName, string Email);
    public record UpdateRoleDto(string Role);

    // RESPONSE DTOs
    public record UserResponseDto(int Id, string Email, string FullName, string Role);
    public record AuthResponseDto(string Token, UserResponseDto User, string Message);
    public record ErrorResponseDto(string Message);
}