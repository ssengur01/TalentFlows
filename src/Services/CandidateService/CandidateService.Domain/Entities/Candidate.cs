using Shared.Library.Entities;

namespace CandidateService.Domain.Entities;

public class Candidate : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ResumeUrl { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public string Education { get; set; } = string.Empty;
    public string LinkedInUrl { get; set; } = string.Empty;
}
