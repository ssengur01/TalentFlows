using CandidateService.Application.Interfaces;
using CandidateService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Library.Services;

namespace CandidateService.Infrastructure.Data;

public class CandidateDbContext : DbContext, ICandidateDbContext
{
    private readonly ITenantProvider _tenantProvider;

    public CandidateDbContext(DbContextOptions<CandidateDbContext> options, ITenantProvider tenantProvider)
        : base(options)
    {
        _tenantProvider = tenantProvider;
    }

    public DbSet<Candidate> Candidates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Candidates are global - they belong to the System tenant
        // No query filter needed as they should be accessible by all companies
    }
}
