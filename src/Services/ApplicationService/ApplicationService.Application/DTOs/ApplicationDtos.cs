namespace ApplicationService.Application.DTOs;

public record ApplicationDto(
    Guid Id,
    Guid JobId,
    Guid CandidateId,
    string Status,
    string CoverLetter,
    DateTime AppliedAt
);

public record CreateApplicationRequest(
    Guid JobId,
    Guid CandidateId,
    string CoverLetter
);

public record UpdateApplicationStatusRequest(
    string Status
);
