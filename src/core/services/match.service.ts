import { IMatchService } from '../primary-ports/match.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../infrastructure/match.entity';
import { MatchModel } from '../models/match.model';
import { UserModel } from '../models/user.model';
import { User } from '../../infrastructure/user.entity';
import { MatchResultModel } from '../models/match-result.model';
import { MatchResult } from '../../infrastructure/match-result.entity';

export class MatchService implements IMatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(MatchResult)
    private matchResultRepository: Repository<MatchResult>,
  ) {}

  async getMatches(): Promise<MatchModel[]> {
    const matches = await this.matchRepository.find({
      relations: ['matchResults'],
    });
    const matchEntities: Match[] = JSON.parse(JSON.stringify(matches));
    return matchEntities;
  }

  async getMatchResults(): Promise<MatchResultModel[]> {
    const matchResults = await this.matchResultRepository.find({
      relations: ['match', 'user'],
    });
    const matchResultEntities: MatchResult[] = JSON.parse(
      JSON.stringify(matchResults),
    );
    return matchResultEntities;
  }

  async queueUp(userModel: UserModel): Promise<UserModel> {
    const userDb = await this.userRepository.findOne({
      username: userModel.username,
    });
    if (userDb.username === userModel.username) {
      return {
        id: userDb.id,
        username: userDb.username,
        password: userDb.password,
        rating: userDb.rating,
        inQueue: userDb.inQueue,
        inGame: userDb.inGame,
        matchResults: userDb.matchResults,
        isActive: userDb.isActive,
      };
    } else {
      throw new Error('Cannot queue');
    }
  }

  async createMatch(id: string, matchModel: MatchModel): Promise<MatchModel> {
    let match = this.matchRepository.create();
    match.id = id;
    match.matchResults = matchModel.matchResults;
    match.score = matchModel.score;
    match = await this.matchRepository.save(match);
    return {
      id: '' + match.id,
      matchResults: match.matchResults,
      score: match.score,
    };
  }

  async createMatchResult(
    id: string,
    matchResultModel: MatchResultModel,
  ): Promise<MatchResultModel> {
    let matchResult = this.matchResultRepository.create();
    matchResult.id = id;
    matchResult.result = matchResultModel.result;
    matchResult.match = matchResultModel.match;
    matchResult.user = matchResultModel.user;
    matchResult = await this.matchResultRepository.save(matchResult);
    return {
      id: '' + matchResult.id,
      result: matchResult.result,
      match: matchResult.match,
      user: matchResult.user,
    };
  }

  async updateMatchResult(
    id: string,
    matchResult: MatchResultModel,
  ): Promise<MatchResultModel> {
    const matchResults = await this.matchResultRepository.find({
      relations: ['match', 'user'],
    });
    matchResults.forEach((result) => {
      if (result.id === matchResult.id) {
        result.user.rating = result.user.rating + 10;
        result.user.lobbyLeader = false;
        this.userRepository.update(result.user.id, result.user);
      } else if (
        result.match.id === matchResult.match.id &&
        result.id !== matchResult.id
      ) {
        result.user.rating = result.user.rating - 10;
        this.userRepository.update(result.user.id, result.user);
      }
    });
    matchResult.result = true;
    await this.matchResultRepository.update(id, matchResult);
    const updatedMatchResult = await this.matchResultRepository.findOne(id);
    if (updatedMatchResult) {
      return matchResult;
    } else {
      throw new Error('Updated matchresult was not found');
    }
  }
}
