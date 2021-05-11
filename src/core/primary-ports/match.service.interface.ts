import { MatchModel } from '../models/match.model';
import { UserModel } from '../models/user.model';

export const IMatchServiceProvider = 'IMatchServiceProvider';
export interface IMatchService {
  getMatches(): Promise<MatchModel[]>;

  createMatch(id: string, match: MatchModel): Promise<MatchModel>;

  queueUp(userModel: UserModel): Promise<UserModel>;
}
