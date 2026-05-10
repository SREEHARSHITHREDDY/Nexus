import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Core
import { DatabaseModule } from './core/database/database.module';
import { CacheModule } from './core/cache/cache.module';
import { QueueModule } from './core/queue/queue.module';
import { LoggingModule } from './core/logging/logger.module';
import { MonitoringModule } from './core/monitoring/monitoring.module';
import { HealthModule } from './core/health/health.module';
import { StorageModule } from './core/storage/storage.module';
import { EventBusModule } from './core/events/event-bus.module';

// Config
import appConfig from './core/config/app.config';
import authConfig from './core/config/auth.config';
import databaseConfig from './core/config/database.config';
import redisConfig from './core/config/redis.config';
import aiConfig from './core/config/ai.config';
import storageConfig from './core/config/storage.config';
import { envValidation } from './core/config/env.validation';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IdeasModule } from './modules/ideas/ideas.module';
import { DecisionsModule } from './modules/decisions/decisions.module';
import { PlanningModule } from './modules/planning/planning.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { ReflectionsModule } from './modules/reflections/reflections.module';
import { MemoryModule } from './modules/memory/memory.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BuddyModule } from './modules/buddy/buddy.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // Config — must be first
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, redisConfig, aiConfig, storageConfig],
      validate: envValidation,
      expandVariables: true,
    }),

    // Core infrastructure
    DatabaseModule,
    CacheModule,
    QueueModule,
    LoggingModule,
    MonitoringModule,
    HealthModule,
    StorageModule,
    EventBusModule,

    // Global features
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.', maxListeners: 20 }),

    // Feature modules
    AuthModule,
    UsersModule,
    IdeasModule,
    DecisionsModule,
    PlanningModule,
    SchedulingModule,
    WorkflowsModule,
    ReflectionsModule,
    MemoryModule,
    AnalyticsModule,
    BuddyModule,
    NotificationsModule,
    DocumentsModule,
    IntegrationsModule,
    AdminModule,
  ],
})
export class AppModule {}
