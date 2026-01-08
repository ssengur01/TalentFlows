namespace ApplicationService.Domain.Events;

public record ApplicationCreatedEvent(
    Guid ApplicationId,
    Guid JobId,
    Guid CandidateId,
    Guid TenantId,
    string CandidateName,
    string CandidateEmail,
    DateTime AppliedAt
);
