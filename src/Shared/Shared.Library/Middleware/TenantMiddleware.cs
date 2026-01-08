using Microsoft.AspNetCore.Http;
using Shared.Library.Services;

namespace Shared.Library.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITenantProvider tenantProvider)
    {
        // Identify tenant
        var tenantId = tenantProvider.GetTenantId();

        // Pass to next
        // Note: We might want to store it in Items if not using per-request scope service for provider,
        // but TenantProvider accesses HttpContext directly, so it's fine.
        
        // If we strictly require a tenant for authenticated requests:
        // if (context.User.Identity.IsAuthenticated && tenantId == Guid.Empty) { ... }
        
        await _next(context);
    }
}
