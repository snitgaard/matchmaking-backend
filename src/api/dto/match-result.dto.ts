import {MatchResultModel} from '../../core/models/match-result.model';

export interface MatchResultDto {
    matchResults: MatchResultModel[];
    matchResult: MatchResultModel;
}
