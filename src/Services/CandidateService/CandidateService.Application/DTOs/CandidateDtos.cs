namespace CandidateService.Application.DTOs;

public record CandidateDto(
    Guid Id,
    string FullName,
    string Email,
    string Phone,
    string ResumeUrl,
    string Skills,
    int YearsOfExperience,
    string Education,
    string LinkedInUrl
);

public record CreateCandidateRequest(
    string FullName,
    string Email,
    string Phone,
    string ResumeUrl,
    string Skills,
    int YearsOfExperience,
    string Education,
    string LinkedInUrl
);

public record UpdateCandidateRequest(
    string FullName,
    string Email,
    string Phone,
    string ResumeUrl,
    string Skills,
    int YearsOfExperience,
    string Education,
    string LinkedInUrl
);
