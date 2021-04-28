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
import { MatchGames } from '../../core/models/match.model';
import { MatchDto } from '../dto/match.dto';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class MatchGateway {
  constructor(
    @Inject(IMatchServiceProvider) private matchService: IMatchService,
  ) {}

  @WebSocketServer() server;
  @SubscribeMessage('match')
  async handleMatchEvent(
    @MessageBody() matchGame: MatchGames,
    @ConnectedSocket() match: Socket,
  ): Promise<void> {
    try {
      const matchClient = await this.matchService.newMatch(match.id, matchGame);
      const matchClients = await this.matchService.getMatches();

      const matchDto: MatchDto = {
        matches: matchClients,
        match: matchClient,
      };
      match.emit('matchDto', matchDto);
      this.server.emit('matches', matchClients);
    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage('welcomeMatch')
  async handleWelcomeMatchEvent(
      @ConnectedSocket() match: Socket
  ): Promise<void> {
    try {
      const matches = await this.matchService.getMatches();
      match.emit('matches', matches);
    } catch (e)
    {
      console.log("Could not fetch matches")
    }
  }
}
