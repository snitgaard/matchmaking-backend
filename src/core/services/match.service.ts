import { IMatchService } from '../primary-ports/match.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../infrastructure/match.entity';
import { MatchModel } from '../models/match.model';
import { UserModel } from '../models/user.model';
import { User } from '../../infrastructure/user.entity';

export class MatchService implements IMatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMatches(): Promise<MatchModel[]> {
    const matches = await this.matchRepository.find();
    const matchEntities: Match[] = JSON.parse(JSON.stringify(matches));
    return matchEntities;
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
        matches: userDb.matches,
        isActive: userDb.isActive,
      };
    } else {
      throw new Error('Cannot queue');
    }
  }

  async createMatch(id: string, matchModel: MatchModel): Promise<MatchModel> {
    let match = this.matchRepository.create();
    match.id = id;
    match.winner = matchModel.winner;
    match.loser = matchModel.loser;
    match.score = matchModel.score;
    match = await this.matchRepository.save(match);
    console.log(match + 'hej');
    return {
      id: '' + match.id,
      winner: match.winner,
      loser: match.loser,
      score: match.score,
    };
  }
}
