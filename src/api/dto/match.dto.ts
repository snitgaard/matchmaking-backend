import { MatchGames } from '../../core/models/match.model';

export interface MatchDto {
  matches: MatchGames[];
  match: MatchGames;
}
