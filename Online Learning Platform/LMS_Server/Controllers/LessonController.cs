using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    public async Task<IActionResult> CreateLesson(Lesson lesson)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        bool moduleExists = await _context.modules
            .AnyAsync(m => m.ModuleId == lesson.ModuleId);

        if (!moduleExists)
            return NotFound("Module not found.");

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
        Lesson updatedLesson)
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
        List<Lesson> lessons = await _context.lessons
            .Include(l => l.Module)
            .ToListAsync();

        return Ok(lessons);
    }

    // Case 6: Get one lesson by its ID.
    [HttpGet("{id}")]
    public async Task<IActionResult> GetLessonById(int id)
    {
        Lesson? lesson = await _context.lessons
            .Include(l => l.Module)
            .FirstOrDefaultAsync(l => l.LessonId == id);

        if (lesson == null)
            return NotFound("Lesson not found.");

        return Ok(lesson);
    }

    // Case 7: Filter lessons by ModuleId.
    [HttpGet("module/{moduleId}")]
    public async Task<IActionResult> GetLessonsByModule(int moduleId)
    {
        List<Lesson> lessons = await _context.lessons
            .Where(l => l.ModuleId == moduleId)
            .ToListAsync();

        return Ok(lessons);
    }

    // Case 8: Sort lessons alphabetically by title.
    [HttpGet("sorted")]
    public async Task<IActionResult> GetLessonsSortedByTitle()
    {
        List<Lesson> lessons = await _context.lessons
            .OrderBy(l => l.LessonTitle)
            .ToListAsync();

        return Ok(lessons);
    }
}