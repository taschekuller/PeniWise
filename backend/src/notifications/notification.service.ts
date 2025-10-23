import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { NotificationEvent } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) { }

  async createNotification(event: NotificationEvent) {
    return this.prisma.notification.create({
      data: {
        userId: event.userId,
        title: event.title,
        message: event.message,
        type: event.type,
      },
    });
  }

  async getUserNotifications(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        read: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  async updateNotificationSettings(userId: string, settings: any) {
    return this.prisma.notificationSettings.upsert({
      where: { userId },
      update: settings,
      create: {
        userId,
        ...settings,
      },
    });
  }

  async getNotificationSettings(userId: string) {
    return this.prisma.notificationSettings.findUnique({
      where: { userId },
    });
  }
}
