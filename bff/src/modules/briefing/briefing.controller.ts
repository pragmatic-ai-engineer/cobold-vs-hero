import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BriefingRequestDto, BriefingResponseDto } from './briefing.dto';
import { BriefingService } from './briefing.service';

@Controller('/api/cobold-vs-hero')
export class BriefingController {
  constructor(private readonly briefingService: BriefingService) {}

  @Post('/briefing')
  @HttpCode(200)
  createBriefing(@Body() request: BriefingRequestDto): Promise<BriefingResponseDto> {
    return this.briefingService.createBriefing(request);
  }
}
