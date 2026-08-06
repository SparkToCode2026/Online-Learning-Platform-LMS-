using BCrypt.Net;
using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS_Server.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ProjectContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        private readonly ILogger<UserController> _logger;

        public UserController(ProjectContext context, IJwtTokenService jwtTokenService, IEmailService emailService, ILogger<UserController> logger)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            //Check if user already exists
            var existingUser = await _context.users.FirstOrDefaultAsync(u => u.UserEmail == dto.Email);
            if (existingUser != null)
            {
                return BadRequest(new ErrorResponseDto("Email is already registered."));
            }

            //Hash the password securely using BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                UserEmail = dto.Email,
                UserPassword = passwordHash,
                UserName = dto.FullName,
                UserRole = string.IsNullOrWhiteSpace(dto.Role) ? "Student" : dto.Role
            };

            _context.users.Add(user);
            await _context.SaveChangesAsync();

            //Send welcome email
            try
            {
                await _emailService.SendEmailAsync(
                    user.UserEmail,
                    "Welcome to LMS!",
                    $"<h3>Welcome {user.UserName}!</h3><p>Your account was successfully created as a {user.UserRole}.</p>"
                );
            }
            catch (Exception ex)
            {
                //error in console
                _logger.LogError(ex, "[Email] Failed to send welcome email to {Email}", user.UserEmail);
            }

            //Generate JWT token for instant login
            var token = _jwtTokenService.GenerateToken(
                user.UserId.ToString(),
                user.UserEmail,
                user.UserRole
            );

            //Map to Response DTOs
            var userDto = new UserResponseDto(user.UserId, user.UserEmail, user.UserName, user.UserRole);
            var response = new AuthResponseDto(token, userDto, "Registration successful!");

            return Ok(response);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            //check if email exists
            var user = await _context.users.FirstOrDefaultAsync(u => u.UserEmail == dto.Email);
            if (user == null)
            {
                return Unauthorized(new ErrorResponseDto("Invalid email or password."));
            }

            //Verify hashed password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.UserPassword);
            if (!isPasswordValid)
            {
                return Unauthorized(new ErrorResponseDto("Invalid email or password."));
            }

            //Generate JWT Token
            var token = _jwtTokenService.GenerateToken(
                user.UserId.ToString(),
                user.UserEmail,
                user.UserRole
            );

            //Map to Response DTOs
            var userDto = new UserResponseDto(user.UserId, user.UserEmail, user.UserName, user.UserRole);
            var response = new AuthResponseDto(token, userDto, "Login successful!");

            return Ok(response);
        }


        // update name and email by id
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
                return NotFound(new ErrorResponseDto("User not found."));

            user.UserName = dto.FullName;
            user.UserEmail = dto.Email;

            await _context.SaveChangesAsync();

            var userDto = new UserResponseDto(user.UserId, user.UserEmail, user.UserName, user.UserRole);
            return Ok(userDto);
        }


        // update role by id
        [HttpPatch("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleDto dto)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
                return NotFound(new ErrorResponseDto("User not found."));

            user.UserRole = dto.Role;
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Role updated to {dto.Role} successfully." });
        }

        // delete user by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
                return NotFound(new ErrorResponseDto("User not found."));

            _context.users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User deleted successfully." });
        }


        // get all users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.users
                .Select(u => new UserResponseDto(u.UserId, u.UserEmail, u.UserName, u.UserRole))
                .ToListAsync();

            return Ok(users);
        }


        // get user by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
                return NotFound(new ErrorResponseDto("User not found."));

            var userDto = new UserResponseDto(user.UserId, user.UserEmail, user.UserName, user.UserRole);
            return Ok(userDto);
        }


        

    }

    //REQUEST DTOs
    public record RegisterDto(string Email, string Password, string FullName, string? Role);
    public record LoginDto(string Email, string Password);

    // RESPONSE DTOs
    public record UserResponseDto(int Id, string Email, string FullName, string Role);
    public record AuthResponseDto(string Token, UserResponseDto User, string Message);
    public record ErrorResponseDto(string Message);

    // update name and email DTO
    public record UpdateUserDto(string FullName, string Email);

    // update role DTO
    public record UpdateRoleDto(string Role);
}