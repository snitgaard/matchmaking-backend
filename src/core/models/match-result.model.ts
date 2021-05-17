import { MatchResult } from '../../infrastructure/match-result.entity';
import { Match } from '../../infrastructure/match.entity';
import { User } from '../../infrastructure/user.entity';

export interface MatchResultModel {
  id: string;
  result: boolean;
  match?: Match;
  user: User;
}
