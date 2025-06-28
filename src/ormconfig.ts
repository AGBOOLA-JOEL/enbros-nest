import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const createDataSource = (configService: ConfigService): DataSource => {
  return new DataSource({
    type: 'postgres',
    url: configService.get<string>('DB_URL') || '',

    // host: configService.get<string>('DB_HOST') || 'localhost',
    // port: configService.get<number>('DB_PORT') || 5432,
    // username: configService.get<string>('DB_USERNAME') || 'postgres',
    // password: configService.get<string>('DB_PASSWORD') || '',
    // database: configService.get<string>('DB_NAME') || 'enbros_nest',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    // synchronize: configService.get<string>('NODE_ENV') === 'development',
    synchronize: true,
    logging: configService.get<string>('NODE_ENV') === 'development',
    ssl: {
      rejectUnauthorized: true,
    },
  });
};
