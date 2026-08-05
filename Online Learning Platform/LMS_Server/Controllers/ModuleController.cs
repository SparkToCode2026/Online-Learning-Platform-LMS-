using LMS_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS_Server.DTOs;

namespace LMS_Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModuleController : ControllerBase
{
    private readonly ProjectContext _context;

    public ModuleController(ProjectContext context)
    {
        _context = context;
    }

    // Case 1: Create a new module.
    [HttpPost]
    public async Task<IActionResult> CreateModule(CreateModuleDto dto)
    {
        bool courseExists = await _context.courses
            .AnyAsync(c => c.CourseId == dto.CourseId);

        if (!courseExists)
            return NotFound("Course not found.");

        Module module = new Module
        {
            ModuleName = dto.ModuleName,
            OrderNumber = dto.OrderNumber,
            CourseId = dto.CourseId
        };

        _context.modules.Add(module);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetModuleById),
            new { id = module.ModuleId },
            module
        );
    }

    // Case 2: Update the module name.
    [HttpPut("{id}/name")]
    public async Task<IActionResult> UpdateModuleName(
        int id,
        [FromBody] string moduleName)
    {
        Module? module = await _context.modules.FindAsync(id);

        if (module == null)
            return NotFound("Module not found.");

        if (string.IsNullOrWhiteSpace(moduleName))
            return BadRequest("Module name is required.");

        module.ModuleName = moduleName;
        await _context.SaveChangesAsync();

        return Ok(module);
    }

    // Case 3: Update the module order number.
    [HttpPatch("{id}/order-number")]
    public async Task<IActionResult> UpdateOrderNumber(
        int id,
        [FromBody] int orderNumber)
    {
        Module? module = await _context.modules.FindAsync(id);

        if (module == null)
            return NotFound("Module not found.");

        if (orderNumber <= 0)
            return BadRequest("Order number must be greater than zero.");

        module.OrderNumber = orderNumber;
        await _context.SaveChangesAsync();

        return Ok(module);
    }

    // Case 4: Delete a module.
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteModule(int id)
    {
        Module? module = await _context.modules.FindAsync(id);

        if (module == null)
            return NotFound("Module not found.");

        _context.modules.Remove(module);
        await _context.SaveChangesAsync();

        return Ok("Module deleted successfully.");
    }

    // Case 5: Get all modules with their lessons.
    [HttpGet]
    public async Task<IActionResult> GetAllModules()
    {
        List<Module> modules = await _context.modules
            .Include(m => m.Lessons)
            .ToListAsync();

        return Ok(modules);
    }

    // Case 6: Get one module by its ID.
    [HttpGet("{id}")]
    public async Task<IActionResult> GetModuleById(int id)
    {
        Module? module = await _context.modules
            .Include(m => m.Lessons)
            .FirstOrDefaultAsync(m => m.ModuleId == id);

        if (module == null)
            return NotFound("Module not found.");

        return Ok(module);
    }

    // Case 7: Filter modules by CourseId.
    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetModulesByCourse(int courseId)
    {
        List<Module> modules = await _context.modules
            .Where(m => m.CourseId == courseId)
            .ToListAsync();

        return Ok(modules);
    }

    // Case 8: Sort modules by OrderNumber.
    [HttpGet("sorted")]
    public async Task<IActionResult> GetModulesSortedByOrder()
    {
        List<Module> modules = await _context.modules
            .OrderBy(m => m.OrderNumber)
            .ToListAsync();

        return Ok(modules);
    }
}