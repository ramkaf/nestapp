import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
      envFilePath: `.env.${process.env.NODE_ENV}`, // Load the correct .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_NAME'),
        entities: [],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: true,
        logger: 'advanced-console',
        connectTimeoutMS: 10000,
        retryAttempts: 10,
        retryDelay: 3000,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        ssl: configService.get('NODE_ENV') === 'production',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    console.log('Attempting to connect to the database...');
  }

  onApplicationBootstrap() {
    console.log('Successfully connected to the database!');
  }
}