import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/common/prisma.service';
import { NotificationService } from './notification.service';

export interface NotificationEvent {
  userId: string;
  title: string;
  message: string;
  type: 'EVENT_REMINDER' | 'EVENT_CREATED' | 'EVENT_UPDATED' | 'EVENT_DELETED' | 'SYSTEM_MESSAGE' | 'MARKETING';
}

@Injectable()
export class NotificationGateway {
  constructor(
    private eventEmitter: EventEmitter2,
    private notificationService: NotificationService,
  ) {}

  async sendNotification(event: NotificationEvent) {
    // Store notification in database
    await this.notificationService.createNotification(event);

    // Emit event for email sending
    this.eventEmitter.emit('notification.created', event);
  }

  async sendEventReminder(userId: string, eventTitle: string, eventDate: Date) {
    await this.sendNotification({
      userId,
      title: 'Event Reminder',
      message: `Don't forget about "${eventTitle}" at ${eventDate.toLocaleString()}`,
      type: 'EVENT_REMINDER',
    });
  }

  async sendEventCreated(userId: string, eventTitle: string) {
    await this.sendNotification({
      userId,
      title: 'Event Created',
      message: `Your event "${eventTitle}" has been created successfully`,
      type: 'EVENT_CREATED',
    });
  }

  async sendEventUpdated(userId: string, eventTitle: string) {
    await this.sendNotification({
      userId,
      title: 'Event Updated',
      message: `Your event "${eventTitle}" has been updated`,
      type: 'EVENT_UPDATED',
    });
  }

  async sendEventDeleted(userId: string, eventTitle: string) {
    await this.sendNotification({
      userId,
      title: 'Event Deleted',
      message: `Your event "${eventTitle}" has been deleted`,
      type: 'EVENT_DELETED',
    });
  }
}
