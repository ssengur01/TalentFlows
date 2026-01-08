namespace IdentityService.Application.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(
    string Email, 
    string Password, 
    string FullName, 
    string Role, // "Company" or "Candidate"
    string? CompanyName = null // Required if Role is Company
);

public record AuthResponse(string Token, string RefreshToken, DateTime Expiration);
