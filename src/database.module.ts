import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './infrastructure/user.entity';
import { Chat } from './infrastructure/chat.entity';
import { Match } from './infrastructure/match.entity';
import { MatchResult } from './infrastructure/match-result.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, Chat, Match, MatchResult],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
