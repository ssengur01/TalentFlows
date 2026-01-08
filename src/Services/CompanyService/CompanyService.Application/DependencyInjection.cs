using CompanyService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CompanyService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICompanyService, CompanyApplicationService>();
        return services;
    }
}
