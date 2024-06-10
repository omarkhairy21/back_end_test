import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GameDataModule } from './game-data/game-data.module';
import { ConfigModule } from '@nestjs/config';
import { LoggingService } from './logging/logging.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,
      logging: 'all',
      logger: 'advanced-console',
      maxQueryExecutionTime: 20,
    }),
    AuthModule,
    GameDataModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggingService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingService).forRoutes('*');
  }
}
