using JobService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobService.Application.Interfaces;

public interface IJobDbContext
{
    DbSet<Job> Jobs { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
