import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  BackendBriefingResponseDto,
  BriefingRequestDto,
  BriefingResponseDto,
} from './briefing.dto';

@Injectable()
export class BriefingService {
  private readonly backendBaseUrl = process.env.BACKEND_BASE_URL ?? 'http://localhost:8080';

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
}
