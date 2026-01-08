using CandidateService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CandidateService.Application.Interfaces;

public interface ICandidateDbContext
{
    DbSet<Candidate> Candidates { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
