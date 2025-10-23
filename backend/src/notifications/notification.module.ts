import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { EmailService } from './email.service';
import { PrismaService } from '@/common/prisma.service';

@Module({
  imports: [EventEmitterModule.forRoot(), ConfigModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationGateway,
    EmailService,
    PrismaService,
  ],
  exports: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
