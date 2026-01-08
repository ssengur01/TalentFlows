using CandidateService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CandidateService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICandidateService, CandidateApplicationService>();
        return services;
    }
}
