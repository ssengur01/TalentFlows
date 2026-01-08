using Microsoft.AspNetCore.Http;

namespace Shared.Library.Services;

public class TenantProvider : ITenantProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private const string TenantIdHeaderName = "X-Tenant-Id";

    public TenantProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetTenantId()
    {
        var context = _httpContextAccessor.HttpContext;
        if (context == null)
        {
            return Guid.Empty;
        }

        var header = context.Request.Headers[TenantIdHeaderName].ToString();
        
        if (Guid.TryParse(header, out var tenantId))
        {
            return tenantId;
        }

        return Guid.Empty;
    }
}
