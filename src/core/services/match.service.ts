import { IMatchService } from '../primary-ports/match.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../infrastructure/match.entity';
import { MatchModel } from '../models/match.model';
import { UserModel } from "../models/user.model";

export class MatchService implements IMatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async getMatches(): Promise<MatchModel[]> {
    const matches = await this.matchRepository.find();
    const matchEntities: Match[] = JSON.parse(JSON.stringify(matches));
    return matchEntities;
  }

  async createMatch(id: string, matchModel: MatchModel): Promise<MatchModel> {
    let match = this.matchRepository.create();
    match.id = id;
    match.winner = matchModel.winner;
    match.loser = matchModel.loser;
    match.score = matchModel.score;
    match = await this.matchRepository.save(match);
    return {
      id: '' + match.id,
      winner: match.winner,
      loser: match.loser,
      score: match.score,
    };
  }

  async getMatchesForUser(id: string): Promise<MatchModel[]> {
    const matches = await this.matchRepository.find({id: id})
    const userMatch: MatchModel[] = JSON.parse(JSON.stringify(matches));
    return userMatch;
  }
}
