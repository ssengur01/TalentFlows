using CandidateService.Application.DTOs;
using CandidateService.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandidateService.API.Controllers;

[ApiController]
[Route("api/candidates")]
public class CandidatesController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidatesController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var candidates = await _candidateService.GetAllAsync();
        return Ok(candidates);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var candidate = await _candidateService.GetByIdAsync(id);
        return candidate == null ? NotFound() : Ok(candidate);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCandidateRequest request)
    {
        var candidate = await _candidateService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = candidate.Id }, candidate);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCandidateRequest request)
    {
        var candidate = await _candidateService.UpdateAsync(id, request);
        return candidate == null ? NotFound() : Ok(candidate);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _candidateService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
