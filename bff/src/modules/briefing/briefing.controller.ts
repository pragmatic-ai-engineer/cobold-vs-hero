import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { BriefingRequestDto, BriefingResponseDto, SystemStatusResponseDto } from './briefing.dto';
import { BriefingService } from './briefing.service';

@Controller('/api/cobold-vs-hero')
export class BriefingController {
  constructor(private readonly briefingService: BriefingService) {}

  @Post('/briefing')
  @HttpCode(200)
  createBriefing(@Body() request: BriefingRequestDto): Promise<BriefingResponseDto> {
    return this.briefingService.createBriefing(request);
  }

  @Get('/status')
  getStatus(): Promise<SystemStatusResponseDto> {
    return this.briefingService.getStatus();
  }
}
