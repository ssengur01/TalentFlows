using IdentityService.Application;
using IdentityService.Infrastructure;
using Shared.Library.Middleware;
using Shared.Library.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

// Shared Services
builder.Services.AddScoped<ITenantProvider, TenantProvider>();

// Infrastructure
builder.Services.AddInfrastructure(builder.Configuration);
// Application
builder.Services.AddApplication();

// JWT Config
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(jwtSettings["Secret"]!))
        };
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Disable for simplified local dev if certs issues arise, but keep for now.

app.UseMiddleware<GlobalExceptionHandler>();
app.UseMiddleware<TenantMiddleware>();

app.UseAuthorization();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<IdentityService.Infrastructure.Data.IdentityDbContext>();
    // context.Database.Migrate(); // Disable until dotnet ef works
    IdentityService.Infrastructure.Data.DbInitializer.Initialize(context);
}

app.Run();
