import { Module } from '@nestjs/common';
import { BriefingController } from './briefing/briefing.controller';
import { BriefingService } from './briefing/briefing.service';

@Module({
  controllers: [BriefingController],
  providers: [BriefingService],
})
export class AppModule {}
