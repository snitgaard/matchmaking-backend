import { MatchModel } from '../../core/models/match.model';

export interface MatchDto {
  matches: MatchModel[];
  match: MatchModel;
}
