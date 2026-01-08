using CompanyService.Application.DTOs;
using CompanyService.Application.Interfaces;
using CompanyService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Library.Services;

namespace CompanyService.Application.Services;

public interface ICompanyService
{
    Task<IEnumerable<CompanyDto>> GetAllAsync();
    Task<CompanyDto?> GetByIdAsync(Guid id);
    Task<CompanyDto> CreateAsync(CreateCompanyRequest request);
    Task<CompanyDto?> UpdateAsync(Guid id, UpdateCompanyRequest request);
    Task<bool> DeleteAsync(Guid id);
}

public class CompanyApplicationService : ICompanyService
{
    private readonly ICompanyDbContext _dbContext;
    private readonly ITenantProvider _tenantProvider;

    public CompanyApplicationService(ICompanyDbContext dbContext, ITenantProvider tenantProvider)
    {
        _dbContext = dbContext;
        _tenantProvider = tenantProvider;
    }

    public async Task<CompanyDto> CreateAsync(CreateCompanyRequest request)
    {
        var company = new Company
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantProvider.GetTenantId(),
            Name = request.Name,
            Description = request.Description,
            Industry = request.Industry,
            Website = request.Website,
            LogoUrl = request.LogoUrl,
            Location = request.Location,
            EmployeeCount = request.EmployeeCount,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Companies.Add(company);
        await _dbContext.SaveChangesAsync();

        return MapToDto(company);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == id);
        if (company == null) return false;

        _dbContext.Companies.Remove(company);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<CompanyDto>> GetAllAsync()
    {
        var companies = await _dbContext.Companies.ToListAsync();
        return companies.Select(MapToDto);
    }

    public async Task<CompanyDto?> GetByIdAsync(Guid id)
    {
        var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == id);
        return company == null ? null : MapToDto(company);
    }

    public async Task<CompanyDto?> UpdateAsync(Guid id, UpdateCompanyRequest request)
    {
        var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == id);
        if (company == null) return null;

        company.Name = request.Name;
        company.Description = request.Description;
        company.Industry = request.Industry;
        company.Website = request.Website;
        company.LogoUrl = request.LogoUrl;
        company.Location = request.Location;
        company.EmployeeCount = request.EmployeeCount;
        company.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDto(company);
    }

    private static CompanyDto MapToDto(Company company) => new(
        company.Id,
        company.Name,
        company.Description,
        company.Industry,
        company.Website,
        company.LogoUrl,
        company.Location,
        company.EmployeeCount
    );
}
