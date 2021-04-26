import { MatchGames } from '../models/match.model';

export const IMatchServiceProvider = 'IMatchServiceProvider';
export interface IMatchService {
  getMatches(): Promise<MatchGames[]>;

  newMatch(id: string, match: MatchGames): Promise<MatchGames>;
}
