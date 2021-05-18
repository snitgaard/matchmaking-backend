import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import {
  IMatchService,
  IMatchServiceProvider,
} from '../../core/primary-ports/match.service.interface';
import { MatchModel } from '../../core/models/match.model';
import { MatchDto } from '../dto/match.dto';
import { Socket } from 'socket.io';
import { ConnectUserDto } from '../dto/connect-user.dto';
import { UserModel } from '../../core/models/user.model';
import { MatchResultModel } from '../../core/models/match-result.model';

@WebSocketGateway()
export class MatchGateway {
  constructor(
    @Inject(IMatchServiceProvider) private matchService: IMatchService,
  ) {}

  @WebSocketServer() server;
  @SubscribeMessage('create-match')
  async createMatchEvent(
    @MessageBody() matchModel: MatchModel,
    @ConnectedSocket() matchSocket: Socket,
  ): Promise<void> {
    try {
      const match = await this.matchService.createMatch(
        matchModel.id,
        matchModel,
      );
      this.server.emit('new-match', match);
    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage('create-matchresult')
  async createMatchResultEvent(
    @MessageBody() matchResultModel: MatchResultModel,
    @ConnectedSocket() matchResultSocket: Socket,
  ): Promise<void> {
    try {
      const matchResult = await this.matchService.createMatchResult(
        matchResultModel.id,
        matchResultModel,
      );
      this.server.emit('new-matchresult', matchResult);
    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage('queue-user')
  async handleQueueUpEvent(
    @MessageBody() connectUserDto: ConnectUserDto,
    @ConnectedSocket() userSocket: Socket,
  ): Promise<void> {
    try {
      const userModel: UserModel = JSON.parse(JSON.stringify(connectUserDto));
      const user = await this.matchService.queueUp(userModel);
      const queuedUser: UserModel = {
        id: user.id,
        username: user.username,
        password: user.password,
        rating: user.rating,
        inQueue: user.inQueue,
        inGame: user.inGame,
        isActive: user.isActive,
      };
      userSocket.emit('in-queue', queuedUser);
    } catch (e) {
      console.log('Incorrect information');
    }
  }

  @SubscribeMessage('getAllMatches')
  async getAllMatchesEvent(
    @ConnectedSocket() matchSocket: Socket,
  ): Promise<void> {
    try {
      const matches = await this.matchService.getMatches();
      console.log(matches);
      matchSocket.emit('matches', matches);
    } catch (e) {
      console.log('Could not fetch matches', e);
    }
  }

  @SubscribeMessage('getAllMatchResults')
  async getAllMatchResultEvents(
    @ConnectedSocket() matchResultSocket: Socket,
  ): Promise<void> {
    try {
      const matchResults = await this.matchService.getMatchResults();
      matchResultSocket.emit('matchResults', matchResults);
    } catch (e) {
      console.log('Could not fetch match results', e);
    }
  }
}
