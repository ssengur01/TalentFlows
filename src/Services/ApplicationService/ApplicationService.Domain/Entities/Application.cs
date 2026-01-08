using Shared.Library.Entities;

namespace ApplicationService.Domain.Entities;

public class Application : BaseEntity
{
    public Guid JobId { get; set; }
    public Guid CandidateId { get; set; }
    public string Status { get; set; } = "Applied"; // Applied, Reviewing, PhoneInterview, TechnicalInterview, Offer, Rejected
    public string CoverLetter { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
}
