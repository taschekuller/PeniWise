import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { NotificationGateway } from '@/notifications/notification.gateway';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) { }

  async createEvent(userId: string, createEventDto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        userId,
      },
    });

    // Send notification
    await this.notificationGateway.sendEventCreated(userId, event.title);

    return event;
  }

  async getUserEvents(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.event.count({
        where: { userId },
      }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(id: string, userId: string) {
    return this.prisma.event.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async updateEvent(id: string, userId: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.findFirst({
      where: { id, userId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });

    // Send notification
    await this.notificationGateway.sendEventUpdated(userId, updatedEvent.title);

    return updatedEvent;
  }

  async deleteEvent(id: string, userId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, userId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    await this.prisma.event.delete({
      where: { id },
    });

    // Send notification
    await this.notificationGateway.sendEventDeleted(userId, event.title);

    return { message: 'Event deleted successfully' };
  }

  async getUpcomingEvents(userId: string, days = 7) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    return this.prisma.event.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }
}
