using CompanyService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CompanyService.Application.Interfaces;

public interface ICompanyDbContext
{
    DbSet<Company> Companies { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
