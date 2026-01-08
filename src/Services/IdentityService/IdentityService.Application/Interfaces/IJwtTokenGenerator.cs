using IdentityService.Domain.Entities;

namespace IdentityService.Application.Services;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user, Guid tenantId);
}
