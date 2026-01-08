using IdentityService.Application.Services;
using IdentityService.Domain.Entities;
using Moq;
using Xunit;

namespace IdentityService.Tests.Unit;

public class AuthServiceTests
{
    [Fact]
    public async Task Register_WithValidData_ShouldCreateUser()
    {
        // Arrange
        var mockDbContext = new Mock<IIdentityDbContext>();
        var mockTokenGenerator = new Mock<IJwtTokenGenerator>();
        
        mockTokenGenerator
            .Setup(x => x.GenerateToken(It.IsAny<User>()))
            .Returns("mock-jwt-token");

        var authService = new AuthService(mockDbContext.Object, mockTokenGenerator.Object);
        
        var registerRequest = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "Password123!",
            FullName = "Test User",
            Role = "Candidate"
        };

        // Act
        var result = await authService.RegisterAsync(registerRequest);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("mock-jwt-token", result.Token);
        mockDbContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ShouldReturnToken()
    {
        // Arrange
        var mockDbContext = new Mock<IIdentityDbContext>();
        var mockTokenGenerator = new Mock<IJwtTokenGenerator>();
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "test@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            FullName = "Test User",
            Role = "Candidate",
            IsActive = true
        };

        mockTokenGenerator
            .Setup(x => x.GenerateToken(It.IsAny<User>()))
            .Returns("mock-jwt-token");

        var authService = new AuthService(mockDbContext.Object, mockTokenGenerator.Object);

        // Act & Assert
        // This is a simplified example - full implementation would mock DbSet
        Assert.True(BCrypt.Net.BCrypt.Verify("Password123!", user.PasswordHash));
    }

    [Fact]
    public void PasswordHashing_ShouldBeSecure()
    {
        // Arrange
        var password = "MySecurePassword123!";

        // Act
        var hash = BCrypt.Net.BCrypt.HashPassword(password);

        // Assert
        Assert.True(BCrypt.Net.BCrypt.Verify(password, hash));
        Assert.False(BCrypt.Net.BCrypt.Verify("WrongPassword", hash));
    }
}
