import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL') || '',
        // host: configService.get('DB_HOST', 'localhost'),
        // port: configService.get('DB_PORT', 5432),
        // username: configService.get('DB_USERNAME', 'postgres'),
        // password: configService.get('DB_PASSWORD', ''),
        // database: configService.get('DB_NAME', 'enbros_nest'),
        autoLoadEntities: true,
        synchronize: true,
        logging: configService.get('NODE_ENV') === 'development',
        ssl: { rejectUnauthorized: true, ca: '' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
