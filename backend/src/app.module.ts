import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

// Configuration
import appConfig, {
  databaseConfig,
  jwtConfig,
  emailConfig,
  redisConfig,
  throttleConfig,
  swaggerConfig
} from './config/configuration';

// Modules
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { NotificationModule } from './notifications/notification.module';
import { TasksModule } from './tasks/tasks.module';

// Services
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        emailConfig,
        redisConfig,
        throttleConfig,
        swaggerConfig,
      ],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: throttleConfig,
    }),

    // Event system
    EventEmitterModule.forRoot(),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    EventsModule,
    NotificationModule,
    TasksModule,
  ],
  providers: [PrismaService],
})
export class AppModule { }
