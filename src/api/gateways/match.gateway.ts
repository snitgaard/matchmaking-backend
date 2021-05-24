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
import {
  IUserService,
  IUserServiceProvider,
} from '../../core/primary-ports/user.service.interface';
import { UserDTO } from '../dto/user.dto';
import { MatchResultDto } from '../dto/match-result.dto';

@WebSocketGateway()
export class MatchGateway {
  constructor(
    @Inject(IMatchServiceProvider) private matchService: IMatchService,
    @Inject(IUserServiceProvider) private userService: IUserService,
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
  @SubscribeMessage('updateMatchResult')
  async handleUpdateUserEvent(
    @MessageBody() matchResultModel: MatchResultModel,
    @ConnectedSocket() matchResultSocket: Socket,
  ): Promise<void> {
    try {
      const matchResultUpdate = await this.matchService.updateMatchResult(
        matchResultModel.id,
        matchResultModel,
      );
      const matchResults = await this.matchService.getMatchResults();
      const matchResultDTO: MatchResultDto = {
        matchResults: matchResults,
        matchResult: matchResultUpdate,
      };
      matchResultSocket.emit('matchResultDTO', matchResultDTO);
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
    @MessageBody() connectUserDto: UserModel,
    @ConnectedSocket() matchResultSocket: Socket,
  ): Promise<void> {
    try {
      const matches = await this.matchService.getMatches();
      const availableMatchResult = matches.find(
        (m) =>
          !m.matchResults ||
          m.matchResults.length === 0 ||
          m.matchResults.length === 1,
      );
      if (!availableMatchResult) {
        const match = await this.matchService.createMatch(undefined, {
          id: undefined,
          matchResults: [],
          score: '0-0',
          hasEnded: false,
        });
        connectUserDto.lobbyLeader = true;
        await this.userService.updateUser(connectUserDto.id, connectUserDto);
        const matchResult = await this.matchService.createMatchResult(
          undefined,
          {
            id: undefined,
            match: JSON.parse(JSON.stringify(match)),
            result: false,
            user: JSON.parse(JSON.stringify(connectUserDto)),
          },
        );
        match.matchResults.push(JSON.parse(JSON.stringify(matchResult)));
        matchResultSocket.emit('NewMatchCreatedForMe', match);
      } else {
        const matchResult = await this.matchService.createMatchResult(
          undefined,
          {
            id: undefined,
            match: JSON.parse(JSON.stringify(availableMatchResult)),
            result: false,
            user: JSON.parse(JSON.stringify(connectUserDto)),
          },
        );
        const matchResults = await this.matchService.getMatchResults();
        availableMatchResult.matchResults = JSON.parse(
          JSON.stringify(
            matchResults.filter(
              (mr) => mr.match.id === availableMatchResult.id,
            ),
          ),
        );
        matchResultSocket.emit('MatchFoundForMe', availableMatchResult);
        this.server.emit('SomeoneJoinedMatch', availableMatchResult);
      }
    } catch (e) {
      console.log('Could not fetch match results', e);
    }
  }
}
