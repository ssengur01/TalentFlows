using IdentityService.Application.Interfaces;
using IdentityService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Library.Services;

namespace IdentityService.Infrastructure.Data;

public class IdentityDbContext : DbContext, IIdentityDbContext
{
    private readonly ITenantProvider _tenantProvider;

    public IdentityDbContext(DbContextOptions<IdentityDbContext> options, ITenantProvider tenantProvider) 
        : base(options)
    {
        _tenantProvider = tenantProvider;
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Tenant> Tenants { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Tenant is the root of isolation, so it manages itself (or system admin manages it).
        // Users are filtered by TenantId.
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasQueryFilter(u => u.TenantId == _tenantProvider.GetTenantId());

        // Tenants shouldn't be filtered by TenantId (recursion issue?), or should they?
        // Usually Tenants table is global (system level).
        // Only filtered if we have "Reseller" model? For now, no filter on Tenants table.
    }
}
