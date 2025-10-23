import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '@/common/prisma.service';
import { NotificationEvent } from './notification.gateway';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  @OnEvent('notification.created')
  async handleNotificationCreated(event: NotificationEvent) {
    const user = await this.prisma.user.findUnique({
      where: { id: event.userId },
    });

    if (!user) return;

    const settings = await this.prisma.notificationSettings.findUnique({
      where: { userId: event.userId },
    });

    // Check if user wants email notifications
    if (!settings?.emailNotifications) return;

    // Check notification type preferences
    if (event.type === 'MARKETING' && !settings.marketingEmails) return;
    if (event.type === 'EVENT_REMINDER' && !settings.eventReminders) return;

    await this.sendEmail(user.email, event.title, event.message);
  }

  private async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to,
        subject: `PeniWise: ${subject}`,
        text,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">PeniWise Notification</h2>
            <h3 style="color: #666;">${subject}</h3>
            <p style="color: #555; line-height: 1.6;">${text}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              This is an automated message from PeniWise. Please do not reply to this email.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.sendEmail(
      email,
      'Welcome to PeniWise!',
      `Hi ${name},\n\nWelcome to PeniWise! We're excited to have you on board.\n\nBest regards,\nThe PeniWise Team`
    );
  }
}
