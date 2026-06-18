import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  BackendStatusResponseDto,
  BackendBriefingResponseDto,
  BriefingRequestDto,
  BriefingResponseDto,
  ServiceStatusDto,
  SystemStatusResponseDto,
} from './briefing.dto';

@Injectable()
export class BriefingService {
  private readonly backendBaseUrl = process.env.BACKEND_BASE_URL ?? 'http://localhost:8080';
  private readonly bffPort = Number(process.env.PORT ?? 3000);

  async createBriefing(request: BriefingRequestDto): Promise<BriefingResponseDto> {
    const response = await fetch(`${this.backendBaseUrl}/api/cobold-vs-hero/briefing`, {
      body: JSON.stringify(request),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });

    if (!response.ok) {
      throw new ServiceUnavailableException(`Backend returned ${response.status}`);
    }

    const backendResponse = (await response.json()) as BackendBriefingResponseDto;

    return {
      checklist: backendResponse.checklist,
      evidencePrompts: backendResponse.evidencePrompts,
      headline: backendResponse.headline,
      nextAction: backendResponse.heroNextStep,
      reason: backendResponse.reason,
      reviewerNote: backendResponse.coboldWisdom,
      signal: backendResponse.signal,
    };
  }

  async getStatus(): Promise<SystemStatusResponseDto> {
    const checkedAt = new Date().toISOString();
    const bffStatus: ServiceStatusDto = {
      checkedAt,
      endpoint: `http://localhost:${this.bffPort}/api/cobold-vs-hero/status`,
      runtime: 'nestjs',
      service: 'bff-nestjs',
      status: 'UP',
    };
    const backendStatus = await this.getBackendStatus();

    return {
      checkedAt,
      services: [bffStatus, backendStatus],
      status: backendStatus.status === 'UP' ? 'UP' : 'DEGRADED',
    };
  }

  private async getBackendStatus(): Promise<ServiceStatusDto> {
    const endpoint = `${this.backendBaseUrl}/api/cobold-vs-hero/status`;

    try {
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(1500) });

      if (!response.ok) {
        return this.backendDownStatus(endpoint, `Backend returned ${response.status}`);
      }

      const backend = (await response.json()) as BackendStatusResponseDto;

      return {
        checkedAt: backend.checkedAt,
        endpoint,
        runtime: backend.runtime,
        service: backend.service,
        status: backend.status === 'UP' ? 'UP' : 'DOWN',
      };
    } catch (error) {
      return this.backendDownStatus(endpoint, error instanceof Error ? error.message : 'Status check failed');
    }
  }

  private backendDownStatus(endpoint: string, detail: string): ServiceStatusDto {
    return {
      checkedAt: new Date().toISOString(),
      detail,
      endpoint,
      runtime: 'spring-boot',
      service: 'be-java',
      status: 'DOWN',
    };
  }
}
