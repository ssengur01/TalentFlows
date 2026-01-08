using JobService.Application.Interfaces;
using JobService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Library.Services;

namespace JobService.Infrastructure.Data;

public class JobDbContext : DbContext, IJobDbContext
{
    private readonly ITenantProvider _tenantProvider;

    public JobDbContext(DbContextOptions<JobDbContext> options, ITenantProvider tenantProvider)
        : base(options)
    {
        _tenantProvider = tenantProvider;
    }

    public DbSet<Job> Jobs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Job>()
            .HasQueryFilter(j => j.TenantId == _tenantProvider.GetTenantId());
    }
}
