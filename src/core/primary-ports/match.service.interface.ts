import { MatchModel } from '../models/match.model';

export const IMatchServiceProvider = 'IMatchServiceProvider';
export interface IMatchService {
  getMatches(): Promise<MatchModel[]>;

  createMatch(id: string, match: MatchModel): Promise<MatchModel>;
}
