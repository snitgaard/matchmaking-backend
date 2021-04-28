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
      const match = await this.matchService.createMatch(matchSocket.id, matchModel);
      const matches = await this.matchService.getMatches();
      const matchDto: MatchDto = {
        matches: matches,
        match: match,
      };
      matchSocket.emit('matchDto', matchDto);
      this.server.emit('matches', matches);
    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage('getAllMatches')
  async getAllMatchesEvent(
      @ConnectedSocket() matchSocket: Socket
  ): Promise<void> {
    try {
      const matches = await this.matchService.getMatches();
      matchSocket.emit('matches', matches);
    } catch (e)
    {
      console.log("Could not fetch matches")
    }
  }
}
