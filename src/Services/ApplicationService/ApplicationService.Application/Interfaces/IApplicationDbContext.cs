using ApplicationEntity = ApplicationService.Domain.Entities.Application;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<ApplicationEntity> Applications { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
