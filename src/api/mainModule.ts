import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/user.entity';
import { UserGateway } from './gateways/user.gateway';
import { IUserServiceProvider } from '../core/primary-ports/user.service.interface';
import { UserService } from '../core/services/user.service';
import { Chat } from '../infrastructure/chat.entity';
import { Match } from '../infrastructure/match.entity';
import { MatchGateway } from './gateways/match.gateway';
import { IMatchServiceProvider } from '../core/primary-ports/match.service.interface';
import { MatchService } from '../core/services/match.service';
import { ChatGateway } from './gateways/chat.gateway';
import { IChatServiceProvider } from '../core/primary-ports/chat.service.interface';
import { ChatService } from '../core/services/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Match])],
  providers: [
    UserGateway,
    {
      provide: IUserServiceProvider,
      useClass: UserService,
    },
    MatchGateway,
    {
      provide: IMatchServiceProvider,
      useClass: MatchService,
    },
    ChatGateway,
    {
      provide: IChatServiceProvider,
      useClass: ChatService,
    },
  ],
})
export class MainModule {}
