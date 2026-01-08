using Shared.Library.Entities;

namespace JobService.Domain.Entities;

public class Job : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public string Requirements { get; set; } = string.Empty;
    public string Benefits { get; set; } = string.Empty;
    public string EmploymentType { get; set; } = string.Empty; // "Full-time", "Part-time", "Contract"
    public bool IsActive { get; set; } = true;
    public DateTime? PublishedAt { get; set; }
}
