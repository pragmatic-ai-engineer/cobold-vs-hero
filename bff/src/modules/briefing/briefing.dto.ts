export interface BriefingRequestDto {
  coboldConcern: string;
  heroMove: string;
  systemMood: string;
  targetEnvironment: string;
  implementationComplexity: string;
  teamExperience: string;
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

export interface BackendStatusResponseDto {
  service: string;
  runtime: string;
  status: string;
  checkedAt: string;
  port: number;
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

export interface ServiceStatusDto {
  service: string;
  runtime: string;
  status: 'UP' | 'DOWN';
  checkedAt: string;
  endpoint: string;
  detail?: string;
}

export interface SystemStatusResponseDto {
  status: 'UP' | 'DEGRADED';
  checkedAt: string;
  services: ServiceStatusDto[];
}
