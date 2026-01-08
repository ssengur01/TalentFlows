namespace Shared.Library.Services;

public interface ITenantProvider
{
    Guid GetTenantId();
}
