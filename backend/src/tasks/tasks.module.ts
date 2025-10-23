import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '@/common/prisma.service';
import { NotificationGateway } from '@/notifications/notification.gateway';

@Module({
  providers: [TasksService, PrismaService, NotificationGateway],
})
export class TasksModule {}
