using JobService.Application.DTOs;
using JobService.Application.Interfaces;
using JobService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Library.Services;

namespace JobService.Application.Services;

public interface IJobService
{
    Task<IEnumerable<JobDto>> GetAllAsync();
    Task<JobDto?> GetByIdAsync(Guid id);
    Task<JobDto> CreateAsync(CreateJobRequest request);
    Task<JobDto?> UpdateAsync(Guid id, UpdateJobRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<JobDto?> PublishAsync(Guid id);
}

public class JobApplicationService : IJobService
{
    private readonly IJobDbContext _dbContext;
    private readonly ITenantProvider _tenantProvider;

    public JobApplicationService(IJobDbContext dbContext, ITenantProvider tenantProvider)
    {
        _dbContext = dbContext;
        _tenantProvider = tenantProvider;
    }

    public async Task<JobDto> CreateAsync(CreateJobRequest request)
    {
        var job = new Job
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantProvider.GetTenantId(),
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            SalaryMin = request.SalaryMin,
            SalaryMax = request.SalaryMax,
            Requirements = request.Requirements,
            Benefits = request.Benefits,
            EmploymentType = request.EmploymentType,
            IsActive = false,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Jobs.Add(job);
        await _dbContext.SaveChangesAsync();

        return MapToDto(job);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var job = await _dbContext.Jobs.FirstOrDefaultAsync(j => j.Id == id);
        if (job == null) return false;

        _dbContext.Jobs.Remove(job);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<JobDto>> GetAllAsync()
    {
        var jobs = await _dbContext.Jobs.Where(j => j.IsActive).ToListAsync();
        return jobs.Select(MapToDto);
    }

    public async Task<JobDto?> GetByIdAsync(Guid id)
    {
        var job = await _dbContext.Jobs.FirstOrDefaultAsync(j => j.Id == id);
        return job == null ? null : MapToDto(job);
    }

    public async Task<JobDto?> PublishAsync(Guid id)
    {
        var job = await _dbContext.Jobs.FirstOrDefaultAsync(j => j.Id == id);
        if (job == null) return null;

        job.IsActive = true;
        job.PublishedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
        
        return MapToDto(job);
    }

    public async Task<JobDto?> UpdateAsync(Guid id, UpdateJobRequest request)
    {
        var job = await _dbContext.Jobs.FirstOrDefaultAsync(j => j.Id == id);
        if (job == null) return null;

        job.Title = request.Title;
        job.Description = request.Description;
        job.Location = request.Location;
        job.SalaryMin = request.SalaryMin;
        job.SalaryMax = request.SalaryMax;
        job.Requirements = request.Requirements;
        job.Benefits = request.Benefits;
        job.EmploymentType = request.EmploymentType;
        job.IsActive = request.IsActive;
        job.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDto(job);
    }

    private static JobDto MapToDto(Job job) => new(
        job.Id,
        job.Title,
        job.Description,
        job.Location,
        job.SalaryMin,
        job.SalaryMax,
        job.Requirements,
        job.Benefits,
        job.EmploymentType,
        job.IsActive,
        job.PublishedAt
    );
}
