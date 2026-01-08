using Shared.Library.Entities;

namespace CompanyService.Domain.Entities;

public class Company : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int EmployeeCount { get; set; }
}
