using CompanyService.Application.Interfaces;
using CompanyService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Library.Services;

namespace CompanyService.Infrastructure.Data;

public class CompanyDbContext : DbContext, ICompanyDbContext
{
    private readonly ITenantProvider _tenantProvider;

    public CompanyDbContext(DbContextOptions<CompanyDbContext> options, ITenantProvider tenantProvider)
        : base(options)
    {
        _tenantProvider = tenantProvider;
    }

    public DbSet<Company> Companies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Company>()
            .HasQueryFilter(c => c.TenantId == _tenantProvider.GetTenantId());
    }
}
