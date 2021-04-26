import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/user.entity';
import { UserGateway } from './gateways/user.gateway';
import { IUserServiceProvider } from '../core/primary-ports/user.service.interface';
import { UserService } from '../core/services/user.service';
import { Message } from '../infrastructure/message.entity';
import { Match } from '../infrastructure/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Match])],
  providers: [
    UserGateway,
    {
      provide: IUserServiceProvider,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
