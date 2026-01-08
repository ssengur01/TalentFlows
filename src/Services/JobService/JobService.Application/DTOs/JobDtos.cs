namespace JobService.Application.DTOs;

public record JobDto(
    Guid Id,
    string Title,
    string Description,
    string Location,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string Requirements,
    string Benefits,
    string EmploymentType,
    bool IsActive,
    DateTime? PublishedAt
);

public record CreateJobRequest(
    string Title,
    string Description,
    string Location,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string Requirements,
    string Benefits,
    string EmploymentType
);

public record UpdateJobRequest(
    string Title,
    string Description,
    string Location,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string Requirements,
    string Benefits,
    string EmploymentType,
    bool IsActive
);
