using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.DTO;

namespace LMS_Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonController : ControllerBase
{
    private readonly ProjectContext _context;

    public LessonController(ProjectContext context)
    {
        _context = context;
    }

    // Case 1: Create a new lesson.
    [HttpPost]
    public async Task<IActionResult> CreateLesson([FromBody] CreateLessonDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        bool moduleExists = await _context.modules
            .AnyAsync(m => m.ModuleId == dto.ModuleId);

        if (!moduleExists)
            return NotFound("Module not found.");

        var lesson = new Lesson
        {
            LessonTitle = dto.LessonTitle,
            LessonURL = dto.LessonURL,
            ModuleId = dto.ModuleId
        };

        _context.lessons.Add(lesson);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetLessonById),
            new { id = lesson.LessonId },
            lesson
        );
    }

    // Case 2: Update the lesson title and URL.
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLesson(
        int id,
        [FromBody] UpdateLessonDto updatedLesson)
    {
        Lesson? lesson = await _context.lessons.FindAsync(id);

        if (lesson == null)
            return NotFound("Lesson not found.");

        if (string.IsNullOrWhiteSpace(updatedLesson.LessonTitle))
            return BadRequest("Lesson title is required.");

        if (string.IsNullOrWhiteSpace(updatedLesson.LessonURL))
            return BadRequest("Lesson URL is required.");

        lesson.LessonTitle = updatedLesson.LessonTitle;
        lesson.LessonURL = updatedLesson.LessonURL;
        
        if (updatedLesson.ModuleId != 0)
        {
            bool moduleExists = await _context.modules.AnyAsync(m => m.ModuleId == updatedLesson.ModuleId);
            if (!moduleExists)
                return NotFound("Module not found.");
            lesson.ModuleId = updatedLesson.ModuleId;
        }

        await _context.SaveChangesAsync();

        return Ok(lesson);
    }

    // Case 3: Move the lesson to another module.
    [HttpPatch("{id}/module")]
    public async Task<IActionResult> UpdateLessonModule(
        int id,
        [FromBody] int moduleId)
    {
        Lesson? lesson = await _context.lessons.FindAsync(id);

        if (lesson == null)
            return NotFound("Lesson not found.");

        bool moduleExists = await _context.modules
            .AnyAsync(m => m.ModuleId == moduleId);

        if (!moduleExists)
            return NotFound("Module not found.");

        lesson.ModuleId = moduleId;
        await _context.SaveChangesAsync();

        return Ok(lesson);
    }

    // Case 4: Delete a lesson.
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLesson(int id)
    {
        Lesson? lesson = await _context.lessons.FindAsync(id);

        if (lesson == null)
            return NotFound("Lesson not found.");

        _context.lessons.Remove(lesson);
        await _context.SaveChangesAsync();

        return Ok("Lesson deleted successfully.");
    }

    // Case 5: Get all lessons with their module.
    [HttpGet]
    public async Task<IActionResult> GetAllLessons()
    {
        var lessons = await _context.lessons
            .Select(l => new LessonResponseDto
            {
                LessonId = l.LessonId,
                LessonTitle = l.LessonTitle,
                LessonURL = l.LessonURL,
                ModuleId = l.ModuleId,
                ModuleName = l.Module.ModuleName
            })
            .ToListAsync();

        return Ok(lessons);
    }

    // Case 6: Get one lesson by its ID.
    [HttpGet("{id}")]
    public async Task<IActionResult> GetLessonById(int id)
    {
        var lesson = await _context.lessons
            .Where(l => l.LessonId == id)
            .Select(l => new LessonResponseDto
            {
                LessonId = l.LessonId,
                LessonTitle = l.LessonTitle,
                LessonURL = l.LessonURL,
                ModuleId = l.ModuleId,
                ModuleName = l.Module.ModuleName
            })
            .FirstOrDefaultAsync();

        if (lesson == null)
            return NotFound("Lesson not found.");

        return Ok(lesson);
    }

    // Case 7: Filter lessons by ModuleId.
    [HttpGet("module/{moduleId}")]
    public async Task<IActionResult> GetLessonsByModule(int moduleId)
    {
        var lessons = await _context.lessons
            .Where(l => l.ModuleId == moduleId)
            .Select(l => new LessonResponseDto
            {
                LessonId = l.LessonId,
                LessonTitle = l.LessonTitle,
                LessonURL = l.LessonURL,
                ModuleId = l.ModuleId,
                ModuleName = l.Module.ModuleName
            })
            .ToListAsync();

        return Ok(lessons);
    }

    // Case 8: Sort lessons alphabetically by title.
    [HttpGet("sorted")]
    public async Task<IActionResult> GetLessonsSortedByTitle()
    {
        var lessons = await _context.lessons
            .OrderBy(l => l.LessonTitle)
            .Select(l => new LessonResponseDto
            {
                LessonId = l.LessonId,
                LessonTitle = l.LessonTitle,
                LessonURL = l.LessonURL,
                ModuleId = l.ModuleId,
                ModuleName = l.Module.ModuleName
            })
            .ToListAsync();

        return Ok(lessons);
    }
}