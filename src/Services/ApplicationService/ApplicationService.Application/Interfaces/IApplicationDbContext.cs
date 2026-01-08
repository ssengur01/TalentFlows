using ApplicationService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Application> Applications { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
