import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '@/common/prisma.service';
import { NotificationGateway } from '@/notifications/notification.gateway';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService, NotificationGateway],
  exports: [EventsService],
})
export class EventsModule {}
