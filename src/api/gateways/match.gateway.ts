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
import { Socket } from 'socket.io';
import { ConnectUserDto } from '../dto/connect-user.dto';
import { UserModel } from '../../core/models/user.model';
import { MatchResultModel } from '../../core/models/match-result.model';
import {
  IUserService,
  IUserServiceProvider,
} from '../../core/primary-ports/user.service.interface';
import { MatchResultDto } from '../dto/match-result.dto';

@WebSocketGateway()
export class MatchGateway {
  constructor(
    @Inject(IMatchServiceProvider) private matchService: IMatchService,
    @Inject(IUserServiceProvider) private userService: IUserService,
  ) {}

  @WebSocketServer() server;

  @SubscribeMessage('create-match')
  async createMatchEvent(@MessageBody() matchModel: MatchModel): Promise<void> {
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

  @SubscribeMessage('updateMatchResult')
  async handleUpdateMatchResultEvent(
    @MessageBody() matchResultModel: MatchResultModel,
  ): Promise<void> {
    try {
      await this.matchService.updateMatchResult(
        matchResultModel.id,
        matchResultModel,
      );
      const matchResults = await this.matchService.getMatchResults();
      this.server.emit('matchResults', matchResults);
    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage('getAllMatches')
  async getAllMatchesEvent(
    @ConnectedSocket() matchSocket: Socket,
  ): Promise<void> {
    try {
      const matches = await this.matchService.getMatches();
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

  @SubscribeMessage('joinLobby')
  async joinLobby(
    @MessageBody() user: UserModel,
    @ConnectedSocket() matchResultSocket: Socket,
  ): Promise<void> {
    try {
      const matches = await this.matchService.getMatches();
      const availableMatch = matches.find(
        (m) =>
          !m.matchResults ||
          m.matchResults.length === 0 ||
          m.matchResults.length === 1,
      );

      if (!availableMatch) {
        const match = await this.matchService.createMatch(undefined, {
          id: undefined,
          matchResults: [],
          score: '0-0',
          hasEnded: false,
        });
        user.lobbyLeader = true;
        await this.userService.updateUser(user.id, user);
        const matchResult = await this.matchService.createMatchResult(
          undefined,
          {
            id: undefined,
            match: JSON.parse(JSON.stringify(match)),
            result: false,
            user: JSON.parse(JSON.stringify(user)),
          },
        );
        match.matchResults.push(JSON.parse(JSON.stringify(matchResult)));
        matchResultSocket.emit('NewMatchCreatedForMe', match);
      } else {
        await this.matchService.createMatchResult(undefined, {
          id: undefined,
          match: JSON.parse(JSON.stringify(availableMatch)),
          result: false,
          user: JSON.parse(JSON.stringify(user)),
        });

        const matchResults = await this.matchService.getMatchResults();

        availableMatch.matchResults = JSON.parse(
          JSON.stringify(
            matchResults.filter((mr) => mr.match.id === availableMatch.id),
          ),
        );

        matchResultSocket.emit('MatchFoundForMe', availableMatch);
        this.server.emit('SomeoneJoinedMatch', availableMatch);
      }
    } catch (e) {
      console.log('Could not fetch match results', e);
    }
  }
}
