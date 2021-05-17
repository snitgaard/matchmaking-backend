import { User } from '../../infrastructure/user.entity';
import { MatchResult } from '../../infrastructure/match-result.entity';

export interface MatchModel {
  id: string;
  matchResults?: MatchResult[];
  score?: string;
}
