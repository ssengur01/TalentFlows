using IdentityService.Domain.Entities;
using IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Infrastructure.Data;

public static class DbInitializer
{
    public static void Initialize(IdentityDbContext context)
    {
        context.Database.EnsureCreated();

        // Seed System Tenant if empty
        if (!context.Tenants.Any())
        {
            context.Tenants.Add(new Tenant
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "System",
                Domain = "talentflows.com",
                IsActive = true
            });
            context.SaveChanges();
        }
    }
}
