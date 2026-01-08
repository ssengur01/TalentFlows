namespace CompanyService.Application.DTOs;

public record CompanyDto(
    Guid Id,
    string Name,
    string Description,
    string Industry,
    string Website,
    string LogoUrl,
    string Location,
    int EmployeeCount
);

public record CreateCompanyRequest(
    string Name,
    string Description,
    string Industry,
    string Website,
    string LogoUrl,
    string Location,
    int EmployeeCount
);

public record UpdateCompanyRequest(
    string Name,
    string Description,
    string Industry,
    string Website,
    string LogoUrl,
    string Location,
    int EmployeeCount
);
