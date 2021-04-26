import { Match } from '../models/match.model';

export const IMatchServiceProvider = 'IMatchServiceProvider';
export interface IMatchService {
  getMatches(): Promise<Match[]>;
}
