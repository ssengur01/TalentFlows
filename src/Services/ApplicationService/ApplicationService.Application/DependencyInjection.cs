using ApplicationService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ApplicationService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IApplicationService, ApplicationApplicationService>();
        return services;
    }
}
