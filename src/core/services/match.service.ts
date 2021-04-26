import { IMatchService } from '../primary-ports/match.service.interface';
import { Match } from '../models/match.model';

export class MatchService implements IMatchService {
  getMatches(): Promise<Match[]> {
    return Promise.resolve([]);
  }
}
