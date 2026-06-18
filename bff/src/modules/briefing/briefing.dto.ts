export interface BriefingRequestDto {
  coboldConcern: string;
  heroMove: string;
  systemMood: string;
}

export interface BackendBriefingResponseDto {
  signal: string;
  headline: string;
  reason: string;
  coboldWisdom: string;
  heroNextStep: string;
  evidencePrompts: string[];
  checklist: string[];
}

export interface BriefingResponseDto {
  signal: string;
  headline: string;
  reason: string;
  reviewerNote: string;
  nextAction: string;
  evidencePrompts: string[];
  checklist: string[];
}
