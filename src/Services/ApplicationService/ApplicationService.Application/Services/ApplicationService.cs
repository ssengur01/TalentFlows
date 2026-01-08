using ApplicationService.Application.DTOs;
using ApplicationService.Application.Interfaces;
using ApplicationService.Domain.Entities;
using ApplicationService.Domain.Events;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Shared.Library.Services;

namespace ApplicationService.Application.Services;

public interface IApplicationService
{
    Task<IEnumerable<ApplicationDto>> GetAllAsync();
    Task<ApplicationDto?> GetByIdAsync(Guid id);
    Task<ApplicationDto> CreateAsync(CreateApplicationRequest request);
    Task<ApplicationDto?> UpdateStatusAsync(Guid id, UpdateApplicationStatusRequest request);
}

public class ApplicationApplicationService : IApplicationService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ITenantProvider _tenantProvider;
    private readonly IPublishEndpoint _publishEndpoint;

    public ApplicationApplicationService(
        IApplicationDbContext dbContext, 
        ITenantProvider tenantProvider,
        IPublishEndpoint publishEndpoint)
    {
        _dbContext = dbContext;
        _tenantProvider = tenantProvider;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<ApplicationDto> CreateAsync(CreateApplicationRequest request)
    {
        var application = new Application
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantProvider.GetTenantId(),
            JobId = request.JobId,
            CandidateId = request.CandidateId,
            CoverLetter = request.CoverLetter,
            Status = "Applied",
            AppliedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Applications.Add(application);
        await _dbContext.SaveChangesAsync();

        // Publish event to RabbitMQ
        await _publishEndpoint.Publish(new ApplicationCreatedEvent(
            application.Id,
            application.JobId,
            application.CandidateId,
            application.TenantId,
            "Candidate Name", // TODO: Fetch from CandidateService
            "candidate@email.com", // TODO: Fetch from CandidateService
            application.AppliedAt
        ));

        return MapToDto(application);
    }

    public async Task<IEnumerable<ApplicationDto>> GetAllAsync()
    {
        var applications = await _dbContext.Applications.ToListAsync();
        return applications.Select(MapToDto);
    }

    public async Task<ApplicationDto?> GetByIdAsync(Guid id)
    {
        var application = await _dbContext.Applications.FirstOrDefaultAsync(a => a.Id == id);
        return application == null ? null : MapToDto(application);
    }

    public async Task<ApplicationDto?> UpdateStatusAsync(Guid id, UpdateApplicationStatusRequest request)
    {
        var application = await _dbContext.Applications.FirstOrDefaultAsync(a => a.Id == id);
        if (application == null) return null;

        application.Status = request.Status;
        application.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDto(application);
    }

    private static ApplicationDto MapToDto(Application a) => new(
        a.Id,
        a.JobId,
        a.CandidateId,
        a.Status,
        a.CoverLetter,
        a.AppliedAt
    );
}
