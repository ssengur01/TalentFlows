using CandidateService.Application.DTOs;
using CandidateService.Application.Interfaces;
using CandidateService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CandidateService.Application.Services;

public interface ICandidateService
{
    Task<IEnumerable<CandidateDto>> GetAllAsync();
    Task<CandidateDto?> GetByIdAsync(Guid id);
    Task<CandidateDto> CreateAsync(CreateCandidateRequest request);
    Task<CandidateDto?> UpdateAsync(Guid id, UpdateCandidateRequest request);
    Task<bool> DeleteAsync(Guid id);
}

public class CandidateApplicationService : ICandidateService
{
    private readonly ICandidateDbContext _dbContext;

    public CandidateApplicationService(ICandidateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CandidateDto> CreateAsync(CreateCandidateRequest request)
    {
        var candidate = new Candidate
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.Parse("00000000-0000-0000-0000-000000000001"), // System tenant for global candidates
            FullName = request.FullName,
            Email = request.Email,
            Phone = request.Phone,
            ResumeUrl = request.ResumeUrl,
            Skills = request.Skills,
            YearsOfExperience = request.YearsOfExperience,
            Education = request.Education,
            LinkedInUrl = request.LinkedInUrl,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Candidates.Add(candidate);
        await _dbContext.SaveChangesAsync();

        return MapToDto(candidate);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var candidate = await _dbContext.Candidates.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Id == id);
        if (candidate == null) return false;

        _dbContext.Candidates.Remove(candidate);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<CandidateDto>> GetAllAsync()
    {
        var candidates = await _dbContext.Candidates.IgnoreQueryFilters().ToListAsync();
        return candidates.Select(MapToDto);
    }

    public async Task<CandidateDto?> GetByIdAsync(Guid id)
    {
        var candidate = await _dbContext.Candidates.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Id == id);
        return candidate == null ? null : MapToDto(candidate);
    }

    public async Task<CandidateDto?> UpdateAsync(Guid id, UpdateCandidateRequest request)
    {
        var candidate = await _dbContext.Candidates.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Id == id);
        if (candidate == null) return null;

        candidate.FullName = request.FullName;
        candidate.Email = request.Email;
        candidate.Phone = request.Phone;
        candidate.ResumeUrl = request.ResumeUrl;
        candidate.Skills = request.Skills;
        candidate.YearsOfExperience = request.YearsOfExperience;
        candidate.Education = request.Education;
        candidate.LinkedInUrl = request.LinkedInUrl;
        candidate.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDto(candidate);
    }

    private static CandidateDto MapToDto(Candidate c) => new(
        c.Id,
        c.FullName,
        c.Email,
        c.Phone,
        c.ResumeUrl,
        c.Skills,
        c.YearsOfExperience,
        c.Education,
        c.LinkedInUrl
    );
}
