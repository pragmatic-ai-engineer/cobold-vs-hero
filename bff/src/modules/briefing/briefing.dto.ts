export interface BriefingRequestDto {
  changeTitle: string;
  changeDescription: string;
  affectedSurfaces: string[];
  providedEvidence: string[];
  riskFlags: string[];
}

export interface BackendReviewMatrixRowDto {
  surface: string;
  expectedEvidence: string[];
  providedEvidence: string[];
  gap: string;
  nextAction: string;
}

export interface BackendBriefingResponseDto {
  signal: string;
  headline: string;
  requiredEvidence: string[];
  missingEvidence: string[];
  stopCondition: string;
  heroNextStep: string;
  reviewMatrix: BackendReviewMatrixRowDto[];
}

export interface BackendStatusResponseDto {
  service: string;
  runtime: string;
  status: string;
  checkedAt: string;
  port: number;
}

export interface ReviewMatrixRowDto {
  surface: string;
  expectedEvidence: string[];
  providedEvidence: string[];
  gap: string;
  nextAction: string;
}

export interface BriefingResponseDto {
  signal: string;
  headline: string;
  requiredEvidence: string[];
  missingEvidence: string[];
  stopCondition: string;
  nextAction: string;
  reviewMatrix: ReviewMatrixRowDto[];
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
