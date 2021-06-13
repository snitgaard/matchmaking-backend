import { MatchModel } from '../models/match.model';
import { UserModel } from '../models/user.model';
import { MatchResultModel } from '../models/match-result.model';

export const IMatchServiceProvider = 'IMatchServiceProvider';

export interface IMatchService {
  getMatches(): Promise<MatchModel[]>;

  getMatchResults(): Promise<MatchResultModel[]>;

  createMatch(id: string, match: MatchModel): Promise<MatchModel>;

  createMatchResult(
    id: string,
    matchResult: MatchResultModel,
  ): Promise<MatchResultModel>;

  updateMatchResult(
    id: string,
    matchResult: MatchResultModel,
  ): Promise<MatchResultModel>;
}
