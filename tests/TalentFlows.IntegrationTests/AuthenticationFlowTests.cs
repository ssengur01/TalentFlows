using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace TalentFlows.IntegrationTests;

public class AuthenticationFlowTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public AuthenticationFlowTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_Login_CreateJob_ShouldSucceed()
    {
        // 1. Register a company
        var registerRequest = new
        {
            email = $"company{Guid.NewGuid()}@test.com",
            password = "Password123!",
            fullName = "Test Company Admin",
            role = "Company",
            companyName = "Test Corp"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        var registerResult = await registerResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(registerResult?.Token);

        // 2. Login with registered credentials
        var loginRequest = new
        {
            email = registerRequest.email,
            password = registerRequest.password
        };

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        var loginResult = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(loginResult?.Token);

        // 3. Create a job with authentication
        _client.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", loginResult.Token);

        var createJobRequest = new
        {
            title = "Senior .NET Developer",
            description = "Looking for an experienced .NET developer",
            location = "Istanbul, Turkey",
            salaryMin = 80000,
            salaryMax = 120000,
            requirements = "5+ years of .NET experience",
            benefits = "Health insurance, remote work",
            employmentType = "Full-time"
        };

        var jobResponse = await _client.PostAsJsonAsync("/api/jobs", createJobRequest);
        Assert.Equal(HttpStatusCode.Created, jobResponse.StatusCode);
    }

    [Fact]
    public async Task UnauthorizedRequest_ShouldReturn401()
    {
        // Attempt to create a job without authentication
        var createJobRequest = new
        {
            title = "Test Job",
            description = "Test Description"
        };

        var response = await _client.PostAsJsonAsync("/api/jobs", createJobRequest);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string Expiration { get; set; } = string.Empty;
}
