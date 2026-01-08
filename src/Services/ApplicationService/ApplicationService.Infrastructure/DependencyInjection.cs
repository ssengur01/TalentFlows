using ApplicationService.Application.Interfaces;
using ApplicationService.Infrastructure.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ApplicationService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        // RabbitMQ with MassTransit
        services.AddMassTransit(x =>
        {
            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host(configuration.GetValue<string>("RabbitMQ:Host") ?? "localhost", "/", h =>
                {
                    h.Username(configuration.GetValue<string>("RabbitMQ:Username") ?? "guest");
                    h.Password(configuration.GetValue<string>("RabbitMQ:Password") ?? "guest");
                });
            });
        });

        return services;
    }
}
