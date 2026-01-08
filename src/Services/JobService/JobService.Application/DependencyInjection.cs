using JobService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace JobService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IJobService, JobApplicationService>();
        return services;
    }
}
