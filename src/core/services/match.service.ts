import { IMatchService } from '../primary-ports/match.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../infrastructure/match.entity';
import { MatchGames } from '../models/match.model';

export class MatchService implements IMatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async getMatches(): Promise<MatchGames[]> {
    const matches = await this.matchRepository.find();
    const matchEntities: Match[] = JSON.parse(JSON.stringify(matches));
    return matchEntities;
  }

  async newMatch(id: string, matchGame: MatchGames): Promise<MatchGames> {
    let match = this.matchRepository.create();
    match.id = id;
    match.winner = matchGame.winner;
    match.loser = matchGame.loser;
    match.score = matchGame.score;
    match = await this.matchRepository.save(match);
    return {
      id: '' + match.id,
      winner: match.winner,
      loser: match.loser,
      score: match.score,
    };
  }
}
