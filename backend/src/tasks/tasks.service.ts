import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/common/prisma.service';
import { NotificationGateway } from '@/notifications/notification.gateway';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) { }

  // Send event reminders every hour
  @Cron(CronExpression.EVERY_HOUR)
  async sendEventReminders() {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // Find events that are starting within the next hour
    const upcomingEvents = await this.prisma.event.findMany({
      where: {
        date: {
          gte: now,
          lte: oneHourFromNow,
        },
      },
      include: {
        user: true,
      },
    });

    for (const event of upcomingEvents) {
      // Get user's notification settings
      const settings = await this.prisma.notificationSettings.findUnique({
        where: { userId: event.userId },
      });

      if (settings?.eventReminders) {
        await this.notificationGateway.sendEventReminder(
          event.userId,
          event.title,
          event.date,
        );
      }
    }

    console.log(`Sent ${upcomingEvents.length} event reminders`);
  }

  // Clean up old notifications (older than 30 days)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
        read: true,
      },
    });

    console.log(`Cleaned up ${result.count} old notifications`);
  }
}
