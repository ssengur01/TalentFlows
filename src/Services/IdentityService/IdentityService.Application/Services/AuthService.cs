using BCrypt.Net;
using IdentityService.Application.DTOs;
using IdentityService.Application.Interfaces;
using IdentityService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Library.Services;

namespace IdentityService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IIdentityDbContext _dbContext;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(IIdentityDbContext dbContext, IJwtTokenGenerator jwtTokenGenerator)
    {
        _dbContext = dbContext;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // 1. Find user by email
        // Note: Global query filter might filter by TenantId. 
        // For login, we usually need to find the user first to know their TenantId if they don't provide it.
        // But our multi-tenant strategy relies on header.
        // If the user is logging in, they might not know their TenantId yet IF it's a subdomain SaaS.
        // Assuming Tenant is resolved via domain or header. 
        // For simplicity now, we assume the frontend sends the TenantId if known, 
        // OR we ignore query filter for login lookup.
        
        var user = await _dbContext.Users.IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            throw new Exception("Invalid credentials");
        }

        // 2. Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("Invalid credentials");
        }

        // 3. Generate Token
        var token = _jwtTokenGenerator.GenerateToken(user, user.TenantId);

        return new AuthResponse(token, "dummy-refresh-token", DateTime.UtcNow.AddMinutes(60));
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // 1. Validations
        if (await _dbContext.Users.IgnoreQueryFilters().AnyAsync(u => u.Email == request.Email))
        {
            throw new Exception("User already exists");
        }

        Guid tenantId;

        // 2. Create Tenant if Company
        if (request.Role == "Company")
        {
            if (string.IsNullOrEmpty(request.CompanyName))
                throw new Exception("Company Name is required for Company role");

            var tenant = new Tenant
            {
                Id = Guid.NewGuid(),
                Name = request.CompanyName,
                Domain = request.CompanyName.ToLower().Replace(" ", "-") + ".talentflows.com", // Simple slug
                IsActive = true
            };
            
            _dbContext.Tenants.Add(tenant);
            tenantId = tenant.Id;
        }
        else
        {
            // Candidate: For now, assign to a default "Public" tenant or handle differently.
            // In many systems, candidates are global or belong to a root tenant.
            // Let's create a "Global/Public" tenant if not exists, or handle logic.
            // For simplicity, let's say Candidates belong to a System Tenant.
            
            // Check if System Tenant exists
            var systemTenant = await _dbContext.Tenants.FirstOrDefaultAsync(t => t.Name == "System");
            if (systemTenant == null)
            {
                systemTenant = new Tenant { Id = Guid.NewGuid(), Name = "System", Domain = "talentflows.com" };
                _dbContext.Tenants.Add(systemTenant);
            }
            tenantId = systemTenant.Id;
        }

        // 3. Create User
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            FullName = request.FullName,
            Role = request.Role,
            TenantId = tenantId,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            IsActive = true
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        // 4. Generate Token
        var token = _jwtTokenGenerator.GenerateToken(user, tenantId);

        return new AuthResponse(token, "dummy-refresh-token", DateTime.UtcNow.AddMinutes(60));
    }
}
